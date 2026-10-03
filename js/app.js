// Os dados ficam apenas na memória.
// Se a página for atualizada, eles voltam ao estado inicial.
const jogos = [
  { id: 1, nome: "The Legend of Zelda: Breath of the Wild", genero: "Aventura", plataforma: "Nintendo Switch", ano: 2017, favorito: true },
  { id: 2, nome: "Hollow Knight", genero: "Metroidvania", plataforma: "PC", ano: 2017, favorito: false },
  { id: 3, nome: "Celeste", genero: "Plataforma", plataforma: "PC", ano: 2018, favorito: false }
];

let proximoId = 4;
let somenteFavoritos = false;

const app = document.querySelector("#app");
const botoesMenu = document.querySelectorAll("nav button");

// Evita que texto digitado vire HTML (segurança básica)
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function marcarMenuAtivo(rota) {
  botoesMenu.forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.rota === rota);
  });
}

function irPara(rota) {
  marcarMenuAtivo(rota);

  if (rota === "inicio") mostrarInicio();
  if (rota === "cadastro") mostrarCadastro();
  if (rota === "catalogo") mostrarCatalogo();
  if (rota === "sobre") mostrarSobre();
}

function mostrarInicio() {
  const favoritos = jogos.filter(j => j.favorito).length;

  app.innerHTML = `
    <section class="destaque">
      <h1>Bem-vindo ao GameKada</h1>
      <p>
        Seu catálogo de jogos em uma SPA feita com HTML, CSS e JavaScript.
        A navegação acontece sem recarregar a página.
      </p>
      <p>
        Os jogos cadastrados ficam temporariamente guardados em um array JavaScript.
      </p>

      <div class="contador">
        Jogos no catálogo: <strong>${jogos.length}</strong> |
        Favoritos: <strong>${favoritos}</strong>
      </div>

      <div class="acoes">
        <button class="botao" id="btnCadastrar">Cadastrar jogo</button>
        <button class="botao secundario" id="btnVerCatalogo">Ver meus jogos</button>
      </div>
    </section>
  `;

  document.querySelector("#btnCadastrar")
    .addEventListener("click", () => irPara("cadastro"));

  document.querySelector("#btnVerCatalogo")
    .addEventListener("click", () => irPara("catalogo"));
}

function mostrarCadastro() {
  app.innerHTML = `
    <h1>Cadastrar Jogo</h1>

    <form id="formJogo">
      <div class="campo">
        <label for="nome">Nome do jogo</label>
        <input id="nome" type="text" placeholder="Digite o nome do jogo" required />
      </div>

      <div class="campo">
        <label for="genero">Gênero</label>
        <select id="genero" required>
          <option value="Ação">Ação</option>
          <option value="Aventura">Aventura</option>
          <option value="RPG">RPG</option>
          <option value="Plataforma">Plataforma</option>
          <option value="Estratégia">Estratégia</option>
          <option value="Esporte">Esporte</option>
          <option value="Corrida">Corrida</option>
          <option value="Terror">Terror</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <div class="campo">
        <label for="plataforma">Plataforma</label>
        <input id="plataforma" type="text" placeholder="Ex.: PC, PlayStation, Xbox, Switch" required />
      </div>

      <div class="campo">
        <label for="ano">Ano de lançamento</label>
        <input id="ano" type="number" min="1970" max="2100" placeholder="Ex.: 2020" required />
      </div>

      <button class="botao" type="submit">Salvar jogo</button>
      <div id="mensagem"></div>
    </form>
  `;

  document.querySelector("#formJogo").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const genero = document.querySelector("#genero").value;
    const plataforma = document.querySelector("#plataforma").value.trim();
    const ano = Number(document.querySelector("#ano").value);

    jogos.push({
      id: proximoId++,
      nome,
      genero,
      plataforma,
      ano,
      favorito: false
    });

    document.querySelector("#mensagem").innerHTML =
      `<div class="mensagem">Jogo cadastrado com sucesso.</div>`;

    evento.target.reset();
  });
}

function mostrarCatalogo() {
  app.innerHTML = `
    <h1>Meus Jogos</h1>
    <p>Os cartões abaixo são criados dinamicamente pelo JavaScript a partir do array de jogos.</p>

    <div class="filtros">
      <button class="botao secundario" id="btnFiltro"></button>
    </div>

    <div id="conteudoCatalogo"></div>
  `;

  document.querySelector("#btnFiltro").addEventListener("click", () => {
    somenteFavoritos = !somenteFavoritos;
    renderizarCatalogo();
  });

  renderizarCatalogo();
}

function renderizarCatalogo() {
  const conteudo = document.querySelector("#conteudoCatalogo");
  const btnFiltro = document.querySelector("#btnFiltro");

  btnFiltro.textContent = somenteFavoritos ? "Mostrar todos" : "Mostrar só favoritos";

  const lista = somenteFavoritos ? jogos.filter(j => j.favorito) : jogos;

  if (lista.length === 0) {
    conteudo.innerHTML = `
      <div class="vazio">
        ${somenteFavoritos ? "Nenhum jogo favorito ainda." : "Nenhum jogo cadastrado ainda."}
      </div>
    `;
    return;
  }

  let cartoes = "";

  lista.forEach(jogo => {
    cartoes += `
      <div class="cartao ${jogo.favorito ? "favorito" : ""}">
        <h3>${escapar(jogo.nome)}</h3>
        <span class="info">Gênero: ${escapar(jogo.genero)}</span>
        <span class="info">Plataforma: ${escapar(jogo.plataforma)}</span>
        <span class="info">Ano: ${jogo.ano}</span>
        <div class="botoes">
          <button class="favoritar" data-id="${jogo.id}">
            ${jogo.favorito ? "★ Favorito" : "☆ Favoritar"}
          </button>
          <button class="excluir" data-id="${jogo.id}">Excluir</button>
        </div>
      </div>
    `;
  });

  conteudo.innerHTML = `<div class="grade">${cartoes}</div>`;

  document.querySelectorAll(".favoritar").forEach(botao => {
    botao.addEventListener("click", function () {
      const id = Number(this.dataset.id);
      const jogo = jogos.find(j => j.id === id);
      jogo.favorito = !jogo.favorito;
      renderizarCatalogo();
    });
  });

  document.querySelectorAll(".excluir").forEach(botao => {
    botao.addEventListener("click", function () {
      const id = Number(this.dataset.id);
      const indice = jogos.findIndex(j => j.id === id);
      jogos.splice(indice, 1);
      renderizarCatalogo();
    });
  });
}

function mostrarSobre() {
  app.innerHTML = `
    <h1>Sobre o projeto</h1>
    <p>
      O Gamekada é uma Single Page Application simples de catálogo de jogos.
    </p>
    <p>
      Existe apenas um arquivo HTML. Ao clicar nas opções do menu,
      o JavaScript modifica o conteúdo do elemento <strong>#app</strong>.
    </p>
    <p>
      O projeto demonstra cadastro em array, manipulação do DOM,
      eventos de clique, envio de formulário, listagem dinâmica,
      favoritos e exclusão.
    </p>
  `;
}

botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => {
    irPara(botao.dataset.rota);
  });
});

mostrarInicio();
