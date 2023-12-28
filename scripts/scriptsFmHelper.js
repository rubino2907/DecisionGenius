// Funções independentes para carregar ligas e divisões
async function carregarLigas() {
  const selectElement = document.getElementById('ligas');

  try {
    const response = await fetch('http://127.0.0.1:3000/ligas');
    const data = await response.json();

    selectElement.innerHTML = '<option value="">Selecione Liga</option>'; // Adiciona a opção "Selecione Liga" no início

    data.ligas.forEach(liga => {
      const option = document.createElement('option');
      option.value = liga.LigaID;
      option.textContent = liga.NomeLiga;
      selectElement.appendChild(option);
    });

  } catch (error) {
    console.error('Erro ao carregar as ligas:', error);
    selectElement.innerHTML = '<option value="all">Erro ao carregar as ligas</option>';
  }
}


window.onload = async () => {
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

  await carregarLigas();

  const ligasSelect = document.getElementById('ligas');
  ligasSelect.addEventListener('change', async () => {
    const selectedLeague = ligasSelect.value;
    await carregarDivisoes(selectedLeague);
  });

  const divisoesSelect = document.getElementById('divisoes');
  divisoesSelect.addEventListener('change', async () => {
    const selectedDivision = divisoesSelect.value;
    if (selectedDivision !== '') {
      try {
        const response = await fetch(`http://127.0.0.1:3000/equipas/${selectedDivision}`);
        const data = await response.json();
        displayTeams(data.equipas);
      } catch (error) {
        console.error('Erro ao carregar as equipes:', error);
      }
    }
  });

  const randomTeamButton = document.getElementById('randomTeamButton');
  randomTeamButton.addEventListener('click', async () => {
    const selectedDivision = divisoesSelect.value;
    if (selectedDivision !== '') {
      try {
        const response = await fetch(`http://127.0.0.1:3000/equipas/${selectedDivision}`);
        const data = await response.json();
        const teams = data.equipas;

        const randomIndex = Math.floor(Math.random() * teams.length);
        const randomTeam = teams[randomIndex];
        
        displayRandomTeam(randomTeam);
      } catch (error) {
        console.error('Erro ao carregar as equipes:', error);
      }
    }
  });
  
};

async function carregarDivisoes(idLiga) {
  const selectElement = document.getElementById('divisoes');

  try {
    const response = await fetch(`http://127.0.0.1:3000/divisoes/${idLiga}`);
    const data = await response.json();

    selectElement.innerHTML = '<option value="">Selecione Divisão</option>'; // Adiciona a opção "Selecione Divisão" no início

    data.divisoes.forEach(divisao => {
      const option = document.createElement('option');
      option.value = divisao.DivisaoID;
      option.textContent = divisao.NomeDivisao;
      selectElement.appendChild(option);
    });

  } catch (error) {
    console.error('Erro ao carregar as divisões:', error);
    selectElement.innerHTML = '<option value="">Erro ao carregar as divisões</option>';
  }
}


function displayTeams(teams) {
  const teamsContainer = document.getElementById('teamsList');
  teamsContainer.innerHTML = ''; // Limpa o conteúdo antes de exibir as novas equipes

  teams.forEach(team => {
    const teamContainer = document.createElement('div');
    teamContainer.classList.add('team');

    const badge = document.createElement('div');
    badge.classList.add('team-badge');

    if (team.EmblemaURL) {
      const img = document.createElement('img');
      img.src = team.EmblemaURL;
      img.alt = 'Emblema do Clube';

      // Definindo o tamanho da imagem (largura e altura)
      img.style.width = '250px'; // Adapte o tamanho conforme necessário
      img.style.height = '250px'; // Adapte o tamanho conforme necessário

      badge.appendChild(img);
    } else {
      badge.textContent = 'Emblema não disponível';
    }

    const teamInfo = document.createElement('div');
    teamInfo.classList.add('team-info');

    const teamName = document.createElement('p');
    teamName.textContent = 'Nome: ' + team.NomeEquipa;

    const participation = document.createElement('p');
    participation.textContent = 'Participação Europeia: ' + team.ParticipacaoEuropeia;

    const transferBalance = document.createElement('p');
    transferBalance.textContent = 'Saldo de Transf: ' + team.SaldoTransferencias;

    const transferMoney = document.createElement('p');
    transferMoney.textContent = 'Dinheiro para Transf: ' + team.DinheiroTransferencias;

    teamInfo.appendChild(teamName);
    teamInfo.appendChild(participation);
    teamInfo.appendChild(transferBalance);
    teamInfo.appendChild(transferMoney);

    teamContainer.appendChild(badge);
    teamContainer.appendChild(teamInfo);

    teamsContainer.appendChild(teamContainer);
  });
}

function displayRandomTeam(team) {
  const randomTeamResult = document.getElementById('randomTeamResult');
  randomTeamResult.innerHTML = ''; // Limpa o conteúdo antes de exibir a nova equipe aleatória

  const teamContainer = document.createElement('div');
  teamContainer.classList.add('team');

  const badge = document.createElement('div');
  badge.classList.add('team-badge');

  const img = document.createElement('img');
  img.src = team.EmblemaURL;
  img.alt = 'Emblema do Clube';

  // Definindo o tamanho da imagem (largura e altura)
  img.style.width = '250px'; // Adapte o tamanho conforme necessário
  img.style.height = '250px'; // Adapte o tamanho conforme necessário

  badge.appendChild(img);

  const teamInfo = document.createElement('div');
  teamInfo.classList.add('team-info');

  const teamName = document.createElement('p');
  teamName.textContent = 'Nome: ' + team.NomeEquipa;

  const participation = document.createElement('p');
  participation.textContent = 'Participação Europeia: ' + team.ParticipacaoEuropeia;

  const transferBalance = document.createElement('p');
  transferBalance.textContent = 'Saldo de Transferências: ' + team.SaldoTransferencias;

  const transferMoney = document.createElement('p');
  transferMoney.textContent = 'Dinheiro para Transferências: ' + team.DinheiroTransferencias;

  teamInfo.appendChild(teamName);
  teamInfo.appendChild(participation);
  teamInfo.appendChild(transferBalance);
  teamInfo.appendChild(transferMoney);

  teamContainer.appendChild(badge);
  teamContainer.appendChild(teamInfo);

  randomTeamResult.appendChild(teamContainer);
}


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