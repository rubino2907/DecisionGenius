const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); // Diretório de uploads
const path = require('path');
const connection = require('./db'); // Importe a conexão do arquivo db.js
const app = express();

// Configuração do middleware de sessão
app.use(session({
  secret: 'secreto', // Chave secreta para assinar a sessão (pode ser qualquer coisa)
  resave: false,
  saveUninitialized: false
}));

// Diretório de uploads
const uploadDestination = './uploads/';
if (!fs.existsSync(uploadDestination)) {
  fs.mkdirSync(uploadDestination);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDestination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // Limite de 5MB
}).single('avatar'); // 'avatar' é o nome do campo do formulário onde o arquivo será enviado

// Usando o middleware de upload
app.post('/upload', (req, res) => {
  fileUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Ocorreu um erro do Multer ao fazer o upload
      return res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
    } else if (err) {
      // Outro tipo de erro
      return res.status(500).json({ error: 'Ocorreu um erro' });
    }

    // Arquivo enviado com sucesso
    res.send('Arquivo enviado com sucesso!');
  });
});

// Configuração da rota estática para servir arquivos, como imagens
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // Define o mecanismo de visualização como EJS
app.set('views', path.join(__dirname, 'views')); // Define o diretório 'views' para os modelos

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

app.get('/profile', (req, res) => {
  const user = req.session.user;

  if (user) {
    // Acesso aos detalhes do usuário na sessão, incluindo UtilizadorID
    res.render('profile', {
      UtilizadorID: user.UtilizadorID,
      nome: user.Nome,
      email: user.Email
    });
  } else {
    res.redirect('/');
  }
});

// Rota '/editProfile' também pode ser ajustada da mesma forma
app.get('/editProfile', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.render('editProfile', {
      UtilizadorID: user.UtilizadorID,
      nome: user.Nome,
      email: user.Email
    });
  } else {
    res.redirect('/');
  }
});

// Rota '/editProfile' também pode ser ajustada da mesma forma
app.get('/fmInsertData', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.render('fmInsertData', {
      UtilizadorID: user.UtilizadorID,
      nome: user.Nome,
      email: user.Email
    });
  } else {
    res.redirect('/');
  }
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

// Rota para o processo de login
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

      console.log('UtilizadorID:', user.UtilizadorID);
      // Após a verificação do login ser bem-sucedida, armazene os detalhes do usuário na sessão
      req.session.user = {
        UtilizadorID: user.UtilizadorID,
        Nome: user.Nome,
        Email: user.Email
      };
      res.redirect('/profile');
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

app.get('/getUsers', (req, res) => {
  connection.query('SELECT UtilizadorID, Nome, Email FROM Utilizadores', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter as users' });
    } else {
      res.json({ users: results }); // Retorna diretamente os resultados da consulta SQL
    }
  });
});

app.get('/getUserDetails', (req, res) => {
  // Recupera os detalhes do usuário da sessão
  const user = req.session.user;

  if (user) {
    // Se houver detalhes do usuário na sessão, envie esses detalhes como resposta em formato JSON
    res.json({ UtilizadorID: user.UtilizadorID, nome: user.Nome, email: user.Email });
  } else {
    // Se não houver detalhes do usuário na sessão, retorne um objeto vazio ou um erro
    res.status(404).json({ error: 'Detalhes do usuário não encontrados' });
  }
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

app.post('/inserirDataClube', upload.single('avatar'), (req, res) => {
  const { nomeclube, participacaoEuropeia, saldoTransferencias, dinheiroTransferencias, divisaoSelecionada } = req.body;
  const emblemaPath = req.file ? req.file.path : null; // Caminho do emblema, se fornecido

  console.log('Dados recebidos para inserir clube:');
  console.log('Nome do Clube:', nomeclube);
  console.log('Participação em Competições Europeias:', participacaoEuropeia);
  console.log('Saldo para Transferências:', saldoTransferencias);
  console.log('Dinheiro Disponível para Transferências:', dinheiroTransferencias);
  console.log('Divisão:', divisaoSelecionada);
  console.log('Caminho do Emblema:', emblemaPath);

  // Montar a query SQL para inserir dados na tabela de Equipas
  let query = 'INSERT INTO Equipas (NomeEquipa, ParticipacaoEuropeia, SaldoTransferencias, DinheiroTransferencias, DivisaoID, EmblemaURL) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nomeclube, participacaoEuropeia, saldoTransferencias, dinheiroTransferencias, divisaoSelecionada, emblemaPath];

  console.log('Query:', query);
  console.log('Valores:', values);

  // Executar a query no banco de dados
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Erro ao inserir dados do clube:', error);
      res.status(500).send('Erro ao inserir dados do clube');
    } else {
      console.log('Dados do clube inseridos com sucesso na tabela Equipas');
      res.status(200).send('Dados do clube inseridos com sucesso na tabela Equipas');
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

app.put('/updateProfile/:userId', upload.single('avatar'), (req, res) => {
  const userId = req.params.userId;
  const { name } = req.body; // Novo nome do usuário
  const avatarPath = req.file ? req.file.path : null; // Caminho da nova imagem de perfil, se fornecida

  console.log('Dados recebidos para atualização:');
  console.log('userID:', userId);
  console.log('Novo Nome:', name);
  console.log('Caminho da Nova Imagem:', avatarPath);

  // Atualização do nome e/ou imagem do usuário na base de dados
  let query = 'UPDATE utilizadores SET ';
  const values = [];

  if (name) {
    query += 'Nome = ?, ';
    values.push(name);
  }

  if (avatarPath) {
    query += 'ImagemPerfil = ?, ';
    values.push(avatarPath);
  }

  // Verifica se nem o nome nem a imagem foram fornecidos
  if (!name && !avatarPath) {
    return res.status(400).send('Por favor, forneça o novo nome e/ou imagem');
  }

  // Remove a última vírgula e finaliza a query
  query = query.slice(0, -2);
  query += ' WHERE UtilizadorID = ?';
  values.push(userId);

  console.log('Query:', query);
  console.log('Valores:', values);

  // Executa a query no banco de dados
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Erro ao atualizar o perfil:', error);
      res.status(500).send('Erro ao atualizar o perfil');
    } else {
      console.log('Perfil do usuário atualizado com sucesso!');
      res.status(200).send('Perfil do usuário atualizado com sucesso!');
    }
  });
});

app.get('/getUserImage/:userID', (req, res) => {
  const userID = req.params.userID;

  // Consulta SQL para obter o caminho da imagem do usuário com base no UtilizadorID
  const sql = 'SELECT ImagemPerfil FROM Utilizadores WHERE UtilizadorID = ?';

  connection.query(sql, [userID], (error, results) => {
    if (error) {
      console.error('Erro ao buscar a imagem do perfil:', error);
      res.status(500).json({ error: 'Erro ao buscar a imagem do perfil' });
    } else {
      if (results.length > 0) {
        const imagePath = results[0].ImagemPerfil;

        // Se houver um caminho de imagem associado ao usuário, retorne-o
        res.json({ imagePath });
      } else {
        // Se o UtilizadorID não for encontrado, retorne um erro ou um valor padrão
        res.status(404).json({ error: 'Utilizador não encontrado' });
      }
    }
  });
});







