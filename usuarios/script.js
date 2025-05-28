function fazerLogin() {
  const usuario = document.getElementById("login-nome").value;
  const senha = document.getElementById("login-senha").value;

  if (!usuario || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.sucesso) {
        localStorage.setItem("usuarioLogado", JSON.stringify({ nome: usuario }));
        window.location.href = "home.html"; // ⬅️ redireciona pra home.html
      } else {
        alert(data.mensagem);
      }
    })
    .catch(err => {
      console.error("Erro ao conectar:", err);
      alert("Erro de conexão com o servidor.");
    });
}


