<template>
  <div class="search-bar">
    <input
      type="text"
      placeholder="Pesquisar por título, autor ou gênero..."
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <button>
      Pesquisar
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

input {
  flex: 1;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
}

button {
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  background: #246b46;
  color: white;
  cursor: pointer;
}
</style>