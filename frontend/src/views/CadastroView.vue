<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import FormularioConta from '@/components/FormularioConta.vue'
import LayoutConta from '@/components/LayoutConta.vue'
import CampoSenha from '@/components/input/CampoSenha.vue'
import CampoTexto from '@/components/input/CampoTexto.vue'
import type { CadastroUsuario } from '@/interfaces/usuario.interface'
import { cadastrarUsuario, consultarCep, ErroApi } from '@/services/api'
import { cpfValido, emailValido, formatarCpf, formatarTelefone, soDigitos } from '@/validacoes/cadastro.validacao'

type ErrosCadastro = Partial<Record<keyof CadastroUsuario | 'primeiroNome' | 'sobrenome', string>>

const primeiroNome = ref('')
const sobrenome = ref('')
const dados = reactive<CadastroUsuario>({
  nome: '', email: '', cpf: '', telefone: '', cep: '', logradouro: '', numero: '', complemento: '',
  bairro: '', cidade: '', estado: '', senha: '', confirmarSenha: '', categoria: 'individual',
})
const erros = ref<ErrosCadastro>({})
const mensagem = ref('')
const mensagemCep = ref('')
const tituloSucesso = ref<HTMLHeadingElement | null>(null)
const enviando = ref(false)
const buscandoCep = ref(false)
const contaCriada = ref(false)
const etapa = ref(1)
const cepConsultado = ref('')

function formatarCep(valor: string) {
  const digitos = soDigitos(valor).slice(0, 8)
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos
}

watch(() => dados.cep, (novoCep) => {
  if (!cepConsultado.value || soDigitos(novoCep) === cepConsultado.value) return
  Object.assign(dados, { logradouro: '', bairro: '', cidade: '', estado: '' })
  cepConsultado.value = ''
  mensagemCep.value = ''
})

function validarDadosPessoais() {
  const problemas: ErrosCadastro = {}
  const nomeCompleto = [primeiroNome.value.trim(), sobrenome.value.trim()].filter(Boolean).join(' ')
  if (!primeiroNome.value.trim()) problemas.primeiroNome = 'Informe seu primeiro nome.'
  if (!sobrenome.value.trim()) problemas.sobrenome = 'Informe seu sobrenome.'
  if (nomeCompleto.length > 150) problemas.sobrenome = 'Use um nome completo com até 150 caracteres.'
  if (!emailValido(dados.email.trim())) problemas.email = 'Informe um e-mail válido.'
  if (!cpfValido(dados.cpf)) problemas.cpf = 'Informe um CPF válido.'
  if (![10, 11].includes(soDigitos(dados.telefone).length)) problemas.telefone = 'Informe seu telefone com DDD.'
  const tamanho = [...dados.senha].length
  if (!dados.senha.trim() || tamanho < 8 || tamanho > 128) problemas.senha = 'Use uma senha de 8 a 128 caracteres.'
  if (!dados.confirmarSenha || dados.senha !== dados.confirmarSenha) {
    problemas.confirmarSenha = 'As senhas precisam ser iguais.'
  }
  return problemas
}

function validarEndereco() {
  const problemas: ErrosCadastro = {}
  if (soDigitos(dados.cep).length !== 8) problemas.cep = 'Informe um CEP com oito números.'
  if (!dados.logradouro.trim()) problemas.logradouro = 'Informe a rua ou avenida.'
  if (!dados.numero.trim()) problemas.numero = 'Informe o número do endereço.'
  if (dados.complemento.trim().length > 100) problemas.complemento = 'Use até 100 caracteres.'
  if (!dados.bairro.trim()) problemas.bairro = 'Informe seu bairro.'
  if (!dados.cidade.trim()) problemas.cidade = 'Informe sua cidade.'
  if (!/^[a-z]{2}$/i.test(dados.estado.trim())) problemas.estado = 'Informe a sigla do estado.'
  return problemas
}

async function focarCampoInvalido(formulario?: EventTarget | null) {
  await nextTick()
  if (formulario instanceof HTMLFormElement) {
    formulario.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  } else {
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }
}

async function avancarEtapa(evento: MouseEvent) {
  mensagem.value = ''
  erros.value = validarDadosPessoais()
  if (Object.keys(erros.value).length) {
    await focarCampoInvalido(evento.currentTarget instanceof HTMLElement
      ? evento.currentTarget.closest('form') : null)
    return
  }
  dados.nome = [primeiroNome.value.trim(), sobrenome.value.trim()].join(' ')
  etapa.value = 2
}

function voltarEtapa() {
  etapa.value = 1
  mensagem.value = ''
  erros.value = {}
}

function focarEtapaAtiva() {
  const campoInicial = etapa.value === 1 ? 'primeiro-nome' : 'cep'
  document.getElementById(campoInicial)?.focus()
}

async function buscarCep() {
  const cep = soDigitos(dados.cep)
  mensagemCep.value = ''
  if (cep.length !== 8) {
    erros.value = { ...erros.value, cep: 'Digite os oito números do CEP para consultar.' }
    await nextTick()
    document.getElementById('cep')?.focus()
    return
  }

  erros.value = { ...erros.value, cep: undefined }
  buscandoCep.value = true
  try {
    const endereco = await consultarCep(cep)
    if (soDigitos(dados.cep) !== cep) return
    Object.assign(dados, {
      cep: formatarCep(endereco.cep || cep),
      logradouro: endereco.street || '',
      bairro: endereco.neighborhood || '',
      cidade: endereco.city || '',
      estado: endereco.state || '',
    })
    cepConsultado.value = cep
    mensagemCep.value = 'Endereço encontrado. Confira os dados e complete o número.'
  } catch (erro) {
    mensagemCep.value = erro instanceof ErroApi
      ? erro.message
      : 'Não foi possível consultar o CEP agora. Tente novamente.'
  } finally {
    buscandoCep.value = false
  }
}

async function cadastrar(evento: SubmitEvent) {
  if (enviando.value || contaCriada.value) return
  const formulario = evento.currentTarget
  mensagem.value = ''
  erros.value = validarEndereco()
  if (Object.keys(erros.value).length) {
    await focarCampoInvalido(formulario)
    return
  }

  enviando.value = true
  try {
    await cadastrarUsuario({
      ...dados,
      email: dados.email.trim().toLowerCase(),
      cep: soDigitos(dados.cep),
      estado: dados.estado.trim().toUpperCase(),
      complemento: dados.complemento.trim(),
    })
    Object.assign(dados, {
      nome: '', email: '', cpf: '', telefone: '', cep: '', logradouro: '', numero: '', complemento: '',
      bairro: '', cidade: '', estado: '', senha: '', confirmarSenha: '',
    })
    primeiroNome.value = ''
    sobrenome.value = ''
    etapa.value = 1
    contaCriada.value = true
    await nextTick()
    tituloSucesso.value?.focus()
  } catch (erro) {
    mensagem.value = erro instanceof ErroApi && [400, 409].includes(erro.status) && erro.message
      ? erro.message : 'Não foi possível criar sua conta agora. Tente novamente em instantes.'
  } finally {
    enviando.value = false
  }
}

async function novoCadastro() {
  contaCriada.value = false
  mensagem.value = ''
  mensagemCep.value = ''
  erros.value = {}
  cepConsultado.value = ''
  await nextTick()
  document.getElementById('primeiro-nome')?.focus()
}
</script>

<template>
  <LayoutConta>
    <div class="coluna-apresentacao">
      <header class="apresentacao-cadastro">
        <span class="etiqueta-cadastro">BIBLIOTECA BRASIL</span>
        <h1>Cadastro de leitor</h1>
        <p>Preencha seus dados para fazer parte da Biblioteca Brasil.</p>
      </header>
    </div>

    <section v-if="contaCriada" class="cartao-cadastro sucesso-cadastro" aria-labelledby="titulo-sucesso">
      <span class="etiqueta-cadastro">BEM-VINDO À BIBLIOTECA BRASIL</span>
      <h2 id="titulo-sucesso" ref="tituloSucesso" tabindex="-1">Que bom ter você por aqui!</h2>
      <p>Seu cadastro foi concluído com sucesso.<br />Em breve, uma nova leitura pode começar.</p>
      <button type="button" class="acao-conta" @click="novoCadastro">Fazer outro cadastro</button>
    </section>

    <section v-else class="cartao-cadastro" aria-labelledby="titulo-formulario">
      <header class="cabecalho-formulario">
        <div>
          <span class="passo-cadastro">PASSO {{ etapa }} DE 2</span>
          <h2 id="titulo-formulario">{{ etapa === 1 ? 'Seus dados pessoais' : 'Onde podemos encontrar você?' }}</h2>
          <p>{{ etapa === 1 ? 'Comece criando sua conta de leitor.' : 'Informe seu endereço para concluir o cadastro.' }}</p>
        </div>
        <span class="tipo-conta">Leitor individual</span>
      </header>

      <ol class="progresso-cadastro" :class="{ 'etapa-endereco': etapa === 2 }" aria-label="Etapas do cadastro">
        <li :class="{ 'etapa-ativa': etapa === 1, 'etapa-concluida': etapa > 1 }" :aria-current="etapa === 1 ? 'step' : undefined">
          <span>1</span><span>Dados</span>
        </li>
        <li :class="{ 'etapa-ativa': etapa === 2 }" :aria-current="etapa === 2 ? 'step' : undefined">
          <span>2</span><span>Endereço</span>
        </li>
      </ol>

      <FormularioConta rotulo="Concluir cadastro" rotulo-envio="Criando sua conta…" :enviando="enviando"
                       validacao-personalizada :mostrar-rodape="etapa === 2" @enviar="cadastrar">
        <Transition name="etapa" mode="out-in" @after-enter="focarEtapaAtiva">
          <div v-if="etapa === 1" key="dados" class="conteudo-etapa">
          <div class="linha-conta">
            <CampoTexto id="primeiro-nome" v-model="primeiroNome" rotulo="Primeiro nome" autocomplete="given-name"
                        :maxlength="75" placeholder="Seu primeiro nome" :erro="erros.primeiroNome" />
            <CampoTexto id="sobrenome" v-model="sobrenome" rotulo="Sobrenome" autocomplete="family-name"
                        :maxlength="74" placeholder="Seu sobrenome" :erro="erros.sobrenome" />
          </div>
          <CampoTexto id="email" v-model="dados.email" rotulo="E-mail" tipo="email" autocomplete="email"
                      :maxlength="254" placeholder="voce@exemplo.com" :erro="erros.email" />
          <div class="linha-conta">
            <CampoTexto id="cpf" v-model="dados.cpf" rotulo="CPF" inputmode="numeric" placeholder="000.000.000-00"
                        :maxlength="14" descricao="uso-dados" :mascara="formatarCpf" :erro="erros.cpf" />
            <CampoTexto id="telefone" v-model="dados.telefone" rotulo="Telefone" tipo="tel" autocomplete="tel-national"
                        placeholder="(00) 00000-0000" descricao="uso-dados" :maxlength="15"
                        :mascara="formatarTelefone" :erro="erros.telefone" />
          </div>
          <div class="linha-conta">
            <CampoSenha id="senha" v-model="dados.senha" rotulo="Senha" placeholder="Crie uma senha"
                        dica="Use de 8 a 128 caracteres." :erro="erros.senha" />
            <CampoSenha id="confirmar-senha" v-model="dados.confirmarSenha" rotulo="Confirmar senha"
                        placeholder="Repita sua senha" :erro="erros.confirmarSenha" />
          </div>
          <p id="uso-dados" class="uso-dados">Seu CPF identifica sua conta. O telefone é usado para falar sobre seu atendimento na biblioteca.</p>
          <p v-if="mensagem" class="aviso-conta" role="alert">{{ mensagem }}</p>
          <div class="acoes-etapa">
            <button type="button" class="acao-conta" @click="avancarEtapa">Próxima etapa</button>
          </div>
          </div>

          <div v-else key="endereco" class="conteudo-etapa">
          <div class="campo-cep">
            <CampoTexto id="cep" v-model="dados.cep" rotulo="CEP" inputmode="numeric" autocomplete="postal-code"
                        placeholder="00000-000" :maxlength="9" :mascara="formatarCep" :erro="erros.cep" />
            <button type="button" class="acao-cep" :disabled="buscandoCep || soDigitos(dados.cep).length !== 8"
                    @click="buscarCep">
              {{ buscandoCep ? 'Buscando…' : 'Buscar CEP' }}
            </button>
          </div>
          <p class="dica-cep" aria-live="polite">{{ mensagemCep || 'Busque seu CEP para preencher rua, bairro, cidade e estado automaticamente.' }}</p>
          <CampoTexto id="logradouro" v-model="dados.logradouro" rotulo="Rua ou avenida" autocomplete="address-line1"
                      placeholder="Ex.: Rua das Flores" :maxlength="150" :erro="erros.logradouro" />
          <div class="linha-conta">
            <CampoTexto id="numero" v-model="dados.numero" rotulo="Número" autocomplete="address-line2"
                        placeholder="Ex.: 123" :maxlength="20" :erro="erros.numero" />
            <CampoTexto id="complemento" v-model="dados.complemento" rotulo="Complemento (opcional)"
                        placeholder="Apartamento, casa..." :maxlength="100" :erro="erros.complemento" />
          </div>
          <CampoTexto id="bairro" v-model="dados.bairro" rotulo="Bairro" autocomplete="address-level3"
                      placeholder="Seu bairro" :maxlength="100" :erro="erros.bairro" />
          <div class="linha-conta">
            <CampoTexto id="cidade" v-model="dados.cidade" rotulo="Cidade" autocomplete="address-level2"
                        placeholder="Sua cidade" :maxlength="100" :erro="erros.cidade" />
            <CampoTexto id="estado" v-model="dados.estado" rotulo="Estado (UF)" autocomplete="address-level1"
                        placeholder="Ex.: RS" :maxlength="2" :erro="erros.estado" />
          </div>
          <p v-if="mensagem" class="aviso-conta" role="alert">{{ mensagem }}</p>
          <div class="acoes-etapa">
            <button type="button" class="botao-voltar" @click="voltarEtapa">Voltar</button>
          </div>
          </div>
        </Transition>
      </FormularioConta>
    </section>
  </LayoutConta>
</template>
