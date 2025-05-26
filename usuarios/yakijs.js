window.addEventListener("DOMContentLoaded", () => {
  console.log("yakijs.js carregado");

  const form = document.querySelector(".login-form");
  const lembrar = document.getElementById("lembrar");
  const inputUsuario = form.querySelector("input[placeholder='Usuário']");
  const inputSenha = form.querySelector("input[placeholder='Senha']");

  // Preenche usuário salvo, se existir
  const salvo = localStorage.getItem("usuarioLembrado");
  if (salvo) {
    inputUsuario.value = salvo;
    lembrar.checked = true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value.trim();

    if (!usuario || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Salva ou remove só o nome do usuário
    if (lembrar.checked) {
      localStorage.setItem("usuarioLembrado", usuario);
    } else {
      localStorage.removeItem("usuarioLembrado");
    }

    // Envia para o servidor
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          alert("Login bem-sucedido!");
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







