<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $cliente_id = (int)$data['cliente_id'];
    $total = (float)$data['total'];
    $frete = (float)$data['frete'];
    $items = $data['items'];
    
    $conn->begin_transaction();
    
    try {
        // Insere a compra
        $sql = "INSERT INTO compras (cliente_id, total, frete, data_compra) 
                VALUES ($cliente_id, $total, $frete, NOW())";
        $conn->query($sql);
        $compra_id = $conn->insert_id;
        
        // Insere os itens da compra
        foreach ($items as $item) {
            $produto_id = (int)$item['id'];
            $quantidade = (int)$item['quantidade'];
            $preco = (float)$item['preco'];
            
            $sql = "INSERT INTO compras_items (compra_id, produto_id, quantidade, preco_unitario) 
                    VALUES ($compra_id, $produto_id, $quantidade, $preco)";
            $conn->query($sql);
        }
        
        $conn->commit();
        echo json_encode(['success' => true, 'compra_id' => $compra_id]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['error' => 'Erro ao processar compra: ' . $e->getMessage()]);
    }
}