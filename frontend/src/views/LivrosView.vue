<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LayoutBiblioteca from '@/components/LayoutBiblioteca.vue'
import type { Livro, Retirada } from '@/interfaces/livro.interface'
import { consultarSessao, devolverLivro, ErroApi, listarLivros, listarMinhasRetiradas, retirarLivro } from '@/services/api'

const livros = ref<Livro[]>([])
const retiradas = ref<Retirada[]>([])
const quantidadeAtiva = computed(() => retiradas.value.filter((retirada) => !retirada.devolvidoEm).length)
const rota = useRoute()
const somenteRetiradas = computed(() => rota.name === 'minhas-retiradas')
const busca = ref('')
const livrosFiltrados = computed(() => livros.value.filter((livro) => (livro.titulo + ' ' + livro.autor).toLocaleLowerCase('pt-BR').includes(busca.value.trim().toLocaleLowerCase('pt-BR'))))
const conectado = ref(false)
const carregando = ref(true)
const enviando = ref(false)
const mensagem = ref('')
const erro = ref('')

async function carregar() {
  livros.value = await listarLivros() ?? []
  if (conectado.value) retiradas.value = await listarMinhasRetiradas() ?? []
}

onMounted(async () => {
  try {
    try {
      conectado.value = !!await consultarSessao()
    } catch (falha) {
      if (!(falha instanceof ErroApi) || falha.status !== 401) throw falha
    }
    await carregar()
  } catch {
    erro.value = 'Não foi possível carregar o acervo. Confira a API e as tabelas do banco.'
  } finally {
    carregando.value = false
  }
})

async function executar(acao: () => Promise<unknown>, sucesso: string) {
  if (enviando.value) return
  enviando.value = true
  erro.value = ''
  mensagem.value = ''
  try {
    await acao()
    mensagem.value = sucesso
    await carregar()
  } catch (falha) {
    if (falha instanceof ErroApi && falha.status === 401) {
      conectado.value = false
      retiradas.value = []
      erro.value = 'Entre na sua conta para retirar ou devolver livros.'
    } else {
      erro.value = falha instanceof ErroApi && falha.status < 500 && falha.mensagem
        ? falha.mensagem : 'Não foi possível concluir a ação. Tente novamente.'
    }
  } finally {
    enviando.value = false
  }
}


const formatarData = (valor: string) => new Date(valor).toLocaleString('pt-BR')
</script>

<template>
  <LayoutBiblioteca :titulo="somenteRetiradas ? 'Minhas retiradas' : 'Biblioteca'">
    <nav class="abas-biblioteca" aria-label="Acervo">
      <RouterLink :to="{ name: 'livros' }" :class="{ 'aba-ativa': !somenteRetiradas }">Procurar</RouterLink>
      <RouterLink :to="{ name: 'adicionar-livro' }">Entrada manual</RouterLink>
      <RouterLink :to="{ name: 'minhas-retiradas' }" :class="{ 'aba-ativa': somenteRetiradas }">Minhas retiradas</RouterLink>
    </nav>
    <p v-if="erro" class="aviso-erro" role="alert">{{ erro }}</p>
    <p v-if="mensagem" class="aviso-sucesso" role="status">{{ mensagem }}</p>
    <p v-if="carregando" role="status">Carregando acervo…</p>
    <p v-if="conectado" class="resumo-retiradas" role="status">
      Você está com <strong>{{ quantidadeAtiva }} de 5 livros</strong> permitidos.
      Devolva um exemplar para liberar uma nova retirada.
    </p>
    <p v-else>Entre na sua conta para retirar e devolver livros.
      <RouterLink :to="{ name: 'login' }" class="botao-secundario">Entrar</RouterLink>
    </p>
    <section v-if="!somenteRetiradas" aria-label="Livros do acervo">
      <div class="busca-acervo"><label for="buscar-livro">Procurar no acervo</label>
        <input id="buscar-livro" v-model="busca" type="search" placeholder="Pesquise pelo título ou autor" />
      </div>
      <p v-if="!carregando && !livrosFiltrados.length">{{ busca ? 'Nenhum livro encontrado para essa busca.' : 'Nenhum exemplar cadastrado no acervo.' }}</p>
      <ul class="lista-acervo">
        <li v-for="livro in livrosFiltrados" :key="livro.id" class="item-acervo">
          <div><h2>{{ livro.titulo }}</h2><p>{{ livro.autor }}</p><small>Exemplar {{ livro.id }}</small></div>
          <div class="acoes-acervo">
            <span class="etiqueta-disponibilidade" :class="{ indisponivel: !livro.disponivel }">{{ livro.disponivel ? 'Disponível' : 'Retirado' }}</span>
            <button class="botao-principal" :disabled="!conectado || !livro.disponivel || enviando || quantidadeAtiva >= 5"
                    @click="executar(() => retirarLivro(livro.id), 'Retirada registrada.')">Retirar</button>
          </div>
        </li>
      </ul>
    </section>
    <section v-else-if="conectado" aria-label="Histórico das minhas retiradas">
      <p v-if="!carregando && !retiradas.length">Você ainda não retirou livros.</p>
      <ul class="lista-acervo">
        <li v-for="retirada in retiradas" :key="retirada.id" class="item-acervo">
          <div><h2>{{ retirada.livro.titulo }}</h2><p>{{ retirada.livro.autor }}</p>
            <p>Retirado em {{ formatarData(retirada.retiradoEm) }}</p>
            <p v-if="retirada.devolvidoEm">Devolvido em {{ formatarData(retirada.devolvidoEm) }}</p>
          </div>
          <span v-if="retirada.devolvidoEm" class="etiqueta-disponibilidade">Devolvido</span>
          <button v-else class="botao-principal" :disabled="enviando"
                  @click="executar(() => devolverLivro(retirada.id), 'Devolução registrada.')">Devolver</button>
        </li>
      </ul>
    </section>
  </LayoutBiblioteca>
</template>

