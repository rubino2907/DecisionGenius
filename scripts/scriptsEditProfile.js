document.addEventListener('DOMContentLoaded', function() {
  // Busca os detalhes do usuário para preencher o campo de nome antigo
  fetch('/getUserDetails', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const usernameField = document.getElementById('username');
    usernameField.innerText = data.nome || 'Nome do Usuário';
  })
  .catch(error => {
    console.error('Erro ao obter os detalhes do usuário:', error);
  });

  const profileForm = document.getElementById('profileForm');
  const avatarInput = document.getElementById('avatar');
  const avatarPreview = document.getElementById('avatarPreview');

  avatarInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        avatarPreview.style.display = 'block';
        avatarPreview.src = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  });

  profileForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
  
    // Obter o UtilizadorID
    fetch('/getUserDetails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const userId = data.UtilizadorID; // Obtém o UtilizadorID do objeto retornado
  
      // Verifique se os dados estão corretamente presentes no formData antes do envio
      console.log('Dados do formulário antes de enviar:', formData);
  
      // Enviar a requisição para a rota de atualização do perfil no servidor
      return fetch(`/updateProfile/${userId}`, {
        method: 'PUT',
        body: formData
      });
    })
    .then(response => {
      if (response.ok) {
        // Se a atualização for bem-sucedida, redireciona para a página do perfil
        window.location.href = '/profile';
      } else {
        // Se houver um erro na atualização, exibe uma mensagem de erro
        console.error('Erro ao atualizar o perfil');
        alert('Erro ao atualizar o perfil. Tente novamente.');
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Ocorreu um erro. Tente novamente mais tarde.');
    });
  
    // Limpar o formulário após enviar os dados (remover esta parte)
    // this.reset();
    // avatarPreview.style.display = 'none';
    // avatarPreview.src = '#'; // Limpar a imagem do preview
  });
});
