# Biblioteca Brasil · Projeto Final Senac

```
Navegador (Vue 3)  →  API NestJS (Node)  →  MySQL no alwaysdata
localhost:3000        localhost:8080         mysql-SUACONTA.alwaysdata.net
```

Tudo roda no Docker: não é preciso instalar Node.js.

- Frontend em Vue 3 com TypeScript, Vue Router e Axios.
- Backend em NestJS com TypeScript, TypeORM e MySQL no alwaysdata.

## Antes de tudo

1. No DBeaver conectado ao alwaysdata, selecione o banco do projeto e execute o [script completo da biblioteca](backend/banco/biblioteca.sql). Ele cria as tabelas de contas, livros e retiradas.
2. Copie `.env.example` para `.env` e preencha os dados do banco (`DB_HOST`, `DB_USER`,
   `DB_PASSWORD`, `DB_NAME`).

## Modo 1 · Construir as imagens a partir do código (dia a dia)

Na raiz do projeto:

```bash
docker compose up --build
```

O Docker baixa as imagens oficiais (Node e nginx), compila o código
e cria as imagens do projeto: `projeto-final-api` e `projeto-final-web`.

- Site: http://localhost:3000
- Cadastro: http://localhost:3000/cadastro
- Login: http://localhost:3000/login
- API: http://localhost:8080/api
- Documentação da API (Swagger): http://localhost:8080/api/docs
- Desligar: `docker compose down`

Para ver as imagens criadas: `docker compose images`

## Modo 2 · Publicar no Docker Hub e usar a imagem pronta (opcional)

Útil para quem vai só usar o sistema, sem esperar a compilação (o professor, por exemplo).
Crie uma conta gratuita em https://hub.docker.com e troque `seuusuario` pelo seu usuário.

**Quem publica (a equipe):**

```bash
docker login
docker build -t seuusuario/projeto-final-api:1.0 ./backend
docker build --build-arg VITE_API_URL=http://localhost:8080 -t seuusuario/projeto-final-web:1.0 ./frontend
docker push seuusuario/projeto-final-api:1.0
docker push seuusuario/projeto-final-web:1.0
```

**Quem usa:** precisa só do `compose.hub.yaml` (com o mesmo usuário) e de um `.env` preenchido.

```bash
docker compose -f compose.hub.yaml pull
docker compose -f compose.hub.yaml up
```

Importante:

- A senha **não** vai dentro da imagem: o `.env` fica fora dela, e cada pessoa usa o seu.
- O endereço da API (`http://localhost:8080`) fica gravado na imagem do site durante o build.
- Mudou o código? Gere uma nova versão (`:1.1`), publique de novo e atualize o `compose.hub.yaml`.

## Biblioteca: retirada e devolução

Não há venda nem preço. Cada registro de livro representa um exemplar físico.
O usuário entra na conta para retirar e devolver; só vê as retiradas da própria conta.
O exemplar fica indisponível enquanto a retirada não tiver uma devolução registrada.
O prazo de devolução e a operação por funcionários ainda não foram definidos.

## SQL no DBeaver

Selecione o banco do projeto no alwaysdata e execute somente `backend/banco/biblioteca.sql` (Alt + X no editor SQL).
As quatro tabelas são `usuarios`, `sessoes_usuarios`, `livros` e `retiradas`.
O SQL não apaga uma eventual tabela `produtos`; ela deixa de ser usada pela aplicação.
O TypeORM permanece com `synchronize: false`.

## Rotas da API

| Verbo | Rota | Finalidade |
|---|---|---|
| GET | /api | Situação da API |
| GET | /api/livros | Acervo e disponibilidade |
| GET | /api/livros/{id} | Consultar exemplar |
| POST | /api/livros | Cadastrar exemplar com título e autor |
| POST | /api/usuarios | Cadastro individual |
| POST | /api/usuarios/sessao | Entrar |
| GET | /api/usuarios/sessao | Consultar sessão |
| DELETE | /api/usuarios/sessao | Sair |
| GET | /api/retiradas | Minhas retiradas |
| POST | /api/retiradas | Retirar exemplar disponível |
| PATCH | /api/retiradas/{id}/devolucao | Devolver exemplar da própria conta |

## Conferir a mudança

1. Execute `backend/banco/biblioteca.sql` no DBeaver.
2. Execute `docker compose up --build`.
3. Abra http://localhost:3000 e cadastre um exemplar com título e autor.
4. Crie uma conta em `/cadastro`, entre em `/login` e volte ao acervo.
5. Retire o exemplar: ele deve ficar indisponível e aparecer em Minhas retiradas.
6. Clique em Devolver: ele deve ficar disponível novamente, preservando o histórico.
7. Sem login, as rotas de retiradas retornam 401. Um exemplar já retirado retorna 409.

Dependências e builds devem rodar no Docker. Chamadas HTTP ficam em
`frontend/src/services/api.ts`; validações do cadastro ficam em
`frontend/src/validacoes/cadastro.validacao.ts`.
## Organização das pastas

```text
backend/
  banco/
    biblioteca.sql
  src/
    livros/          # entidade, DTO, service, controller e module
    usuarios/        # contas, sessões e validação do cadastro
    retiradas/       # entidade, DTO, service, controller e module
    app.module.ts
    main.ts
    situacao.controller.ts
frontend/
  src/
    assets/          # imagens e estilos
    components/      # layout e formulário de conta
      input/         # campos reutilizáveis, como nos exemplos das aulas
    interfaces/      # tipos dos dados
    router/          # rotas das páginas
    services/
      api.ts         # todas as chamadas HTTP
    validacoes/      # validações e máscaras do cadastro
    views/           # telas de cadastro, login e acervo
    App.vue
    main.ts
docs/
  guia-nestjs/        # guia PDF das aulas
```

O backend agrupa os arquivos por assunto, como pede o AGENTS.md.
O frontend separa telas, componentes e interfaces, como nos exemplos das aulas.
Mantemos `views/` e `services/api.ts` porque esses caminhos são exigidos pelas regras do projeto.
Validações no navegador e na API têm funções distintas e são mantidas.
Cada pessoa pode manter no máximo 5 livros retirados ao mesmo tempo. Livros devolvidos não contam nesse limite. A API verifica a regra dentro de uma transação, inclusive em pedidos simultâneos.

## Layout da biblioteca

A referência visual enviada pelo usuário orienta o menu lateral, as abas, os campos e o azul-turquesa.
O catálogo fica em `/`, a entrada manual em `/livros/adicionar` e o histórico em `/retiradas`.
Não há preço, venda ou cadastro de filmes e jogos.

O formulário permite informar coleção, descrição, editora, publicação, ISBN, páginas e capa.
Título e autor são obrigatórios; os demais campos são opcionais.
A capa aceita JPG, PNG ou GIF de até 2 MB e é armazenada junto ao exemplar.

**Banco existente:** execute uma vez `backend/banco/atualizar-detalhes-livros.sql` no DBeaver.
**Banco novo:** execute somente `backend/banco/biblioteca.sql`, que já inclui as novas colunas.
Não execute a atualização novamente se as colunas já existirem.
O SQL continua manual; o TypeORM não altera o banco.

A interface mostra somente funções implementadas. Coleções são um rótulo do exemplar;
não há módulo separado de coleções nem importação CSV nesta etapa.