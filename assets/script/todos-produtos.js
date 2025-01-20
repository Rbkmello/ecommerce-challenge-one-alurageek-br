document.addEventListener("DOMContentLoaded", () => {
    const produtosContainer = document.querySelector(".todos-produtos");
    const categoriaNome = new URLSearchParams(window.location.search).get("categoria"); // Obtém a categoria da URL

    // Verifica se categoriaNome foi obtido corretamente
    if (!categoriaNome) {
        console.error("Categoria não fornecida na URL.");
        if (produtosContainer) {
            produtosContainer.innerHTML = `<p>Categoria não fornecida na URL. Por favor, selecione uma categoria válida.</p>`;
        }
        return; // Encerra a execução se categoria não for encontrada
    }

    // Carregar produtos para a categoria selecionada
    carregarProdutos(categoriaNome);

    function carregarProdutos(categoriaNome) {
        fetch("http://localhost:3001/categorias")
            .then(response => response.json())
            .then(categorias => {
                const categoria = categorias.find(c => c.nome && c.nome.toLowerCase() === categoriaNome.toLowerCase());

                if (categoria) {
                    if (categoria.produtos && Array.isArray(categoria.produtos)) {
                        // Cria o HTML para os produtos da categoria
                        const produtosHTML = categoria.produtos.map(produto => `
                        <div class="produto__info">
                            <img class="produtos__img" src="${produto.imagem}" alt="${produto.descricao}">
                            <p class="produto__descricao">${produto.nome}</p>
                            <p class="produto__preco">R$ ${produto.preco.toFixed(2)}</p>
                            <a href="produto.html?id=${produto.id}&categoria=${produto.categoria}" class="produto__link">Ver produto</a>
                            <button class="excluir-produto" data-id="${produto.id}">Excluir</button>
                        </div>
                    `).join(''); 

                        if (produtosContainer) {
                            produtosContainer.innerHTML = produtosHTML;
                        } else {
                            console.error("Produto container não encontrado!");
                        }

                        document.getElementById("botoesOpcoes").style.display = "block"; // Exibe os botões de operações adicionais

                        // Adiciona os eventos para os botões de exclusão de produto
                        document.querySelectorAll(".excluir-produto").forEach(botao => {
                            botao.addEventListener("click", (event) => {
                                const idProduto = event.target.getAttribute("data-id");
                                excluirProduto(idProduto, categoriaNome);
                            });
                        });

                        // Adiciona eventos para os botões de edição e adição de produto
                        document.getElementById("editarProdutos").addEventListener("click", () => {
                            window.location.href = `editar-produtos.html?categoria=${categoriaNome}`;
                        });

                        document.getElementById("adicionarProduto").addEventListener("click", () => {
                            window.location.href = `adicionar-produto.html?categoria=${categoriaNome}`;
                        });

                        // Adiciona evento para excluir todos os produtos da categoria
                        document.getElementById("excluirTodosProdutos").addEventListener("click", () => {
                            excluirTodosProdutos(categoriaNome);
                        });
                    } else {
                        if (produtosContainer) {
                            produtosContainer.innerHTML = `<p>Categoria não possui produtos.</p>`;
                        }
                    }
                } else {
                    if (produtosContainer) {
                        produtosContainer.innerHTML = `<p>Categoria não encontrada.</p>`;
                    }
                }
            })
            .catch(error => {
                console.error("Erro ao carregar os produtos:", error);
                if (produtosContainer) {
                    produtosContainer.innerHTML = `<p class="error">Erro ao carregar produtos.</p>`;
                }
            });
    }

    // Função para excluir um produto individual
    function excluirProduto(idProduto, categoriaNome) {
        fetch(`http://localhost:3001/categorias/${categoriaNome.toLowerCase()}/produtos/${idProduto}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível excluir o produto.');
                }
                alert('Produto excluído com sucesso!');
                carregarProdutos(categoriaNome); // Recarrega os produtos após exclusão
            })
            .catch(error => {
                console.error('Erro ao excluir produto:', error);
                alert('Erro ao excluir o produto.');
            });
    }

    // Função para excluir todos os produtos da categoria
    function excluirTodosProdutos(categoriaNome) {
        fetch(`http://localhost:3001/categorias/${categoriaNome.toLowerCase()}/produtos`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível excluir os produtos.');
                }
                alert('Todos os produtos foram excluídos com sucesso!');
                carregarProdutos(categoriaNome); // Recarrega os produtos após exclusão
            })
            .catch(error => {
                console.error('Erro ao excluir os produtos:', error);
                alert('Erro ao excluir os produtos.');
            });
    }
});
