// Quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
     // Elementos existentes no HTML
  const nomeClienteEl = document.getElementById('nomeCliente');
  const inputNome = document.getElementById('inputNome');
  const btnSalvar = document.getElementById('btnSalvar');
  const cardapioEl = document.getElementById('cardapio');
  const btnDestaque = document.getElementById('btnDestaque');
    // Salvar e carregar nome do cliente
  btnSalvar.addEventListener('click', () => {
    const nome = inputNome.value.trim();
    if (nome) {
      localStorage.setItem('cliente', nome);
      nomeClienteEl.textContent = nome;
    }
  });

  const nomeSalvo = localStorage.getItem('cliente');
  if (nomeSalvo) {
    nomeClienteEl.textContent = nomeSalvo;
  }

  // Lista de pratos
  const pratos = [];

  // Adicionar pratos ao HTML
  pratos.forEach((prato, i) => {
    const item = document.createElement('div');
    item.className = 'prato';
    item.textContent = `Prato ${i + 1}: ${prato}`;
    cardapioEl.appendChild(item);
  });

  // Destacar prato aleatório
  btnDestaque.addEventListener('click', () => {
    const pratosEl = document.querySelectorAll('.prato');
    pratosEl.forEach(p => p.classList.remove('destaque'));
    const aleatorio = pratosEl[Math.floor(Math.random() * pratosEl.length)];
    aleatorio.classList.add('destaque');
  });
});
// Botões para categorias (comida, bebida, etc)
document.getElementById('btnComida').addEventListener('click', () => {
    window.location.href = 'comidas.html';
});
document.getElementById('btnBebida').addEventListener('click', () => {
    window.location.href = 'bebidas.html';
});
//Carrinho estilo iFood
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(item) {
    carrinho.push(item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert('Item adicionado ao carrinho!');
}
//fazer o login e o usuario
function salvarUsuario(nome) {
    localStorage.setItem('usuario', nome);
}

function verificarUsuario() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        document.getElementById('usuarioLogado').textContent = `Bem-vindo, ${usuario}!`;
    }
}
//estruturar o carrinho e ainda continuar com as informaçoes
// Em uma página
localStorage.setItem('pedidoAtual', JSON.stringify(pedido));

// Em outra
let pedido = JSON.parse(localStorage.getItem('pedidoAtual'));
