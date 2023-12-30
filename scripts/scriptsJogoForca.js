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

let selectedWord = "";
let guessedWord = "";
let guessesLeft = 6;
let guessedLetters = [];

function startGame() {
  selectedWord = document.getElementById("wordInput").value.toLowerCase();

  if (selectedWord.length > 0 && /^[a-zA-Z]+$/.test(selectedWord)) {
    guessedWord = "_".repeat(selectedWord.length);
    displayWord();
    resetGame();
  } else {
    alert("Por favor, insira uma palavra válida.");
  }
  // Esconder a seção de inserção da palavra
  document.getElementById("wordInputSection").style.display = "none";
}

function displayWord() {
  document.getElementById("wordDisplay").textContent = guessedWord.split("").join(" ");
}

function updateGuessesLeft() {
  document.getElementById("guessesLeft").textContent = guessesLeft;
}

function updateGuessedLetters() {
  document.getElementById("guessedLetters").textContent = guessedLetters.join(", ");
}

function guessLetter() {
  let letter = document.getElementById("letterInput").value.toLowerCase();

  if (letter.length === 1 && letter.match(/[a-z]/)) {
    if (guessedLetters.includes(letter)) {
      alert("Você já tentou essa letra. Tente outra.");
    } else {
      guessedLetters.push(letter);
      updateGuessedLetters();

      let letterIndices = [];
      for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === letter) {
          letterIndices.push(i);
        }
      }

      if (letterIndices.length > 0) {
        letterIndices.forEach(index => {
          guessedWord = guessedWord.substring(0, index) + letter + guessedWord.substring(index + 1);
        });

        displayWord();
      } else {
        guessesLeft--;
        updateGuessesLeft();
      }

      checkGameStatus();
    }
  } else {
    alert("Por favor, insira uma letra válida.");
  }

  document.getElementById("letterInput").value = "";
}

function checkGameStatus() {
  if (guessesLeft === 0) {
    alert("Você perdeu! A palavra era: " + selectedWord);
    resetGame();
  } else if (!guessedWord.includes("_")) {
    alert("Parabéns! Você ganhou!");
    resetGame();
  }
}

function resetGame() {
  guessedWord = "_".repeat(selectedWord.length);
  guessesLeft = 6;
  guessedLetters = [];

  displayWord();
  updateGuessesLeft();
  updateGuessedLetters();

  // Mostrar a seção de inserção da palavra ao reiniciar o jogo
  document.getElementById("wordInputSection").style.display = "block";
  // Limpar os campos de entrada de letras
  document.getElementById("letterInput").value = "";
}
  
// Inicializar o jogo
displayWord();
updateGuessesLeft();

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
