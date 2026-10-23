

export async function buscarHistoricos(tickers) {
  const historicos = {}
  const falhas = []

  const codigos = [...new Set(tickers)]

  for (const ticker of codigos) {
    try {
      const resposta = await fetch(
        `/api/historico/${encodeURIComponent(ticker)}`
      )

      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`)
      }

      const dados = await resposta.json()

      if (!Array.isArray(dados.precos) || !dados.precos.length) {
        throw new Error('Sem preços históricos')
      }

      historicos[ticker] = dados.precos
        .filter(p =>
          typeof p.data === 'string' &&
          /^\d{4}-\d{2}-\d{2}$/.test(p.data) &&
          Number.isFinite(Number(p.fechamento)) &&
          Number(p.fechamento) > 0
        )
        .map(p => ({
          data: p.data,
          fechamento: Number(p.fechamento),
        }))
        .sort((a, b) => a.data.localeCompare(b.data))

      if (!historicos[ticker].length) {
        delete historicos[ticker]
        throw new Error('Histórico sem fechamentos válidos')
      }
    } catch (erro) {
      falhas.push(`${ticker}: ${erro.message}`)
    }
  }

  return { historicos, falhas }
}


export function reconstruirHistorico(operacoes, historicos) {
  const pontos = []
  const alertas = []

  const operacoesOrdenadas = operacoes
    .map((op, indice) => ({
      ...op,
      indice,
      ticker: String(op.ticker || '').toUpperCase(),
      quantidade: Number(op.quantidade),
      preco: Number(op.preco),
    }))
    .filter(op =>
      /^\d{4}-\d{2}-\d{2}$/.test(op.data) &&
      ['compra', 'venda'].includes(op.tipo) &&
      Number.isSafeInteger(op.quantidade) &&
      op.quantidade > 0 &&
      Number.isFinite(op.preco) &&
      op.preco > 0
    )
    .sort((a, b) =>
      a.data.localeCompare(b.data) ||
      a.indice - b.indice
    )

  const datas = [...new Set(
    Object.values(historicos)
      .flatMap(lista => lista.map(p => p.data))
  )].sort()

  if (!datas.length || !operacoesOrdenadas.length) {
    return { pontos, alertas }
  }

  const posicoes = {}
  const ultimoPreco = {}
  const indices = {}

  for (const ticker of Object.keys(historicos)) {
    indices[ticker] = 0
  }

  let indiceOperacao = 0
  let indiceDesempenho = 1
  let mercadoAnterior = null
  let diasOmitidos = 0
  let vendasInvalidas = 0
  let reinicios = 0
  let inicioComparavel = false

  function avaliarCarteira() {
    let mercado = 0
    let investido = 0
    let cotas = 0

    for (const [ticker, posicao] of Object.entries(posicoes)) {
      if (posicao.quantidade <= 0) continue

      const preco = ultimoPreco[ticker]

      if (!Number.isFinite(preco) || preco <= 0) {
        return null
      }

      mercado += posicao.quantidade * preco
      investido += posicao.custo
      cotas += posicao.quantidade
    }

    return { mercado, investido, cotas }
  }

  for (const data of datas) {
    // 1. Atualiza os preços conhecidos até este pregão.
    for (const [ticker, lista] of Object.entries(historicos)) {
      while (
        indices[ticker] < lista.length &&
        lista[indices[ticker]].data <= data
      ) {
        ultimoPreco[ticker] =
          Number(lista[indices[ticker]].fechamento)

        indices[ticker]++
      }
    }

    // 2. Avalia as posições anteriores às operações do dia.
    // Isso separa a oscilação do mercado dos novos aportes.
    const antesOperacoes = avaliarCarteira()

    if (mercadoAnterior !== null && mercadoAnterior > 0) {
      if (
        antesOperacoes &&
        antesOperacoes.mercado >= 0
      ) {
        const retornoDia =
          antesOperacoes.mercado / mercadoAnterior - 1

        indiceDesempenho *= 1 + retornoDia
      }
    }

    // 3. Processa as operações registradas até a data.
    while (
      indiceOperacao < operacoesOrdenadas.length &&
      operacoesOrdenadas[indiceOperacao].data <= data
    ) {
      const op = operacoesOrdenadas[indiceOperacao]

      if (!posicoes[op.ticker]) {
        posicoes[op.ticker] = {
          quantidade: 0,
          custo: 0,
        }
      }

      const posicao = posicoes[op.ticker]

      if (op.tipo === 'compra') {
        posicao.quantidade += op.quantidade
        posicao.custo += op.quantidade * op.preco
      } else if (op.quantidade > posicao.quantidade) {
        vendasInvalidas++
      } else {
        const medio = posicao.custo / posicao.quantidade

        posicao.quantidade -= op.quantidade
        posicao.custo -= medio * op.quantidade

        if (posicao.quantidade === 0) {
          posicao.custo = 0
        }
      }

      indiceOperacao++
    }

    // 4. Avalia a carteira depois das operações.
    const depoisOperacoes = avaliarCarteira()

    if (!depoisOperacoes) {
      diasOmitidos++
      mercadoAnterior = null
      continue
    }

    if (depoisOperacoes.cotas === 0) {
      if (inicioComparavel) reinicios++
      mercadoAnterior = null
      inicioComparavel = false
      continue
    }

    // Quando a carteira começa ou volta a ter posições,
    // inicia uma nova base de comparação.
    if (!inicioComparavel) {
      indiceDesempenho = 1
      inicioComparavel = true
    }

    mercadoAnterior = depoisOperacoes.mercado

    pontos.push({
      data,
      investido: Number(depoisOperacoes.investido.toFixed(2)),
      mercado: Number(depoisOperacoes.mercado.toFixed(2)),
      desempenho: Number(
        ((indiceDesempenho - 1) * 100).toFixed(4)
      ),
    })
  }

  if (diasOmitidos) {
    alertas.push(
      `${diasOmitidos} pregão(ões) sem todas as cotações necessárias.`
    )
  }

  if (vendasInvalidas) {
    alertas.push(
      `${vendasInvalidas} venda(s) sem saldo foram ignoradas.`
    )
  }

  if (reinicios) {
    alertas.push(
      'A carteira ficou zerada em algum período. ' +
      'O desempenho foi reiniciado após a nova compra.'
    )
  }

  if (indiceOperacao < operacoesOrdenadas.length) {
    alertas.push(
      'Existem operações posteriores ao último pregão disponível.'
    )
  }

  return { pontos, alertas }
}
