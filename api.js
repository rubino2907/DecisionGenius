const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); // Diretório de uploads
//routes
const profileRoutes = require('./routes/profileRoutes');
const editProfileRoute = require('./routes/editProfileRoute.js');
const fmInsertDataRoute = require('./routes/fmInsertDataRoute');
const dashboardAdminRoute = require('./routes/dashboardAdminRoute');
const aboutRoute = require('./routes/aboutRoute');
const filmesRoute = require('./routes/filmesRoute');
const fmHelperRoute = require('./routes/fmHelperRoute');
const jogoGalo = require('./routes/jogoGaloRoute');
const jogoForca = require('./routes/jogoForcaRoute');
const series = require('./routes/seriesRoute');
const seeSeries = require('./routes/seeSeriesRoute');

const path = require('path');
const connection = require('./db'); // Importe a conexão do arquivo db.js
const app = express();

// Habilitar o CORS
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// Configuração do middleware de sessão
app.use(session({
  secret: 'secreto', // Chave secreta para assinar a sessão (pode ser qualquer coisa)
  resave: false,
  saveUninitialized: false
}));

// Importe o middleware configurado para upload de arquivos
const fileUpload = require('./multerConfig');

// Utilize o middleware para processar os uploads de arquivos
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
app.use(express.static(path.join(__dirname, "images"))); // Servir arquivos estáticos na rota '/images'
app.use(express.urlencoded({ extended: true })); // Middleware para lidar com dados do formulário

app.get("/", (req, res) => {
  res.render('home');
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "registo.html"));
});

//Routesssssssssss
app.use(profileRoutes);
app.use(editProfileRoute);
app.use(fmInsertDataRoute);
app.use(dashboardAdminRoute);
app.use(aboutRoute);
app.use(filmesRoute);
app.use(fmHelperRoute);
app.use(jogoGalo);
app.use(jogoForca);
app.use(series);
app.use(seeSeries);

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, '192.168.1.21', () => {
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
        res.redirect("/login"); // Redireciona para a página de login
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

      console.log('UtilizadorID:', user.UtilizadorID);

      // Verifica se o usuário é um administrador (isAdmin igual a 1)
      if (user.isAdmin === 1) {
        // Dentro da rota de login, após verificar as credenciais e determinar que o login é bem-sucedido:
        req.session.user = {
          UtilizadorID: user.UtilizadorID,
          Nome: user.Nome,
          Email: user.Email,
          isAdmin: user.isAdmin
        };
        // Redireciona para a rota da DashboardAdmin se o usuário for um administrador
        res.redirect('/dashboardAdmin');
      } else {
        // Se não for administrador, armazene os detalhes do usuário na sessão e redirecione para o perfil
        req.session.user = {
          UtilizadorID: user.UtilizadorID,
          Nome: user.Nome,
          Email: user.Email,
          isAdmin: user.isAdmin
        };
        res.redirect('/profile');
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

//USERSSSSSSSSSSSSSSSSSS
app.get('/getUsers', (req, res) => {
  connection.query('SELECT UtilizadorID, Nome, Email FROM Utilizadores', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter as users' });
    } else {
      res.json({ users: results }); // Retorna diretamente os resultados da consulta SQL
    }
  });
});

// Configuração de uma rota para eliminar um usuário pelo UtilizadorID
app.delete('/eliminarUser/:UtilizadorID', (req, res) => {
  const { UtilizadorID } = req.params;

  // Aqui você usaria o UtilizadorID para eliminar o usuário do seu banco de dados
  // Por exemplo:
  connection.query('DELETE FROM Utilizadores WHERE UtilizadorID = ?', UtilizadorID, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao eliminar o usuário' });
    } else {
      res.status(200).json({ message: 'Usuário eliminado com sucesso' });
    }
  });
});

// Configuração de uma rota para tornar um usuário administrador pelo UtilizadorID
app.put('/TornarAdmin/:UtilizadorID', (req, res) => {
  const { UtilizadorID } = req.params;

  // Query para atualizar o status isAdmin para 1 para o usuário com o UtilizadorID fornecido
  connection.query('UPDATE Utilizadores SET isAdmin = 1 WHERE UtilizadorID = ?', UtilizadorID, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao tornar o usuário administrador' });
    } else {
      res.status(200).json({ message: 'Usuário tornou-se administrador com sucesso' });
    }
  });
});

// Configuração de uma rota para tornar um usuário administrador pelo UtilizadorID
app.put('/TirarAdmin/:UtilizadorID', (req, res) => {
  const { UtilizadorID } = req.params;

  // Query para atualizar o status isAdmin para 1 para o usuário com o UtilizadorID fornecido
  connection.query('UPDATE Utilizadores SET isAdmin = 0 WHERE UtilizadorID = ?', UtilizadorID, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao tornar o usuário administrador' });
    } else {
      res.status(200).json({ message: 'Usuário tornou-se administrador com sucesso' });
    }
  });
});

app.get('/getUserAdmin', (req, res) => {
  connection.query('SELECT UtilizadorID, Nome, Email FROM Utilizadores WHERE isAdmin = 1', (error, results) => {
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







