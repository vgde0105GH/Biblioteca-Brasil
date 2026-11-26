<template>
  <header class="header">
    <h1 class="title">{{ title }}</h1>

    <div class="actions">
      <button class="btn btn-secondary">
        Notificações
      </button>

      <button class="btn btn-primary">
        Conta
      </button>
    </div>
  </header>
</template>

<script>
export default 
{
  props: 
  {
    title: 
    {
      type: String,
      default: 'Feed'
    }
  }
}
</script>

<style scoped>
.header 
{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
.actions 
{
  display: flex;
  gap: 10px;
}
</style>