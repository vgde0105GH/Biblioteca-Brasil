-- Somente para habilitar o login. Execute no banco existente, após usuarios.sql.
-- Não apaga dados nem altera a tabela usuarios.
CREATE TABLE IF NOT EXISTS sessoes_usuarios (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  expira_em DATETIME NOT NULL,
  KEY sessoes_usuarios_expiracao (expira_em),
  CONSTRAINT sessoes_usuarios_usuario_fk
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
