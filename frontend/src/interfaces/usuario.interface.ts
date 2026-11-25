export interface CadastroUsuario {
  nome: string
  email: string
  cpf: string
  telefone: string
  senha: string
  confirmarSenha: string
  categoria: 'individual'
}

export interface DadosLogin {
  email: string
  senha: string
}

export interface ContaAutenticada {
  nome: string
}
