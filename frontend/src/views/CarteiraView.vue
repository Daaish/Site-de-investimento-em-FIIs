
<script setup>
import { ref } from 'vue'
import { useCarteira } from '../composables/useCarteira'

// Dados compartilhados com o Dashboard
const {
  operacoes,
  posicoes,
  patrimonio,
  totalCotas,
} = useCarteira()

const hoje = new Date()
const dataAtual = [
  hoje.getFullYear(),
  String(hoje.getMonth() + 1).padStart(2, '0'),
  String(hoje.getDate()).padStart(2, '0'),
].join('-')

const formulario = ref({
  tipo: 'compra',
  ticker: '',
  quantidade: 1,
  preco: null,
  data: dataAtual,
})

const erro = ref('')
const sucesso = ref('')

const moeda = (valor) =>
  Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

function adicionarOperacao() {
  erro.value = ''
  sucesso.value = ''

  const ticker = formulario.value.ticker.trim().toUpperCase()
  const quantidade = Number(formulario.value.quantidade)
  const preco = Number(formulario.value.preco)
  const tipo = formulario.value.tipo
  const data = formulario.value.data

  if (!/^[A-Z0-9]{5,12}$/.test(ticker)) {
    erro.value = 'Informe um ticker válido, como HGLG11.'
    return
  }

  if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
    erro.value = 'A quantidade deve ser um número inteiro positivo.'
    return
  }

  if (!Number.isFinite(preco) || preco <= 0) {
    erro.value = 'Informe um preço válido maior que zero.'
    return
  }

  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    erro.value = 'Selecione uma data válida.'
    return
  }

  if (tipo !== 'compra' && tipo !== 'venda') {
    erro.value = 'Selecione uma operação válida.'
    return
  }

  // Não permite vender mais cotas do que o usuário possui
  if (tipo === 'venda') {
    const posicao = posicoes.value.find(
      (fii) => fii.ticker === ticker
    )

    if (!posicao || posicao.quantidade < quantidade) {
      erro.value = 'Você não possui cotas suficientes para vender.'
      return
    }
  }

  operacoes.value.push({
    id: crypto.randomUUID(),
    tipo,
    ticker,
    quantidade,
    preco,
    data,
  })

  sucesso.value = 'Operação registrada com sucesso!'

  formulario.value = {
    tipo: 'compra',
    ticker: '',
    quantidade: 1,
    preco: null,
    data: dataAtual,
  }
}

function desfazerUltima() {
  if (operacoes.value.length === 0) return

  const confirmou = window.confirm(
    'Deseja desfazer a última operação registrada?'
  )

  if (!confirmou) return

  operacoes.value.pop()
  sucesso.value = 'Última operação desfeita.'
  erro.value = ''
}
</script>

<template>
  <section>
    <div class="eyebrow">BELMAR STATE / PORTFÓLIO</div>

    <h1>
      Minha Carteira <span class="accent">.</span>
    </h1>

    <p>
      Registre suas operações e acompanhe seus fundos imobiliários.
    </p>

    <!-- INDICADORES -->
    <div class="carteira-stats">
      <article class="stat-card">
        <div class="stat-heading">
          Capital investido
          <span>◈</span>
        </div>

        <h2>{{ moeda(patrimonio) }}</h2>
        <p>Custo das cotas em carteira</p>
      </article>

      <article class="stat-card">
        <div class="stat-heading">
          Fundos diferentes
          <span>▣</span>
        </div>

        <h2>{{ posicoes.length }}</h2>
        <p>FIIs com posições ativas</p>
      </article>

      <article class="stat-card">
        <div class="stat-heading">
          Quantidade de cotas
          <span>◎</span>
        </div>

        <h2>{{ totalCotas }}</h2>
        <p>Total de cotas dos seus FIIs</p>
      </article>
    </div>

    <!-- FORMULÁRIO E POSIÇÕES -->
    <div class="carteira-layout">
      <div class="painel">
        <h2>Nova operação</h2>

        <p>
          Adicione uma compra ou venda à sua carteira.
        </p>

        <form @submit.prevent="adicionarOperacao">
          <label for="tipo">Tipo da operação</label>

          <select id="tipo" v-model="formulario.tipo">
            <option value="compra">Compra</option>
            <option value="venda">Venda</option>
          </select>

          <label for="ticker">Código do FII</label>

          <input
            id="ticker"
            v-model="formulario.ticker"
            placeholder="Ex: MXRF11"
            maxlength="12"
            required
          />

          <label for="quantidade">Quantidade de cotas</label>

          <input
            id="quantidade"
            v-model.number="formulario.quantidade"
            type="number"
            min="1"
            step="1"
            required
          />

          <label for="preco">Preço por cota (R$)</label>

          <input
            id="preco"
            v-model.number="formulario.preco"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Ex: 10.50"
            required
          />

          <label for="data">Data da operação</label>

          <input
            id="data"
            v-model="formulario.data"
            type="date"
            required
          />

          <div v-if="erro" class="mensagem erro">
            {{ erro }}
          </div>

          <div v-if="sucesso" class="mensagem sucesso">
            {{ sucesso }}
          </div>

          <button
            type="submit"
            class="primary-button botao-full"
          >
            Registrar operação →
          </button>
        </form>
      </div>

      <!-- ATIVOS -->
      <div class="painel">
        <h2>Meus ativos</h2>

        <p>
          Posições calculadas automaticamente.
        </p>

        <div class="table-scroll">
          <table v-if="posicoes.length">
            <thead>
              <tr>
                <th>FII</th>
                <th>Cotas</th>
                <th>Preço médio</th>
                <th>Custo total</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="fii in posicoes"
                :key="fii.ticker"
              >
                <td>
                  <strong>{{ fii.ticker }}</strong>
                </td>

                <td>{{ fii.quantidade }}</td>

                <td>
                  {{ moeda(fii.precoMedio) }}
                </td>

                <td class="positive">
                  {{ moeda(fii.custo) }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="estado-vazio">
            <div>▣</div>

            <h3>Sua carteira está vazia</h3>

            <p>
              Registre sua primeira compra para começar.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- HISTÓRICO -->
    <div class="painel historico">
      <div class="historico-topo">
        <div>
          <h2>Histórico de operações</h2>

          <p>
            Todas as compras e vendas registradas.
          </p>
        </div>

        <button
          v-if="operacoes.length"
          class="botao-secundario"
          @click="desfazerUltima"
        >
          Desfazer última
        </button>
      </div>

      <div class="table-scroll">
        <table v-if="operacoes.length">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>FII</th>
              <th>Quantidade</th>
              <th>Preço unitário</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="op in [...operacoes].reverse()"
              :key="op.id"
            >
              <td>
                {{ op.data.split('-').reverse().join('/') }}
              </td>

              <td>
                <span
                  class="tipo-operacao"
                  :class="op.tipo"
                >
                  {{
                    op.tipo === 'compra'
                      ? 'Compra'
                      : 'Venda'
                  }}
                </span>
              </td>

              <td>
                <strong>{{ op.ticker }}</strong>
              </td>

              <td>{{ op.quantidade }}</td>

              <td>{{ moeda(op.preco) }}</td>

              <td>
                {{ moeda(op.quantidade * op.preco) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="estado-vazio">
          Nenhuma operação registrada.
        </div>
      </div>
    </div>

    <p class="aviso-dados">
      Seus registros ficam salvos neste navegador.
      O capital investido não representa o valor atual
      de mercado da carteira. Taxas e impostos não estão
      incluídos nos cálculos.
    </p>
  </section>
</template>

<style scoped>
.carteira-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.carteira-layout {
  display: grid;
  grid-template-columns: minmax(300px, 370px) minmax(0, 1fr);
  gap: 20px;
  margin-top: 24px;
  align-items: start;
}

.painel {
  background: #101a2a;
  border: 1px solid #223047;
  border-radius: 14px;
  padding: 24px;
  min-width: 0;
}

.painel h2 {
  font-size: 22px;
  margin: 0;
}

.painel p {
  font-size: 13px;
  margin: 7px 0 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 13px;
  color: #aab8cc;
  margin-top: 8px;
}

input,
select {
  width: 100%;
  min-width: 0;
  padding: 13px;
  border: 1px solid #314158;
  border-radius: 9px;
  background: #0a1120;
  color: #f0f5fc;
  outline: none;
  font: inherit;
}

input:focus,
select:focus {
  border-color: #20d69f;
}

.botao-full {
  width: 100%;
  border: 0;
  margin-top: 14px;
}

.mensagem {
  font-size: 13px;
  padding: 10px;
  border-radius: 8px;
}

.erro {
  background: #40232b;
  color: #ffaaaa;
}

.sucesso {
  background: #15382d;
  color: #4aebba;
}

.historico {
  margin-top: 24px;
}

.historico-topo {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 15px;
}

.botao-secundario {
  background: transparent;
  border: 1px solid #405066;
  color: #b7c6d8;
  border-radius: 8px;
  padding: 10px 13px;
  cursor: pointer;
}

.botao-secundario:hover {
  border-color: #20d69f;
  color: #20d69f;
}

.tipo-operacao {
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 9px;
}

.compra {
  background: #153c30;
  color: #32dfa7;
}

.venda {
  background: #432b31;
  color: #ffa4aa;
}

.estado-vazio {
  text-align: center;
  padding: 50px 12px;
  color: #8796ac;
}

.estado-vazio div {
  font-size: 40px;
  color: #20d69f;
}

.estado-vazio h3 {
  margin: 12px 0 0;
}

.aviso-dados {
  font-size: 12px;
  margin-top: 20px;
}

@media (max-width: 1100px) {
  .carteira-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .carteira-stats {
    grid-template-columns: 1fr;
  }

  .historico-topo {
    flex-direction: column;
  }
}
</style>
