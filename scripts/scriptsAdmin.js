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

function eliminarUser(UtilizadorID) {
    fetch(`/eliminarUser/${UtilizadorID}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao eliminar o usuário');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message); // Mensagem de sucesso da API
        atualizarTabela(); // Atualiza a tabela após a eliminação bem-sucedida
      })
      .catch(error => {
        console.error('Erro ao eliminar o usuário:', error);
        mostrarMensagemErro('Erro ao eliminar o usuário. Tente novamente.');
      });
  }

  function tornarAdmin(UtilizadorID) {
    fetch(`/TornarAdmin/${UtilizadorID}`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao tornar o usuário administrador');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message); // Mensagem de sucesso da API
        atualizarTabela(); // Atualiza a tabela após tornar o usuário administrador com sucesso
      })
      .catch(error => {
        console.error('Erro ao tornar o usuário administrador:', error);
        mostrarMensagemErro('Erro ao tornar o usuário administrador. Tente novamente.');
      });
  }
  
  
  function populateUserTable(users) {
    const tableBody = document.querySelector('#userTable tbody');
  
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.UtilizadorID}</td>
        <td>${user.Nome}</td>
        <td>${user.Email}</td>
        <td class="actions-column">
          <button class="btn-eliminar" onclick="eliminarUser(${user.UtilizadorID})">Eliminar</button>
          <button class="btn-tornar-admin" onclick="tornarAdmin(${user.UtilizadorID})">Tornar Admin</button>
        </td>
        <!-- Adicione mais colunas conforme necessário -->
      `;
      tableBody.appendChild(row);
    });
  }
  
  function atualizarTabela() {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ''; // Limpa o conteúdo atual da tabela
    fetch('/getUsers')
      .then(response => response.json())
      .then(data => {
        const users = data.users;
        populateUserTable(users);
      })
      .catch(error => {
        console.error('Erro ao obter os usuários:', error);
        mostrarMensagemErro('Erro ao atualizar a tabela de usuários.');
      });
  }
  
  function mostrarMensagemErro(message) {
    // Mostra uma mensagem de erro na interface
    const errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    // Você pode inserir essa mensagem em algum lugar visível na sua página
    document.body.appendChild(errorMessage);
  }
  
  // Inicialização: Popula a tabela de usuários
  fetch('/getUsers')
    .then(response => response.json())
    .then(data => {
      const users = data.users;
      populateUserTable(users);
    })
    .catch(error => {
      console.error('Erro ao obter os usuários:', error);
      mostrarMensagemErro('Erro ao carregar a tabela de usuários.');
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