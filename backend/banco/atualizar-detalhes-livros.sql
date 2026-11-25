-- Execute SOMENTE se a tabela livros já existe com apenas id, titulo e autor.
-- Se já executou biblioteca.sql com estas colunas, não repita esta atualização.
-- Não apaga registros. Selecione o banco do projeto no DBeaver.
ALTER TABLE livros
  ADD COLUMN colecao VARCHAR(150) NULL,
  ADD COLUMN descricao TEXT NULL,
  ADD COLUMN editora VARCHAR(150) NULL,
  ADD COLUMN publicacao_ano INT NULL,
  ADD COLUMN publicacao_mes INT NULL,
  ADD COLUMN publicacao_dia INT NULL,
  ADD COLUMN isbn13 VARCHAR(13) NULL,
  ADD COLUMN isbn10 VARCHAR(10) NULL,
  ADD COLUMN paginas INT NULL,
  ADD COLUMN capa LONGTEXT NULL;
