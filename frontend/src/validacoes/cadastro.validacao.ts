export function soDigitos(valor: string) {
  return valor.replace(/\D/g, '')
}

export function cpfValido(valor: string) {
  const cpf = soDigitos(valor)
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  for (const tamanho of [9, 10]) {
    let soma = 0
    for (let indice = 0; indice < tamanho; indice++) {
      soma += Number(cpf[indice]) * (tamanho + 1 - indice)
    }
    if ((soma * 10 % 11) % 10 !== Number(cpf[tamanho])) return false
  }
  return true
}

export function emailValido(email: string) {
  const formato = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i
  const parteLocal = email.split('@')[0]
  return email.length <= 254 && parteLocal.length <= 64 && formato.test(email) &&
    !parteLocal.startsWith('.') && !parteLocal.endsWith('.') && !parteLocal.includes('..')
}

export function formatarCpf(valor: string) {
  return soDigitos(valor).slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2')
}

export function formatarTelefone(valor: string) {
  const digitos = soDigitos(valor)
  const telefone = (valor.startsWith('+55') ? digitos.slice(2) : digitos).slice(0, 11)
  const prefixo = telefone.length > 10 ? 5 : 4
  const numero = telefone.slice(2)
  if (telefone.length < 3) return telefone
  return `(${telefone.slice(0, 2)}) ${numero.slice(0, prefixo)}${numero.length > prefixo ? `-${numero.slice(prefixo)}` : ''}`
}
