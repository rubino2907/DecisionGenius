var playchar = "X";
var terminado = 0;
/* terminado = 1 vitória
   terminado = 3 se jogo empatado */

var jogo = [[], [], []];
var pcplay;
var pcchar;
var huchar;
var jogovetor = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var pcpontuacao = 0;
var hupontuacao = 0;
const celulas = document.querySelectorAll(".btnarea");
const combinacoes = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

function bloqueiajogo() {
  for (var i = 0; i < celulas.length; i++) {
    celulas[i].disabled = true;
  }
}

function changeplaychar() {
  if (playchar == "X") playchar = "O";
  else playchar = "X";
}

function DefineBorderColuna(linha, tipoborder) {
  document.getElementById("btnA" + linha).style.border = tipoborder;
  document.getElementById("btnB" + linha).style.border = tipoborder;
  document.getElementById("btnC" + linha).style.border = tipoborder;
}

function DefineBorderLinha(linha, tipoborder) {
  document.getElementById("btn" + linha + "A").style.border = tipoborder;
  document.getElementById("btn" + linha + "B").style.border = tipoborder;
  document.getElementById("btn" + linha + "C").style.border = tipoborder;
}

function espacosbrancos() {
  return jogovetor.filter(s => typeof s == "number");
}

function MostraResultado(texto) {
  document.getElementById("jogoacabadomax").style.display = "flex";
  document.getElementById("jogoacabado").innerHTML = texto;
  bloqueiajogo();
}

function fazTabuleiro() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      jogo[i][j] = "";
    }
  }
  document.getElementById("piecetype").style.display = "none";
  document.getElementById("areaJogo").style.display = "flex";
  document.getElementById("idTitle").style.display = "none";
  for (i = 0; i < celulas.length; i++) {
    celulas[i].innerHTML = "";
    celulas[i].disabled = false;
    celulas[i].style.border = "1px solid #7394FF";
  }
}

function ganhou() {
  /* verifica colunas */
  for (var i = 0; i < 3; i++) {
    if (jogo[0][i] == jogo[1][i] && jogo[1][i] == jogo[2][i]) {
      if (jogo[0][i] == "X" || jogo[0][i] == "O") {
        terminado = 1;
        if (i === 0) {
          DefineBorderColuna("A", "thick solid red");
        } else if (i == 1) {
          DefineBorderColuna("B", "thick solid red");
        } else if (i == 2) {
          DefineBorderColuna("C", "thick solid red");
        }
        return;
      }
    }
  }
  /* verifica linhas */
  for (i = 0; i < 3; i++) {
    if (jogo[i][0] == jogo[i][1] && jogo[i][1] == jogo[i][2]) {
      if (jogo[i][0] == "X" || jogo[i][0] == "O") {
        if (i === 0) {
          DefineBorderLinha("A", "thick solid red");
        } else if (i == 1) {
          DefineBorderLinha("B", "thick solid red");
        } else if (i == 2) {
          DefineBorderLinha("C", "thick solid red");
        }
        terminado = 1;
        return;
      }
    }
  }
  /* verifica diagonal principal */
  if (jogo[0][0] == jogo[1][1] && jogo[1][1] == jogo[2][2]) {
    if (jogo[0][0] == "X" || jogo[0][0] == "O") {
      terminado = 1;
      document.getElementById("btnAA").style.border = "thick solid red";
      document.getElementById("btnBB").style.border = "thick solid red";
      document.getElementById("btnCC").style.border = "thick solid red";
      return;
    }
  }
  /* verifica diagonal secundária */
  if (jogo[2][0] == jogo[1][1] && jogo[1][1] == jogo[0][2]) {
    if (jogo[2][0] == "X" || jogo[2][0] == "O") {
      terminado = 1;
      document.getElementById("btnAC").style.border = "thick solid red";
      document.getElementById("btnBB").style.border = "thick solid red";
      document.getElementById("btnCA").style.border = "thick solid red";
      return;
    }
  }
  /* verifica se jogo empatado */
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      if (jogo[i][j] === "") {
        return;
      } else if (i >= 2 && j >= 2) {
        terminado = 3;
      }
    }
  }
}

function ganhoupossivel(jogoaux, jogador) {
  let jogadas = jogoaux.reduce(
    (a, e, i) => (e === jogador ? a.concat(i) : a),
    []
  );
  let jogoganho = null;
  for (let [index, vitoria] of combinacoes.entries()) {
    if (vitoria.every(elem => jogadas.indexOf(elem) > -1)) {
      jogoganho = { index: index, jogador: jogador };
      break;
    }
  }
  return jogoganho;
}

function MelhorJogada() {
  //transformar tabuleiro num vetor
  var auxposicao = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (jogo[i][j] == "X" || jogo[i][j] == "O") {
        jogovetor[auxposicao] = jogo[i][j];
      }
      auxposicao++;
    }
  }
  var posicao = minimax(jogovetor, pcchar).index;
  switch (posicao) {
    case 0:
      linha = 0;
      coluna = 0;
      break;
    case 1:
      linha = 0;
      coluna = 1;
      break;
    case 2:
      linha = 0;
      coluna = 2;
      break;
    case 3:
      linha = 1;
      coluna = 0;
      break;
    case 4:
      linha = 1;
      coluna = 1;
      break;
    case 5:
      linha = 1;
      coluna = 2;
      break;
    case 6:
      linha = 2;
      coluna = 0;
      break;
    case 7:
      linha = 2;
      coluna = 1;
      break;
    case 8:
      linha = 2;
      coluna = 2;
      break;
  }
  jogo[linha][coluna] = playchar;
  var idbotao = "btn";
  switch (linha) {
    case 0:
      idbotao += "A";
      break;
    case 1:
      idbotao += "B";
      break;
    case 2:
      idbotao += "C";
      break;
  }
  switch (coluna) {
    case 0:
      idbotao += "A";
      break;
    case 1:
      idbotao += "B";
      break;
    case 2:
      idbotao += "C";
      break;
  }
  document.getElementById(idbotao).innerHTML = playchar;
  document.getElementById(idbotao).disabled = true;
  ganhou();
}

function minimax(jogoatual, jogador) {
  var escolhaspossiveis = espacosbrancos();
  if (ganhoupossivel(jogoatual, huchar)) {
    return { resultado: -10 };
  } else if (ganhoupossivel(jogoatual, pcchar)) {
    return { resultado: 10 };
  } else if (escolhaspossiveis.length === 0) {
    return { resultado: 0 };
  }
  var movimentos = [];
  for (var i = 0; i < escolhaspossiveis.length; i++) {
    var movimento = {};
    movimento.index = jogoatual[escolhaspossiveis[i]];
    jogoatual[escolhaspossiveis[i]] = jogador;
    var res;
    if (jogador == pcchar) {
      res = minimax(jogoatual, huchar);
      movimento.resultado = res.resultado;
    } else {
      res = minimax(jogoatual, pcchar);
      movimento.resultado = res.resultado;
    }
    jogoatual[escolhaspossiveis[i]] = movimento.index;
    movimentos.push(movimento);
  }
  var melhorjogada;
  var melhorpontuacao;
  if (jogador === pcchar) {
    melhorpontuacao = -10000;
    for (i = 0; i < movimentos.length; i++) {
      if (movimentos[i].resultado > melhorpontuacao) {
        melhorpontuacao = movimentos[i].resultado;
        melhorjogada = i;
      }
    }
  } else {
    melhorpontuacao = 10000;
    for (i = 0; i < movimentos.length; i++) {
      if (movimentos[i].resultado < melhorpontuacao) {
        melhorpontuacao = movimentos[i].resultado;
        melhorjogada = i;
      }
    }
  }
  return movimentos[melhorjogada];
}

function oneplayer() {
  pcplayer = true;
  document.getElementById("gametype").style.display = "none";
  document.getElementById("piecetype").style.display = "flex";
  document.getElementById("idTitle").innerHTML = "X ou O?";
}

function pieceO() {
  playchar = "X";
  fazTabuleiro();
  document.getElementById("divpontuacao").style.display = "flex";
  document.getElementById("pontuacaoX").innerHTML = "PC: " + pcpontuacao;
  document.getElementById("pontuacaoO").innerHTML = "VOCÊ: " + hupontuacao;
  pcchar = "X";
  huchar = "O";
  if (pcplayer) {
    //numero aleatorio entre 0 e 3
    var casa = Math.floor((Math.random() * 3));
    switch (casa) {
      case 0:
        jogo[0][0] = "X";
        document.getElementById("btnAA").innerHTML = playchar;
        document.getElementById("btnAA").disabled = true;
        break;
      case 1:
        jogo[0][2] = "X";
        document.getElementById("btnAC").innerHTML = playchar;
        document.getElementById("btnAC").disabled = true;
        break;
      case 2:
        jogo[2][0] = "X";
        document.getElementById("btnCA").innerHTML = playchar;
        document.getElementById("btnCA").disabled = true;
        break;
      case 2:
        jogo[2][2] = "X";
        document.getElementById("btnCC").innerHTML = playchar;
        document.getElementById("btnCC").disabled = true;
        break;
    }
    /*   playComputer();*/
    changeplaychar();
  } else {
    document.getElementById("pontuacaoX").innerHTML =
      "JOGADOR X: " + pcpontuacao;
    document.getElementById("pontuacaoO").innerHTML =
      "JOGADOR O: " + hupontuacao;
  }
}

function pieceX() {
  playchar = "X";
  fazTabuleiro();
  document.getElementById("divpontuacao").style.display = "flex";
  pcchar = "X";
  huchar = "O";
  if (pcplayer) {
    document.getElementById("pontuacaoX").innerHTML = "VOCÊ: " + pcpontuacao;
    document.getElementById("pontuacaoO").innerHTML = "PC: " + hupontuacao;
  } else {
    document.getElementById("pontuacaoX").innerHTML =
      "JOGADOR X: " + pcpontuacao;
    document.getElementById("pontuacaoO").innerHTML =
      "JOGADOR O: " + hupontuacao;
  }
}

function play(row, col) {
  var idbotao = "btn" + row + col;
  document.getElementById(idbotao).innerHTML = playchar;
  document.getElementById(idbotao).disabled = true;
  var linha, coluna;
  switch (row) {
    case "A":
      linha = 0;
      break;
    case "B":
      linha = 1;
      break;
    case "C":
      linha = 2;
      break;
  }
  switch (col) {
    case "A":
      coluna = 0;
      break;
    case "B":
      coluna = 1;
      break;
    case "C":
      coluna = 2;
      break;
  }
  jogo[linha][coluna] = playchar;
  ganhou();
  if (terminado === 0) {
    if (pcplayer) {
      changeplaychar();
      playComputer();
    }
  }
  if (terminado == 1) {
    MostraResultado("Ganhou " + playchar);
    if (playchar == huchar) {
      hupontuacao++;
    } else if (playchar == pcchar) {
      pcpontuacao++;
    }
  } else if (terminado == 3) {
    MostraResultado("Jogo Empatado");
  }
  atualizapontuacao();
  changeplaychar();
}

function atualizapontuacao() {
  if (pcplayer) {
    document.getElementById("pontuacaoX").innerHTML = "PC: " + pcpontuacao;
    document.getElementById("pontuacaoO").innerHTML = "VOCÊ: " + hupontuacao;
  } else {
    document.getElementById("pontuacaoX").innerHTML =
      "JOGADOR X: " + pcpontuacao;
    document.getElementById("pontuacaoO").innerHTML =
      "JOGADOR O: " + hupontuacao;
  }
}

function playComputer() {
  if (terminado != 3) {
    MelhorJogada();
  }
}

function refrescar() {
  document.getElementById("idTitle").style.display = "flex";
  document.getElementById("idTitle").innerHTML = "Tipo de Jogo";
  document.getElementById("gametype").style.display = "flex";
  document.getElementById("piecetype").style.display = "none";
  document.getElementById("areaJogo").style.display = "none";
  terminado = 0;
  document.getElementById("piecetype").style.display = "none";
  document.getElementById("jogoacabadomax").style.display = "none";
  for (var i = 0; i < 9; i++) jogovetor[i] = i;
  pcpontuacao = 0;
  hupontuacao = 0;
}

function refrescarjogo() {
  terminado = 0;
  document.getElementById("jogoacabadomax").style.display = "none";
  for (var i = 0; i < 9; i++) jogovetor[i] = i;
  fazTabuleiro();
  if (pcplayer) {
    playchar = "X";
    //numero aleatorio entre 0 e 3
    var casa = Math.floor(Math.random() * 3);
    switch (casa) {
      case 0:
        jogo[0][0] = "X";
        document.getElementById("btnAA").innerHTML = playchar;
        document.getElementById("btnAA").disabled = true;
        break;
      case 1:
        jogo[0][2] = "X";
        document.getElementById("btnAC").innerHTML = playchar;
        document.getElementById("btnAC").disabled = true;
        break;
      case 2:
        jogo[2][0] = "X";
        document.getElementById("btnCA").innerHTML = playchar;
        document.getElementById("btnCA").disabled = true;
        break;
      case 2:
        jogo[2][2] = "X";
        document.getElementById("btnCC").innerHTML = playchar;
        document.getElementById("btnCC").disabled = true;
        break;
    }
    /*   playComputer();*/
    changeplaychar();
  } else {
    playchar = "X";
  }
}

function twoplayer() {
  pcplayer = false;
  document.getElementById("gametype").style.display = "none";
  document.getElementById("piecetype").style.display = "flex";
  document.getElementById("idTitle").innerHTML = "First player: X ou O?";
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/getUserDetails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Detalhes do usuário recebidos:', data);
  
      // Obtém o UtilizadorID do usuário
      const userID = data.UtilizadorID;
  
      // Chama a função para carregar a imagem do usuário usando o UtilizadorID
      loadUserImage(userID);
    })
    .catch(error => {
      console.error('Erro ao obter os detalhes do usuário:', error);
    });
  });

  function loadUserImage(userID) {
    fetch(`/getUserImage/${userID}`)
      .then(response => response.json())
      .then(data => {
        let imagePath = data.imagePath;
        imagePath = imagePath.replace(/\\/g, '/'); // Substituir barras invertidas por barras normais
  
        const userImage = document.getElementById('userImage');
        userImage.src = imagePath; // Define o caminho da imagem do usuário
      })
      .catch(error => {
        console.error('Erro ao carregar a imagem:', error);
      });
  }
  