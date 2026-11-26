import { createRouter, createWebHistory } from 'vue-router'
import CadastroView from '@/views/CadastroView.vue'

const roteador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/cadastro' },
    { path: '/cadastro', name: 'cadastro', component: CadastroView },
    { path: '/:caminho(.*)*', redirect: '/cadastro' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

roteador.afterEach(() => { document.title = 'Crie sua conta | Biblioteca Brasil' })
export default roteador
