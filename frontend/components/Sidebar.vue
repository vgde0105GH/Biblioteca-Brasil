<template>
  <aside class="sidebar">
    <div class="logo">
      <h2>Biblioteca Brasil</h2>
    </div>

    <nav>
      <RouterLink to="/" class="link">
        Feed
      </RouterLink>

      <RouterLink to="/emprestimos" class="link">
        Empréstimos
      </RouterLink>

      <RouterLink to="/generos" class="link">
        Gêneros
      </RouterLink>

      <RouterLink to="/lidos" class="link">
        Livros lidos
      </RouterLink>

      <RouterLink to="/agendados" class="link">
        Agendados
      </RouterLink>

      <RouterLink to="/favoritos" class="link">
        Favoritos
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">
      <RouterLink to="/perfil" class="link">
        Conta e perfil
      </RouterLink>

      <button class="logout">
        Sair
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 230px;
  min-height: 100vh;
  padding: 25px 18px;
  background: #123b2a;
  color: white;
  display: flex;
  flex-direction: column;
}

.logo {
  margin-bottom: 35px;
}

.logo h2 {
  font-size: 22px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link {
  color: white;
  text-decoration: none;
  padding: 12px;
  border-radius: 8px;
}

.link:hover,
.router-link-active {
  background: #246b46;
}

.sidebar-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logout {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #d9534f;
  color: white;
  cursor: pointer;
}
</style>