# Biblioteca Brasil · Projeto Final Senac

## Etapa atual: cadastro de leitores

O frontend mostra somente o cadastro de leitores, inspirado na referência enviada pelo usuário.
A marca é Biblioteca Brasil. Não há navegação para login, acervo ou retiradas nesta etapa.
As rotas antigas redirecionam para /cadastro.

A tela é dividida em duas etapas: dados pessoais e endereço. O CEP pode ser consultado
na BrasilAPI para preencher rua, bairro, cidade e estado; os campos continuam editáveis.
O cadastro também coleta número e complemento do endereço.
Primeiro nome e sobrenome são enviados juntos no campo nome da API.
A conta criada é sempre individual. CPF, telefone e confirmação são exigidos pela API.
O cadastro mostra a confirmação na própria página e trata erros sem apagar os dados preenchidos.

## Executar

Abra o Docker Desktop. Na raiz do projeto:

```powershell
docker compose up --build
```

- Cadastro: http://localhost:3000/cadastro
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/docs
- Conferir builds: docker compose build api web
- Desligar: docker compose down

As dependências são instaladas pelo Docker. node_modules local é mantido para o editor
e fica fora do Git. Não usar npm install no computador.

## Banco no alwaysdata

Os dados de conexão ficam somente no .env da raiz. Não publicar nem compartilhar seu conteúdo.
O MySQL fica online, fora do Docker. O TypeORM mantém synchronize: false.

Para um banco novo, execute backend/banco/biblioteca.sql no DBeaver.
Para um banco existente, execute uma vez backend/banco/adicionar-endereco-usuarios.sql
no DBeaver antes de usar a nova etapa de endereço. A migração adiciona os campos de
endereço sem apagar os usuários existentes.
Para a tela atual funcionar, as tabelas de usuários precisam estar criadas.
O script backend/banco/atualizar-detalhes-livros.sql é apenas para bancos antigos
que ainda não têm as colunas extras de livros; não é necessário para cadastrar leitores.

Nenhuma alteração de banco é executada automaticamente.

## Organização

```text
frontend/src/
  components/
    input/
      CampoTexto.vue
      CampoSenha.vue
    LayoutConta.vue
    FormularioConta.vue
  views/
    CadastroView.vue
  interfaces/
    usuario.interface.ts
  services/
    api.ts
  validacoes/
    cadastro.validacao.ts
  router/
    index.ts
  assets/
    conta.css
```

O backend mantém seus módulos de usuarios, livros e retiradas para as próximas etapas,
sem expor essas telas no frontend. A regra de no máximo 5 retiradas ativas por pessoa
continua na API.

## Rotas da API preservadas

| Verbo | Rota | Finalidade |
|---|---|---|
| GET | /api | Situação da API |
| POST | /api/usuarios | Cadastro individual usado pela tela atual |
| POST | /api/usuarios/sessao | Entrar, disponível somente na API nesta etapa |
| GET | /api/usuarios/sessao | Consultar sessão |
| DELETE | /api/usuarios/sessao | Sair |
| GET | /api/livros | Acervo |
| GET | /api/livros/{id} | Consultar exemplar |
| POST | /api/livros | Cadastrar exemplar |
| GET | /api/retiradas | Minhas retiradas |
| POST | /api/retiradas | Retirar exemplar |
| PATCH | /api/retiradas/{id}/devolucao | Devolver exemplar |

Exemplos manuais: backend/Api.http.

## Conferir o cadastro

1. Abra /cadastro no computador e no celular.
2. Tente enviar vazio: o primeiro campo inválido deve receber o foco.
3. Preencha seus dados e confira a máscara de CPF e telefone.
4. Senhas diferentes devem impedir o avanço para a etapa de endereço.
5. Consulte um CEP válido e confira os campos preenchidos; teste também CEP inválido.
6. Preencha número e confira os demais dados do endereço antes de concluir.
7. Um cadastro válido mostra a confirmação na mesma página.
8. CPF ou e-mail repetidos mostram a mensagem da API e preservam o formulário.