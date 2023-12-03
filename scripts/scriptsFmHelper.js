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

async function carregarDivisoes() {
  const selectElement = document.getElementById('divisoes');

  try {
    const response = await fetch('http://127.0.0.1:3000/divisoes');
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
    badge.innerHTML = team.EmblemaURL; // Verifique se o EmblemaURL está retornando corretamente o SVG
    badge.classList.add('team-badge');

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

    teamsContainer.appendChild(teamContainer);
  });
}

function displayRandomTeam(team) {
  const randomTeamResult = document.getElementById('randomTeamResult');
  randomTeamResult.innerHTML = ''; // Limpa o conteúdo antes de exibir a nova equipe aleatória

  const teamContainer = document.createElement('div');
  teamContainer.classList.add('team');

  const badge = document.createElement('div');
  badge.innerHTML = team.EmblemaURL; // Verifique se o EmblemaURL está retornando corretamente o SVG
  badge.classList.add('team-badge');

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





