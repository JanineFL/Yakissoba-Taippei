const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
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
    try { usuarios = JSON.parse(data); } catch { usuarios = []; }

    const existe = usuarios.find(u => u.email === novoUsuario.email || u.nome.toLowerCase() === novoUsuario.nome.toLowerCase());
    if (existe) return res.status(400).json({ erro: 'Usuário já cadastrado.' });

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
    if (err) return res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor' });

    const usuarios = JSON.parse(data);
    const encontrado = usuarios.find(u => u.nome.toLowerCase() === usuario.toLowerCase() && u.senha === senha);

    if (encontrado) {
      res.status(200).json({ sucesso: true, mensagem: 'Login bem-sucedido!' });
    } else {
      res.status(401).json({ sucesso: false, mensagem: 'Usuário não encontrado ou senha incorreta.' });
    }
  });
});

// Rota de recuperação de senha
app.post('/esqueci-senha', (req, res) => {
  const { email } = req.body;
  const dbPath = path.join(__dirname, 'banco-de-dados', 'db.json');

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });

    let usuarios = [];
    try { usuarios = JSON.parse(data); } catch { usuarios = []; }

    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).json({ erro: 'Email não cadastrado.' });

    const novaSenha = Math.random().toString(36).slice(-8);
    usuario.senha = novaSenha;

    fs.writeFile(dbPath, JSON.stringify(usuarios, null, 2), err => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar senha.' });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yakisobasuporte0@gmail.com',
          pass: 'aozk slsx vyih hoiq'
        }
      });

      const mailOptions = {
        from: 'yakisobasuporte0@gmail.com',
        to: email,
        subject: 'Recuperação de senha - Yakisoba Taippei',
        text: `Olá! Sua nova senha é: ${novaSenha}`
      };

      transporter.sendMail(mailOptions, (erro, info) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao enviar email.' });
        res.status(200).json({ mensagem: 'Email enviado com sucesso!' });
      });
    });
  });
});

// Rota para adicionar pedido
app.post("/adicionar-pedido", (req, res) => {
  const pedido = req.body;
  const pedidosPath = path.join(__dirname, "banco-de-dados", "pedidos.json");

  if (!fs.existsSync(pedidosPath)) fs.writeFileSync(pedidosPath, "[]");

  fs.readFile(pedidosPath, "utf8", (err, data) => {
    let pedidos = [];
    if (!err && data.trim()) {
      try { pedidos = JSON.parse(data); } catch (e) { pedidos = []; }
    }

    pedidos.push(pedido);

    fs.writeFile(pedidosPath, JSON.stringify(pedidos, null, 2), (err) => {
      if (err) return res.status(500).send("Erro ao salvar pedido");
      res.send("Pedido adicionado com sucesso!");
    });
  });
});

// Rota para buscar pedidos
app.get('/pedidos', (req, res) => {
  const pathPedidos = path.join(__dirname, 'banco-de-dados', 'pedidos.json');
  fs.readFile(pathPedidos, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler pedidos.' });
    res.json(JSON.parse(data));
  });
});

// Rota para marcar pedido como enviado
app.post('/pedidos/enviar/:id', (req, res) => {
  const pathPedidos = path.join(__dirname, 'banco-de-dados', 'pedidos.json');
  fs.readFile(pathPedidos, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao acessar pedidos.' });

    const pedidos = JSON.parse(data);
    const id = parseInt(req.params.id);
    if (!pedidos[id]) return res.status(404).json({ erro: 'Pedido não encontrado.' });

    pedidos[id].status = "Enviado para maquininha";

    fs.writeFile(pathPedidos, JSON.stringify(pedidos, null, 2), err => {
      if (err) return res.status(500).json({ erro: 'Erro ao salvar alteração.' });
      res.json({ mensagem: 'Pedido enviado com sucesso!' });
    });
  });
});

// Rota para remover um pedido
app.delete('/remover-pedido/:id', (req, res) => {
  const { id } = req.params;
  const pathPedidos = path.join(__dirname, 'banco-de-dados', 'pedidos.json');

  fs.readFile(pathPedidos, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler o banco de dados');

    let pedidos = JSON.parse(data);
    pedidos = pedidos.filter((pedido, index) => index != id);

    fs.writeFile(pathPedidos, JSON.stringify(pedidos, null, 2), (err) => {
      if (err) return res.status(500).send('Erro ao salvar alteração');
      res.status(200).send('Pedido removido com sucesso');
    });
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
const dbPedidosPath = path.join(__dirname, 'banco-de-dados', 'pedidos.json');

// Rota para o cliente ver apenas os próprios pedidos
app.get('/meus-pedidos', (req, res) => {
  const usuario = req.query.usuario; // nome do usuário

  fs.readFile(dbPedidosPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler pedidos.');

    const pedidos = JSON.parse(data);
    const meusPedidos = pedidos.filter(p => p.usuario.nome === usuario);
    res.json(meusPedidos);
  });
});

// Rota para o proprietário ver todos os pedidos
app.get('/todos-pedidos', (req, res) => {
  fs.readFile(dbPedidosPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler pedidos.');
    res.json(JSON.parse(data));
  });
});
