
const CACHE_MS = 15 * 60 * 1000

const cache = new Map()

async function buscarCotacao(ticker) {
  const codigo = String(ticker).toUpperCase().trim()

  if (!/^[A-Z0-9]{5,12}$/.test(codigo)) {
    throw new Error('Ticker inválido')
  }

  const salvo = cache.get(codigo)

  if (salvo && Date.now() - salvo.consultadoEm < CACHE_MS) {
    return salvo.dados
  }

  const token = process.env.BRAPI_TOKEN

  if (!token) {
    throw new Error('BRAPI_TOKEN não configurado')
  }

  const url =
    `https://brapi.dev/api/quote/${encodeURIComponent(codigo)}`

  const resposta = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!resposta.ok) {
    throw new Error(`Erro na brapi: HTTP ${resposta.status}`)
  }

  const json = await resposta.json()
  const resultado = json.results?.find(
    item => item.symbol === codigo
  )

  const preco = Number(resultado?.regularMarketPrice)

  if (!resultado || !Number.isFinite(preco) || preco <= 0) {
    throw new Error('Cotação indisponível para este FII')
  }

  const dados = {
    ticker: resultado.symbol,
    nome: resultado.longName || resultado.shortName || codigo,
    preco,
    variacaoDia: Number.isFinite(
      Number(resultado.regularMarketChangePercent)
    ) ? Number(resultado.regularMarketChangePercent) : null,
    atualizadoEm: resultado.regularMarketTime || null,
    fonte: 'brapi.dev',
  }

  cache.set(codigo, {
    dados,
    consultadoEm: Date.now(),
  })

  return dados
}

module.exports = { buscarCotacao }
