
<script setup>

import { RouterLink } from 'vue-router'
import { useCarteira } from '../composables/useCarteira'

const {
  posicoes: carteira,
  patrimonio,
  totalCotas,
} = useCarteira()

const moeda = (valor) =>
  Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const atalhos = [
  { titulo: 'Minha Carteira', desc: 'Acompanhe seus fundos e posições', rota: '/carteira', icone: '▣' },
  { titulo: 'Calendário', desc: 'Consulte seus próximos proventos', rota: '/calendario', icone: '▦' },
  { titulo: 'Conquistas', desc: 'Desbloqueie novas medalhas', rota: '/conquistas', icone: '✦' },
  { titulo: 'Meu DNA', desc: 'Descubra seu perfil de investidor', rota: '/dna', icone: '◎' },
]

</script>

<template>
  <section>
    <div class="page-heading">
      <div>
        <div class="eyebrow">SEU PAINEL FINANCEIRO</div>
        <h1>Visão Geral <span class="accent">.</span></h1>
        <p>Acompanhe sua jornada no universo dos fundos imobiliários.</p>
      </div>
      <span class="tag-demo">Dados de demonstração</span>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-heading">Patrimônio total <span>◈</span></div>
        <h2>{{ moeda(patrimonio) }}</h2>
        <p>Valor demonstrativo da carteira</p>
      </article>

      <article class="stat-card">
        <div class="stat-heading">Dividendos mensais <span>↗</span></div>
        <h2 class="positive">{{ moeda(dividendos) }}</h2>
        <p>Estimativa ilustrativa</p>
      </article>

      <article class="stat-card">
        <div class="stat-heading">Fundos na carteira <span>▣</span></div>
        <h2>{{ carteira.length }}</h2>
        <p>Ativos diferentes</p>
      </article>

      <article class="stat-card">
        <div class="stat-heading">Yield mensal estimado <span>◎</span></div>
        <h2>{{ (dividendos / patrimonio * 100).toFixed(2) }}%</h2>
        <p>Sobre o patrimônio demonstrativo</p>
      </article>
    </div>

    <div class="section-heading">
      <div>
        <h2>Explore a plataforma</h2>
        <p>Ferramentas para sua jornada como investidor.</p>
      </div>
    </div>

    <div class="features-grid">
      <RouterLink
        v-for="atalho in atalhos"
        :key="atalho.rota"
        :to="atalho.rota"
        class="feature-card"
      >
        <div class="feature-icon">{{ atalho.icone }}</div>
        <h3>{{ atalho.titulo }}</h3>
        <p>{{ atalho.desc }}</p>
        <span class="feature-link">Explorar →</span>
      </RouterLink>
    </div>

    <div class="section-heading">
      <div>
        <h2>Minha carteira</h2>
        <p>Uma prévia de como seus ativos serão exibidos.</p>
      </div>
      <RouterLink to="/carteira" class="text-link">Ver carteira →</RouterLink>
    </div>

    <div class="table-card">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Ativo</th>
              <th>Segmento</th>
              <th>Patrimônio</th>
              <th>Renda mensal estimada</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fii in carteira" :key="fii.ticker">
              <td><strong>{{ fii.ticker }}</strong></td>
              <td>{{ fii.quantidade }}</td>
              <td>{{ moeda(fii.custo) }}</td>
              <td class="positive">{{ moeda(fii.precoMedio) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
