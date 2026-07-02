async function CarregarCursos() {
  const container = document.getElementById("cursos-destaque");
  try {
    const resposta = await fetch("https://tecno-brasilia.fly.dev/cursos/");
    // console.log(response.status);
    const data = await resposta.json();
    console.log("Dados dos cursos:", data);

    container.innerHTML = "";
    const cursos = data.cursos.slice(0, 8);

    if (cursos.length === 0){
      container.innerHTML = "<p>Nenhum curso disponível no momento.</p>";
      return;
    }
    cursos.forEach((curso) => {
      const card = document.createElement("div");
      card.classList.add("cursos-mais-procurados");

      card.innerHTML = `
                <div class="curso-imagem">
                    <img src="${curso.imagem}" alt="${curso.curso}" class="imagem-curso">
                </div>
                <div class="curso-texto">
                    <h3>${curso.curso}</h3>
                    <p>${curso.descricao}</p>
                </div>
                <ul class="curso-info">
                    <li class="info-cursos">${curso.carga_horaria} horas</li>
                    <li class="info-cursos">${curso.nivel}</li>
                    <li class="info-cursos">${curso.categoria}</li>
                </ul>
                 <div class="curso-acao">
                    <button class="btn-matricula" data-id="${curso.id}">Matricular-se</button>
                    <span class="curso-preco">R$${curso.preco}</span>
                </div>
            `;

      container.appendChild(card);
      console.log(cursos);
    });
  } catch (erro) {
    console.error("Erro ao carregar cursos:", erro);
    container.innerHTML = "<p class='mensagem-de-erro'>Erro ao carregar cursos. Por favor, tente novamente mais tarde.</p>";
  }
}

// CarregarCursos();

document.addEventListener("DOMContentLoaded", () => {
  CarregarCursos();

  const container = document.getElementById("cursos-destaque");
  const SetaEsquerda = document.getElementById("seta-esquerda");
  const SetaDireita = document.getElementById("seta-direita");

  const quantidadeScroll = 330;

  SetaDireita.addEventListener("click", () => {
    container.scrollLeft += quantidadeScroll;
  });

  SetaEsquerda.addEventListener("click", () => {
    container.scrollLeft -= quantidadeScroll;
  });
});

document.addEventListener("DOMContentLoaded", (event) => {
  const btnMenu = document.getElementById("btn-menu");
  const navegacao = document.getElementById("navegacao-lateral");
  const overlay = document.getElementById("overlay");

  function toggleMenu() {
    navegacao.classList.toggle("ativo");
    overlay.classList.toggle("ativo");
    
    if (navegacao.classList.contains("ativo")){
      document.body.style.overflow ="hidden";
    } else{
      document.body.style.overflow = "";
    }
  }
 
  btnMenu.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);

  document.querySelectorAll("nav-paginas-lateral").forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });    

  
});

