<script setup lang="ts">
import { reactive, ref } from 'vue'
import LayoutBiblioteca from '@/components/LayoutBiblioteca.vue'
import type { DadosLivro } from '@/interfaces/livro.interface'
import { cadastrarLivro, ErroApi } from '@/services/api'
const formulario = reactive<DadosLivro>({ titulo: '', autor: '', colecao: 'Acervo geral', descricao: '', editora: '', publicacaoAno: null, publicacaoMes: null, publicacaoDia: null, isbn13: '', isbn10: '', paginas: null, capa: null })
const enviando = ref(false)
const mensagem = ref('')
const erro = ref('')
const arquivoCapa = ref<HTMLInputElement | null>(null)
async function selecionarCapa(evento: Event) {
  const campo = evento.target as HTMLInputElement
  const arquivo = campo.files?.[0]
  if (!arquivo) return
  erro.value = ''
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(arquivo.type) || arquivo.size > 2 * 1024 * 1024) {
    erro.value = 'Selecione uma capa JPG, PNG ou GIF de até 2 MB.'
    campo.value = ''
    return
  }
  try {
    formulario.capa = await new Promise<string>((resolver, rejeitar) => {
      const leitor = new FileReader()
      leitor.onload = () => resolver(String(leitor.result))
      leitor.onerror = () => rejeitar(new Error('Falha ao ler a capa'))
      leitor.readAsDataURL(arquivo)
    })
  } catch { erro.value = 'Não foi possível abrir a imagem. Escolha outro arquivo.' }
}
async function salvar() {
  if (enviando.value) return
  erro.value = ''
  mensagem.value = ''
  enviando.value = true
  try {
    await cadastrarLivro({ ...formulario })
    mensagem.value = 'Livro adicionado ao acervo com sucesso.'
    Object.assign(formulario, { titulo: '', autor: '', descricao: '', editora: '', publicacaoAno: null, publicacaoMes: null, publicacaoDia: null, isbn13: '', isbn10: '', paginas: null, capa: null })
    if (arquivoCapa.value) arquivoCapa.value.value = ''
  } catch (falha) {
    erro.value = falha instanceof ErroApi && falha.status < 500 && falha.mensagem
      ? falha.mensagem : 'Não foi possível salvar o livro. Confira a conexão e a atualização do banco.'
  } finally { enviando.value = false }
}
</script>
<template>
  <LayoutBiblioteca titulo="Adicionar livros">
    <nav class="abas-biblioteca" aria-label="Cadastro de livros">
      <RouterLink :to="{ name: 'livros' }">Procurar</RouterLink>
      <RouterLink :to="{ name: 'adicionar-livro' }" class="aba-ativa" aria-current="page">Entrada manual</RouterLink>
    </nav>
    <form class="formulario-livro" @submit.prevent="salvar">
      <h2 id="titulo-colecao">Selecionar coleção</h2>
      <div class="campo-livro">
        <label class="somente-leitor" for="colecao">Coleção</label>
        <input id="colecao" v-model="formulario.colecao" maxlength="150" placeholder="Acervo geral" aria-describedby="dica-colecao" />
        <small id="dica-colecao">Informe a coleção à qual você está adicionando este exemplar.</small>
      </div>
      <div class="tipo-item">
        <h2>Tipo de item</h2>
        <label><input type="radio" name="tipo-item" checked value="livro" /> Livro</label>
        <p class="dica-formulario">O acervo da biblioteca é destinado à retirada de livros.</p>
      </div>
      <div class="subtitulo-item">Item</div>
      <div class="campo-livro">
        <label for="titulo">Título <span class="somente-leitor">(obrigatório)</span></label>
        <input id="titulo" v-model="formulario.titulo" maxlength="255" required />
      </div>
      <div class="campo-livro">
        <label for="autor">Autor <span class="somente-leitor">(obrigatório)</span></label>
        <input id="autor" v-model="formulario.autor" maxlength="150" required aria-describedby="dica-autor" />
        <small id="dica-autor">Para mais de um autor, separe os nomes com vírgula.</small>
      </div>
      <div class="campo-livro">
        <label for="descricao">Descrição</label>
        <textarea id="descricao" v-model="formulario.descricao" maxlength="5000" rows="7"></textarea>
      </div>
      <div class="campo-livro">
        <label for="editora">Editora</label>
        <input id="editora" v-model="formulario.editora" maxlength="150" />
      </div>
      <fieldset>
        <legend>Data de publicação</legend>
        <div class="linha-data">
          <div class="campo-livro"><label for="ano">Ano</label><input id="ano" v-model.number="formulario.publicacaoAno" type="number" min="1" max="9999" placeholder="AAAA" /></div>
          <div class="campo-livro"><label for="mes">Mês</label><input id="mes" v-model.number="formulario.publicacaoMes" type="number" min="1" max="12" placeholder="MM" /></div>
          <div class="campo-livro"><label for="dia">Dia</label><input id="dia" v-model.number="formulario.publicacaoDia" type="number" min="1" max="31" placeholder="DD" /></div>
        </div>
      </fieldset>
      <div class="linha-formulario">
        <div class="campo-livro"><label for="isbn13">ISBN 13</label><input id="isbn13" v-model="formulario.isbn13" inputmode="numeric" pattern="[0-9]{13}" maxlength="13" aria-describedby="dica-isbn13" /><small id="dica-isbn13">Apenas números. Exatamente 13 dígitos, se informado.</small></div>
        <div class="campo-livro"><label for="isbn10">ISBN 10</label><input id="isbn10" v-model="formulario.isbn10" pattern="[0-9]{9}[0-9Xx]" maxlength="10" aria-describedby="dica-isbn10" /><small id="dica-isbn10">10 caracteres. O último pode ser X.</small></div>
      </div>
      <div class="linha-formulario">
        <div class="campo-livro"><label for="paginas">Páginas</label><input id="paginas" v-model.number="formulario.paginas" type="number" min="1" max="100000" /></div>
        <div class="campo-upload">
          <button type="button" class="botao-upload" @click="arquivoCapa?.click()">Imagem da capa</button>
          <input ref="arquivoCapa" class="somente-leitor" tabindex="-1" type="file" accept="image/jpeg,image/png,image/gif" aria-label="Selecionar imagem da capa" @change="selecionarCapa" />
          <small class="dica-formulario">Arquivos JPG, PNG ou GIF de até 2 MB.</small>
          <img v-if="formulario.capa" :src="formulario.capa" alt="Prévia da capa selecionada" class="previa-capa" />
          <button v-if="formulario.capa" type="button" class="botao-secundario" @click="formulario.capa = null">Remover capa</button>
        </div>
      </div>
      <p v-if="erro" class="aviso-erro" role="alert">{{ erro }}</p>
      <p v-if="mensagem" class="aviso-sucesso" role="status">{{ mensagem }}</p>
      <footer class="rodape-formulario">
        <button class="botao-principal" type="submit" :disabled="enviando">{{ enviando ? 'Enviando…' : 'Enviar' }}</button>
        <RouterLink :to="{ name: 'livros' }">Voltar à biblioteca</RouterLink>
      </footer>
    </form>
  </LayoutBiblioteca>
</template>
<style scoped>
.somente-leitor { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
</style>
