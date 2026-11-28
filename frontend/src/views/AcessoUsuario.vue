<script setup lang="ts">
import { onMounted, ref } from "vue";
import LayoutConta from "@/components/LayoutConta.vue";
import CampoTexto from "@/components/input/CampoTexto.vue";
import CampoSenha from "@/components/input/CampoSenha.vue";
import {
  consultarSessao,
  entrarNaConta,
  sairDaConta,
  ErroApi,
} from "@/services/api";

const email = ref("");
const senha = ref("");
const nome = ref("");
const enviando = ref(false);
const consultando = ref(true);
const mensagem = ref("");
onMounted(async () => {
  try {
    nome.value = (await consultarSessao())?.nome ?? "";
  } catch (erro) {
    if (!(erro instanceof ErroApi) || erro.status !== 401)
      mensagem.value = "Não foi possível consultar sua sessão.";
  } finally {
    consultando.value = false;
  }
});
async function entrar() {
  if (enviando.value) return;
  mensagem.value = "";
  if (!email.value.trim() || !senha.value) {
    mensagem.value = "Informe seu e-mail e sua senha.";
    return;
  }
  enviando.value = true;
  try {
    nome.value =
      (await entrarNaConta({ email: email.value.trim(), senha: senha.value }))
        ?.nome ?? "";
    senha.value = "";
  } catch (erro) {
    mensagem.value =
      erro instanceof ErroApi && erro.status === 401
        ? "E-mail ou senha inválidos."
        : "Não foi possível entrar agora. Tente novamente.";
  } finally {
    enviando.value = false;
  }
}
async function sair() {
  enviando.value = true;
  mensagem.value = "";
  try {
    await sairDaConta();
    nome.value = "";
  } catch {
    mensagem.value = "Não foi possível sair. Tente novamente.";
  } finally {
    enviando.value = false;
  }
}
</script>
<template>
  <LayoutConta>
    <section
      class="cartao-cadastro cartao-login"
      aria-labelledby="titulo-login"
    >
      <header class="cabecalho-formulario">
        <h1 id="titulo-login">
          {{ nome ? "Bem-vindo de volta" : "Entre na sua conta" }}
        </h1>
      </header>
      <p v-if="mensagem" class="aviso-conta" role="alert">{{ mensagem }}</p>
      <p v-if="consultando" class="estado-login" role="status">
        Verificando sua sessão…
      </p>
      <div v-else-if="nome" class="conteudo-etapa">
        <p class="estado-login" role="status">
          Olá, {{ nome }}. Você está conectado à Biblioteca Brasil.
        </p>
        <button class="acao-conta" :disabled="enviando" @click="sair">
          Sair da conta
        </button>
      </div>
      <form
        v-else
        id="formulario-cadastro"
        class="formulario-conta"
        @submit.prevent="entrar"
      >
        <fieldset class="campos-cadastro conteudo-etapa" :disabled="enviando">
          <CampoTexto
            id="login-email"
            v-model="email"
            rotulo="E-mail"
            tipo="email"
            autocomplete="username"
            placeholder="voce@exemplo.com"
            :maxlength="254"
          />
          <CampoSenha
            id="login-senha"
            v-model="senha"
            rotulo="Senha"
            autocomplete="current-password"
            placeholder="Sua senha"
          />
          <button class="acao-conta" type="submit" :disabled="enviando">
            {{ enviando ? "Entrando…" : "Entrar" }}
          </button>
        </fieldset>
      </form>
      <footer class="acesso-existente">
        <RouterLink class="botao-login" :to="{ name: 'cadastro' }"
          >Criar uma conta</RouterLink
        >
      </footer>
    </section>
  </LayoutConta>
</template>
