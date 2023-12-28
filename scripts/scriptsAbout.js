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

  // Atualize a função loadUserImage
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