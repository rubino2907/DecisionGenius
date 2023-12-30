const apiKey = '82c69a95563baea5f245619c3975f623';
let player; // Declare a variável globalmente para armazenar o objeto do player do YouTube

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
  // Chama a função para exibir os gêneros de séries no menu suspenso
  showSeriesGenresDropdown();

  // Exibe todas as séries inicialmente
  showSeries('all');
});

async function getSeriesGenresList() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`);
      const data = await response.json();
      return data.genres || [];
    } catch (error) {
      console.error('Erro ao buscar lista de gêneros de séries:', error);
      return [];
    }
  }

  async function showSeriesGenresDropdown() {
    try {
      const seriesGenres = await getSeriesGenresList();
      const genreDropdown = document.getElementById('genre');
  
      seriesGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao exibir opções de gênero de séries:', error);
    }
  }
  
  showSeriesGenresDropdown();

async function getSeriesByGenre(genre) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genre}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    return [];
  }
}

async function getSeriesGenres(genreIds) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`);
    const data = await response.json();

    const genres = genreIds.map(genreId => data.genres.find(genre => genre.id === genreId));
    return genres.filter(Boolean); // Filtrar e remover valores nulos ou indefinidos
  } catch (error) {
    console.error('Erro ao buscar gêneros de séries:', error);
    return [];
  }
}

// ...

// Associar a função ao evento de alteração do menu suspenso
const genreDropdown = document.getElementById('genre');
genreDropdown.addEventListener('change', function() {
  const selectedGenre = this.value; // Obtém o valor selecionado
  showSeries(selectedGenre); // Chama a função showSeries com o valor selecionado
});

showSeriesGenresDropdown();

// ...

async function showSeries(genreId) {
    try {
      const series = await getSeriesByGenre(genreId);
      const seriesList = document.getElementById('seriesList');
      let seriesHTML = '';
  
      for (const serie of series) {
        if (genreId === 'all' || serie.genre_ids.includes(parseInt(genreId))) {
          const genres = await getSeriesGenres(serie.genre_ids);
          const imageUrl = `https://image.tmdb.org/t/p/w300${serie.poster_path}`;
  
          // Adicionando uma estrela após a avaliação
          const rating = serie.vote_average ? `${serie.vote_average} &#9733;` : 'N/A';
  
          seriesHTML += `
            <div class="serie">
              <img src="${imageUrl}" alt="${serie.name}">
              <div class="serie-details">
                <h3>${serie.name}</h3>
                <p><strong>Gênero:</strong> ${genres.map(genre => genre.name).join(', ') || 'Gênero não especificado'}</p>
                <p><strong>Avaliação:</strong> ${rating}</p>
                <p><strong>Data de Lançamento:</strong> ${serie.first_air_date || 'N/A'}</p>
                <p>${serie.overview || 'Descrição não disponível'}</p>
                ${serie.number_of_seasons ? `<p><strong>Temporadas:</strong> ${serie.number_of_seasons}</p>` : ''}
                ${serie.number_of_episodes ? `<p><strong>Episódios:</strong> ${serie.number_of_episodes}</p>` : ''}
                <!-- Aqui você pode adicionar mais detalhes, como elenco, por exemplo -->
              </div>
            </div>
          `;
        }
      }
  
      seriesList.innerHTML = seriesHTML;
    } catch (error) {
      console.error('Erro ao exibir séries:', error);
    }
  }

// ...



// Função para obter uma série aleatória com base no gênero selecionado
async function getRandomSerie(genre) {
  try {
    const series = await getSeriesByGenre(genre);
    const randomIndex = Math.floor(Math.random() * series.length);
    const randomSerie = series[randomIndex];

    await displayRandomSerie(randomSerie);
  } catch (error) {
    console.error('Erro ao buscar série aleatória:', error);
  }
}


  async function displayRandomSerie(serie) {
    try {
      const randomSerieResult = document.getElementById('randomSerieResult');
      const imageUrl = `https://image.tmdb.org/t/p/w500${serie.poster_path}`;
      
      const genres = await getSeriesGenres(serie.genre_ids);
  
      // Adicionando uma estrela após a avaliação
      const rating = serie.vote_average ? `Avaliação: ${serie.vote_average} ★` : 'Avaliação: N/A';
  
      randomSerieResult.innerHTML = `
        <h2>Série Selecionada:</h2>
        <div class="random-serie">
          <img src="${imageUrl}" alt="${serie.name}" class="serie-poster">
          <div class="serie-details">
            <h3>${serie.name}</h3>
            <p><strong>Gênero:</strong> ${genres.map(genre => genre.name).join(', ') || 'Gênero não especificado'}</p>
            <p>${serie.overview || 'Descrição não disponível'}</p>
            <p><strong>Avaliação:</strong> ${rating}</p>
            <p><strong>Data de Lançamento:</strong> ${serie.first_air_date || 'N/A'}</p>
            ${serie.number_of_seasons ? `<p><strong>Temporadas:</strong> ${serie.number_of_seasons}</p>` : ''}
            ${serie.number_of_episodes ? `<p><strong>Episódios:</strong> ${serie.number_of_episodes}</p>` : ''}
            <!-- Adicione aqui outros detalhes que deseja exibir -->
          </div>
        </div>
      `;
    // Adicionar evento de clique na div 'randomSerieResult'
    randomSerieResult.addEventListener('click', async () => {
      const randomSerieData = {
        name: serie.name,
        overview: serie.overview,
        genres: genres.map(genre => genre.name),
        rating: rating
      };
      await showSeriePopup(randomSerieData);
    });
  } catch (error) {
    console.error('Erro ao exibir série aleatória:', error);
  }
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


// Associar a função ao botão "Série Aleatória"
// Associar a função ao botão "Série Aleatória"
const randomSerieButton = document.getElementById('randomSerieButton');
randomSerieButton.addEventListener('click', function() {
  const selectedGenre = document.getElementById('genre').value;
  getRandomSerie(selectedGenre);
});

showSeries('all'); // Exibe todas as séries inicialmente

// Função para obter os dados da série a partir do elemento clicado
function getSeriesDataFromElement(element) {
  const serieElement = element.closest('.serie'); // Encontra o elemento pai da série
  const serieTitle = serieElement.querySelector('h3').textContent; // Obtém o título da série
  const serieOverview = serieElement.querySelector('p:nth-child(5)').textContent; // Obtém a descrição da série
  const serieGenres = serieElement.querySelector('p:nth-child(2)').textContent; // Obtém os gêneros da série
  const popupSerieRating = serieElement.querySelector('p:nth-child(3)').textContent; // Obtém os gêneros da série
  return {
      name: serieTitle,
      overview: serieOverview,
      genres: serieGenres.split(': ')[1].split(', '), // Separa os gêneros em um array
      rating: popupSerieRating
      // Outros dados da série, se necessário
  };
}

// Função para exibir a popup da série aleatória ao clicar na div
function showRandomSeriePopup() {
  const randomSerieTitle = document.querySelector('#randomSerieResult h3').innerText;
  const randomSerieOverview = document.querySelector('#randomSerieResult p:nth-child(4)').innerText;
  const randomSerieGenres = document.querySelector('#randomSerieResult p:nth-child(2)').innerText;
  const randomSerieRating = document.querySelector('#randomSerieResult p:nth-child(3)').innerText;

  const randomSerieData = {
    name: randomSerieTitle,
    overview: randomSerieOverview,
    genres: randomSerieGenres.split(': ')[1].split(', '),
    rating: randomSerieRating
  };

  showSeriePopup(randomSerieData);
}

// Função para obter os detalhes da série (incluindo a URL do trailer)
async function getSeriesDetails(serieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}`);
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('Erro ao buscar detalhes da série:', error);
    return {};
  }
}

// Obtém a referência para os elementos relevantes da popup
const seriePopup = document.getElementById('seriePopup');
const closePopupButton = document.getElementById('closePopupButton');

// Adiciona evento de clique no botão de fechar a popup
closePopupButton.addEventListener('click', () => {
  stopYouTubePlayer();
  clearYouTubePlayer();
  seriePopup.style.display = 'none';
});

async function showSeriePopup(serie) {
  try {
    stopYouTubePlayer();
    clearYouTubePlayer();
    const serieDetails = await getSeriesDetails(serie.id);

    document.getElementById('popupSerieTitle').innerText = serie.name;
    document.getElementById('popupSerieGenres').innerText = 'Gênero: ' + serie.genres.join(', ');
    document.getElementById('popupSerieOverview').innerText = serie.overview;
    document.getElementById('popupSerieRating').innerText = serie.rating;

    seriePopup.style.display = 'flex';

    const trailerLink = await searchTrailerOnYouTube(serie.name + ' official trailer');

    if (trailerLink) {
      clearYouTubePlayer();
      createYouTubePlayer(trailerLink);
    } else {
      console.log('Nenhum trailer disponível para esta série.');
    }
  } catch (error) {
    console.error('Erro ao exibir série na popup:', error);
  }
}
  
// Evento de clique em um item da lista de séries para exibir a popup
const seriesList = document.getElementById('seriesList');
seriesList.addEventListener('click', async (event) => {
  const clickedElement = event.target.closest('.serie');
  if (clickedElement) {
    const serieData = getSeriesDataFromElement(clickedElement);
    if (serieData.name && serieData.overview && serieData.genres && serieData.rating) {
      // Chama a função para exibir a popup com os detalhes da série
      await showSeriePopup(serieData);
    } else {
      console.error('Dados da série incompletos:', serieData);
    }
  }
});


async function searchTrailerOnYouTube(serieName) {
    try {
      const apiKeyYoutube = 'AIzaSyDSi-5INoKN8feikWAumPXUbR_NhELtaJI'; // Substitua pelo seu YouTube API Key
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${serieName} serie official trailer&type=video&key=${apiKeyYoutube}`;
  
      const response = await fetch(searchUrl);
      const data = await response.json();
  
      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        console.log('Nenhum trailer encontrado.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar o trailer:', error);
      return null;
    }
  }

  

  function createYouTubePlayer(videoUrl) {
    const playerElement = document.getElementById('youtubePlayer');
    playerElement.innerHTML = ''; // Limpa o conteúdo do elemento antes de criar um novo player
    
    player = new YT.Player(playerElement, {
      height: '300', // Definindo a altura para criar um quadrado proporcional
      width: '300',  // Mantendo a largura igual à altura
      videoId: getVideoIdFromUrl(videoUrl),
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
      },
    });
  }

  function getVideoIdFromUrl(url) {
    // Extrai o ID do vídeo do URL do YouTube
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  }

function stopYouTubePlayer() {
  // Pausa o vídeo do player do YouTube somente se o player estiver definido e for uma função
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
  }
}

function clearYouTubePlayer() {
    if (player && typeof player.destroy === 'function') {
      player.destroy(); // Destroi o player do YouTube
      player = null; // Reseta a variável do player
    }
  }

  closePopupButton.addEventListener('click', () => {
    stopYouTubePlayer();
    clearYouTubePlayer();
    seriePopup.style.display = 'none';
  });
  