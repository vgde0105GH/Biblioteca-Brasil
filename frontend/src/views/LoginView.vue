<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FormularioConta from '@/components/FormularioConta.vue'
import LayoutConta from '@/components/LayoutConta.vue'
import CampoSenha from '@/components/input/CampoSenha.vue'
import CampoTexto from '@/components/input/CampoTexto.vue'
import type { ContaAutenticada } from '@/interfaces/usuario.interface'
import { consultarSessao, entrarNaConta, ErroApi, sairDaConta } from '@/services/api'

const email = ref('')
const senha = ref('')
const conta = ref<ContaAutenticada | null>(null)
const mensagem = ref('')
const consultando = ref(true)
const enviando = ref(false)

onMounted(async () => {
  try {
    conta.value = await consultarSessao()
  } catch (erro) {
    if (!(erro instanceof ErroApi) || erro.status !== 401) mensagem.value = 'Não foi possível consultar sua sessão.'
  } finally {
    consultando.value = false
  }
})

async function entrar() {
  if (enviando.value) return
  enviando.value = true
  mensagem.value = ''
  try {
    conta.value = await entrarNaConta({ email: email.value.trim(), senha: senha.value })
    email.value = ''
    senha.value = ''
  } catch (erro) {
    mensagem.value = erro instanceof ErroApi && erro.status === 401
      ? 'E-mail ou senha inválidos.'
      : 'Não foi possível entrar. Tente novamente.'
  } finally {
    enviando.value = false
  }
}

async function sair() {
  if (enviando.value) return
  enviando.value = true
  mensagem.value = ''
  try {
    await sairDaConta()
    conta.value = null
  } catch {
    mensagem.value = 'Não foi possível sair. Tente novamente.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <LayoutConta>
    <header class="cabecalho-conta">
      <h1 id="titulo-conta">{{ conta ? 'Minha conta' : 'Entrar' }}</h1>
      <p v-if="conta" role="status">Olá, {{ conta.nome }}.</p>
      <p v-else>Acesse sua conta da Biblioteca Brasil.</p>
    </header>

    <p v-if="mensagem" class="aviso-conta" role="alert">{{ mensagem }}</p>
    <p v-if="consultando" role="status">Verificando sua sessão…</p>

    <div v-else-if="conta">
      <RouterLink class="acao-conta" :to="{ name: 'livros' }">Ir para a biblioteca <span aria-hidden="true">→</span></RouterLink>
      <p class="rodape-conta"><button class="link-conta" :disabled="enviando" @click="sair">Sair da conta</button></p>
    </div>

    <template v-else>
      <FormularioConta rotulo="Entrar" rotulo-envio="Entrando…" :enviando="enviando" @enviar="entrar">
        <CampoTexto id="login-email" v-model="email" rotulo="E-mail" nome="email" tipo="email" autocomplete="username"
                    :maxlength="254" placeholder="Digite seu e-mail" />
        <CampoSenha id="login-senha" v-model="senha" rotulo="Senha" placeholder="Digite sua senha"
                    autocomplete="current-password" />
      </FormularioConta>
      <p class="rodape-conta">Ainda não tem conta? <RouterLink :to="{ name: 'cadastro' }">Criar conta</RouterLink></p>
    </template>
  </LayoutConta>
</template>
