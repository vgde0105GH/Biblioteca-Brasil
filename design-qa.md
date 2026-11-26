# Revisão do cadastro — Biblioteca Brasil

final result: passed

## Referência e escopo

Referência: imagem de cadastro enviada pelo usuário nesta conversa (774 × 401 pixels).
Pedido: usar a composição como inspiração, melhorar o visual e deixar somente o cadastro.
Correção de marca confirmada pelo usuário: Biblioteca Brasil, sem SAPIENS.

A implementação é uma adaptação da referência: cabeçalho simples, apresentação central,
cartão de cadastro, campos organizados em colunas e chamada de ação turquesa.
O usuário pediu melhoria visual, portanto não foi buscada reprodução pixel a pixel.

## Evidências visuais

- Desktop: C:/Users/MARIANAMACHADO/Projeto Final - senac/verificacao-layout/cadastro-brasil-desktop.png
- Celular: C:/Users/MARIANAMACHADO/Projeto Final - senac/verificacao-layout/cadastro-brasil-celular.png
- Viewport desktop: 1440 × 1100 CSS px; captura completa da página; densidade 1.
- Viewport celular: 390 × 844 CSS px; captura completa da página; densidade 1.
- Estado: formulário vazio, sem autenticação.
- Fonte local: Space Grotesk, já presente no projeto.
- Paleta: fundo claro, cartão branco, texto escuro e turquesa.
- Sem imagens decorativas ou novos recursos externos.

## Testes de navegador

Browser plugin not available. Playwright com Chrome, autorizado pelo usuário.
Chamadas da API simuladas; nenhum registro criado no banco remoto.

- Marca e título Biblioteca Brasil, sem SAPIENS.
- Rota inicial e rotas antigas redirecionam para /cadastro.
- Formulário vazio não envia e foca o primeiro campo inválido.
- CPF e telefone aplicam suas máscaras.
- Mostrar e ocultar senha funciona.
- Senhas diferentes impedem envio.
- Primeiro nome e sobrenome chegam juntos no campo nome.
- Categoria enviada permanece individual.
- Envio válido mostra confirmação na mesma página e foca seu título.
- Fazer outro cadastro retorna ao formulário.
- Resposta 409 mostra o erro e preserva os dados preenchidos.
- Formulário sem rolagem horizontal no celular.
- Nenhum erro JavaScript nos fluxos testados.

## Verificação técnica

Frontend compilado no Docker, incluindo vue-tsc.
Backend preservado, sem alterações nesta etapa.
As demais telas, estilos exclusivos e imagens sem uso foram retirados do frontend,
com cópia de segurança fora do projeto.
Dependências locais foram mantidas para o VS Code.

## Limites

O teste de persistência com dados reais no alwaysdata não foi executado.
As tabelas de usuários e os dados de conexão precisam existir para cadastro real.
Login, acervo e retiradas não têm telas nesta etapa, conforme solicitado.

