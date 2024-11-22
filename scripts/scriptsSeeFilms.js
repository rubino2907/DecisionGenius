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
  
  const video = document.getElementById("video");
const nextButton = document.getElementById("nextButton");
const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const episodeList = document.getElementById("episodeList");

let episodes = []; // Lista de episódios
let currentEpisodeIndex = 0;

// Prevenir comportamento padrão ao arrastar e soltar
document.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.stopPropagation();
});

document.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();
});

// Detectar arquivos arrastados
uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  handleFiles(files);
});

// Detectar arquivos do input
fileInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);
  handleFiles(files);
});

// Processar os arquivos e configurar o vídeo
function handleFiles(files) {
  // Filtrar apenas arquivos MP4 e ordenar por nome (assumindo que seguem uma ordem lógica)
  episodes = files.filter(file => file.type === "video/mp4").sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });

  if (episodes.length === 0) {
    alert("Nenhum episódio válido encontrado.");
    return;
  }

  // Esconde a área de upload
  uploadArea.style.display = "none";

  // Listar episódios na interface (opcional)
  episodeList.innerHTML = "";
  episodes.forEach((file, index) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    li.dataset.index = index;
    li.addEventListener("click", () => loadEpisode(index));
    episodeList.appendChild(li);
  });

  // Procurar o primeiro episódio pelo nome "episódio 1"
  const firstEpisodeIndex = episodes.findIndex(file => /epis[óo]dio\s?1/i.test(file.name));
  if (firstEpisodeIndex >= 0) {
    loadEpisode(firstEpisodeIndex);
  } else {
    // Se não encontrado, carregue o primeiro arquivo da lista
    loadEpisode(0);
  }
}

// Carregar episódio pelo índice
function loadEpisode(index) {
  currentEpisodeIndex = index;
  const file = episodes[index];

  if (file) {
    const url = URL.createObjectURL(file); // Criar URL temporária para o arquivo
    video.src = url; // Atualizar a fonte do vídeo
    video.play(); // Reproduzir o vídeo
  }
}

// Próximo episódio
nextButton.addEventListener("click", () => {
  if (currentEpisodeIndex < episodes.length - 1) {
    loadEpisode(currentEpisodeIndex + 1);
  } else {
    alert("Você já está no último episódio.");
  }
});

  