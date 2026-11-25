CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL,
  cpf CHAR(11) NOT NULL,
  telefone VARCHAR(11) NOT NULL,
  senha_hash VARCHAR(161) NOT NULL,
  categoria ENUM('individual', 'institucional', 'funcionario', 'admin', 'dev') NOT NULL,
  UNIQUE KEY usuarios_email_unico (email),
  UNIQUE KEY usuarios_cpf_unico (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessoes_usuarios (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  expira_em DATETIME NOT NULL,
  KEY sessoes_usuarios_expiracao (expira_em),
  CONSTRAINT sessoes_usuarios_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Selecione o banco do projeto no DBeaver e execute com Alt + X.
-- Este arquivo já inclui as quatro tabelas na ordem correta.
-- Um registro de livros representa um exemplar físico, sem preço.
CREATE TABLE IF NOT EXISTS livros (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(150) NOT NULL,
  colecao VARCHAR(150) NULL,
  descricao TEXT NULL,
  editora VARCHAR(150) NULL,
  publicacao_ano INT NULL,
  publicacao_mes INT NULL,
  publicacao_dia INT NULL,
  isbn13 VARCHAR(13) NULL,
  isbn10 VARCHAR(10) NULL,
  paginas INT NULL,
  capa LONGTEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS retiradas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  livro_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  retirado_em DATETIME NOT NULL,
  devolvido_em DATETIME NULL,
  -- No MySQL, valores NULL podem se repetir no índice único.
  -- Apenas uma retirada ativa por exemplar, inclusive em envios simultâneos.
  livro_ativo_id INT UNSIGNED GENERATED ALWAYS AS
    (CASE WHEN devolvido_em IS NULL THEN livro_id ELSE NULL END) STORED,
  UNIQUE KEY retiradas_exemplar_ativo (livro_ativo_id),
  KEY retiradas_usuario (usuario_id),
  KEY retiradas_livro (livro_id),
  CONSTRAINT retiradas_livro_fk FOREIGN KEY (livro_id) REFERENCES livros(id),
  CONSTRAINT retiradas_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- A tabela produtos, se já existir, não é utilizada nem apagada por este script.
