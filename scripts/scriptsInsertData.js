document.addEventListener('DOMContentLoaded', async () => {
  // Seu código JavaScript aqui
  async function carregarDados() {

    const formDivisao = document.getElementById('inserirDivisaoForm');
  
    formDivisao.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const divisaoNome = document.getElementById('nomedivisao').value;
      const ligaSelecionada = document.getElementById('ligas').value;
  
      try {
        const response = await fetch('http://127.0.0.1:3000/inserirDivisao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nomedivisao: divisaoNome,
            ligaId: ligaSelecionada
          })
        });
  
        if (response.ok) {
          console.log('Divisão inserida com sucesso!');
          limparCampos();
        } else {
          console.error('Erro ao inserir a divisão');
        }
      } catch (error) {
        console.error('Erro ao enviar os dados da divisão:', error);
      }
    });
  }
  
  async function carregarLigas() {
    const selectElement = document.getElementById('ligas');
  
    try {
      const response = await fetch('http://127.0.0.1:3000/ligas');
      const data = await response.json();
  
      selectElement.innerHTML = ''; // Limpa o conteúdo do select
  
      // Adiciona a opção "Selecione uma Liga" no início do select
      const selectOption = document.createElement('option');
      selectOption.value = ''; // Defina um valor vazio ou o mais adequado para esta opção
      selectOption.textContent = 'Selecione uma Liga'; // Texto exibido para a opção
      selectElement.appendChild(selectOption);
  
      // Itera sobre os dados das ligas e adiciona as opções no select
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

  async function carregarLigas2() {
    const selectElement = document.getElementById('ligass');
  
    try {
      const response = await fetch('http://127.0.0.1:3000/ligas');
      const data = await response.json();
  
      selectElement.innerHTML = ''; // Limpa o conteúdo do select
  
      // Adiciona a opção "Selecione uma Liga" no início do select
      const selectOption = document.createElement('option');
      selectOption.value = ''; // Defina um valor vazio ou o mais adequado para esta opção
      selectOption.textContent = 'Selecione uma Liga'; // Texto exibido para a opção
      selectElement.appendChild(selectOption);
  
      // Itera sobre os dados das ligas e adiciona as opções no select
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
  
  
  async function carregarDivisoes(idLiga) {
    const selectDivisoes = document.getElementById('divisoes');
  
    try {
      const response = await fetch(`http://127.0.0.1:3000/divisoes/${idLiga}`);
      const data = await response.json();
  
      selectDivisoes.innerHTML = '<option value="">Selecione Divisão</option>'; // Adiciona a opção "Selecione Divisão" no início
  
      data.divisoes.forEach(divisao => {
        const option = document.createElement('option');
        option.value = divisao.DivisaoID;
        option.textContent = divisao.NomeDivisao;
        selectDivisoes.appendChild(option);
      });
  
    } catch (error) {
      console.error('Erro ao carregar as divisões:', error);
      selectDivisoes.innerHTML = '<option value="">Erro ao carregar as divisões</option>';
    }
  }

  const formClube = document.getElementById('inserirClubeForm');
  console.log(formClube);

  formClube.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário


    const nomeclube = document.getElementById('nomeclube').value;
    const avatarInput = document.getElementById('avatar');
    const avatarFile = avatarInput.files[0]; // Obtém o arquivo do emblema

    let emblemaURL = null;
    if (avatarFile) {
      emblemaURL = avatarFile.name; // Define o nome do arquivo como EmblemaURL
    }

    const divisaoSelecionada = document.querySelector('select[name="divisoes"]').value;
    const participacaoEuropeia = document.getElementById('participacaoEuropeia').value;
    const saldoTransferencias = document.getElementById('saldoTransferencias').value;
    const dinheiroTransferencias = document.getElementById('dinheiroTransferencias').value;

  

  console.log('Nome do Clube:', nomeclube);
  console.log('Caminho do Emblema:', emblemaURL);
  console.log('Divisão Selecionada:', divisaoSelecionada); // Certifique-se de que a divisão está sendo capturada corretamente
  console.log('Participação em Competições Europeias:', participacaoEuropeia);
  console.log('Saldo para Transferências:', saldoTransferencias);
  console.log('Dinheiro Disponível para Transferências:', dinheiroTransferencias);

  const formData = new FormData();
    formData.append('nomeclube', nomeclube);
    formData.append('avatar', avatarFile); // Adiciona o arquivo do emblema ao FormData
    formData.append('emblemaURL', emblemaURL); // Adiciona o caminho do emblema ao FormData
    formData.append('divisaoSelecionada', divisaoSelecionada);
    formData.append('participacaoEuropeia', participacaoEuropeia);
    formData.append('saldoTransferencias', saldoTransferencias);
    formData.append('dinheiroTransferencias', dinheiroTransferencias);

    try {
      const response = await fetch('http://127.0.0.1:3000/inserirDataClube', {
        method: 'POST',
        body: formData
      });

    // Restante do código para manipular a resposta...
    console.log('Clube inserido com sucesso!');
    limparCampos(); // Chama a função para limpar os campos do formulário
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao criar clube. Tente novamente.');
  }
});
  

function limparCampos() {
  document.getElementById('nomeclube').value = '';
  document.getElementById('avatar').value = '';
  document.getElementById('divisoes').value = ''; // Limpar o campo de divisões
  document.getElementById('participacaoEuropeia').value = '';
  document.getElementById('saldoTransferencias').value = '';
  document.getElementById('dinheiroTransferencias').value = '';
  document.getElementById('nomedivisao').value = '';
}

// Seu código existente...

window.onload = async () => {
  await carregarLigas();
  await carregarDivisoes();
  await carregarLigas2();

  const ligasSelect = document.getElementById('ligass');
  ligasSelect.addEventListener('change', async () => {
    const selectedLeague = ligasSelect.value;
    await carregarDivisoes(selectedLeague);
  });

  carregarDados(); // Adicione esta linha para configurar o listener do formulário de inserção de divisões
};


});

