import { BadRequestException } from "@nestjs/common";
import { CadastroUsuarioDto } from "./usuario.dto";
import { CategoriaConta } from "./usuario.entity";

const formatoEmail =
  /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

export function normalizarEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function cpfValido(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;

  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let indice = 0; indice < tamanho; indice++) {
      soma += Number(cpf[indice]) * (tamanho + 1 - indice);
    }
    if (((soma * 10) % 11) % 10 !== Number(cpf[tamanho])) return false;
  }
  return true;
}

export function validarCadastro(dados: CadastroUsuarioDto | undefined) {
  const nome = typeof dados?.nome === "string" ? dados.nome.trim() : "";
  const email = normalizarEmail(dados?.email);
  const cpfInformado = typeof dados?.cpf === "string" ? dados.cpf.trim() : "";
  const telefoneInformado =
    typeof dados?.telefone === "string" ? dados.telefone.trim() : "";
  const cpf = cpfInformado.replace(/\D/g, "");
  const telefone = telefoneInformado.replace(/\D/g, "");
  const cepInformado = typeof dados?.cep === "string" ? dados.cep.trim() : "";
  const cep = cepInformado.replace(/\D/g, "");
  const logradouro =
    typeof dados?.logradouro === "string" ? dados.logradouro.trim() : "";
  const numero = typeof dados?.numero === "string" ? dados.numero.trim() : "";
  const complemento =
    typeof dados?.complemento === "string" ? dados.complemento.trim() : "";
  const bairro = typeof dados?.bairro === "string" ? dados.bairro.trim() : "";
  const cidade = typeof dados?.cidade === "string" ? dados.cidade.trim() : "";
  const estado =
    typeof dados?.estado === "string" ? dados.estado.trim().toUpperCase() : "";
  const senha = typeof dados?.senha === "string" ? dados.senha : "";
  const caracteres = [...senha].length;
  const parteLocal = email.split("@")[0];

  if (!nome || nome.length > 150) {
    throw new BadRequestException(
      "Informe seu nome completo com até 150 caracteres.",
    );
  }
  if (
    email.length > 254 ||
    parteLocal.length > 64 ||
    !formatoEmail.test(email) ||
    parteLocal.startsWith(".") ||
    parteLocal.endsWith(".") ||
    parteLocal.includes("..")
  ) {
    throw new BadRequestException("Informe um e-mail válido.");
  }
  if (
    !/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(cpfInformado) ||
    !cpfValido(cpf)
  ) {
    throw new BadRequestException("Informe um CPF válido.");
  }
  if (!/^(\d{10,11}|\(\d{2}\)\s?\d{4,5}-\d{4})$/.test(telefoneInformado)) {
    throw new BadRequestException("Informe um telefone com DDD.");
  }
  if (!/^\d{5}-?\d{3}$/.test(cepInformado)) {
    throw new BadRequestException("Informe um CEP válido.");
  }
  if (!logradouro || logradouro.length > 150) {
    throw new BadRequestException(
      "Informe um logradouro com até 150 caracteres.",
    );
  }
  if (!numero || numero.length > 20) {
    throw new BadRequestException(
      "Informe o número do endereço com até 20 caracteres.",
    );
  }
  if (complemento.length > 100) {
    throw new BadRequestException("O complemento deve ter até 100 caracteres.");
  }
  if (!bairro || bairro.length > 100) {
    throw new BadRequestException("Informe um bairro com até 100 caracteres.");
  }
  if (!cidade || cidade.length > 100) {
    throw new BadRequestException("Informe uma cidade com até 100 caracteres.");
  }
  if (!/^[A-Z]{2}$/.test(estado)) {
    throw new BadRequestException("Informe a sigla do estado com duas letras.");
  }
  if (!senha.trim() || caracteres < 8 || caracteres > 128) {
    throw new BadRequestException("Use uma senha de 8 a 128 caracteres.");
  }
  if (senha !== dados?.confirmarSenha) {
    throw new BadRequestException("As senhas precisam ser iguais.");
  }
  if (dados?.categoria !== CategoriaConta.Individual) {
    throw new BadRequestException(
      "O cadastro público aceita a categoria Usuário Individual.",
    );
  }

  return {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    numero,
    complemento: complemento || null,
    bairro,
    cidade,
    estado,
    senha,
  };
}
