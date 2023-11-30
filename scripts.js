// scripts.js
// Dados simulados de filmes
const moviesData = [
    { title: 'Filme A', genre: 'action', description: 'Descrição do Filme A.' },
    { title: 'Filme B', genre: 'drama', description: 'Descrição do Filme B.' },
    { title: 'Filme C', genre: 'comedy', description: 'Descrição do Filme C.' },
    // Adicione mais filmes conforme necessário
  ];
  
  // Função para exibir filmes com base no gênero selecionado
  function showMovies(genre) {
    const movieList = document.getElementById('movieList');
    let moviesHTML = '';
  
    moviesData.forEach(movie => {
      if (genre === 'all' || movie.genre === genre) {
        moviesHTML += `
          <div class="movie">
            <h3>${movie.title}</h3>
            <p><strong>Gênero:</strong> ${movie.genre}</p>
            <p>${movie.description}</p>
          </div>
        `;
      }
    });
  
    movieList.innerHTML = moviesHTML;
  }
  
  // Event listener para alterações na seleção de gênero
  document.getElementById('genre').addEventListener('change', function() {
    const selectedGenre = this.value;
    showMovies(selectedGenre);
  });
  
  // Exibição inicial de todos os filmes
  showMovies('all');
  