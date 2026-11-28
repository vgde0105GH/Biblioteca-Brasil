<script setup lang="ts">
import { ref } from "vue";
withDefaults(
  defineProps<{
    id: string;
    rotulo: string;
    placeholder?: string;
    dica?: string;
    erro?: string;
    autocomplete?: "new-password" | "current-password";
  }>(),
  { autocomplete: "new-password" },
);
const senha = defineModel<string>({ required: true });
const visivel = ref(false);
</script>
<template>
  <div class="campo-conta">
    <label :for="id">{{ rotulo }}</label>
    <div class="controle-senha">
      <input
        :id="id"
        v-model="senha"
        :type="visivel ? 'text' : 'password'"
        :name="id"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        spellcheck="false"
        autocapitalize="off"
        :aria-invalid="erro ? 'true' : undefined"
        :aria-describedby="
          [dica && `${id}-dica`, erro && `${id}-erro`]
            .filter(Boolean)
            .join(' ') || undefined
        "
        required
      />
      <button
        type="button"
        class="alternar-senha"
        :aria-label="`${visivel ? 'Ocultar' : 'Mostrar'} ${rotulo === 'Senha' ? 'senha' : 'confirmação da senha'}`"
        :aria-pressed="visivel"
        :aria-controls="id"
        @click="visivel = !visivel"
      >
        {{ visivel ? "Ocultar" : "Mostrar" }}
      </button>
    </div>
    <small v-if="dica" :id="`${id}-dica`">{{ dica }}</small>
    <small v-if="erro" :id="`${id}-erro`" class="erro-campo">{{ erro }}</small>
  </div>
</template>
