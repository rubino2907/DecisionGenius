const express = require('express');
const path = require('path');
const connection = require('./db'); // Importe a conexão do arquivo db.js

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "styles"))); // Servir arquivos estáticos na rota '/styles'
app.use(express.static(path.join(__dirname, "scripts"))); // Servir arquivos estáticos na rota '/scripts'
app.use(express.urlencoded({ extended: true })); // Middleware para lidar com dados do formulário

// Rota para a página de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "registo.html"));
});

// Rota protegida - verifica se o usuário está autenticado antes de redirecionar para a página fmInsertData.html
app.get("/InserirLeagues", (req, res) => {
  // Aqui você pode adicionar lógica para verificar se o usuário está autenticado
  // Por exemplo, verificar se o usuário está logado ou se possui um token válido

  // Supondo que o usuário esteja autenticado, redirecione para a página fmInsertData.html
  res.sendFile(path.join(__dirname, "fmInsertData.html"));
});

app.get("/fmHelper", (req, res) => {
  res.sendFile(path.join(__dirname, "fmHelper.html"));
});

app.get("/fmInsertData", (req, res) => {
  res.sendFile(path.join(__dirname, "fmInsertData.html"));
});
app.get("/filmes", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/createLeague", (req, res) => {
  console.log(req.body);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});


app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  console.log("Dados recebidos:");
  console.log("Username:", username);
  console.log("Email:", email);
  console.log("Password:", password);

  // Validação dos dados (exemplo simples)
  if (!username || !email || !password) {
    return res.status(400).send("Por favor, preencha todos os campos");
  }

  // Verificação do formato de email (exemplo simples)
  if (!validateEmail(email)) {
    return res.status(400).send("Formato de email inválido");
  }

  // Insira os dados na base de dados
  connection.query(
    'INSERT INTO utilizadores (Nome, Email, Password) VALUES (?, ?, ?)',
    [username, email, password],
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao inserir usuário:", error);
        res.status(500).send("Erro ao registrar usuário");
      } else {
        console.log("Usuário registrado com sucesso!");
        res.redirect("/"); // Redireciona para a página de login
      }
    }
  );
});



// Função para validação de email (exemplo simples)
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Dados recebidos para login:');
  console.log('Email:', email);
  console.log('Password:', password);

  if (!email || !password) {
    return res.status(400).send('Por favor, informe o email e a senha');
  }

  connection.query('SELECT * FROM utilizadores WHERE Email = ? AND Password = ?', [email, password], (error, results) => {
    if (error) {
      console.error('Erro ao executar a consulta:', error);
      return res.status(500).send('Erro ao realizar o login');
    }

    if (results.length > 0) {
      res.status(200).send('Login bem-sucedido');
    } else {
      res.status(401).send('Tenta De Novo');
    }
  });
});

