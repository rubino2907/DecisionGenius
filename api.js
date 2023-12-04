const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./db'); // Importe a conexão do arquivo db.js

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/filmes", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/dashboardAdmin", (req, res) => {
  res.sendFile(path.join(__dirname, "DashboardAdmin.html"));
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

  connection.query('SELECT * FROM Utilizadores WHERE Email = ? AND Password = ?', [email, password], (error, results) => {
    if (error) {
      console.error('Erro ao executar a consulta:', error);
      return res.status(500).send('Erro ao realizar o login');
    }

    if (results.length > 0) {
      const user = results[0];
      if (user.isAdmin === 1) {
        res.redirect("/dashboardAdmin");
      } else {
        res.redirect('/filmes');
      }
    } else {
      return res.status(401).send('Credenciais inválidas');
    }
  });
});

app.post("/inserirDataLeagues", (req, res) => {
  const { nomeliga } = req.body;

  console.log("Dados recebidos:");
  console.log("NomeLiga:", nomeliga);

  // Validação dos dados (exemplo simples)
  if (!nomeliga ) {
    return res.status(400).send("Por favor, preencha o campos");
  }

  // Insira os dados na base de dados
  connection.query(
    'INSERT INTO ligas (NomeLiga) VALUES (?)',
    [nomeliga],
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao inserir Liga:", error);
        res.status(500).send("Erro ao registrar Liga");
      } else {
        console.log("Liga registada com sucesso!");
        res.redirect("/fmInsertData"); // Redireciona para a página de fmInsertData
      }
    }
  );
});

app.get('/ligas', (req, res) => {
  connection.query('SELECT LigaID, NomeLiga FROM Ligas', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter as ligas' });
    } else {
      res.json({ ligas: results }); // Retorna diretamente os resultados da consulta SQL
    }
  });
});

app.post("/inserirDivisao", (req, res) => {
  const { nomedivisao, ligaId } = req.body;

  console.log("Dados recebidos:");
  console.log("NomeDivisao:", nomedivisao);
  console.log("LigaID:", ligaId);

  // Validação dos dados (exemplo simples)
  if (!nomedivisao || !ligaId) {
    return res.status(400).send("Por favor, preencha todos os campos");
  }

  // Insere os dados na base de dados
  connection.query(
    'INSERT INTO Divisoes (NomeDivisao, LigaID) VALUES (?, ?)',
    [nomedivisao, ligaId],
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao inserir divisão:", error);
        res.status(500).send("Erro ao registrar a divisão");
      } else {
        console.log("Divisão registrada com sucesso!");
      }
    }
  );
});

// Rota para inserir dados do clube
app.post('/inserirDataClube', (req, res) => {
  const { nomeclube, emblemaurl, participacaoEuropeia, saldoTransferencias, dinheiroTransferencias, divisaoSelecionada } = req.body;

  console.log('Dados recebidos para inserir clube:');
  console.log('Nome do Clube:', nomeclube);
  console.log('Emblema URL:', emblemaurl);
  console.log('Participação em Competições Europeias:', participacaoEuropeia);
  console.log('Saldo para Transferências:', saldoTransferencias);
  console.log('Dinheiro Disponível para Transferências:', dinheiroTransferencias);
  console.log('Divisão:', divisaoSelecionada); // Certifique-se de que

  // Montar a query SQL para inserir dados na tabela Equipas
const query = 'INSERT INTO Equipas (NomeEquipa, EmblemaURL, ParticipacaoEuropeia, SaldoTransferencias, DinheiroTransferencias, DivisaoID) VALUES (?, ?, ?, ?, ?, ?)';

// Executar a query SQL com os dados recebidos
connection.query(query, [nomeclube, emblemaurl, participacaoEuropeia, saldoTransferencias, dinheiroTransferencias, divisaoSelecionada], (err, results) => {
  if (err) {
    console.error('Erro ao inserir dados do clube:', err);
    res.status(500).send('Erro ao inserir dados do clube');
  } else {
    console.log('Dados do clube inseridos com sucesso na tabela Equipas');
    res.status(200).send('Dados do clube inseridos com sucesso na tabela Equipas');
  }
});

});

app.get('/divisoes', (req, res) => {
  connection.query('SELECT DivisaoID, NomeDivisao FROM Divisoes', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter as divisoes' });
    } else {
      res.json({ divisoes: results }); // Retorna diretamente os resultados da consulta SQL
    }
  });
});

app.get('/equipas/:divisaoID', (req, res) => {
  const { divisaoID } = req.params;
  
  // Consulta SQL para obter as equipes da divisão especificada
  const query = 'SELECT EquipaID, DivisaoID, NomeEquipa, EmblemaURL, ParticipacaoEuropeia, SaldoTransferencias, DinheiroTransferencias FROM Equipas WHERE DivisaoID = ?';

  connection.query(query, [divisaoID], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter as equipas' });
    } else {
      res.json({ equipas: results }); // Retorna diretamente os resultados da consulta SQL
    }
  });
});

app.get('/divisoes/:ligaID', (req, res) => {
  const { ligaID } = req.params;
  
  // Consulta SQL para obter as divisões da liga especificada
  const query = 'SELECT DivisaoID, NomeDivisao FROM Divisoes WHERE LigaID = ?';

  connection.query(query, [ligaID], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter as divisões' });
    } else {
      res.json({ divisoes: results }); // Retorna diretamente os resultados da consulta SQL
    }
  });
});

