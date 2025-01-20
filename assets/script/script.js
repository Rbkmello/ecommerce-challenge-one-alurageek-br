document.addEventListener("DOMContentLoaded", () => {
    const produtosContainer = document.querySelector(".todos-produtos");
    const API_URL = "http://localhost:3001/categorias"; // URL correta da API para categorias
    const buscaInput = document.querySelector('.busca__barra'); // Seleciona a barra de busca
  
    let categorias = []; // Armazena os dados das categorias para uso na busca
  
    // Função para criar o HTML de um item de produto
    function criarItemHTML(produto) {
        if (!produto.imagem || !produto.nome || !produto.preco) {
            return ''; // Não exibe o produto se faltar dados essenciais
        }
  
        return `
        
            <div class="produto__info">
                <img class="produtos__img" src="${produto.imagem}" alt="${produto.descricao || produto.nome}">
                <p class="produto__descricao">${produto.nome}</p>
                <p class="produto__preco">R$ ${produto.preco.toFixed(2)}</p>
                <a href="produtos-relacionados.html?id=${produto.id}&categoria=${produto.categoria}" class="produto__link">Ver produto</a>
            </div>
        `;
    }
  
    // Função para criar o HTML de uma categoria e seus produtos
    function criarCategoria(categoria) {
        if (!categoria || !categoria.produtos || categoria.produtos.length === 0) {
            return ''; // Evita categorias sem produtos ou dados inválidos
        }
  
        const produtosHTML = categoria.produtos.map(criarItemHTML).join("");
        return `
            <section class="categorias ${categoria.nome.toLowerCase()}">
                <section class="categoria">
                    <div class="categoria-header">
                        <h2>${categoria.nome}</h2>
                        <a href="todos-produtos.html?categoria=${categoria.nome}" class="ver-tudo">Ver Tudo</a>
                    </div>
                </section>
                <section class="todos-produtos">
                    ${produtosHTML}
                </section>
            </section>
        `;
    }
  
    // Função para renderizar os produtos no HTML
    function renderizarProdutos(categorias) {
        const categoriasHTML = categorias.map(categoria => criarCategoria(categoria)).join("");
        produtosContainer.innerHTML = categoriasHTML;
    }
  
    // Função para buscar produtos na API
    function buscarProdutos(termo) {
        const termoNormalizado = termo.toLowerCase();
        const resultados = categorias.flatMap(categoria => 
            categoria.produtos.filter(produto => 
                produto.nome.toLowerCase().includes(termoNormalizado)
            )
        );
  
        // Atualiza os produtos exibidos com base nos resultados
        if (resultados.length > 0) {
            const categoriaResultado = { nome: "Resultados da Busca", produtos: resultados };
            renderizarProdutos([categoriaResultado]);
        } else {
            produtosContainer.innerHTML = `<p class="error">Nenhum produto encontrado para "${termo}".</p>`;
        }
    }
  
    // Evento para capturar a busca
    buscaInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') { // Verifica se a tecla pressionada é "Enter"
            const searchTerm = buscaInput.value.trim();
            if (searchTerm) {
                buscarProdutos(searchTerm); // Realiza a busca
                buscaInput.value = ''; // Limpa a barra de busca
            } else {
                alert("Digite algo na barra de busca!"); // Alerta se a barra estiver vazia
            }
        }
    });
  
    // Função para buscar os produtos pelo termo diretamente pela URL
    function buscarProdutosPorTermo(termo) {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar a API: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(categorias => {
                const termoNormalizado = termo.toLowerCase();
                const resultados = categorias.flatMap(categoria =>
                    categoria.produtos.filter(produto =>
                        produto.nome.toLowerCase().includes(termoNormalizado)
                    )
                );
  
                // Atualiza os produtos exibidos com base nos resultados
                if (resultados.length > 0) {
                    const produtosHTML = resultados.map(criarItemHTML).join("");
                    produtosContainer.innerHTML = produtosHTML;
                } else {
                    produtosContainer.innerHTML = `<p class="error">Nenhum produto encontrado para "${termo}".</p>`;
                }
            })
            .catch(error => {
                console.error("Erro ao carregar os produtos:", error);
                produtosContainer.innerHTML = `<p class="error">Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>`;
            });
    }
  
    // Se o termo de busca estiver presente na URL, chamar a função de busca
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("search");
  
    if (searchTerm) {
        buscarProdutosPorTermo(searchTerm);
    } else {
        // Carregar dados da API quando a página é acessada sem um termo de busca específico
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar a API: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error("Formato de dados inesperado.");
                }
  
                categorias = data; // Armazena os dados das categorias para uso posterior
                categorias.forEach(categoria => {
                    categoria.produtos = categoria.produtos ? categoria.produtos.slice(0, 4) : []; // Exibir apenas 4 produtos por categoria
                });
  
                renderizarProdutos(categorias); // Renderizar os produtos iniciais
            })
            .catch(error => {
                console.error("Erro ao carregar os produtos:", error);
                produtosContainer.innerHTML = `<p class="error">Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>`;
            });
    }
});

/* Botão de Login */
const botaologin = document.querySelector('[data-login-button]');
botaologin.addEventListener('click', () => {
  window.location.href = './login.html';
});

// Seleciona o botão de login
const loginButton = document.querySelector('[data-form-button]');

// Adiciona um evento de clique ao botão
loginButton.addEventListener('click', (event) => {
  event.preventDefault(); // Evita o comportamento padrão do botão

  // Seleciona os campos de email e senha
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');

  // Obtém os valores dos campos
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  // Validação básica
  if (!email || !senha) {
    alert('Por favor, preencha todos os campos!'); // Alerta se os campos estiverem vazios
  } else {
    alert(`Email: ${email}\nSenha: ${senha}`); // Exibe os dados inseridos
    emailInput.value = ''; // Limpa o campo de email
    senhaInput.value = ''; // Limpa o campo de senha
  }
});

/* Validando formulário de iniciar sessão */
(() => {
  function verificar() {
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');

    // Validação do email
    if (!email.value.trim()) {
      email.classList.add('input-erro');
      alert('O campo email é obrigatório.');
      email.focus();
      return false;
    } else if (!email.value.includes('@') || !email.value.includes('.') || email.value.indexOf('.') - email.value.indexOf('@') <= 1) {
      alert('Complete o email corretamente.');
      email.focus();
      return false;
    } else {
      email.classList.remove('input-erro');
      email.classList.add('input-sucesso');
    }

    // Validação da senha
    if (!senha.value.trim()) {
      senha.classList.add('input-erro');
      alert('Digite sua senha.');
      senha.focus();
      return false;
    } else if (senha.value.length > 6) {
      alert('Digite no máximo 6 caracteres.');
      senha.focus();
      return false;
    } else {
      senha.classList.remove('input-erro');
      senha.classList.add('input-sucesso');
    }

    // Verificação de credenciais
    if (email.value === 'teste@email.com' && senha.value === '000000') {
      window.location.href = './adicionar-produto.html';
    } else {
      alert('Email ou senha incorretos.');
    }
  }

  const btnEntrar = document.querySelector('[data-form-button]');
  btnEntrar.addEventListener('click', (event) => {
    event.preventDefault(); // Evita o comportamento padrão do botão
    verificar();
  });
})();