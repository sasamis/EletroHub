// Estado do Carrinho
let carrinho = [];
let paginaAtual = 'produtos';
let valorFrete = 0;
let clienteId = null;

// Elementos do DOM
const linksMenu = document.querySelectorAll('nav a');
const paginas = document.querySelectorAll('.page');
const containerProdutos = document.getElementById('products-container');
const containerCarrinho = document.getElementById('cart-items');
const contadorCarrinho = document.querySelector('.cart-count');
const totalCarrinho = document.getElementById('cart-total');
const botaoFinalizar = document.getElementById('checkout');
const formularioCadastro = document.getElementById('register-form');
const inputCep = document.getElementById('cep');
const botaoBuscarCep = document.getElementById('search-cep');
const inputCepFrete = document.getElementById('shipping-cep');
const botaoCalcularFrete = document.getElementById('calc-shipping');

// Exibição de Produtos
function exibirProdutos() {
    fetch('api/produtos.php')
        .then(response => response.json())
        .then(produtos => {
            containerProdutos.innerHTML = produtos.map(produto => `
                <div class="product-card">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="price">R$ ${produto.preco.toFixed(2)}</div>
                    <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

// Chame a função para exibir os produtos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    exibirProdutos();
    atualizarCarrinho();
});

// Navegação
linksMenu.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.dataset.page;
        mudarPagina(targetPage);
    });
});

function mudarPagina(pagina) {
    paginaAtual = pagina;
    paginas.forEach(p => p.classList.remove('active'));
    linksMenu.forEach(link => link.classList.remove('active'));
    
    document.getElementById(pagina).classList.add('active');
    document.querySelector(`[data-page="${pagina}"]`).classList.add('active');
}

// Funções do Carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    const itemCarrinho = carrinho.find(item => item.id === produtoId);
    
    if (itemCarrinho) {
        itemCarrinho.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            descricao: produto.descricao,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
}

function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarCarrinho();
}

function alterarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            atualizarCarrinho();
        }
    }
}

function atualizarCarrinho() {
    // Atualiza contador
    const totalItems = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    contadorCarrinho.textContent = totalItems;

    // Atualiza itens do carrinho
    if (paginaAtual === 'cart') {
        if (carrinho.length === 0) {
            containerCarrinho.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
        } else {
            containerCarrinho.innerHTML = carrinho.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.imagem}" alt="${item.nome}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.nome}</h3>
                        <p class="cart-item-description">${item.descricao}</p>
                        <p class="cart-item-price">R$ ${item.preco.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
                            <span>${item.quantidade}</span>
                            <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
                        </div>
                        <p class="cart-item-subtotal">Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                    <button class="remove-item" onclick="removerDoCarrinho(${item.id})">Remover</button>
                </div>
            `).join('');
        }

        // Atualiza total
        const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        const total = subtotal + valorFrete;
        totalCarrinho.textContent = total.toFixed(2);
    }
}

// Busca CEP
async function buscarCep(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        return data;
    } catch (error) {
        alert('Erro ao buscar CEP: ' + error.message);
        return null;
    }
}

// Cálculo de Frete
function calcularFrete(distancia) {
    const valorBase = 10;
    const valorPorKm = 0.5;
    return valorBase + (distancia * valorPorKm);
}

// Event Listeners
botaoBuscarCep.addEventListener('click', async () => {
    const cep = inputCep.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert('CEP inválido');
        return;
    }

    const endereco = await buscarCep(cep);
    if (endereco) {
        document.getElementById('address').value = endereco.logradouro;
        document.getElementById('city').value = endereco.localidade;
        document.getElementById('state').value = endereco.uf;
    }
});

botaoCalcularFrete.addEventListener('click', async () => {
    const cep = inputCepFrete.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert('CEP inválido');
        return;
    }

    const endereco = await buscarCep(cep);
    if (endereco) {
        // Simulação de distância baseada no CEP
        const distancia = parseInt(cep.substring(0, 3)) / 10;
        valorFrete = calcularFrete(distancia);

        document.getElementById('shipping-result').innerHTML = `
            <p>Frete para ${endereco.localidade} - ${endereco.uf}</p>
            <p>Valor do frete: R$ ${valorFrete.toFixed(2)}</p>
        `;

        atualizarCarrinho();
    }
});

// Cadastro de Cliente
formularioCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('name').value,
        email: document.getElementById('email').value,
        cep: document.getElementById('cep').value,
        endereco: document.getElementById('address').value,
        cidade: document.getElementById('city').value,
        estado: document.getElementById('state').value
    };

    try {
        const response = await fetch(`${API_URL}/clientes.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Cadastro realizado com sucesso!');
            clienteId = result.cliente_id;
            formularioCadastro.reset();
        } else {
            alert('Erro ao cadastrar: ' + result.error);
        }
    } catch (erro) {
        alert('Erro ao enviar cadastro: ' + erro.message);
    }
});

// Finalização da Compra
botaoFinalizar.addEventListener('click', async () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    if (!clienteId) {
        alert('Por favor, faça seu cadastro antes de finalizar a compra!');
        mudarPagina('register');
        return;
    }

    const compraData = {
        cliente_id: clienteId,
        total: carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0) + valorFrete,
        frete: valorFrete,
        items: carrinho
    };

    try {
        const response = await fetch(`${API_URL}/compras.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compraData)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Compra finalizada com sucesso!');
            carrinho = [];
            valorFrete = 0;
            atualizarCarrinho();
        } else {
            alert('Erro ao finalizar compra: ' + result.error);
        }
    } catch (erro) {
        alert('Erro ao processar compra: ' + erro.message);
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    exibirProdutos();
    atualizarCarrinho();
});