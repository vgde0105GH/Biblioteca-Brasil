<script setup lang="ts">
defineProps<{
  rotulo: string
  rotuloEnvio: string
  enviando: boolean
  validacaoPersonalizada?: boolean
  mostrarRodape?: boolean
}>()
const emitir = defineEmits<{ enviar: [evento: SubmitEvent] }>()
</script>

<template>
  <form id="formulario-cadastro" class="formulario-conta" :aria-busy="enviando"
        :novalidate="validacaoPersonalizada" @submit.prevent="emitir('enviar', $event)">
    <fieldset :disabled="enviando" class="campos-cadastro"><slot /></fieldset>
    <footer v-if="mostrarRodape !== false" class="rodape-formulario">
      <button class="acao-conta" type="submit" :disabled="enviando">{{ enviando ? rotuloEnvio : rotulo }}</button>
      <p>Seu próximo capítulo começa com uma conta.</p>
    </footer>
  </form>
</template>
