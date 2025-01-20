document.addEventListener("DOMContentLoaded", () => {
  const produtoInput = document.getElementById("produto");
  const precoInput = document.getElementById("preco");
  const descricaoInput = document.getElementById("descricao");
  const picture = document.getElementById("picture");
  const btnImagem = document.querySelector(".btn__imagem");
  const adicionarBotao = document.querySelector("[data-adicionar-botao]");
  const imagemInput = document.createElement("input");

  imagemInput.setAttribute("type", "file");
  imagemInput.setAttribute("accept", "image/*");
  imagemInput.style.display = "none";
  document.body.appendChild(imagemInput);

  imagemInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        picture.src = reader.result;
        picture.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  btnImagem.addEventListener("click", () => {
    imagemInput.click();
  });

  adicionarBotao.addEventListener("click", () => {
    const nomeProduto = produtoInput.value.trim();
    const precoProduto = precoInput.value.trim();
    const descricaoProduto = descricaoInput.value.trim();

    if (nomeProduto && precoProduto && descricaoProduto && picture.src) {
      const novoProduto = {
        nome: nomeProduto,
        preco: precoProduto,
        descricao: descricaoProduto,
        imagem: picture.src,
      };

      console.log("Produto adicionado:", novoProduto);

      produtoInput.value = "";
      precoInput.value = "";
      descricaoInput.value = "";
      picture.src = "";
      picture.style.display = "none";
      alert("Produto adicionado com sucesso!");
    } else {
      alert("Por favor, preencha todos os campos corretamente!");
    }
  });

  // Verificar se o botão de cancelar adição existe e adicionar o evento
  const cancelarAdicao = document.getElementById("cancelar-adicao");

  console.log(cancelarAdicao); // Verifique se o elemento está sendo encontrado

  if (cancelarAdicao) {
    cancelarAdicao.addEventListener("click", () => {
      window.history.back();
    });
  } else {
    console.error('Botão de cancelar adição não encontrado!');
  }
});
