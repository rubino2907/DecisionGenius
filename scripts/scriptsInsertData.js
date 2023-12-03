async function carregarDados() {
    await carregarLigas();
    await carregarDivisoes();

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
          window.location.href = "/InserirLeagues";
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
  
      selectElement.innerHTML = '';
  
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
  
  async function carregarDivisoes() {
    const selectElement = document.getElementById('divisoes');
  
    try {
      const response = await fetch('http://127.0.0.1:3000/divisoes');
      const data = await response.json();
  
      selectElement.innerHTML = '';
  
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
  
  window.onload = carregarDados;

  const formClube = document.getElementById('inserirClubeForm');

  formClube.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o envio padrão do formulário

  const nomeclube = document.getElementById('nomeclube').value;
  const emblemaurl = document.getElementById('emblemaurl').value;
  const divisaoSelecionada = document.querySelector('select[name="divisoes"]').value;
  const participacaoEuropeia = document.getElementById('participacaoEuropeia').value;
  const saldoTransferencias = document.getElementById('saldoTransferencias').value;
  const dinheiroTransferencias = document.getElementById('dinheiroTransferencias').value;

  console.log('Nome do Clube:', nomeclube);
  console.log('Emblema URL:', emblemaurl);
  console.log('Divisão Selecionada:', divisaoSelecionada); // Certifique-se de que a divisão está sendo capturada corretamente
  console.log('Participação em Competições Europeias:', participacaoEuropeia);
  console.log('Saldo para Transferências:', saldoTransferencias);
  console.log('Dinheiro Disponível para Transferências:', dinheiroTransferencias);

  const dadosClube = {
    nomeclube: nomeclube,
    emblemaurl: emblemaurl,
    divisaoSelecionada: divisaoSelecionada, // Certifique-se de que o nome da propriedade corresponde ao que é esperado no servidor
    participacaoEuropeia: participacaoEuropeia,
    saldoTransferencias: saldoTransferencias,
    dinheiroTransferencias: dinheiroTransferencias
  };

  try {
    const response = await fetch('http://127.0.0.1:3000/inserirDataClube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosClube)
    });

    // Restante do código para manipular a resposta...
    console.log('Divisão inserida com sucesso!');
    limparCampos(); // Chama a função para limpar os campos do formulário
    window.location.href = "/InserirLeagues";
  } catch (error) {
    console.error('Erro:', error);
    // Adicione aqui o código para lidar com erros, se necessário
  }
});
  

function limparCampos() {
  document.getElementById('nomeclube').value = '';
  document.getElementById('emblemaurl').value = '';
  document.getElementById('divisoes').value = ''; // Limpar o campo de divisões
  document.getElementById('participacaoEuropeia').value = '';
  document.getElementById('saldoTransferencias').value = '';
  document.getElementById('dinheiroTransferencias').value = '';
  document.getElementById('nomedivisao').value = '';
}
