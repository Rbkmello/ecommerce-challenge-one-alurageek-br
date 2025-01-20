document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get("id");

    const API_URL = "http://localhost:3001/categorias"; // URL da API
    const produtosContainer = document.querySelector(".produtos-relacionados");

    // Função para preencher os detalhes do produto
    function preencherDetalhesProduto(produto) {
        document.querySelector(".produto__nome").textContent = produto.nome;
        document.querySelector(".produtos__img").src = produto.imagem;
        document.querySelector(".produtos__img").alt = produto.descricao;
        document.querySelector(".produto__descricao").textContent = produto.descricao;
        document.querySelector(".preco").textContent = `R$ ${produto.preco.toFixed(2)}`;
    }

    // Função para criar o HTML dos produtos relacionados
    function criarItemHTML(produto) {
        return `
            <div class="produto-relacionado">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <p>${produto.nome}</p>
                <p>R$ ${produto.preco.toFixed(2)}</p>
                <a href="produtos-relacionados.html?id=${produto.id}" class="ver-detalhes" data-id="${produto.id}">Ver detalhes</a>
            </div>
        `;
    }

    // Função para configurar eventos de "Ver detalhes"
    function configurarEventosVerDetalhes() {
        const linksDetalhes = document.querySelectorAll(".ver-detalhes");
        linksDetalhes.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const idProduto = link.getAttribute("data-id");
                window.location.href = `produtos-relacionados.html?id=${idProduto}`;
            });
        });
    }

    // Função principal para carregar os dados do produto e relacionados
    function carregarDados() {
        if (produtoId) {
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    let produtoSelecionado = null;
                    let produtosRelacionados = [];

                    // Procura o produto nas categorias
                    data.forEach(categoria => {
                        const produto = categoria.produtos.find(prod => prod.id == produtoId);
                        if (produto) {
                            produtoSelecionado = produto;
                            produtosRelacionados = categoria.produtos.filter(prod => prod.id != produtoId); // Produtos relacionados
                        }
                    });

                    // Se o produto não foi encontrado
                    if (!produtoSelecionado) {
                        alert("Produto não encontrado.");
                        return;
                    }

                    preencherDetalhesProduto(produtoSelecionado);

                    const tituloProdutosRelacionados = `
                        <div class="produtos__titulo">
                            <p>Produtos relacionados</p>
                        </div>
                    `;

                    const produtosRelacionadosHTML = produtosRelacionados.map(criarItemHTML).join("");
                    produtosContainer.innerHTML = tituloProdutosRelacionados + produtosRelacionadosHTML;

                    configurarEventosVerDetalhes();
                })
                .catch(error => {
                    console.error("Erro ao carregar os produtos:", error);
                    produtosContainer.innerHTML = `<p class="error">Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>`;
                });
        } else {
            produtosContainer.innerHTML = `<p class="error">Produto não encontrado.</p>`;
        }
    }

    // Iniciar a função principal
    carregarDados();
});
