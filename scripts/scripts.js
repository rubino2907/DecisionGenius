const apiKey = '82c69a95563baea5f245619c3975f623';

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
    const genreDropdown = document.getElementById('genre');

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
    return genres.filter(Boolean); // Filtrar e remover valores nulos ou indefinidos
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
}

// ...

// Associar a função ao evento de alteração do menu suspenso
const genreDropdown = document.getElementById('genre');
genreDropdown.addEventListener('change', function() {
  const selectedGenre = this.value; // Obtém o valor selecionado
  showMovies(selectedGenre); // Chama a função showMovies com o valor selecionado
});

showGenresDropdown(); // Exibe os gêneros no menu suspenso ao carregar a página
showMovies('all'); // Exibe todos os filmes inicialmente

// ...

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

// ...



// Função para obter um filme aleatório com base no gênero selecionado
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

// Função para exibir o filme aleatório selecionado
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
      imagePath = imagePath.replace(/\\/g, '/'); // Substituir barras invertidas por barras normais

      const userImage = document.getElementById('userImage');
      userImage.src = imagePath; // Define o caminho da imagem do usuário
    })
    .catch(error => {
      console.error('Erro ao carregar a imagem:', error);
    });
}



// Associar a função ao botão "Filme Aleatório"
const randomMovieButton = document.getElementById('randomMovieButton');
randomMovieButton.addEventListener('click', function() {
  const selectedGenre = document.getElementById('genre').value;
  getRandomMovie(selectedGenre); // Chamar a função getRandomMovie com o gênero selecionado
});


