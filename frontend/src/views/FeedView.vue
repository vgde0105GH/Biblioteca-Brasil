<script>
import Sidebar from '../Components/Sidebar.vue'
import Header from '../Components/Header.vue'
import SearchBar from '../Components/SearchBar.vue'
import BookCard from '../Components/BookCard.vue'

export default {
  components: {
    Sidebar,
    Header,
    SearchBar,
    BookCard
  },

  data() {
    return {
      pesquisa: '',

      livros: [
        {
          id: 1,
          titulo: 'Dom Casmurro',
          autor: 'Machado de Assis'
        },
        {
          id: 2,
          titulo: 'O Hobbit',
          autor: 'J. R. R. Tolkien'
        },
        {
          id: 3,
          titulo: 'Harry Potter',
          autor: 'J. K. Rowling'
        }
      ]
    }
  },

  computed: {
    livrosFiltrados() {
      return this.livros.filter(livro =>
        livro.titulo.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        livro.autor.toLowerCase().includes(this.pesquisa.toLowerCase())
      )
    }
  }
}
</script>

<template>
  <div class="pagina">

    <Sidebar />

    <main class="conteudo">

      <Header titulo="Feed" />

      <SearchBar
        @pesquisar="pesquisa = $event"
      />

      <section class="card">
        <h2 class="titulo">Meus empréstimos</h2>
        <p class="subtitulo">
          Você não possui empréstimos ativos.
        </p>
      </section>

      <section>
        <h2 class="titulo">Lançamentos</h2>

        <div class="grid">
          <BookCard
            v-for="livro in livrosFiltrados"
            :key="livro.id"
            :livro="livro"
          />
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  min-height: 100vh;
}

.conteudo {
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

section .titulo {
  margin-bottom: 15px;
}
</style>