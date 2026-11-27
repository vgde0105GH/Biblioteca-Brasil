<template>
  <article class="book-card">
    <img
      :src="livro.capa"
      :alt="`Capa do livro ${livro.titulo}`"
      class="book-cover"
    />

    <div class="book-info">
      <h3>{{ livro.titulo }}</h3>

      <p>{{ livro.autor }}</p>

      <span class="genre">
        {{ livro.genero }}
      </span>

      <button @click="$emit('detalhes', livro)">
        Ver detalhes
      </button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  livro: {
    type: Object,
    required: true
  }
})

defineEmits(['detalhes'])
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px #00000012;
}

.book-cover {
  width: 100%;
  height: 220px;
  object-fit: contain;
  background: #f1f1f1;
  border-radius: 8px;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

h3 {
  color: #123b2a;
  font-size: 17px;
}

p {
  color: #666;
}

.genre {
  color: #246b46;
  font-size: 13px;
}

button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #246b46;
  color: white;
  cursor: pointer;
}
</style>