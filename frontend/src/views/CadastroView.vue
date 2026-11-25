<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import FormularioConta from '@/components/FormularioConta.vue'
import LayoutConta from '@/components/LayoutConta.vue'
import CampoSenha from '@/components/input/CampoSenha.vue'
import CampoTexto from '@/components/input/CampoTexto.vue'
import type { CadastroUsuario } from '@/interfaces/usuario.interface'
import { cadastrarUsuario, ErroApi } from '@/services/api'
import { cpfValido, emailValido, formatarCpf, formatarTelefone, soDigitos } from '@/validacoes/cadastro.validacao'

type ErrosCadastro = Partial<Record<keyof CadastroUsuario, string>>

const dados = reactive<CadastroUsuario>({
  nome: '', email: '', cpf: '', telefone: '', senha: '', confirmarSenha: '', categoria: 'individual',
})
const erros = ref<ErrosCadastro>({})
const mensagem = ref('')
const tituloSucesso = ref<HTMLHeadingElement | null>(null)
const enviando = ref(false)
const contaCriada = ref(false)

function validar() {
  const problemas: ErrosCadastro = {}
  if (!dados.nome.trim()) problemas.nome = 'Informe seu nome completo.'
  if (!emailValido(dados.email.trim())) problemas.email = 'Informe um e-mail válido.'
  if (!cpfValido(dados.cpf)) problemas.cpf = 'Informe um CPF válido.'
  if (soDigitos(dados.telefone).length < 10) problemas.telefone = 'Informe um telefone com DDD.'
  const tamanho = [...dados.senha].length
  if (!dados.senha.trim() || tamanho < 8 || tamanho > 128) problemas.senha = 'Use uma senha de 8 a 128 caracteres.'
  if (!dados.confirmarSenha || dados.senha !== dados.confirmarSenha) {
    problemas.confirmarSenha = 'As senhas precisam ser iguais.'
  }
  if (dados.categoria !== 'individual') problemas.categoria = 'Selecione a categoria da conta.'
  return problemas
}

async function cadastrar(evento: SubmitEvent) {
  if (enviando.value || contaCriada.value) return
  const formulario = evento.currentTarget
  mensagem.value = ''
  erros.value = validar()

  if (Object.keys(erros.value).length) {
    await nextTick()
    if (formulario instanceof HTMLFormElement) {
      formulario.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
    return
  }

  enviando.value = true
  try {
    await cadastrarUsuario({ ...dados, nome: dados.nome.trim(), email: dados.email.trim() })
    Object.assign(dados, { nome: '', email: '', cpf: '', telefone: '', senha: '', confirmarSenha: '' })
    contaCriada.value = true
    await nextTick()
    tituloSucesso.value?.focus()
  } catch (erro) {
    mensagem.value = erro instanceof ErroApi && [400, 409].includes(erro.status) && erro.mensagem
      ? erro.mensagem
      : 'Não foi possível cadastrar sua conta agora. Tente novamente.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <LayoutConta>
    <template v-if="contaCriada">
      <header class="cabecalho-conta">
        <h1 id="titulo-conta" ref="tituloSucesso" tabindex="-1">Conta criada!</h1>
        <p>Seu cadastro foi concluído. Entre para acessar a biblioteca.</p>
      </header>
      <RouterLink class="acao-conta" :to="{ name: 'login' }">Entrar <span aria-hidden="true">→</span></RouterLink>
    </template>

    <template v-else>
      <header class="cabecalho-conta">
        <h1 id="titulo-conta">Criar conta</h1>
        <p>Preencha seus dados para acessar a biblioteca.</p>
      </header>

      <FormularioConta rotulo="Cadastrar-se" rotulo-envio="Cadastrando…" :enviando="enviando"
                       validacao-personalizada @enviar="cadastrar">
        <CampoTexto id="nome" v-model="dados.nome" rotulo="Nome completo" autocomplete="name" :maxlength="150"
                    placeholder="Digite seu nome completo" :erro="erros.nome" />
        <CampoTexto id="email" v-model="dados.email" rotulo="E-mail" tipo="email" autocomplete="email" :maxlength="254"
                    placeholder="Digite seu e-mail" :erro="erros.email" />

        <div class="linha-conta">
          <CampoTexto id="cpf" v-model="dados.cpf" rotulo="CPF" inputmode="numeric" placeholder="000.000.000-00"
                      descricao="uso-dados" :mascara="formatarCpf" :erro="erros.cpf" />
          <CampoTexto id="telefone" v-model="dados.telefone" rotulo="Telefone" tipo="tel" autocomplete="tel-national"
                      placeholder="(00) 00000-0000" descricao="uso-dados" :mascara="formatarTelefone" :erro="erros.telefone" />
        </div>
        <p id="uso-dados" class="uso-dados">Usamos seu CPF para identificar sua conta e seu telefone para falar sobre seu atendimento.</p>

        <div class="linha-conta">
          <CampoSenha id="senha" v-model="dados.senha" rotulo="Senha" placeholder="Digite sua senha"
                      dica="Mínimo de 8 caracteres" :erro="erros.senha" />
          <CampoSenha id="confirmar-senha" v-model="dados.confirmarSenha" rotulo="Confirmar senha"
                      placeholder="Confirme sua senha" :erro="erros.confirmarSenha" />
        </div>

        <div class="campo-conta">
          <label for="categoria">Categoria da conta</label>
          <div class="controle-categoria">
            <select id="categoria" v-model="dados.categoria" name="categoria" required
                    :aria-invalid="erros.categoria ? 'true' : undefined"
                    :aria-describedby="erros.categoria ? 'categoria-erro' : undefined">
              <option value="individual">Usuário Individual</option>
            </select>
          </div>
          <small v-if="erros.categoria" id="categoria-erro" class="erro-campo">{{ erros.categoria }}</small>
        </div>

        <p v-if="mensagem" class="aviso-conta" role="alert">{{ mensagem }}</p>
      </FormularioConta>

      <p class="rodape-conta">Já possui uma conta? <RouterLink :to="{ name: 'login' }">Entrar</RouterLink></p>
    </template>
  </LayoutConta>
</template>
