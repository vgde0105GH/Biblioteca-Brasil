
<script setup lang="ts">
import { ref } from 'vue'

const abaSelecionada = ref('Livros')
const mostrarFormulario = ref(false)

const livros = ref<{ id: number; nome: string; autor: string }[]>([])

const novoLivro = ref({
  nome: '',
  autor: ''
})

function adicionarLivro() {
  if (!novoLivro.value.nome.trim()) return

  livros.value.push({
    id: Date.now(),
    nome: novoLivro.value.nome,
    autor: novoLivro.value.autor
  })

  novoLivro.value = { nome: '', autor: '' }
  mostrarFormulario.value = false
}
</script>

<template>
  <div class="pagina">

    <!-- BARRA SUPERIOR -->
    <header class="topo">
      <div class="logo">Biblioteca <b>3D</b></div>
      <span class="explorar">Explorar</span>

      <div class="pesquisa">
        <button>Todos</button>
        <input placeholder="Buscar..." />
        <button>⌕</button>
      </div>

      <span class="notificacao">♧</span>
      <span class="bandeira">🇧🇷</span>
    </header>

    <!-- SEGUNDA BARRA -->
    <nav class="barra">
      <button class="novo" @click="mostrarFormulario = true">
        ⊕ Novo
      </button>
      <span>☑ Selecionar todos</span>
      <span class="desativado">□ Limpar seleção</span>
    </nav>

    <!-- CONTEÚDO -->
    <div class="conteudo">

      <!-- MENU LATERAL -->
      <aside class="lateral">

        <div class="foto">
          <span>👤</span>
        </div>

        <button class="alterar">
          ♧ Alterar foto de perfil
        </button>

        <input
          class="nome"
          placeholder="Nome do usuário"
        />

        <div class="menu">
          <button>▣ Sobre</button>

          <button class="ativo">
            ▦ Minhas Bibliotecas
          </button>

          <button>☁ Bibliotecas da Conta</button>

          <button>◆ Categorias</button>

          <button>⚙ Gerenciador</button>
        </div>

      </aside>

      <!-- ÁREA PRINCIPAL -->
      <main class="principal">

        <div class="abas">
          <button
            :class="{ selecionada: abaSelecionada === 'Livros' }"
            @click="abaSelecionada = 'Livros'"
          >
            Livros
          </button>

          <button
            :class="{ selecionada: abaSelecionada === 'Materiais' }"
            @click="abaSelecionada = 'Materiais'"
          >
            Materiais
          </button>
        </div>

        <div v-if="abaSelecionada === 'Livros'">

          <div v-if="livros.length === 0" class="aviso">
            ℹ Nenhum livro cadastrado no momento.
          </div>

          <div v-else class="livros">
            <div
              v-for="livro in livros"
              :key="livro.id"
              class="card-livro"
            >
              <div class="capa">📖</div>
              <strong>{{ livro.nome }}</strong>
              <small>{{ livro.autor }}</small>
            </div>
          </div>

        </div>

        <div v-else class="aviso">
          ℹ Nenhum material cadastrado no momento.
        </div>

      </main>
    </div>

    <!-- BOTÃO ADICIONAR -->
    <button
      class="adicionar"
      @click="mostrarFormulario = true"
    >
      +
    </button>

    <!-- FORMULÁRIO -->
    <div v-if="mostrarFormulario" class="fundo">
      <div class="modal">
        <h2>Adicionar livro</h2>

        <input
          v-model="novoLivro.nome"
          placeholder="Nome do livro"
        />

        <input
          v-model="novoLivro.autor"
          placeholder="Nome do autor"
        />

        <div class="acoes">
          <button @click="mostrarFormulario = false">
            Cancelar
          </button>

          <button @click="adicionarLivro">
            Salvar
          </button>
        </div>
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
  background: #fafafa;
  font-family: Arial, sans-serif;
  color: #292929;
}

/* BARRA SUPERIOR */
.topo {
  height: 42px;
  background: #492052;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 25px;
}

.logo {
  font-size: 13px;
}

.logo b {
  color: #c7a5d8;
}

.explorar {
  font-size: 14px;
}

.pesquisa {
  display: flex;
  margin-left: auto;
  height: 27px;
}

.pesquisa input {
  width: 125px;
  border: 0;
  padding: 5px;
}

.pesquisa button {
  border: 0;
  padding: 0 10px;
  color: #555;
}

.notificacao,
.bandeira {
  font-size: 19px;
}

/* SEGUNDA BARRA */
.barra {
  height: 25px;
  background: #774281;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 12px;
}

.barra button {
  height: 25px;
  border: none;
  cursor: pointer;
}

.novo {
  background: #582263;
  color: white;
  font-weight: bold;
}

.desativado {
  opacity: .55;
}

/* CONTEÚDO */
.conteudo {
  display: flex;
  padding: 18px 7%;
  gap: 32px;
}

.lateral {
  width: 120px;
  flex-shrink: 0;
}

.foto {
  width: 120px;
  height: 120px;
  background: #dce0e2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 65px;
}

.alterar {
  border: none;
  background: transparent;
  color: #704080;
  font-size: 11px;
  cursor: pointer;
  margin: 5px 0 12px;
}

.nome {
  width: 120px;
  height: 24px;
  border: 1px solid #ddd;
  padding: 5px;
}

.menu {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
}

.menu button {
  text-align: left;
  border: none;
  background: transparent;
  padding: 6px 4px;
  font-size: 12px;
  cursor: pointer;
}

.menu button.ativo {
  background: #dedede;
}

/* ÁREA PRINCIPAL */
.principal {
  flex: 1;
  min-width: 0;
}

.abas {
  display: flex;
  border-bottom: 1px solid #ddd;
  height: 42px;
}

.abas button {
  background: transparent;
  border: none;
  padding: 10px 15px;
  color: #704080;
  cursor: pointer;
}

.abas button.selecionada {
  background: white;
  border: 1px solid #ddd;
  border-bottom: 1px solid white;
  border-radius: 4px 4px 0 0;
}

.aviso {
  background: #d9f2fa;
  border: 1px solid #b4e7f4;
  color: #24718a;
  text-align: center;
  padding: 6px;
  margin-top: 15px;
  font-size: 12px;
  border-radius: 4px;
}

/* LIVROS */
.livros {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding-top: 20px;
}

.card-livro {
  width: 130px;
  min-height: 160px;
  border: 1px solid #ddd;
  background: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.capa {
  width: 100px;
  height: 100px;
  background: #eee5f2;
  display: grid;
  place-items: center;
  font-size: 35px;
}

.card-livro small {
  color: #777;
}

/* BOTÃO ADICIONAR */
.adicionar {
  position: fixed;
  bottom: 25px;
  right: 35px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #754181;
  color: white;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0 2px 6px #aaa;
}

/* MODAL */
.fundo {
  position: fixed;
  inset: 0;
  background: #0007;
  display: grid;
  place-items: center;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 300px;
}

.modal h2 {
  font-size: 20px;
}

.modal input {
  width: 100%;
  padding: 10px;
  margin: 7px 0;
  border: 1px solid #ccc;
}

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.acoes button {
  padding: 8px 12px;
  border: none;
  background: #754181;
  color: white;
  cursor: pointer;
}

@media (max-width: 600px) {
  .conteudo {
    padding: 15px;
    gap: 15px;
  }

  .lateral {
    width: 110px;
  }

  .foto {
    width: 105px;
    height: 105px;
  }

  .pesquisa input {
    width: 65px;
  }

  .topo {
    gap: 10px;
  }
}
</style>

