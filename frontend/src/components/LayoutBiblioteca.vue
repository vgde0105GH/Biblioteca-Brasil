<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { consultarSessao, sairDaConta } from '@/services/api'
defineProps<{ titulo: string }>()
const roteador = useRouter()
const nome = ref('')
const menuAberto = ref(false)
const saindo = ref(false)
const erroConta = ref('')
onMounted(async () => {
  try { nome.value = (await consultarSessao())?.nome ?? '' } catch { nome.value = '' }
})
async function sair() {
  if (saindo.value) return
  saindo.value = true
  try {
    await sairDaConta()
    nome.value = ''
    await roteador.push({ name: 'login' })
  } catch { erroConta.value = 'Não foi possível sair. Tente novamente.' }
  finally { saindo.value = false }
}
</script>
<template>
  <div class="biblioteca-layout">
    <a class="pular-conteudo" href="#conteudo-biblioteca">Ir para o conteúdo</a>
    <aside class="menu-biblioteca" aria-label="Menu da biblioteca">
      <RouterLink :to="{ name: 'livros' }" class="marca-sapiens">SAPIENS</RouterLink>
      <button class="alternar-menu" :aria-expanded="menuAberto" aria-controls="navegacao-biblioteca"
              @click="menuAberto = !menuAberto">Menu</button>
      <nav id="navegacao-biblioteca" :class="{ aberto: menuAberto }">
        <RouterLink :to="{ name: 'livros' }" :class="{ selecionado: $route.name === 'livros' }">Biblioteca</RouterLink>
        <RouterLink :to="{ name: 'adicionar-livro' }" :class="{ selecionado: $route.name === 'adicionar-livro' }">
          <span class="indicador-adicionar" aria-hidden="true">+</span> Adicionar livros
        </RouterLink>
        <RouterLink :to="{ name: 'minhas-retiradas' }" :class="{ selecionado: $route.name === 'minhas-retiradas' }">Minhas retiradas</RouterLink>
        <div class="menu-secundario">
          <RouterLink :to="{ name: 'login' }">Minha conta</RouterLink>
          <RouterLink v-if="!nome" :to="{ name: 'cadastro' }">Criar conta</RouterLink>
          <button v-else :disabled="saindo" @click="sair">{{ saindo ? 'Saindo…' : 'Sair' }}</button>
        </div>
      </nav>
    </aside>
    <div class="corpo-biblioteca">
      <header class="cabecalho-biblioteca">
        <h1>{{ titulo }}</h1>
        <RouterLink class="menu-conta-biblioteca" :to="{ name: 'login' }">
          <span><strong>{{ nome || 'Usuário' }}</strong><small>{{ nome ? 'Menu da conta' : 'Entrar na conta' }}</small></span>
          <span class="avatar-conta" aria-hidden="true">{{ nome ? nome.charAt(0).toUpperCase() : '' }}</span>
        </RouterLink>
      </header>
      <main id="conteudo-biblioteca" class="conteudo-biblioteca">
        <p v-if="erroConta" class="aviso-erro" role="alert">{{ erroConta }}</p>
        <slot />
      </main>
    </div>
  </div>
</template>
<style src="@/assets/biblioteca.css"></style>
