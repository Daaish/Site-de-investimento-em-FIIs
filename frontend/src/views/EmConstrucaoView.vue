
<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  titulo: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section>
    <div class="eyebrow">BELMAR STATE / FUNCIONALIDADES</div>
    <h1>{{ titulo }} <span class="accent">.</span></h1>
    <p>Esta área está preparada para receber sua funcionalidade.</p>

    <div class="placeholder-panel">
      <div class="placeholder-symbol">✦</div>
      <h2>Em desenvolvimento</h2>
      <p>
        Em breve, esta ferramenta estará integrada
        à plataforma de investimentos.
      </p>

      <RouterLink to="/" class="primary-button">
        ← Voltar ao Dashboard
      </RouterLink>
    </div>
  </section>
</template>
