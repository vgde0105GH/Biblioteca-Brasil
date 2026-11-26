
<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

// DADOS DO USUÁRIO
const nome = ref('Nome do usuário')
const bio = ref('Bio')

const descricao = ref(
  'Esta é a descrição do usuário. Aqui você pode escrever sobre seus gostos, seus livros favoritos, suas experiências de leitura e outras informações interessantes. A descrição pode ser bem grande e terá a opção de continuar lendo.'
)

// FOTO DE PERFIL
const foto = ref<string | null>(null)
const arquivoFoto = ref<HTMLInputElement | null>(null)

function abrirArquivos() {
  arquivoFoto.value?.click()
}

function selecionarFoto(event: Event) {
  const arquivo = (event.target as HTMLInputElement).files?.[0]

  if (!arquivo) return

  if (!arquivo.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem!')
    return
  }

  if (foto.value) {
    URL.revokeObjectURL(foto.value)
  }

  foto.value = URL.createObjectURL(arquivo)
}

// DESCRIÇÃO
const limite = 115
const mostrarDescricaoCompleta = ref(false)

const descricaoCurta = computed(() => {
  if (descricao.value.length <= limite) {
    return descricao.value
  }

  return descricao.value.slice(0, limite) + '...'
})

// MENU LATERAL
const paginaAtual = ref('Sobre')

const paginas = [
  { nome: 'Sobre', icone: 'ℹ' },
  { nome: 'Minhas Bibliotecas', icone: '▥' },
  { nome: 'Bibliotecas de conta', icone: '♟' },
  { nome: 'Categorias', icone: '📁' },
  { nome: 'Gerenciador', icone: '☷' }
]

// SALVAR ALTERAÇÕES
function salvarAlteracoes() {
  if (!nome.value.trim()) {
    alert('Digite um nome para seu perfil!')
    return
  }

  paginaAtual.value = 'Sobre'
  alert('Perfil atualizado com sucesso!')
}

// LIMPAR URL DA FOTO
onBeforeUnmount(() => {
  if (foto.value) {
    URL.revokeObjectURL(foto.value)
  }
})
</script>

<template>
  <div class="pagina">

    <!-- CABEÇALHO DO PERFIL -->
    <header class="cabecalho">

      <!-- FOTO DE PERFIL -->
      <div class="area-foto">

        <div class="foto" @click="abrirArquivos">

          <img
            v-if="foto"
            :src="foto"
            alt="Foto do usuário"
          />

          <div v-else class="usuario-padrao">
            <span class="silhueta">●</span>
            <span class="corpo">●</span>
          </div>

          <div v-if="!foto" class="camera">📷</div>

        </div>

        <input
          ref="arquivoFoto"
          type="file"
          accept="image/*"
          hidden
          @change="selecionarFoto"
        />

      </div>

      <!-- INFORMAÇÕES -->
      <div class="cartao-perfil">

        <div class="bandeira-fundo"></div>

        <div class="dados">
          <h1>{{ nome }}</h1>
          <h2>{{ bio }}</h2>

          <p class="descricao">
            {{ descricaoCurta }}

            <button
              v-if="descricao.length > limite"
              class="continuar"
              @click="mostrarDescricaoCompleta = true"
            >
              Continuar ler
            </button>
          </p>
        </div>

        <span class="bandeira">🇧🇷</span>

      </div>

    </header>

    <!-- ÁREA PRINCIPAL -->
    <div class="estrutura">

      <!-- MENU LATERAL -->
      <aside class="menu">

        <nav>
          <button
            v-for="pagina in paginas"
            :key="pagina.nome"
            :class="{ ativo: paginaAtual === pagina.nome }"
            @click="paginaAtual = pagina.nome"
          >
            <span>{{ pagina.icone }}</span>
            {{ pagina.nome }}
          </button>
        </nav>

        <button class="sair" @click="paginaAtual = 'Sobre'">
          <span>⇥</span>
          Sair
        </button>

      </aside>

      <!-- PAINEL PRINCIPAL -->
      <main class="painel">

        <!-- SOBRE -->
        <div
          v-if="paginaAtual === 'Sobre'"
          class="conteudo-painel"
        >
        </div>

        <!-- MINHAS BIBLIOTECAS -->
        <div
          v-else-if="paginaAtual === 'Minhas Bibliotecas'"
          class="conteudo-painel"
        >
          <h2>Minhas Bibliotecas</h2>
          <p>Aqui aparecerão suas bibliotecas e livros.</p>
        </div>

        <!-- BIBLIOTECAS DA CONTA -->
        <div
          v-else-if="paginaAtual === 'Bibliotecas de conta'"
          class="conteudo-painel"
        >
          <h2>Bibliotecas da conta</h2>
          <p>Aqui aparecerão as bibliotecas da sua conta.</p>
        </div>

        <!-- CATEGORIAS -->
        <div
          v-else-if="paginaAtual === 'Categorias'"
          class="conteudo-painel"
        >
          <h2>Categorias</h2>
          <p>Aqui aparecerão as categorias dos livros.</p>
        </div>

        <!-- GERENCIADOR -->
        <div
          v-else-if="paginaAtual === 'Gerenciador'"
          class="gerenciador"
        >

          <h2>Gerenciar perfil</h2>

          <p class="subtitulo">
            Edite as informações do seu perfil.
          </p>

          <label>Nick / Nome do usuário</label>

          <input
            v-model="nome"
            placeholder="Digite seu nome"
            maxlength="40"
          />

          <label>Bio</label>

          <input
            v-model="bio"
            placeholder="Digite sua bio"
            maxlength="100"
          />

          <label>Descrição</label>

          <textarea
            v-model="descricao"
            placeholder="Escreva sua descrição..."
            rows="6"
            maxlength="2000"
          ></textarea>

          <button
            class="salvar"
            @click="salvarAlteracoes"
          >
            ✓ Salvar alterações
          </button>

        </div>

      </main>

    </div>

    <!-- JANELA CONTINUAR LENDO -->
    <div
      v-if="mostrarDescricaoCompleta"
      class="fundo-modal"
      @click.self="mostrarDescricaoCompleta = false"
    >

      <div class="modal">

        <button
          class="fechar"
          @click="mostrarDescricaoCompleta = false"
        >
          ×
        </button>

        <h2>Sobre o usuário</h2>

        <p>{{ descricao }}</p>

        <button
          class="botao-fechar"
          @click="mostrarDescricaoCompleta = false"
        >
          Fechar
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.pagina {
  min-height: 100vh;
  padding: 18px;
  background: linear-gradient(120deg, #07572b, #003d1e);
  font-family: Arial, sans-serif;
  color: #103b23;
  border: 5px solid #003d1e;
  border-radius: 18px;
}

/* CABEÇALHO */

.cabecalho {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 14px;
}

/* FOTO */

.area-foto {
  width: 185px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.foto {
  width: 155px;
  height: 155px;
  border-radius: 50%;
  border: 5px solid #dce5df;
  background: #f1f5f1;
  box-shadow: 0 3px 10px #001c0e;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.usuario-padrao {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #064422;
}

.silhueta {
  font-size: 65px;
  line-height: 60px;
}

.corpo {
  font-size: 85px;
  line-height: 55px;
}

.camera {
  position: absolute;
  bottom: 23px;
  right: 20px;
  background: #0b4b27;
  color: white;
  padding: 7px;
  border-radius: 50%;
  font-size: 17px;
}

/* CARTÃO DO PERFIL */

.cartao-perfil {
  flex: 1;
  min-height: 155px;
  background: white;
  border-radius: 13px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 10px #002a14;
}

.bandeira-fundo {
  position: absolute;
  top: 0;
  right: 0;
  width: 35%;
  height: 55px;
  background: linear-gradient(
    155deg,
    #dce8f7 0%,
    #dce8f7 35%,
    #f5d52e 36%,
    #f5d52e 65%,
    #173d9c 66%
  );
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 65%);
  opacity: .95;
}

.dados {
  position: relative;
  z-index: 1;
  padding: 10px 16px;
}

.dados h1 {
  font-size: 34px;
  margin: 0 0 4px;
  font-weight: bold;
  color: #103b23;
}

.dados h2 {
  font-size: 21px;
  margin: 0 0 8px;
}

.descricao {
  font-size: 16px;
  margin: 0;
  color: #222;
  line-height: 1.5;
}

.continuar {
  border: none;
  background: transparent;
  color: #08733a;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
  padding: 0 4px;
}

.bandeira {
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 24px;
}

/* ESTRUTURA */

.estrutura {
  display: flex;
  gap: 14px;
  min-height: calc(100vh - 225px);
}

/* MENU */

.menu {
  width: 210px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #064a25, #003b1c);
  border-radius: 12px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 3px 10px #002a14;
}

.menu nav {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.menu button {
  border: none;
  border-radius: 13px;
  padding: 10px;
  background: #f1f1df;
  color: #183d26;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: .2s;
}

.menu button span {
  margin-right: 5px;
}

.menu button:hover {
  background: #d5e6d8;
}

.menu button.ativo {
  background: #f4cf4d;
}

.menu button.sair {
  background: #bd3029;
  color: white;
  text-align: left;
  margin-top: 30px;
}

/* PAINEL */

.painel {
  flex: 1;
  min-width: 0;
  background: #e7f4ed;
  border-radius: 13px;
  box-shadow: 0 3px 10px #002a14;
  padding: 25px;
}

.conteudo-painel h2 {
  margin-top: 0;
  color: #104327;
}

.conteudo-painel p {
  color: #4c6756;
}

/* GERENCIADOR */

.gerenciador {
  max-width: 600px;
}

.gerenciador h2 {
  color: #104327;
  font-size: 25px;
  margin-top: 0;
}

.subtitulo {
  color: #4c6756;
  margin-bottom: 25px;
}

.gerenciador label {
  display: block;
  margin-top: 18px;
  margin-bottom: 7px;
  font-weight: bold;
  color: #164b2b;
}

.gerenciador input,
.gerenciador textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #b5cbb9;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  outline-color: #08733a;
  background: white;
}

.gerenciador textarea {
  resize: vertical;
}

.salvar {
  margin-top: 20px;
  padding: 12px 22px;
  background: #07572b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: .2s;
}

.salvar:hover {
  background: #087a3b;
}

/* MODAL */

.fundo-modal {
  position: fixed;
  inset: 0;
  background: #0009;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10;
}

.modal {
  position: relative;
  background: white;
  width: 100%;
  max-width: 500px;
  padding: 28px;
  border-radius: 15px;
  box-shadow: 0 5px 20px #0005;
}

.modal h2 {
  color: #07572b;
}

.modal p {
  color: #333;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.fechar {
  position: absolute;
  right: 15px;
  top: 10px;
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
}

.botao-fechar {
  background: #07572b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* CELULAR */

@media (max-width: 650px) {
  .cabecalho {
    flex-direction: column;
  }

  .cartao-perfil {
    width: 100%;
  }

  .estrutura {
    flex-direction: column;
  }

  .menu {
    width: 100%;
    gap: 20px;
  }

  .menu nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .dados h1 {
    font-size: 25px;
  }

  .area-foto {
    width: 100%;
  }
}
</style>
