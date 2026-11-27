import { createRouter, createWebHistory } from 'vue-router'

import FeedView from '../views/FeedView.vue'
import PerfilView from '../views/PerfilView.vue'

const routes = [
  {
    path: '/',
    name: 'Feed',
    component: FeedView
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router