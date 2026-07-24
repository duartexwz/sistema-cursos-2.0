let todosCursos = [];
let currentPage = 1;
const cursosPorPagina = 8;

const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-container");

const sortOptions = document.querySelectorAll(".option");
let ordenacao = "Mais Populares";
const pagination = document.getElementById("pagination");

async function CarregarCursos() {
  const resposta = await fetch(
    "https://tecno-brasilia.fly.dev/cursos/?limit=100",
  );
  try {
    const data = await resposta.json();
    todosCursos = data.cursos;
    renderCursos();
  } catch (erro) {
    console.error("Erro ao carregar os cursos", erro);
    document.getElementById("cursos-superior").innerHTML =
      "<p class='mensagem-de-erro'>Erro ao carregar os cursos. Tente novamente mais tarde.</p>";
  }
  
}

function renderCursos() {
  const termoBusca = searchInput.value.toLowerCase();

  let resultado = todosCursos.filter((curso) =>
    curso.curso.toLowerCase().includes(termoBusca),
  );

  resultado = ordenarCursos(resultado, ordenacao);

  atualizarContadores(resultado.length);
  buildPagination(resultado);
  fillCursos(resultado);
}

function ordenarCursos(lista, criterio) {
  const copia = [...lista];
  switch (criterio) {
    case "Menor preço":
      return copia.sort((a, b) => a.preco - b.preco);
    case "Maior Preço":
      return copia.sort((a, b) => b.preco - a.preco);
    case "Mais Recentes":
      return copia.sort((a, b) => b.id - a.id);
    case "Mais Populares":
    case "Mais Procurados":
    default:
      return copia;
  }
}

function atualizarContadores(qtdFiltrada) {
  const qtdMostrando = document.getElementById("qtd-mostrando");
  const qtdTotal = document.getElementById("qtd-total");

  const inicio = (currentPage - 1) * cursosPorPagina;
  const quantidadeNaPagina = Math.min(cursosPorPagina, qtdFiltrada - inicio);

  if (qtdMostrando) qtdMostrando.textContent = Math.max(quantidadeNaPagina, 0);
  if (qtdTotal) qtdTotal.textContent = todosCursos.length;
}

function fillCursos(lista) {
  const containerCursos = document.getElementById("cursos-superior");
  const containerCursosInferior = document.getElementById("cursos-inferior");

  containerCursos.innerHTML = "";
  containerCursosInferior.innerHTML = "";

  if (lista.length === 0) {
    containerCursos.innerHTML =
      "<p class='curso-nao-disponivel'>Nenhum curso disponível no momento.</p>";
    return;
  }

  const inicio = (currentPage - 1) * cursosPorPagina;
  const paginaAtual = lista.slice(inicio, inicio + cursosPorPagina);

  let superior = paginaAtual.slice(0, 4);
  let inferior = paginaAtual.slice(4, 8);
  const largura = window.innerWidth;
   console.log("largura detectada pelo JS:", largura); 

    if (largura <= 599){
      superior = paginaAtual.slice(0, 2);
      inferior = paginaAtual.slice(2, 4);
    }
   if(largura <= 600 && largura >= 799){
      superior = paginaAtual.slice(0, 3);
      inferior = paginaAtual.slice(3, 6);
    } 
   if (largura >= 690 && largura <= 948) {
      superior = paginaAtual.slice(0, 3);
      inferior = paginaAtual.slice(3, 6);
    }
    

  superior.forEach((curso) => containerCursos.appendChild(criarCard(curso)));
  inferior.forEach((curso) =>
    containerCursosInferior.appendChild(criarCard(curso)),
  );
}

let tempoEsperaResize;

  window.addEventListener("resize", () => {
    clearTimeout(tempoEsperaResize);
    tempoEsperaResize = setTimeout(() => {
      renderCursos();
    }, 100);
  });

function criarCard(curso) {
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
      <li class="info-cursos"><span class="material-symbols-outlined">schedule</span>${curso.carga_horaria} horas</li>
      <li class="info-cursos">${curso.nivel}</li>
      <li class="info-cursos">${curso.categoria}</li>
    </ul>
    <div class="curso-acao">
     <a href="matricula.html" class="redirecionar-matricula" >
        <button class="btn-matricula" data-id="${curso.id}">Matricular-se</button>
     </a>
      <span class="curso-preco">R$${curso.preco}</span>
    </div>
  `;
  card.querySelector(".btn-matricula").addEventListener("click", () => {
    localStorage.setItem("cursoSelecionado", JSON.stringify(curso));
  });
  return card;
}

function buildPagination(list) {
  const totalPages = Math.ceil(list.length / cursosPorPagina);
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  const criarBotao = (label, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.onclick = onClick;
    return btn;
  };

  const criarReticencias = () => {
    const span = document.createElement("span");
    span.textContent = "...";
    span.classList.add("pagination-dots");
    return span;
  };

  // Botão «
  pagination.appendChild(
    criarBotao("«", currentPage === 1, () => {
      currentPage--;
      renderCursos();
    }),
  );

  const delta = 1;
  const paginasParaMostrar = new Set();

  paginasParaMostrar.add(1);
  paginasParaMostrar.add(totalPages);
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i >= 1 && i <= totalPages) paginasParaMostrar.add(i);
  }

  const paginasOrdenadas = [...paginasParaMostrar].sort((a, b) => a - b);

  let ultimaPagina = 0;
  paginasOrdenadas.forEach((i) => {
    if (i - ultimaPagina > 1) {
      pagination.appendChild(criarReticencias());
    }

    const btn = criarBotao(i, false, () => {
      currentPage = i;
      renderCursos();
    });
    if (i === currentPage) btn.classList.add("active");
    pagination.appendChild(btn);

    ultimaPagina = i;
  });

  pagination.appendChild(
    criarBotao("»", currentPage === totalPages, () => {
      currentPage++;
      renderCursos();
    }),
  );
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  renderCursos();
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderCursos();
});

sortOptions.forEach((option) => {
  option.addEventListener("click", () => {
    ordenacao = option.dataset.value;
    currentPage = 1;
    renderCursos();
  });

});
document.addEventListener("DOMContentLoaded", (event) => {
  const btnMenu = document.getElementById("btn-menu");
  const navegacao = document.getElementById("navegacao-lateral");
  const overlay = document.getElementById("overlay");

  function toggleMenu() {
    navegacao.classList.toggle("ativo");
    overlay.classList.toggle("ativo");

    if (navegacao.classList.contains("ativo")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  btnMenu.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);

  document.querySelectorAll("nav-paginas-lateral").forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });
});

CarregarCursos();