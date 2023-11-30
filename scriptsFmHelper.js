const ligasFutebol = [
    { id: 1, name: 'Premier League', divisoes: 4 },
    { id: 2, name: 'La Liga', divisoes: 3 },
    { id: 3, name: 'Serie A', divisoes: 2 },
    { id: 4, name: 'Bundesliga', divisoes: 2 },
    { id: 5, name: 'Ligue 1', divisoes: 2 }
    // Adicione mais ligas conforme necessário
  ];
  
  const equipesFutebol = [
    {
      ligaId: 1,
      divisao: 1,
      name: 'Manchester City',
      image: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
      description: 'Manchester City Football Club é um clube de futebol inglês.'
      // ...outros detalhes
    },
    {
      ligaId: 1,
      divisao: 2,
      name: 'Manchester City',
      image: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
      description: 'Manchester City Football Club é um clube de futebol inglês.'
      // ...outros detalhes
    },
    {
        ligaId: 1,
        divisao: 1,
        name: 'Manchester United',
        image: 'https://upload.wikimedia.org/wikipedia/sco/thumb/7/7a/Manchester_United_FC_crest.svg/2021px-Manchester_United_FC_crest.svg.png',
        description: 'Manchester Unied Football Club é um clube de futebol inglês.'
        // ...outros detalhes
    },
    {
      ligaId: 1,
      divisao: 1,
      name: 'Newcastle',
      image: 'https://upload.wikimedia.org/wikipedia/sco/thumb/5/56/Newcastle_United_Logo.svg/1200px-Newcastle_United_Logo.svg.png',
      description: 'Newcastle é um clube de futebol inglês.'
      // ...outros detalhes
    },
    {
        ligaId: 1,
        divisao: 1,
        name: 'Chelsea',
        image: 'https://upload.wikimedia.org/wikipedia/sco/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
        description: 'Chelsea é um clube de futebol inglês.'
        // ...outros detalhes
    },
    {
      ligaId: 5,
      divisao: 1,
      name: 'PSG',
      image: 'https://logovectordl.com/wp-content/uploads/2021/05/paris-saint-germain-logo-vector.png',
      description: 'PSG é um clube de futebol frances.'
      // ...outros detalhes
    },
    {
      ligaId: 2,
      divisao: 1,
      name: 'Real Madrid',
      image: 'https://cdn.worldvectorlogo.com/logos/real-madrid-c-f.svg',
      description: 'Real Madrid é um clube de futebol espanhol.'
      // ...outros detalhes
    },
    {
        ligaId: 2,
        divisao: 1,
        name: 'Barcelona',
        image: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1010px-FC_Barcelona_%28crest%29.svg.png',
        description: 'Barcelona é um clube de futebol espanhol.'
        // ...outros detalhes
    },
      
    // Adicione mais detalhes conforme necessário
  ];
  
  
  function preencherOpcoesLigas() {
    const selectElement = document.getElementById('leagueSelect');
  
    ligasFutebol.forEach(liga => {
      const option = document.createElement('option');
      option.value = liga.id;
      option.textContent = liga.name;
      selectElement.appendChild(option);
    });
  
    selectElement.addEventListener('change', function() {
      const divisoesSelect = document.getElementById('divisoesSelect');
      const ligaSelecionada = ligasFutebol.find(liga => liga.id === parseInt(this.value));
  
      divisoesSelect.innerHTML = '';
  
      if (ligaSelecionada) {
        for (let i = 1; i <= ligaSelecionada.divisoes; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = `Divisão ${i}`;
          divisoesSelect.appendChild(option);
        }
        showTeams(ligaSelecionada.id, divisoesSelect.value);
      } else {
        divisoesSelect.innerHTML = '<option value="">Selecione a liga primeiro</option>';
      }
    });
  }
  
  function showTeams(ligaId, divisao) {
    const teamsList = document.getElementById('teamsList');
    teamsList.innerHTML = '';
  
    const filteredTeams = equipesFutebol.filter(equipe => equipe.ligaId === ligaId && equipe.divisao === parseInt(divisao));
  
    if (filteredTeams.length > 0) {
      filteredTeams.forEach(equipe => {
        const teamElement = document.createElement('div');
        teamElement.classList.add('team');
  
        const teamImage = document.createElement('img');
        teamImage.src = equipe.image;
        teamImage.alt = equipe.name;
        teamElement.appendChild(teamImage);
  
        const teamDetails = document.createElement('div');
        teamDetails.classList.add('team-details');
  
        const teamName = document.createElement('h3');
        teamName.textContent = equipe.name;
        teamDetails.appendChild(teamName);
  
        const teamDescription = document.createElement('p');
        teamDescription.textContent = equipe.description;
        teamDetails.appendChild(teamDescription);
  
        teamElement.appendChild(teamDetails);
        teamsList.appendChild(teamElement);
      });
    } else {
      const noTeamElement = document.createElement('div');
      noTeamElement.textContent = 'Nenhuma equipe encontrada para esta divisão.';
      teamsList.appendChild(noTeamElement);
    }
  }
  
  
  window.addEventListener('load', preencherOpcoesLigas);

// Adicione um ouvinte de evento para o botão "Equipe Aleatória"
const randomTeamButton = document.getElementById('randomTeamButton');
randomTeamButton.addEventListener('click', () => {
  const ligaSelecionada = document.getElementById('leagueSelect').value;
  const divisaoSelecionada = document.getElementById('divisoesSelect').value;

  if (ligaSelecionada && divisaoSelecionada) {
    showRandomTeam(parseInt(ligaSelecionada), parseInt(divisaoSelecionada));
  } else {
    alert('Selecione uma liga e divisão antes de obter uma equipe aleatória.');
  }
});

// Função para mostrar uma equipe aleatória com base na liga e divisão selecionadas
function showRandomTeam(ligaId, divisao) {
  const filteredTeams = equipesFutebol.filter(equipe => equipe.ligaId === ligaId && equipe.divisao === divisao);

  if (filteredTeams.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredTeams.length);
    const randomTeam = filteredTeams[randomIndex];

    // Aqui você pode exibir os detalhes da equipe aleatória conforme desejado
    console.log('Equipe Aleatória:', randomTeam);
    // Por exemplo: exibir na div randomTeamResult na página
    const randomTeamResult = document.getElementById('randomTeamResult');
    randomTeamResult.innerHTML = `
      <div class="team">
        <h3>${randomTeam.name}</h3>
        <img src="${randomTeam.image}" alt="${randomTeam.name}">
        <p>${randomTeam.description}</p>
      </div>
    `;
  } else {
    alert('Nenhuma equipe encontrada para a liga e divisão selecionadas.');
  }
}
  