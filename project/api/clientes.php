<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nome = $conn->real_escape_string($data['nome']);
    $email = $conn->real_escape_string($data['email']);
    $cep = $conn->real_escape_string($data['cep']);
    $endereco = $conn->real_escape_string($data['endereco']);
    $cidade = $conn->real_escape_string($data['cidade']);
    $estado = $conn->real_escape_string($data['estado']);
    
    $sql = "INSERT INTO clientes (nome, email, cep, endereco, cidade, estado) 
            VALUES ('$nome', '$email', '$cep', '$endereco', '$cidade', '$estado')";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'message' => 'Cliente cadastrado com sucesso']);
    } else {
        echo json_encode(['error' => 'Erro ao cadastrar: ' . $conn->error]);
    }
}