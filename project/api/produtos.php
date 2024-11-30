<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM produtos";
    $result = $conn->query($sql);
    
    $produtos = [];
    while ($row = $result->fetch_assoc()) {
        $produtos[] = [
            'id' => (int)$row['id'],
            'nome' => $row['nome'],
            'preco' => (float)$row['preco'],
            'imagem' => $row['imagem'],
            'descricao' => $row['descricao']
        ];
    }
    
    echo json_encode($produtos);
}