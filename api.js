const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "styles"))); // Servir arquivos estáticos na rota '/styles'
app.use(express.static(path.join(__dirname, "scripts"))); // Servir arquivos estáticos na rota '/styles'

// Rota para a página de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Rota para verificar o login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    res.status(200).send("Login bem-sucedido");
  } else {
    res.status(401).send("Nome de usuário ou senha incorretos");
  }
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
