import axios, { type AxiosRequestConfig } from "axios";
import type { CadastroUsuario } from "@/interfaces/cadastro-usuario.interface";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export class ErroApi extends Error {
  constructor(
    public status: number,
    public mensagem: string,
  ) {
    super(mensagem || `A API respondeu com erro ${status}`);
  }
}

export interface EnderecoCep {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

// As chamadas à API da biblioteca passam por esta função.
async function pedir<T>(
  caminho: string,
  opcoes: AxiosRequestConfig = {},
): Promise<T | null> {
  try {
    const resposta = await api.request<T>({ url: caminho, ...opcoes });
    return resposta.status === 204 ? null : resposta.data;
  } catch (erro) {
    if (axios.isAxiosError<{ message?: unknown }>(erro) && erro.response) {
      const mensagem = erro.response.data?.message;
      throw new ErroApi(
        erro.response.status,
        typeof mensagem === "string" ? mensagem : "",
      );
    }
    throw erro;
  }
}

export async function consultarCep(cep: string): Promise<EnderecoCep> {
  const cepNumerico = cep.replace(/\D/g, "");
  try {
    const resposta = await pedir<EnderecoCep>(
      `https://brasilapi.com.br/api/cep/v2/${cepNumerico}`,
      { timeout: 8000 },
    );
    if (!resposta)
      throw new ErroApi(502, "A consulta do CEP não retornou um endereço.");
    return resposta;
  } catch (erro) {
    if (erro instanceof ErroApi) {
      if (erro.status === 404)
        throw new ErroApi(
          404,
          "CEP não encontrado. Confira os números e tente novamente.",
        );
      throw new ErroApi(
        erro.status,
        "A consulta do CEP está indisponível. Tente novamente.",
      );
    }
    if (axios.isAxiosError(erro)) {
      throw new ErroApi(
        0,
        "Não foi possível consultar o CEP. Verifique sua conexão e tente novamente.",
      );
    }
    throw erro;
  }
}

export const cadastrarUsuario = (cadastro: CadastroUsuario) =>
  pedir<{ id: number; categoria: "individual" }>("/api/usuarios", {
    method: "POST",
    data: cadastro,
  });

export const entrarNaConta = (dados: { email: string; senha: string }) =>
  pedir<{ nome: string }>("/api/usuarios/sessao", {
    method: "POST",
    data: dados,
    withCredentials: true,
  });
export const consultarSessao = () =>
  pedir<{ nome: string }>("/api/usuarios/sessao", { withCredentials: true });
export const sairDaConta = () =>
  pedir("/api/usuarios/sessao", { method: "DELETE", withCredentials: true });
