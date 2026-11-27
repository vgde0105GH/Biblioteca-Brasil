<template>
  <header class="header">
    <h1>{{ titulo }}</h1>

    <div class="header-actions">
      <button class="notification">
        Notificações
      </button>

      <RouterLink to="/perfil" class="profile">
        Minha conta
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    default: 'Feed'
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.header h1 {
  font-size: 28px;
  color: #123b2a;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification,
.profile {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background: #e8f2ec;
  color: #123b2a;
  text-decoration: none;
  cursor: pointer;
}
</style>