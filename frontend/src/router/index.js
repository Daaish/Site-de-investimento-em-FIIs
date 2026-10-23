
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import EmConstrucaoView from '../views/EmConstrucaoView.vue'
import CarteiraView from '../views/CarteiraView.vue'
import CalendarioView from '../views/CalendarioView.vue'
import ConquistasView from '../views/ConquistasView.vue'
import DnaView from '../views/DnaView.vue'
import ExplorarView from '../views/ExplorarView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/explorar', name: 'explorar', component: ExplorarView },
    { path: '/carteira', name: 'carteira', component: CarteiraView },
    { path: '/calendario', name: 'calendario', component: CalendarioView },
    { path: '/conquistas', name: 'conquistas', component: ConquistasView },
    { path: '/dna', name: 'dna', component: DnaView },
  ],
})

export default router
