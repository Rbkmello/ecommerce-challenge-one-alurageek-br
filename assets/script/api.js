// Definindo a URL da API fora do evento para torná-la acessível globalmente
const API_URL = "http://localhost:3001/categorias";  // Verifique se a URL está correta

document.addEventListener("DOMContentLoaded", () => {
  const produtosContainer = document.querySelector(".todos-produtos");

  // Restante do código...
});

// Função para criar o HTML de cada produto
function criarItemHTML(produto, categoriaNome) {
  if (!produto.imagem || !produto.nome || !produto.preco) {
    console.warn(`Produto faltando dados essenciais: ${JSON.stringify(produto)}`);
    return '';  // Se algum dado essencial estiver ausente, não exibe o produto
  }

  return `
    <div class="produto__info">
      <img class="produtos__img" src="${produto.imagem}" alt="${produto.descricao || produto.nome}">
      <p class="produto__descricao">${produto.nome}</p>
      <p class="produto__preco">R$ ${produto.preco.toFixed(2)}</p>
      <a href="produtos-relacionados.html?id=${produto.id}&categoria=${categoriaNome}" class="produto__link" onclick="abrirProdutoRelacionados(event, '${produto.id}', '${categoriaNome}')">Ver produto</a>
    </div>
  `;
}

// Função para criar o HTML de cada categoria
function criarCategoria(categoria) {
  if (!categoria || !categoria.produtos || categoria.produtos.length === 0) {
    console.warn(`Categoria sem produtos ou dados inválidos: ${JSON.stringify(categoria)}`);
    return ''; // Se a categoria não tiver produtos, não exibe nada
  }

  const produtosHTML = categoria.produtos.map(produto => criarItemHTML(produto, categoria.nome)).join("");
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

// Função para abrir a página de produto relacionado
function abrirProdutoRelacionados(event, produtoId, categoriaNome) {
  event.preventDefault();  // Impede o comportamento padrão do link
  // Aqui você pode usar localStorage ou uma outra abordagem para passar os dados
  localStorage.setItem("produtoId", produtoId);
  localStorage.setItem("categoriaNome", categoriaNome);

  window.location.href = `produtos-relacionados.html?id=${produtoId}&categoria=${categoriaNome}`;
}

// Buscar os dados da API e renderizar no HTML
fetch(API_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Não foi possível carregar os produtos.");
    }
    return response.json();
  })
  .then(data => {
    console.log("Dados recebidos da API:", data);  // Adicionando log para verificar os dados

    // Verificando se a resposta possui a estrutura esperada
    if (!data || !data.categorias) {
      throw new Error("Estrutura de dados inválida");
    }

    const categoriasHTML = data.categorias.map(categoria => {
      // Exibir apenas 4 produtos por categoria
      if (categoria.produtos && categoria.produtos.length > 4) {
        categoria.produtos = categoria.produtos.slice(0, 4); // Limitando a 4 produtos
      }
      return criarCategoria(categoria);
    }).join("");

    // Inserindo o HTML gerado no container
    produtosContainer.innerHTML = categoriasHTML;
  })
  .catch(error => {
    console.error("Erro ao carregar os produtos:", error);
    produtosContainer.innerHTML = `<p class="error">Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>`;
  });
