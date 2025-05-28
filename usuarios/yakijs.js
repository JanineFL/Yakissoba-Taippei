window.addEventListener("DOMContentLoaded", () => {
  console.log("yakijs.js carregado");

  const form = document.querySelector(".login-form");
  const lembrar = document.getElementById("lembrar");
  const inputUsuario = document.getElementById("usuario");
  const inputSenha = document.getElementById("senha");

  if (!form || !inputUsuario || !inputSenha) {
    console.warn("⚠️ Elementos do formulário de login não foram encontrados.");
    return;
  }

  // Preenche se lembrar estiver marcado
  const salvo = localStorage.getItem("usuarioLembrado");
  if (lembrar && salvo) {
    inputUsuario.value = salvo;
    lembrar.checked = true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value.trim();

    if (!usuario || !senha) {
      alert("⚠️ Por favor, preencha todos os campos.");
      return;
    }

    if (lembrar && lembrar.checked) {
      localStorage.setItem("usuarioLembrado", usuario);
    } else {
      localStorage.removeItem("usuarioLembrado");
    }

    // Envia login
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          alert("✅ Login bem-sucedido!");
          const tipo = usuario.toLowerCase() === "proprietario" ? "proprietario" : "cliente";
          localStorage.setItem("usuarioLogado", JSON.stringify({ nome: usuario, tipo }));


          window.location.href = "home.html";
        } else {
          alert("❌ " + (data.mensagem || "Usuário ou senha incorretos."));
        }
      })
      .catch(err => {
        console.error("Erro ao conectar:", err);
        alert("Erro ao conectar com o servidor.");
      });
  });
});
function mostrarSenha() {
  const input = document.getElementById("senha");
  input.type = input.type === "password" ? "text" : "password";
}
const pedido = {
  usuario: {
    nome: userLogado.nome
  },
  itens: carrinho,
  total: calcularTotal(carrinho),
  data: new Date().toLocaleString()
};
const user = JSON.parse(localStorage.getItem("usuarioLogado"));

if (user) {
  fetch(`/meus-pedidos?usuario=${user.nome}`)
    .then(res => res.json())
    .then(pedidos => {
      const container = document.getElementById("meus-pedidos");
      pedidos.forEach(p => {
        const div = document.createElement("div");
        div.innerHTML = `<p><strong>Pedido:</strong> ${p.itens.length} itens - Total: R$ ${p.total.toFixed(2)} - ${p.data}</p>`;
        container.appendChild(div);
      });
    });
}
// Parte do yakijs.js
console.log("yakijs.js carregado");

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const lembrar = document.getElementById("lembrar");

  if (!form) return console.warn("Formulário de login não encontrado.");

  const inputUsuario = form.querySelector("#usuario");
  const inputSenha = form.querySelector("#senha");

  // Preencher campo se checkbox lembrar estiver ativado
  if (lembrar && localStorage.getItem("usuarioLembrado")) {
    inputUsuario.value = localStorage.getItem("usuarioLembrado");
    lembrar.checked = true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value.trim();

    if (!usuario || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    // Proprietária com senha especial
    if (usuario.toLowerCase() === "proprietaria" && senha === "senha-mestra-123") {
      localStorage.setItem("usuarioLogado", JSON.stringify({ nome: usuario, tipo: "proprietario" }));
      window.location.href = "proprietario.html";
      return;
    }

    // Login normal (cliente)
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          const tipo = usuario.toLowerCase() === "proprietario" ? "proprietario" : "cliente";
          localStorage.setItem("usuarioLogado", JSON.stringify({ nome: usuario, tipo }));
          window.location.href = "home.html";
        } else {
          alert("Usuário ou senha incorretos.");
        }
      })
      .catch(() => alert("Erro ao conectar com o servidor."));
  });
});








