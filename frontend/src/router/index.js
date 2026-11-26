import { createRouter, createWebHistory } from 'vue-router'

import FeedView from '@/views/FeedView.vue'
import PerfilView from '@/views/PerfilView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
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
})

export default router