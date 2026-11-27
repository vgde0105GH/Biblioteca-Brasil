<template>
  <div class="feed">
    <Sidebar />

    <main class="content">
      <Header titulo="Feed" />

      <SearchBar v-model="pesquisa" />

      <section class="section">
        <h2>Livros populares</h2>

        <div class="books">
          <BookCard
            v-for="livro in livrosFiltrados"
            :key="livro.id"
            :livro="livro"
            @detalhes="verDetalhes"
          />
        </div>

        <p v-if="livrosFiltrados.length === 0">
          Nenhum livro encontrado.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import Sidebar from '../../Components/Sidebar.vue'
import Header from '../../Components/Header.vue'
import SearchBar from '../../Components/SearchBar.vue'
import BookCard from '../../Components/BookCard.vue'

const pesquisa = ref('')

const livros = ref([
  {
    id: 1,
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    genero: 'Fantasia',
    capa: 'https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg'
  },
  {
    id: 2,
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    genero: 'Romance',
    capa: 'https://covers.openlibrary.org/b/isbn/9788525406958-M.jpg'
  },
  {
    id: 3,
    titulo: 'Harry Potter e a Pedra Filosofal',
    autor: 'J. K. Rowling',
    genero: 'Fantasia',
    capa: 'https://covers.openlibrary.org/b/isbn/9788532511010-M.jpg'
  },
  {
    id: 4,
    titulo: 'O Hobbit',
    autor: 'J. R. R. Tolkien',
    genero: 'Aventura',
    capa: 'https://covers.openlibrary.org/b/isbn/9788595084742-M.jpg'
  }
])

const livrosFiltrados = computed(() => {
  const termo = pesquisa.value.toLowerCase()

  return livros.value.filter((livro) => {
    return (
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo) ||
      livro.genero.toLowerCase().includes(termo)
    )
  })
})

function verDetalhes(livro) {
  alert(`Livro selecionado: ${livro.titulo}`)
}
</script>

<style scoped>
.feed {
  display: flex;
  min-height: 100vh;
  background: #f5f7f5;
}

.content {
  flex: 1;
  padding: 30px;
  overflow: hidden;
}

.section h2 {
  margin-bottom: 20px;
  color: #123b2a;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 20px;
}

@media (max-width: 700px) {
  .content {
    padding: 15px;
  }

  .feed {
    flex-direction: column;
  }
}
</style>