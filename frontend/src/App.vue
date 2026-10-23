
<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const menuAberto = ref(false)

const menu = [
  { nome: 'Visão Geral', rota: '/', icone: '◈' },
  { nome: 'Explorar FIIs', rota: '/explorar', icone: '⌕' },
  { nome: 'Minha Carteira', rota: '/carteira', icone: '▣' },
  { nome: 'Calendário', rota: '/calendario', icone: '▦' },
  { nome: 'Conquistas', rota: '/conquistas', icone: '✦' },
  { nome: 'Meu DNA', rota: '/dna', icone: '◎' },
]
</script>

<template>
  <div class="app-layout">
    <button class="mobile-menu" @click="menuAberto = !menuAberto">
      ☰
    </button>

    <aside class="sidebar" :class="{ aberto: menuAberto }">
      <div class="logo">
        <div class="logo-icon">B</div>
        <div>
          <h2>Belmar State</h2>
          <span>INVESTIMENTOS</span>
        </div>
      </div>

      <div class="menu-label">PLATAFORMA</div>

      <nav class="navigation">
        <RouterLink
          v-for="item in menu"
          :key="item.rota"
          :to="item.rota"
          class="nav-item"
          @click="menuAberto = false"
        >
          <span class="nav-icon">{{ item.icone }}</span>
          {{ item.nome }}
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="profile-avatar">IV</div>
        <div>
          <strong>Investidor</strong>
          <small>Conta demonstrativa</small>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumb">PLATAFORMA / INVESTIMENTOS</div>
        <div class="topbar-right">
          <span class="demo-indicator">● Ambiente demonstrativo</span>
          <div class="top-avatar">IV</div>
        </div>
      </header>

      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>
