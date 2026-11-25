import { createRouter, createWebHistory } from 'vue-router'
import LivrosView from '@/views/LivrosView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    titulo?: string
  }
}

const roteador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'livros', component: LivrosView },
    { path: '/livros/adicionar', name: 'adicionar-livro', component: () => import('@/views/AdicionarLivroView.vue'), meta: { titulo: 'Adicionar livros' } },
    { path: '/retiradas', name: 'minhas-retiradas', component: LivrosView, meta: { titulo: 'Minhas retiradas' } },
    { path: '/cadastro', name: 'cadastro', component: () => import('@/views/CadastroView.vue'), meta: { titulo: 'Criar conta' } },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { titulo: 'Entrar' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

const tituloOriginal = document.title
roteador.afterEach((rota, anterior, falha) => {
  if (!falha) document.title = rota.meta.titulo ? `${rota.meta.titulo} | Biblioteca Brasil` : tituloOriginal
})

export default roteador
