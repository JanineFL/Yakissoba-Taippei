function cadastrar() {
  const nome = document.getElementById("cad-nome").value;
  const email = document.getElementById("cad-email").value;
  const telefone = document.getElementById("cad-telefone").value;
  const senha = document.getElementById("cad-senha").value;
  const confirmar = document.getElementById("cad-confirmar").value;

  if (!nome || !email || !telefone || !senha || !confirmar) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha !== confirmar) {
    alert("As senhas não coincidem.");
    return;
  }

  fetch("/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, telefone, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert(data.erro); // Mostra mensagem de erro como "Cadastro já existe"
      } else {
        alert(data.mensagem); // "Usuário registrado com sucesso!"
        window.location.href = "config.html";
      }
    })
    .catch(err => {
      console.error("Erro ao conectar:", err);
      alert("Erro de conexão com o servidor.");
    });
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
  });


