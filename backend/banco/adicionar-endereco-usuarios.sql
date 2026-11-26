-- Execute uma única vez no banco existente para habilitar o cadastro com endereço.
ALTER TABLE usuarios
  ADD COLUMN cep CHAR(8) NOT NULL DEFAULT '',
  ADD COLUMN logradouro VARCHAR(150) NOT NULL DEFAULT '',
  ADD COLUMN numero VARCHAR(20) NOT NULL DEFAULT '',
  ADD COLUMN complemento VARCHAR(100) NULL,
  ADD COLUMN bairro VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN cidade VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN estado CHAR(2) NOT NULL DEFAULT '';

-- Depois de preencher os endereços dos usuários existentes, os valores padrão
-- podem ser removidos caso esses registros precisem ter endereço obrigatório.
