// Seleciona os elementos do formulário
const form = document.querySelector('.contato-form');
const nomeInput = document.getElementById('nome');
const mensagemInput = document.getElementById('msg');
const alertMessage = document.querySelector('.alert-message');

// Função para exibir a mensagem de alerta
function showAlert(message, isError = false) {
  alertMessage.textContent = message;
  alertMessage.style.display = 'inline'; // Exibe a mensagem
  alertMessage.className = isError ? 'alert-message error' : 'alert-message'; // Define a classe com base no tipo
  setTimeout(() => {
    alertMessage.style.display = 'none'; // Oculta após 5 segundos
  }, 5000);
}

// Adiciona o ouvinte de evento para o envio do formulário
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Validação dos campos
  const nome = nomeInput.value.trim();
  const mensagem = mensagemInput.value.trim();

  if (!nome) {
    showAlert('Por favor, preencha o campo "Nome".', true);
    return;
  }

  if (!mensagem) {
    showAlert('Por favor, escreva sua mensagem.', true);
    return;
  }

  // Exibe a mensagem de sucesso
  showAlert('Mensagem enviada com sucesso! Obrigado por entrar em contato.');

  // Limpa os campos do formulário
  form.reset();
});
