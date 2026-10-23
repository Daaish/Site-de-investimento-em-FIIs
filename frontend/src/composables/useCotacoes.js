
import { reactive, ref, computed } from 'vue'

const cotacoes = reactive({})
const erros = reactive({})
const carregando = ref(false)

const CACHE_MS = 15 * 60 * 1000
const ultimaConsulta = new Map()
const requisicoes = new Map()

async function consultarTicker(ticker, forcar = false) {
  const codigo = String(ticker).trim().toUpperCase()

  if (!/^[A-Z0-9]{5,12}$/.test(codigo)) return

  const ultima = ultimaConsulta.get(codigo) || 0

  if (
    !forcar &&
    cotacoes[codigo] &&
    Date.now() - ultima < CACHE_MS
  ) {
    return cotacoes[codigo]
  }

  if (requisicoes.has(codigo)) {
    return requisicoes.get(codigo)
  }

  const requisicao = (async () => {
    try {
      delete erros[codigo]

      const resposta = await fetch(
        `/api/cotacao/${encodeURIComponent(codigo)}`
      )

      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`)
      }

      const dados = await resposta.json()
      const preco = Number(dados.preco)

      if (!Number.isFinite(preco) || preco <= 0) {
        throw new Error('Preço inválido')
      }

      cotacoes[codigo] = {
        ...dados,
        preco,
      }

      ultimaConsulta.set(codigo, Date.now())

      return cotacoes[codigo]
    } catch (erro) {
      // Não reaproveitamos uma cotação antiga como atual.
      delete cotacoes[codigo]
      ultimaConsulta.delete(codigo)
      erros[codigo] = erro.message
      return null
    } finally {
      requisicoes.delete(codigo)
    }
  })()

  requisicoes.set(codigo, requisicao)
  return requisicao
}

async function atualizarCotacoes(tickers, forcar = false) {
  const codigos = [...new Set(tickers)].filter(Boolean)

  carregando.value = true

  try {
    // Consultas em lotes para evitar muitas chamadas simultâneas.
    for (let i = 0; i < codigos.length; i += 3) {
      await Promise.all(
        codigos.slice(i, i + 3).map(ticker =>
          consultarTicker(ticker, forcar)
        )
      )
    }
  } finally {
    carregando.value = false
  }
}

export function useCotacoes() {
  return {
    cotacoes,
    erros,
    carregando,
    atualizarCotacoes,
  }
}
