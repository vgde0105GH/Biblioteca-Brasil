import type {
  CadastroUsuario,
  ErrosCadastro,
} from "@/interfaces/cadastro-usuario.interface";

export function soDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export function cpfValido(valor: string) {
  const cpf = soDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let indice = 0; indice < tamanho; indice++) {
      soma += Number(cpf[indice]) * (tamanho + 1 - indice);
    }
    if (((soma * 10) % 11) % 10 !== Number(cpf[tamanho])) return false;
  }
  return true;
}

export function emailValido(email: string) {
  const formato =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
  const parteLocal = email.split("@")[0];
  return (
    email.length <= 254 &&
    parteLocal.length <= 64 &&
    formato.test(email) &&
    !parteLocal.startsWith(".") &&
    !parteLocal.endsWith(".") &&
    !parteLocal.includes("..")
  );
}

export function formatarCpf(valor: string) {
  return soDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
}

export function formatarTelefone(valor: string) {
  const digitos = soDigitos(valor);
  const telefone = (valor.startsWith("+55") ? digitos.slice(2) : digitos).slice(
    0,
    11,
  );
  const prefixo = telefone.length > 10 ? 5 : 4;
  const numero = telefone.slice(2);
  if (telefone.length < 3) return telefone;
  return `(${telefone.slice(0, 2)}) ${numero.slice(0, prefixo)}${numero.length > prefixo ? `-${numero.slice(prefixo)}` : ""}`;
}

export function formatarCep(valor: string) {
  const digitos = soDigitos(valor).slice(0, 8);
  return digitos.length > 5
    ? `${digitos.slice(0, 5)}-${digitos.slice(5)}`
    : digitos;
}

export function validarDadosPessoais(
  dados: CadastroUsuario,
  primeiroNome: string,
  sobrenome: string,
) {
  const problemas: ErrosCadastro = {};
  const nomeCompleto = [primeiroNome.trim(), sobrenome.trim()]
    .filter(Boolean)
    .join(" ");
  if (!primeiroNome.trim())
    problemas.primeiroNome = "Informe seu primeiro nome.";
  if (!sobrenome.trim()) problemas.sobrenome = "Informe seu sobrenome.";
  if (nomeCompleto.length > 150)
    problemas.sobrenome = "Use um nome completo com até 150 caracteres.";
  if (!emailValido(dados.email.trim()))
    problemas.email = "Informe um e-mail válido.";
  if (!cpfValido(dados.cpf)) problemas.cpf = "Informe um CPF válido.";
  if (![10, 11].includes(soDigitos(dados.telefone).length))
    problemas.telefone = "Informe seu telefone com DDD.";
  const tamanho = [...dados.senha].length;
  if (!dados.senha.trim() || tamanho < 8 || tamanho > 128)
    problemas.senha = "Use uma senha de 8 a 128 caracteres.";
  if (!dados.confirmarSenha || dados.senha !== dados.confirmarSenha) {
    problemas.confirmarSenha = "As senhas precisam ser iguais.";
  }
  return problemas;
}

export function validarEndereco(dados: CadastroUsuario) {
  const problemas: ErrosCadastro = {};
  if (soDigitos(dados.cep).length !== 8)
    problemas.cep = "Informe um CEP com oito números.";
  if (!dados.logradouro.trim())
    problemas.logradouro = "Informe a rua ou avenida.";
  if (!dados.numero.trim()) problemas.numero = "Informe o número do endereço.";
  if (dados.complemento.trim().length > 100)
    problemas.complemento = "Use até 100 caracteres.";
  if (!dados.bairro.trim()) problemas.bairro = "Informe seu bairro.";
  if (!dados.cidade.trim()) problemas.cidade = "Informe sua cidade.";
  if (!/^[a-z]{2}$/i.test(dados.estado.trim()))
    problemas.estado = "Informe a sigla do estado.";
  return problemas;
}
