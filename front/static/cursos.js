let todosCursos = [];
let currentPage = 1;
const cursosPorPagina = 8;
 
// O input de busca não tem id, então pegamos pela classe
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-container");
 
// O "select" de ordenação é um dropdown customizado (divs), não um <select> nativo
const options = document.querySelectorAll(".option");
let ordenacao = "Mais Populares"; // valor inicial, igual à option marcada como "selected" no HTML
 
const pagination = document.getElementById("pagination");
 
async function CarregarCursos() {
  const resposta = await fetch("https://tecno-brasilia.fly.dev/cursos/");
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
 
  // 1) filtra pelo texto digitado
  let resultado = todosCursos.filter((curso) =>
    curso.curso.toLowerCase().includes(termoBusca)
  );
 
  // 2) ordena de acordo com a opção escolhida no dropdown
  resultado = ordenarCursos(resultado, ordenacao);
 
  atualizarContadores(resultado.length);
  buildPagination(resultado);
  fillCursos(resultado);
}
 
function ordenarCursos(lista, criterio) {
  const copia = [...lista]; // evita alterar a lista original ao ordenar
  switch (criterio) {
    case "Menor preço":
      return copia.sort((a, b) => a.preco - b.preco);
    case "Maior Preço":
      return copia.sort((a, b) => b.preco - a.preco);
    case "Mais Recentes":
      // ajuste "id" para o campo de data se a API tiver um (ex: data_criacao)
      return copia.sort((a, b) => b.id - a.id);
    case "Mais Populares":
    case "Mais Procurados":
    default:
      return copia; // mantém a ordem que a API já retorna
  }
}
 
function atualizarContadores(qtdFiltrada) {
  const qtdMostrando = document.getElementById("qtd-mostrando");
  const qtdTotal = document.getElementById("qtd-total");
  if (qtdMostrando) qtdMostrando.textContent = Math.min(qtdFiltrada, cursosPorPagina);
  if (qtdTotal) qtdTotal.textContent = todosCursos.length;
}
 
function fillCursos(lista) {
  const containerCursos = document.getElementById("cursos-superior");
  const containerCursosInferior = document.getElementById("cursos-inferior");
 
  containerCursos.innerHTML = "";
  containerCursosInferior.innerHTML = "";
 
  if (lista.length === 0) {
    containerCursos.innerHTML = "<p>Nenhum curso disponível no momento.</p>";
    return;
  }
 
  const inicio = (currentPage - 1) * cursosPorPagina;
  const paginaAtual = lista.slice(inicio, inicio + cursosPorPagina);
 
  const superior = paginaAtual.slice(0, 4);
  const inferior = paginaAtual.slice(4, 8);
 
  superior.forEach((curso) => containerCursos.appendChild(criarCard(curso)));
  inferior.forEach((curso) => containerCursosInferior.appendChild(criarCard(curso)));
}
 
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
      <button class="btn-matricula" data-id="${curso.id}">Matricular-se</button>
      <span class="curso-preco">R$${curso.preco}</span>
    </div>
  `;
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
 
  pagination.appendChild(
    criarBotao("«", currentPage === 1, () => {
      currentPage--;
      renderCursos();
    })
  );
 
  for (let i = 1; i <= totalPages; i++) {
    const btn = criarBotao(i, false, () => {
      currentPage = i;
      renderCursos();
    });
    if (i === currentPage) btn.classList.add("active");
    pagination.appendChild(btn);
  }
 
  pagination.appendChild(
    criarBotao("»", currentPage === totalPages, () => {
      currentPage++;
      renderCursos();
    })
  );
}
 
// Impede que o form navegue para "/pesquisa" ao apertar Enter
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  renderCursos();
});
 
// Filtra em tempo real enquanto o usuário digita
searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderCursos();
});
 
// O dropdown customizado: cada "option" já tem seu próprio listener no
// script inline do HTML (que troca o texto exibido). Aqui só reagimos
// à escolha para reordenar a lista de cursos.
options.forEach((option) => {
  option.addEventListener("click", () => {
    ordenacao = option.dataset.value;
    currentPage = 1;
    renderCursos();
  });
});
 
CarregarCursos();