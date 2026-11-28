import { createRouter, createWebHistory } from "vue-router";
import CadastroUsuario from "@/views/CadastroUsuario.vue";

const roteador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/cadastro" },
    { path: "/cadastro", name: "cadastro", component: CadastroUsuario },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/AcessoUsuario.vue"),
    },
    { path: "/:caminho(.*)*", redirect: "/cadastro" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

roteador.afterEach((rota) => {
  document.title =
    (rota.name === "login" ? "Entrar" : "Crie sua conta") +
    " | Biblioteca Brasil";
});
export default roteador;
