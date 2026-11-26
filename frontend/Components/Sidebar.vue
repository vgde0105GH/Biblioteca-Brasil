<template>
  <aside class="sidebar">
    <h2>Biblioteca Brasil</h2>

    <nav>
      <a href="#">Feed</a>
      <a href="#">Empréstimos</a>
      <a href="#">Gêneros</a>
      <a href="#">Livros lidos</a>
      <a href="#">Agendados</a>
      <a href="#">Favoritos</a>
    </nav>

    <button class="btn btn-primary" @click="$emit('logout')">
      Sair
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  min-height: 100vh;
  padding: 20px;
  background: var(--verde-escuro);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

nav a {
  padding: 10px;
  border-radius: 8px;
}

nav a:hover {
  background: var(--verde);
}

button {
  margin-top: auto;
}
</style>