import type { DadosLivro, Livro, Retirada } from '@/interfaces/livro.interface'
import axios, { type AxiosRequestConfig } from 'axios'
import type { CadastroUsuario, ContaAutenticada, DadosLogin } from '@/interfaces/usuario.interface'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })


export class ErroApi extends Error {
  constructor(public status: number, public mensagem: string) {
    super(`A API respondeu com erro ${status}`)
  }
}

// Toda chamada à API passa por aqui.
async function pedir<T>(caminho: string, opcoes: AxiosRequestConfig = {}): Promise<T | null> {
  try {
    const resposta = await api.request<T>({ url: caminho, ...opcoes })
    return resposta.status === 204 ? null : resposta.data
  } catch (erro) {
    if (axios.isAxiosError<{ message?: unknown }>(erro) && erro.response) {
      const mensagem = erro.response.data?.message
      throw new ErroApi(erro.response.status, typeof mensagem === 'string' ? mensagem : '')
    }
    throw erro
  }
}

export const cadastrarUsuario = (cadastro: CadastroUsuario) =>
  pedir('/api/usuarios', { method: 'POST', data: cadastro })

export const entrarNaConta = (dados: DadosLogin) =>
  pedir<ContaAutenticada>('/api/usuarios/sessao', { method: 'POST', withCredentials: true, data: dados })

export const consultarSessao = () =>
  pedir<ContaAutenticada>('/api/usuarios/sessao', { withCredentials: true })

export const sairDaConta = () =>
  pedir('/api/usuarios/sessao', { method: 'DELETE', withCredentials: true })

export const listarLivros = () => pedir<Livro[]>('/api/livros')

export const cadastrarLivro = (livro: DadosLivro) =>
  pedir('/api/livros', { method: 'POST', data: livro })

export const listarMinhasRetiradas = () =>
  pedir<Retirada[]>('/api/retiradas', { withCredentials: true })

export const retirarLivro = (livroId: number) =>
  pedir('/api/retiradas', { method: 'POST', data: { livroId }, withCredentials: true })

export const devolverLivro = (id: number) =>
  pedir(`/api/retiradas/${id}/devolucao`, { method: 'PATCH', withCredentials: true })