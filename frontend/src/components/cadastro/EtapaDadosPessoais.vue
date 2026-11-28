<script setup lang="ts">
import CampoSenha from "@/components/input/CampoSenha.vue";
import CampoTexto from "@/components/input/CampoTexto.vue";
import type {
  CadastroUsuario,
  ErrosCadastro,
} from "@/interfaces/cadastro-usuario.interface";
import { formatarCpf, formatarTelefone } from "@/validacoes/cadastro.validacao";

defineProps<{
  dados: CadastroUsuario;
  erros: ErrosCadastro;
  erroSenha?: string;
  mensagem: string;
}>();
const primeiroNome = defineModel<string>("primeiroNome", { required: true });
const sobrenome = defineModel<string>("sobrenome", { required: true });
</script>

<template>
  <div class="conteudo-etapa">
    <div class="linha-conta">
      <CampoTexto
        id="primeiro-nome"
        v-model="primeiroNome"
        rotulo="Primeiro nome"
        autocomplete="given-name"
        :maxlength="75"
        placeholder="Seu primeiro nome"
        :erro="erros.primeiroNome"
      />
      <CampoTexto
        id="sobrenome"
        v-model="sobrenome"
        rotulo="Sobrenome"
        autocomplete="family-name"
        :maxlength="74"
        placeholder="Seu sobrenome"
        :erro="erros.sobrenome"
      />
    </div>
    <CampoTexto
      id="email"
      v-model="dados.email"
      rotulo="E-mail"
      tipo="email"
      autocomplete="email"
      :maxlength="254"
      placeholder="voce@exemplo.com"
      :erro="erros.email"
    />
    <div class="linha-conta">
      <CampoTexto
        id="cpf"
        v-model="dados.cpf"
        rotulo="CPF"
        inputmode="numeric"
        placeholder="000.000.000-00"
        :maxlength="14"
        :mascara="formatarCpf"
        :erro="erros.cpf"
      />
      <CampoTexto
        id="telefone"
        v-model="dados.telefone"
        rotulo="Telefone"
        tipo="tel"
        autocomplete="tel-national"
        placeholder="(00) 00000-0000"
        :maxlength="15"
        :mascara="formatarTelefone"
        :erro="erros.telefone"
      />
    </div>
    <div class="linha-conta">
      <CampoSenha
        id="senha"
        v-model="dados.senha"
        rotulo="Senha"
        placeholder="Crie uma senha"
        :erro="erroSenha"
      />
      <CampoSenha
        id="confirmar-senha"
        v-model="dados.confirmarSenha"
        rotulo="Confirmar senha"
        placeholder="Repita sua senha"
        :erro="erros.confirmarSenha"
      />
    </div>
    <p v-if="mensagem" class="aviso-conta" role="alert">
      {{ mensagem }}
    </p>
    <div class="acoes-etapa">
      <button type="submit" class="acao-conta">Próxima etapa</button>
    </div>
  </div>
</template>
