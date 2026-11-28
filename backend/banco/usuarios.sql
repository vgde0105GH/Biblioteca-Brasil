-- Cadastro de leitores da Biblioteca Brasil.
-- Selecione o banco do projeto no DBeaver e execute este script com Alt + X.
-- Não cria banco novo, não apaga dados e não altera tabelas existentes.
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL,
  cpf CHAR(11) NOT NULL,
  telefone VARCHAR(11) NOT NULL,
  cep CHAR(8) NOT NULL,
  logradouro VARCHAR(150) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  complemento VARCHAR(100) NULL,
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado CHAR(2) NOT NULL,
  senha_hash VARCHAR(161) NOT NULL,
  categoria ENUM('individual', 'institucional', 'funcionario', 'admin', 'dev') NOT NULL,
  UNIQUE KEY usuarios_email_unico (email),
  UNIQUE KEY usuarios_cpf_unico (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cadastre pela tela, não por INSERT manual: a API gera senha_hash.
-- A categoria enviada pelo cadastro público é sempre individual.
-- Se usuarios já existe SEM os campos de endereço, execute uma única vez
-- adicionar-endereco-usuarios.sql. Não repita se as colunas já existirem.
