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

  function tirarAdmin(UtilizadorID) {
    fetch(`/TirarAdmin/${UtilizadorID}`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao retirar o usuário administrador');
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

function populateUserAdminTable(users) {
    const tableBody = document.querySelector('#userAdminsTableBody');
  
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.UtilizadorID}</td>
        <td>${user.Nome}</td>
        <td>${user.Email}</td>
        <td class="actions-column">
          <button class="btn-eliminar" onclick="eliminarUser(${user.UtilizadorID})">Eliminar</button>
          <button class="btn-tornar-admin" onclick="tirarAdmin(${user.UtilizadorID})">Tirar Admin</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  

  function atualizarTabela() {
    const tableBody = document.querySelector('#userAdminsTable tbody');
    tableBody.innerHTML = ''; // Limpa o conteúdo atual da tabela
    fetch('/getUserAdmin')
      .then(response => response.json())
      .then(data => {
        const users = data.users;
        populateUserAdminTable(users); // Corrigido: deve ser populateUserAdminTable
      })
      .catch(error => {
        console.error('Erro ao obter os usuários:', error);
        mostrarMensagemErro('Erro ao atualizar a tabela de usuários.');
      });
  }
  
  // Inicialização: Popula a tabela de usuários administradores
  fetch('/getUserAdmin')
    .then(response => response.json())
    .then(data => {
      const users = data.users;
      populateUserAdminTable(users); // Corrigido: deve ser populateUserAdminTable
    })
    .catch(error => {
      console.error('Erro ao obter os usuários:', error);
      mostrarMensagemErro('Erro ao carregar a tabela de usuários.');
    });
  