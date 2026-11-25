export interface DadosLivro {
  titulo: string
  autor: string
  colecao?: string | null
  descricao?: string | null
  editora?: string | null
  publicacaoAno?: number | null
  publicacaoMes?: number | null
  publicacaoDia?: number | null
  isbn13?: string | null
  isbn10?: string | null
  paginas?: number | null
  capa?: string | null
}

export interface Livro {
  id: number
  titulo: string
  autor: string
  disponivel: boolean
}

export interface Retirada {
  id: number
  livro: Omit<Livro, 'disponivel'>
  retiradoEm: string
  devolvidoEm: string | null
}
