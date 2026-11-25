<script setup lang="ts">
import { soDigitos } from '@/validacoes/cadastro.validacao'

const propriedades = withDefaults(defineProps<{
  id: string
  rotulo: string
  tipo?: 'text' | 'email' | 'tel'
  nome?: string
  placeholder?: string
  autocomplete?: string
  inputmode?: 'numeric'
  maxlength?: number
  erro?: string
  descricao?: string
  mascara?: (valor: string) => string
}>(), { tipo: 'text' })

const valor = defineModel<string>({ required: true })

function aplicarMascara(evento: Event) {
  const campo = evento.currentTarget
  if (!propriedades.mascara || !(campo instanceof HTMLInputElement)) return

  const anterior = campo.value
  const formatado = propriedades.mascara(anterior)
  if (anterior === formatado) return

  const posicao = campo.selectionStart
  campo.value = formatado
  if (posicao === null) return

  const digitosAntes = soDigitos(anterior.slice(0, posicao)).length
  let cursor = 0
  while (cursor < formatado.length && soDigitos(formatado.slice(0, cursor)).length < digitosAntes) {
    cursor++
  }
  campo.setSelectionRange(cursor, cursor)
}
</script>

<template>
  <div class="campo-conta">
    <label :for="id">{{ rotulo }}</label>
    <input
      :id="id" v-model="valor" :type="tipo" :name="nome ?? id"
      :placeholder="placeholder" :autocomplete="autocomplete" :inputmode="inputmode" :maxlength="maxlength"
      :aria-invalid="erro ? 'true' : undefined"
      :aria-describedby="[erro && `${id}-erro`, descricao].filter(Boolean).join(' ') || undefined"
      required @input.capture="aplicarMascara"
    />
    <small v-if="erro" :id="`${id}-erro`" class="erro-campo">{{ erro }}</small>
  </div>
</template>
