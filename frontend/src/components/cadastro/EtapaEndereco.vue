<script setup lang="ts">
import CampoTexto from "@/components/input/CampoTexto.vue";
import type {
  CadastroUsuario,
  ErrosCadastro,
} from "@/interfaces/cadastro-usuario.interface";
import { formatarCep, soDigitos } from "@/validacoes/cadastro.validacao";

defineProps<{
  dados: CadastroUsuario;
  erros: ErrosCadastro;
  mensagem: string;
  mensagemCep: string;
  buscandoCep: boolean;
}>();
const emitir = defineEmits<{ buscarCep: []; voltar: [] }>();
</script>

<template>
  <div class="conteudo-etapa">
    <div class="campo-cep">
      <CampoTexto
        id="cep"
        v-model="dados.cep"
        rotulo="CEP"
        inputmode="numeric"
        autocomplete="postal-code"
        placeholder="00000-000"
        :maxlength="9"
        :mascara="formatarCep"
        :erro="erros.cep"
      />
      <button
        type="button"
        class="acao-cep"
        :disabled="buscandoCep || soDigitos(dados.cep).length !== 8"
        @click="emitir('buscarCep')"
      >
        {{ buscandoCep ? "Buscando…" : "Buscar CEP" }}
      </button>
    </div>
    <p v-if="mensagemCep" class="dica-cep" aria-live="polite">
      {{ mensagemCep }}
    </p>
    <CampoTexto
      id="logradouro"
      v-model="dados.logradouro"
      rotulo="Rua ou avenida"
      autocomplete="address-line1"
      placeholder="Ex.: Rua das Flores"
      :maxlength="150"
      :erro="erros.logradouro"
    />
    <div class="linha-conta">
      <CampoTexto
        id="numero"
        v-model="dados.numero"
        rotulo="Número"
        autocomplete="address-line2"
        placeholder="Ex.: 123"
        :maxlength="20"
        :erro="erros.numero"
      />
      <CampoTexto
        id="complemento"
        v-model="dados.complemento"
        rotulo="Complemento (opcional)"
        :obrigatorio="false"
        placeholder="Apartamento, casa..."
        :maxlength="100"
        :erro="erros.complemento"
      />
    </div>
    <CampoTexto
      id="bairro"
      v-model="dados.bairro"
      rotulo="Bairro"
      autocomplete="address-level3"
      placeholder="Seu bairro"
      :maxlength="100"
      :erro="erros.bairro"
    />
    <div class="linha-conta">
      <CampoTexto
        id="cidade"
        v-model="dados.cidade"
        rotulo="Cidade"
        autocomplete="address-level2"
        placeholder="Sua cidade"
        :maxlength="100"
        :erro="erros.cidade"
      />
      <CampoTexto
        id="estado"
        v-model="dados.estado"
        rotulo="Estado (UF)"
        autocomplete="address-level1"
        placeholder="Ex.: RS"
        :maxlength="2"
        :erro="erros.estado"
      />
    </div>
    <p v-if="mensagem" class="aviso-conta" role="alert">
      {{ mensagem }}
    </p>
    <div class="acoes-etapa">
      <button type="button" class="botao-voltar" @click="emitir('voltar')">
        Voltar
      </button>
    </div>
  </div>
</template>
