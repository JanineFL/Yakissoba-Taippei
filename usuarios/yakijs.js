app.post('/registrar', (req, res) => {
  const novoUsuario = req.body;
  const dbPath = path.join(__dirname, 'banco-de-dados', 'db.json');

  fs.readFile(dbPath, 'utf-8', (err, data) => {
    if (err) {
      console.error("Erro ao ler o banco:", err);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }

    let usuarios = [];
    try {
      usuarios = JSON.parse(data);
    } catch {
      usuarios = [];
    }

    // Verifica se o usuário já existe (por nome ou email)
    const existe = usuarios.find(u =>
      u.email === novoUsuario.email ||
      u.nome.toLowerCase() === novoUsuario.nome.toLowerCase()
    );

    if (existe) {
      console.log("Tentativa de cadastro duplicado:", novoUsuario);
      return res.status(400).json({ erro: 'Cadastro já existe. Faça login.' });
    }

    // Adiciona novo usuário
    usuarios.push(novoUsuario);
    console.log("Usuário a ser salvo:", novoUsuario);

    fs.writeFile(dbPath, JSON.stringify(usuarios, null, 2), err => {
      if (err) {
        console.error("Erro ao salvar:", err);
        return res.status(500).json({ erro: 'Erro ao salvar o usuário.' });
      }

      console.log("Usuário salvo com sucesso!");
      res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
    });
  });
});


