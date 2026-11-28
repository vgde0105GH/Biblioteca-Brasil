import { computed, nextTick, reactive, ref, watch } from "vue";
import type {
  CadastroUsuario,
  ErrosCadastro,
} from "@/interfaces/cadastro-usuario.interface";
import { cadastrarUsuario, ErroApi } from "@/services/api";
import { usarEnderecoCadastro } from "./usarEnderecoCadastro";
import {
  soDigitos,
  validarDadosPessoais,
  validarEndereco,
} from "@/validacoes/cadastro.validacao";

function criarDadosCadastro(): CadastroUsuario {
  return {
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    senha: "",
    confirmarSenha: "",
    categoria: "individual",
  };
}

export function usarCadastroUsuario() {
  const primeiroNome = ref("");
  const sobrenome = ref("");
  const dados = reactive(criarDadosCadastro());
  const erros = ref<ErrosCadastro>({});
  const { mensagemCep, buscandoCep, buscarCep, limparConsultaCep } =
    usarEnderecoCadastro(dados, erros);
  const erroSenha = computed(() => {
    const tamanho = [...dados.senha].length;
    if (tamanho > 0 && tamanho < 8)
      return "Sua senha precisa ter pelo menos 8 caracteres.";
    if (tamanho > 128) return "Use no máximo 128 caracteres.";
    return erros.value.senha;
  });
  for (const campo of ["senha", "confirmarSenha"] as const) {
    watch(
      () => dados[campo],
      () => {
        erros.value = { ...erros.value, [campo]: undefined };
      },
    );
  }
  const mensagem = ref("");
  const tituloSucesso = ref<HTMLHeadingElement | null>(null);
  const enviando = ref(false);
  const contaCriada = ref(false);
  const etapa = ref(1);

  async function focarCampoInvalido(formulario?: EventTarget | null) {
    await nextTick();
    const origem =
      formulario instanceof HTMLFormElement ? formulario : document;
    origem.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }

  async function avancarEtapa(evento: Event) {
    mensagem.value = "";
    erros.value = validarDadosPessoais(
      dados,
      primeiroNome.value,
      sobrenome.value,
    );
    if (Object.keys(erros.value).length) {
      await focarCampoInvalido(
        evento.currentTarget instanceof HTMLElement
          ? evento.currentTarget.closest("form")
          : null,
      );
      return;
    }
    dados.nome = [primeiroNome.value.trim(), sobrenome.value.trim()].join(" ");
    etapa.value = 2;
  }

  function voltarEtapa() {
    etapa.value = 1;
    mensagem.value = "";
    erros.value = {};
  }

  function focarEtapaAtiva() {
    const campoInicial = etapa.value === 1 ? "primeiro-nome" : "cep";
    document.getElementById(campoInicial)?.focus();
  }

  async function cadastrar(evento: SubmitEvent) {
    if (enviando.value || contaCriada.value) return;
    if (etapa.value === 1) {
      await avancarEtapa(evento);
      return;
    }
    const formulario = evento.currentTarget;
    mensagem.value = "";
    erros.value = validarEndereco(dados);
    if (Object.keys(erros.value).length) {
      await focarCampoInvalido(formulario);
      return;
    }

    enviando.value = true;
    try {
      await cadastrarUsuario({
        ...dados,
        email: dados.email.trim().toLowerCase(),
        cep: soDigitos(dados.cep),
        estado: dados.estado.trim().toUpperCase(),
        complemento: dados.complemento.trim(),
      });
      Object.assign(dados, criarDadosCadastro());
      primeiroNome.value = "";
      sobrenome.value = "";
      etapa.value = 1;
      contaCriada.value = true;
      await nextTick();
      tituloSucesso.value?.focus();
    } catch (erro) {
      mensagem.value =
        erro instanceof ErroApi &&
        [400, 409].includes(erro.status) &&
        erro.message
          ? erro.message
          : "Não foi possível criar sua conta agora. Tente novamente em instantes.";
    } finally {
      enviando.value = false;
    }
  }

  async function novoCadastro() {
    contaCriada.value = false;
    mensagem.value = "";
    limparConsultaCep();
    erros.value = {};
    await nextTick();
    document.getElementById("primeiro-nome")?.focus();
  }

  return {
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
  };
}
