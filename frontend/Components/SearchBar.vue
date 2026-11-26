<script>
export default 
{
  data() 
  {
    return 
    {
      pesquisa: ''
    }
  }
}
</script>

<template>
  <input
    v-model="pesquisa"
    class="input"
    placeholder="Pesquisar livros ou autores..."
    @input="$emit('pesquisar', pesquisa)"
  />
</template>