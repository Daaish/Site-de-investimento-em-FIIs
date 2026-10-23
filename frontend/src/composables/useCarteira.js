
import { ref, computed, watch } from 'vue'

const CHAVE = 'belmar-carteira-v1'

function carregar() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]')
    return Array.isArray(dados) ? dados : []
  } catch {
    return []
  }
}

const operacoes = ref(carregar())

const posicoes = computed(() => {
  const mapa = {}

  for (const op of operacoes.value) {
    if (!mapa[op.ticker]) {
      mapa[op.ticker] = {
        ticker: op.ticker,
        quantidade: 0,
        custo: 0,
      }
    }

    const fii = mapa[op.ticker]

    if (op.tipo === 'compra') {
      fii.quantidade += op.quantidade
      fii.custo += op.quantidade * op.preco
    } else {
      if (op.quantidade > fii.quantidade) continue

      const precoMedio = fii.custo / fii.quantidade
      fii.custo -= precoMedio * op.quantidade
      fii.quantidade -= op.quantidade

      if (fii.quantidade === 0) fii.custo = 0
    }
  }

  return Object.values(mapa)
    .filter(fii => fii.quantidade > 0)
    .map(fii => ({
      ...fii,
      precoMedio: fii.custo / fii.quantidade,
    }))
    .sort((a, b) => a.ticker.localeCompare(b.ticker))
})

const patrimonio = computed(() =>
  posicoes.value.reduce((total, fii) => total + fii.custo, 0)
)

const totalCotas = computed(() =>
  posicoes.value.reduce((total, fii) => total + fii.quantidade, 0)
)

watch(
  operacoes,
  dados => localStorage.setItem(CHAVE, JSON.stringify(dados)),
  { deep: true }
)

export function useCarteira() {
  return {
    operacoes,
    posicoes,
    patrimonio,
    totalCotas,
  }
}
