window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Verifica se é o proprietário
  if (!user || user.tipo !== "proprietario") {
    alert(" Acesso restrito! Apenas o proprietário pode acessar esta página.");
    window.location.href = "config.html";
    return;
  }

  const lista = document.getElementById("lista-pedidos");

  // Carrega os pedidos
  fetch("/pedidos")
    .then(res => res.json())
    .then(pedidos => {
      if (!pedidos.length) {
        lista.innerHTML = "<p>Nenhum pedido por enquanto.</p>";
        return;
      }

      lista.innerHTML = "";
      pedidos.forEach((p, i) => {
        const div = document.createElement("div");
        div.style = "border:1px solid #ccc; padding:10px; margin-bottom:10px;";
        div.innerHTML = `
          <p><strong>Cliente:</strong> ${p.cliente}</p>
          <p><strong>Pedido:</strong> ${p.itens}</p>
          <p><strong>Status:</strong> ${p.status}</p>
          ${
            p.status !== "Enviado para maquininha"
              ? `<button onclick="enviar(${i})">Enviar para maquininha</button>`
              : `<span style="color:green;"> Enviado</span>`
          }
        `;
        lista.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar pedidos:", err);
      lista.innerHTML = "<p>Erro ao carregar pedidos.</p>";
    });
});

// Enviar pedido para "maquininha"
function enviar(index) {
  fetch(`/pedidos/enviar/${index}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensagem || "Pedido atualizado.");
      location.reload(); // Recarrega a lista
    })
    .catch(err => {
      console.error("Erro ao enviar pedido:", err);
      alert("Erro ao enviar pedido.");
    });
}

// Botão de sair
function sair() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "config.html";
}
