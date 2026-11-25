# Revisão do layout da biblioteca

Referência: imagem de “Adicionar Itens / SAPIENS” anexada pelo usuário nesta conversa.
Dimensões informadas: original 3852 × 3172; versão exibida 3497 × 2880.
Implementação: http://localhost:3000/livros/adicionar.
Capturas: C:/Users/MARIANAMACHADO/Projeto Final - senac/verificacao-layout/adicionar-livro-desktop.png e adicionar-livro-celular.png.
Viewport desktop: 1920 × 1080 CSS px, densidade 1, captura completa da página.
Viewport celular: 390 × 844 CSS px, densidade 1, captura completa da página.
Estado: entrada manual vazia, conta de exemplo simulada no navegador.

## Comparação visual

Menu lateral cinza, marca em texto, conteúdo branco, hierarquia de títulos,
abas com linha turquesa, campos largos com borda clara e botão de envio
foram implementados seguindo a referência e verificados nas capturas.
O layout é uma adaptação funcional, não uma cópia integral do sistema da imagem.

Diferenças intencionais de escopo:
- “Adicionar livros” substitui “Adicionar Itens”; não há preço, filme ou jogo.
- Menu mostra apenas acervo, entrada manual, retiradas e conta, que funcionam no projeto.
- Coleção é um rótulo editável do exemplar, sem módulo de coleções separado.
- Importação CSV e tags não aparecem porque não existem na aplicação.
- Capa aceita até 2 MB; o limite é informado na tela e validado no backend.
- Marca e avatar usam texto/interface; não foram adicionadas imagens decorativas.
- Login e cadastro de usuários mantêm seu layout anterior, fora da tela de referência.

## Ajustes e segunda verificação

Na primeira captura, o seletor nativo de arquivo estava duplicado com o botão
de capa. O input passou a ficar visualmente oculto, mantendo o botão funcional.
As abas receberam rolagem interna para caberem no celular.
A segunda execução de navegador passou após essas correções.

## Interações verificadas

Playwright com Chrome, autorizado pelo usuário. Browser plugin not available.
Respostas da API simuladas apenas no teste, sem registros no alwaysdata.

- Campos obrigatórios bloqueiam formulário vazio.
- Título, autor, ano e páginas são enviados com os tipos esperados.
- Seleção de imagem cria a prévia e envia a capa em base64.
- Sucesso limpa os campos e mostra confirmação.
- Navegação acervo/entrada manual/minhas retiradas funciona.
- Busca mostra o estado sem resultados.
- Histórico vazio e menu móvel funcionam.
- Não houve overflow horizontal no formulário ou acervo móveis.
- Nenhum erro JavaScript ou erro de console nos fluxos simulados.

API e frontend compilados no Docker; frontend inclui vue-tsc.
Validação backend conferida na imagem: normalização, ano bissexto e
seis entradas inválidas recusadas com 400, sem conexão ao banco.

## Limite de verificação

Persistência dos novos campos no alwaysdata depende de executar manualmente
backend/banco/atualizar-detalhes-livros.sql em bancos existentes.
Não foi executado SQL nem feito teste de gravação no banco remoto.
Esta revisão aprova o layout adaptado e as interações com dados simulados;
não certifica o fluxo completo de persistência.

final result: passed

