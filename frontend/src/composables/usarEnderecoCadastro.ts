import { nextTick, ref, watch } from "vue";
import type { Ref } from "vue";
import type {
  CadastroUsuario,
  ErrosCadastro,
} from "@/interfaces/cadastro-usuario.interface";
import { consultarCep, ErroApi } from "@/services/api";
import { formatarCep, soDigitos, validarEndereco } from "@/validacoes/cadastro.validacao";

const camposEndereco = [
  "cep",
  "logradouro",
  "numero",
  "complemento",
  "bairro",
  "cidade",
  "estado",
] as const;

export function usarEnderecoCadastro(dados: CadastroUsuario, erros: Ref<ErrosCadastro>) {
  const mensagemCep = ref("");
  const buscandoCep = ref(false);
  const cepConsultado = ref("");

  watch(
    () => dados.cep,
    (novoCep) => {
      if (!cepConsultado.value || soDigitos(novoCep) === cepConsultado.value)
        return;
      Object.assign(dados, {
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
      });
      cepConsultado.value = "";
      mensagemCep.value = "";
    },
  );

  watch(
    () => camposEndereco.map((campo) => dados[campo]),
    () => {
      // Remove o aviso de um campo de endereço assim que ele for corrigido.
      const problemas = validarEndereco(dados);
      const atualizados = { ...erros.value };
      for (const campo of camposEndereco) {
        if (atualizados[campo] && !problemas[campo])
          atualizados[campo] = undefined;
      }
      erros.value = atualizados;
    },
  );

  async function buscarCep() {
    const cep = soDigitos(dados.cep);
    mensagemCep.value = "";
    if (cep.length !== 8) {
      erros.value = {
        ...erros.value,
        cep: "Digite os oito números do CEP para consultar.",
      };
      await nextTick();
      document.getElementById("cep")?.focus();
      return;
    }

    erros.value = { ...erros.value, cep: undefined };
    buscandoCep.value = true;
    try {
      const endereco = await consultarCep(cep);
      if (soDigitos(dados.cep) !== cep) return;
      Object.assign(dados, {
        cep: formatarCep(endereco.cep || cep),
        logradouro: endereco.street || "",
        bairro: endereco.neighborhood || "",
        cidade: endereco.city || "",
        estado: endereco.state || "",
      });
      cepConsultado.value = cep;
      mensagemCep.value =
        "Endereço encontrado. Confira os dados e complete o número.";
    } catch (erro) {
      mensagemCep.value =
        erro instanceof ErroApi
          ? erro.message
          : "Não foi possível consultar o CEP agora. Tente novamente.";
    } finally {
      buscandoCep.value = false;
    }
  }

  function limparConsultaCep() {
    mensagemCep.value = "";
    cepConsultado.value = "";
  }

  return { mensagemCep, buscandoCep, buscarCep, limparConsultaCep };
}
