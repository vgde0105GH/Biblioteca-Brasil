# Biblioteca Brasil — Cadastro de usuários

Esta etapa contém cadastro de leitores, com dados pessoais e endereço, e login.
O frontend usa Vue 3, TypeScript e Axios; a API usa NestJS 11, TypeORM e mysql2.
Livros e retiradas continuam fora desta etapa. O login usa sessões por cookie HttpOnly.

## Executar e conferir

Abra o Docker Desktop e execute na raiz:

```powershell
docker compose up --build
```

Tela: http://localhost:3000/cadastro
API: http://localhost:8080/api
Swagger: http://localhost:8080/api/docs

Builds: docker compose build api web.
Não usar npm install no computador. Dependências são instaladas pelo Docker.
Manter node_modules local para o VS Code reconhecer tipos; a pasta fica fora do Git.

## DBeaver: usuários e sessões

O banco MySQL continua no alwaysdata. Não criar um banco local.
Selecione o banco do projeto no DBeaver e execute backend/banco/usuarios.sql (Alt + X).
Esse script cria usuarios com os dados pessoais, endereço e senha protegida.
Ele não apaga nem altera tabelas existentes.

Se usuarios já existe sem os campos de endereço, execute uma única vez
backend/banco/adicionar-endereco-usuarios.sql. Não repita se as colunas já existirem.
O login também precisa de sessoes_usuarios: execute sessoes-usuarios.sql. Não criar livros ou retiradas.
Não apagar tabelas antigas que já contenham dados: elas apenas deixaram de ser usadas.

Os dados da conexão ficam somente no .env da raiz. Não publicar seu conteúdo.
O TypeORM usa synchronize: false; nenhuma mudança de tabela é automática.
Primeiro nome e sobrenome são enviados juntos em nome. A confirmação da senha
é validada, mas não é gravada; apenas senha_hash é armazenada.

## Organização

- backend/src/usuarios/: entidade, DTO, validação, service, controller e module.
- backend/banco/: criação da tabela e atualização de endereço para bancos antigos.
- frontend/src/views/: CadastroUsuario.vue e AcessoUsuario.vue contêm as telas.
- frontend/src/composables/: usarCadastroUsuario.ts controla etapas e envio; usarEnderecoCadastro.ts controla consulta de CEP e correção dos erros de endereço.
- frontend/src/interfaces/cadastro-usuario.interface.ts: tipos dos dados e erros.
- frontend/src/assets/: estrutura-conta.css (página e banner), formulario-conta.css (cartões e etapas), campos-conta.css (inputs e erros), botoes-conta.css (ações) e animacoes-conta.css (movimentos).
- frontend/src/components/: layout, formulário e campos reutilizáveis.
- frontend/src/components/cadastro/: EtapaDadosPessoais.vue e EtapaEndereco.vue, com os campos de cada etapa.
- frontend/src/services/api.ts: chamadas HTTP do cadastro, CEP, login e sessão.
- frontend/src/validacoes/: máscaras e validações.
- docs/: referências das aulas, sem código usado pela aplicação.

## Rotas

| Verbo | Rota | Finalidade |
|---|---|---|
| GET | /api | Conferir se a API está no ar |
| POST | /api/usuarios | Cadastrar leitor individual |
| POST | /api/usuarios/sessao | Entrar |
| GET | /api/usuarios/sessao | Consultar sessão |
| DELETE | /api/usuarios/sessao | Sair |
| GET | /api/docs | Documentação Swagger |

Exemplos: backend/usuarios.http.

## Como testar

1. Envie os dados pessoais vazios: o primeiro erro deve receber foco.
2. Preencha os dados e avance com o botão ou Enter.
3. Informe um CEP e use Buscar CEP, ou preencha o endereço manualmente.
4. O complemento é opcional. Voltar mantém os dados pessoais.
5. Conclua para ver a confirmação na própria tela.
6. CPF ou e-mail repetidos devem mostrar um erro sem apagar o formulário.

A busca de CEP usa BrasilAPI e pode falhar por indisponibilidade da rede.
O preenchimento manual continua disponível.
## Identidade visual

Bandeira em frontend/src/assets/bandeira-brasil.svg, armazenada localmente.
Fonte: https://commons.wikimedia.org/wiki/File:Flag_of_Brazil.svg (domínio público).
A imagem inteira é exibida sem cortes, como parte do banner superior.
As animações de entrada rodam uma vez ao carregar a página; transições continuam
nas interações. Não há botão de pausa nem animações contínuas.
## Login adicionado

O cadastro agora tem o botão Já tenho cadastro, que abre /login.
Para habilitar sessões no banco existente, execute backend/banco/sessoes-usuarios.sql
uma vez no DBeaver, após usuarios.sql. Nenhum SQL é executado automaticamente.
Login verifica a senha protegida e cria cookie HttpOnly; o token é armazenado no banco
somente como hash, com validade de 24 horas. O logout encerra a sessão.


Foram removidos os textos fixos sobre senha e CPF/telefone da tela.
A senha curta mostra o campo vermelho e a mensagem enquanto estiver inválida.
A reorganização dos arquivos não altera as tabelas nem exige executar SQL novamente no DBeaver.
