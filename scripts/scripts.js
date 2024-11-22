const apiKey = '82c69a95563baea5f245619c3975f623';
let player;

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

    const userID = data.UtilizadorID;
    loadUserImage(userID);
  })
  .catch(error => {
    console.error('Erro ao obter os detalhes do usuário:', error);
  });

  showGenresDropdown();

  const genreDropdownMovies = document.getElementById('genreMovies');
  if (genreDropdownMovies) {
    genreDropdownMovies.addEventListener('change', function() {
      const selectedGenre = this.value;
      showMovies(selectedGenre);
    });
  } else {
    console.error("Elemento com id 'genreMovies' não encontrado.");
  }

  showMovies('all');
});

async function getGenresList() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('Erro ao buscar lista de gêneros:', error);
    return [];
  }
}

async function showGenresDropdown() {
  try {
    const genres = await getGenresList();
    const genreDropdown = document.getElementById('genreMovies');

    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genreDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao exibir opções de gênero:', error);
  }
}

showGenresDropdown();

async function getMoviesByGenre(genre) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
}

async function getMovieGenres(genreIds) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
    const data = await response.json();

    const genres = genreIds.map(genreId => data.genres.find(genre => genre.id === genreId));
    return genres.filter(Boolean);
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
}

const genreDropdownMovies = document.getElementById('genreMovies');
genreDropdownMovies.addEventListener('change', function() {
  const selectedGenre = this.value;
  showMovies(selectedGenre);
});

showGenresDropdown();
showMovies('all');

async function showMovies(genreId) {
  try {
    const movies = await getMoviesByGenre(genreId);
    const movieList = document.getElementById('movieList');
    let moviesHTML = '';

    for (const movie of movies) {
      if (genreId === 'all' || movie.genre_ids.includes(parseInt(genreId))) {
        const genres = await getMovieGenres(movie.genre_ids);
        const imageUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;

        moviesHTML += `
          <div class="movie">
            <img src="${imageUrl}" alt="${movie.title}">
            <div class="movie-details">
              <h3>${movie.title}</h3>
              <p><strong>Gênero:</strong> ${genres.map(genre => genre.name).join(', ') || 'Gênero não especificado'}</p>
              <p>${movie.overview || 'Descrição não disponível'}</p>
            </div>
          </div>
        `;
      }
    }

    movieList.innerHTML = moviesHTML;
  } catch (error) {
    console.error('Erro ao exibir filmes:', error);
  }
}

async function getRandomMovie(genre) {
  try {
    const movies = await getMoviesByGenre(genre);
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    displayRandomMovie(randomMovie);
  } catch (error) {
    console.error('Erro ao buscar filme aleatório:', error);
  }
} 

async function displayRandomMovie(movie) {
  try {
    const randomMovieResult = document.getElementById('randomMovieResult');
    const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const genres = await getMovieGenres(movie.genre_ids);

    randomMovieResult.innerHTML = `
      <h2>Filme Selecionado:</h2>
      <div class="random-movie">
        <img src="${imageUrl}" alt="${movie.title}" class="movie-poster">
        <div class="movie-details">
          <h3>${movie.title}</h3>
          <p><strong>Gênero:</strong> ${genres.map(genre => genre.name).join(', ') || 'Gênero não especificado'}</p>
          <p>${movie.overview || 'Descrição não disponível'}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Erro ao exibir filme aleatório:', error);
  }
}

function loadUserImage(userID) {
  fetch(`/getUserImage/${userID}`)
    .then(response => response.json())
    .then(data => {
      let imagePath = data.imagePath;
      imagePath = imagePath.replace(/\\/g, '/');
      const userImage = document.getElementById('userImage');
      userImage.src = imagePath;
    })
    .catch(error => {
      console.error('Erro ao carregar a imagem:', error);
    });
}

const randomMovieButton = document.getElementById('randomMovieButton');
randomMovieButton.addEventListener('click', function() {
  const selectedGenre = document.getElementById('genreMovies').value;
  getRandomMovie(selectedGenre);
});

function getMovieDataFromElement(element) {
  const movieElement = element.closest('.movie');
  const movieTitle = movieElement.querySelector('h3').textContent;
  const movieOverview = movieElement.querySelector('p:nth-child(3)').textContent;
  const movieGenres = movieElement.querySelector('p:nth-child(2)').textContent;
  return {
      name: movieTitle,
      overview: movieOverview,
      genres: movieGenres.split(': ')[1].split(', '),
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
const moviePopup = document.getElementById('moviePopup');
const closePopupButton = document.getElementById('closePopupButton');

// Adiciona evento de clique no botão de fechar a popup
closePopupButton.addEventListener('click', () => {
  stopYouTubePlayer();
  clearYouTubePlayer();
  moviePopup.style.display = 'none';
});

// Função para exibir a popup do filme ao clicar na div
async function showMoviePopup(movie) {
  try {
    const moviePopup = document.getElementById('moviePopup');
    const movieTitleElement = document.getElementById('popupMovieTitle');
    const movieGenresElement = document.getElementById('popupMovieGenres');
    const movieOverviewElement = document.getElementById('popupMovieOverview');

    movieTitleElement.innerText = movie.name;
    movieGenresElement.innerText = 'Gênero: ' + movie.genres.join(', ');
    movieOverviewElement.innerText = movie.overview;

    moviePopup.style.display = 'flex';

    // Lógica para buscar e exibir o trailer do filme no YouTube
    searchTrailerOnYouTube(movie.name + ' filme official trailer')
      .then(trailerLink => {
        if (trailerLink) {
          console.log('Trailer encontrado:', trailerLink);
          // Aqui você pode inserir a lógica para exibir o trailer, como abrir um modal ou um elemento na página
        } else {
          console.log('Nenhum trailer disponível para este filme.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar trailer:', error);
      });
  } catch (error) {
    console.error('Erro ao exibir filme na popup:', error);
  }
}

// Evento de clique em um item da lista de filmes para exibir a popup
const movieList = document.getElementById('movieList');
movieList.addEventListener('click', async (event) => {
  const clickedElement = event.target.closest('.movie');
  if (clickedElement) {
    const movieData = getMovieDataFromElement(clickedElement);
    if (movieData.name && movieData.overview && movieData.genres) {
      await showMoviePopup(movieData);
    } else {
      console.error('Dados do filme incompletos:', movieData);
    }
  }
});

// Função para buscar o trailer do filme no YouTube
async function searchTrailerOnYouTube(movieName) {
  try {
    const apiKeyYoutube = 'AIzaSyDSi-5INoKN8feikWAumPXUbR_NhELtaJI'; // Substitua pelo seu YouTube API Key
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieName} filme official trailer&type=video&key=${apiKeyYoutube}`;

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
    moviePopup.style.display = 'none';
  });

