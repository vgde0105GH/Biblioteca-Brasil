<script setup lang="ts">
defineProps<{
  rotulo: string
  rotuloEnvio: string
  enviando: boolean
  validacaoPersonalizada?: boolean
}>()

const emitir = defineEmits<{ enviar: [evento: SubmitEvent] }>()
</script>

<template>
  <form class="formulario-conta" :novalidate="validacaoPersonalizada" @submit.prevent="emitir('enviar', $event)">
    <slot />
    <button class="acao-conta acao-formulario" type="submit" :disabled="enviando">
      {{ enviando ? rotuloEnvio : rotulo }} <span aria-hidden="true">→</span>
    </button>
  </form>
</template>
