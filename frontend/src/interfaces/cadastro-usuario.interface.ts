export interface CadastroUsuario {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  senha: string;
  confirmarSenha: string;
  categoria: "individual";
}

export type ErrosCadastro = Partial<
  Record<keyof CadastroUsuario | "primeiroNome" | "sobrenome", string>
>;
