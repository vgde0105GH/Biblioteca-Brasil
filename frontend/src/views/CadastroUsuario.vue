<script setup lang="ts">
import FormularioConta from "@/components/FormularioConta.vue";
import LayoutConta from "@/components/LayoutConta.vue";
import EtapaDadosPessoais from "@/components/cadastro/EtapaDadosPessoais.vue";
import EtapaEndereco from "@/components/cadastro/EtapaEndereco.vue";
import { usarCadastroUsuario } from "@/composables/usarCadastroUsuario";

const {
  primeiroNome,
  sobrenome,
  dados,
  erros,
  erroSenha,
  mensagem,
  mensagemCep,
  tituloSucesso,
  enviando,
  buscandoCep,
  contaCriada,
  etapa,
  focarEtapaAtiva,
  buscarCep,
  cadastrar,
  novoCadastro,
  voltarEtapa,
} = usarCadastroUsuario();
</script>

<template>
  <LayoutConta>
    <section
      v-if="contaCriada"
      class="cartao-cadastro sucesso-cadastro"
      aria-labelledby="titulo-sucesso"
    >
      <h1 id="titulo-sucesso" ref="tituloSucesso" tabindex="-1">
        Que bom ter você por aqui!
      </h1>
      <p>Seu cadastro foi concluído com sucesso.</p>
      <RouterLink class="acao-conta" :to="{ name: 'login' }"
        >Ir para o login</RouterLink
      >
      <button type="button" class="botao-voltar" @click="novoCadastro">
        Fazer outro cadastro
      </button>
    </section>

    <section
      v-else
      class="cartao-cadastro cartao-registro"
      aria-labelledby="titulo-formulario"
    >
      <header class="cabecalho-formulario">
        <span class="passo-cadastro">Etapa {{ etapa }} de 2</span>
        <h1 id="titulo-formulario">
          {{ etapa === 1 ? "Crie sua conta" : "Seu endereço" }}
        </h1>
      </header>

      <ol
        class="progresso-cadastro"
        :class="{ 'etapa-endereco': etapa === 2 }"
        aria-label="Etapas do cadastro"
      >
        <li
          :class="{ 'etapa-ativa': etapa === 1, 'etapa-concluida': etapa > 1 }"
          :aria-current="etapa === 1 ? 'step' : undefined"
        >
          <span>1</span><span>Dados</span>
        </li>
        <li
          :class="{ 'etapa-ativa': etapa === 2 }"
          :aria-current="etapa === 2 ? 'step' : undefined"
        >
          <span>2</span><span>Endereço</span>
        </li>
      </ol>

      <FormularioConta
        rotulo="Concluir cadastro"
        rotulo-envio="Criando sua conta…"
        :enviando="enviando"
        validacao-personalizada
        :mostrar-rodape="etapa === 2"
        @enviar="cadastrar"
      >
        <Transition name="etapa" mode="out-in" @after-enter="focarEtapaAtiva">
          <EtapaDadosPessoais
            v-if="etapa === 1"
            key="dados"
            v-model:primeiro-nome="primeiroNome"
            v-model:sobrenome="sobrenome"
            :dados="dados"
            :erros="erros"
            :erro-senha="erroSenha"
            :mensagem="mensagem"
          />
          <EtapaEndereco
            v-else
            key="endereco"
            :dados="dados"
            :erros="erros"
            :mensagem="mensagem"
            :mensagem-cep="mensagemCep"
            :buscando-cep="buscandoCep"
            @buscar-cep="buscarCep"
            @voltar="voltarEtapa"
          />
        </Transition>
      </FormularioConta>
      <footer class="acesso-existente">
        <RouterLink class="botao-login" :to="{ name: 'login' }"
          >Já tenho cadastro</RouterLink
        >
      </footer>
    </section>
  </LayoutConta>
</template>
