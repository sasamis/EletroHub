

-- CREATE TABLE produtos (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     nome VARCHAR(255) NOT NULL,
--     preco DECIMAL(10,2) NOT NULL,
--     imagem VARCHAR(255) NOT NULL,
--     descricao TEXT
-- );

-- CREATE TABLE clientes (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     nome VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     cep VARCHAR(8) NOT NULL,
--     endereco VARCHAR(255) NOT NULL,
--     cidade VARCHAR(100) NOT NULL,
--     estado VARCHAR(2) NOT NULL,
--     data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE compras (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     cliente_id INT NOT NULL,
--     total DECIMAL(10,2) NOT NULL,
--     frete DECIMAL(10,2) NOT NULL,
--     data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (cliente_id) REFERENCES clientes(id)
-- );

-- CREATE TABLE compras_items (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     compra_id INT NOT NULL,
--     produto_id INT NOT NULL,
--     quantidade INT NOT NULL,
--     preco_unitario DECIMAL(10,2) NOT NULL,
--     FOREIGN KEY (compra_id) REFERENCES compras(id),
--     FOREIGN KEY (produto_id) REFERENCES produtos(id)
-- );