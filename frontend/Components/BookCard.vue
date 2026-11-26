<script>
export default 
{
  props: 
  {
    book: 
    {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <article class="card book">
    <div class="cover">
      <img
        v-if="book.cover"
        :src="book.cover"
        :alt="book.title"
      />

      <span v-else>📚</span>
    </div>

    <h3>{{ book.title }}</h3>
    <p class="subtitle">{{ book.author }}</p>

    <button class="btn btn-primary">
      Ver detalhes
    </button>
  </article>
</template>

<style scoped>
.book 
{
  text-align: center;
}
.cover 
{
  height: 180px;
  margin-bottom: 15px;
  background: var(--verde-claro);
  border-radius: var(--radius);
  display: grid;
  place-items: center;
  font-size: 45px;
  overflow: hidden;
}
.cover img 
{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
button 
{
  width: 100%;
  margin-top: 15px;
}
</style>