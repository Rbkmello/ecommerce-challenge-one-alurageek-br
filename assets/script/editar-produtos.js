document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get("id");
    const categoriaNome = params.get("categoria");

    const nomeInput = document.getElementById("nome-produto");
    const codigoInput = document.getElementById("codigo-produto");
    const precoInput = document.getElementById("preco-produto");
    const produtoIdInput = document.getElementById("produto-id");
    const categoriaInput = document.getElementById("categoria-produto");
    const form = document.getElementById("form-editar-produto");

    // Logar a URL da API para depuração
    console.log(`URL da API: http://localhost:3001/categorias/${categoriaNome.toLowerCase()}/produtos/${produtoId}`);
    console.log(`Categoria: ${categoriaNome}, Produto ID: ${produtoId}`);

    // Carregar os dados do produto
    fetch(`http://localhost:3001/categorias/${categoriaNome.toLowerCase()}/produtos/${produtoId}`)
        .then(response => {
            if (!response.ok) {
                // Exibe o erro detalhado no console para ajudar na depuração
                console.error(`Erro ao buscar produto: ${response.statusText} (Código: ${response.status})`);
                throw new Error(`Erro ao buscar produto: ${response.statusText} (Código: ${response.status})`);
            }
            return response.json();  // Parseia o JSON apenas se a resposta for válida
        })
        .then(produto => {
            if (produto) {
                nomeInput.value = produto.nome;
                codigoInput.value = produto.codigo;
                precoInput.value = produto.preco;
                produtoIdInput.value = produto.id;
                categoriaInput.value = categoriaNome;
            } else {
                // Produto não encontrado, mas a requisição foi bem-sucedida
                alert("Produto não encontrado.");
            }
        })
        .catch(error => {
            console.error("Erro ao carregar produto:", error);
            alert(`Erro ao carregar os dados do produto: ${error.message}`);
        });

    // Submeter o formulário para atualizar os dados do produto
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nome = nomeInput.value;
        const codigo = codigoInput.value;
        const preco = parseFloat(precoInput.value);
        const idProduto = produtoIdInput.value;
        const categoria = categoriaInput.value;

        const produtoAtualizado = {
            nome: nome,
            codigo: codigo,
            preco: preco
        };

        // Enviar os dados para a API (PUT)
        fetch(`http://localhost:3001/categorias/${categoria.toLowerCase()}/produtos/${idProduto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoAtualizado)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao atualizar produto: ${response.statusText} (Código: ${response.status})`);
                }
                alert("Produto atualizado com sucesso!");
                window.location.href = `produtos-relacionados.html?categoria=${categoria}`;
            })
            .catch(error => {
                console.error("Erro ao atualizar o produto:", error);
                alert(`Erro ao atualizar o produto: ${error.message}`);
            });
    });

    // Botão de cancelar edição
    document.getElementById("cancelar-edicao").addEventListener("click", () => {
        window.history.back(); // Volta para a página anterior
    });
});
