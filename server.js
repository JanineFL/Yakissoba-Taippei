const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve arquivos da pasta "usuarios"
app.use(express.static(path.join(__dirname, 'usuarios')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'usuarios', 'index.html'));
});

// Rota de cadastro
app.post('/registrar', (req, res) => {
  const novoUsuario = req.body;
  const dbPath = path.join(__dirname, 'banco-de-dados', 'db.json');

  fs.readFile(dbPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });

    let usuarios = [];
    try {
      usuarios = JSON.parse(data);
    } catch {
      usuarios = [];
    }

    const existe = usuarios.find(u => u.email === novoUsuario.email || u.nome.toLowerCase() === novoUsuario.nome.toLowerCase());

    if (existe) {
      return res.status(400).json({ erro: 'Usuário já cadastrado.' });
    }

    usuarios.push(novoUsuario);

    fs.writeFile(dbPath, JSON.stringify(usuarios, null, 2), err => {
      if (err) return res.status(500).json({ erro: 'Erro ao salvar o usuário.' });

      res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
    });
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const dbPath = path.join(__dirname, 'banco-de-dados', 'db.json');

  fs.readFile(dbPath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor' });
    }

    const usuarios = JSON.parse(data);

    const encontrado = usuarios.find(
      u => u.nome.toLowerCase() === usuario.toLowerCase() && u.senha === senha
    );

    if (encontrado) {
      res.status(200).json({ sucesso: true, mensagem: 'Login bem-sucedido!' });
    } else {
      res.status(401).json({ sucesso: false, mensagem: 'Nome ou senha inválidos' });
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
