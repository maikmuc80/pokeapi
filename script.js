const API_URL = "https://pokeapi.co/api/v2/pokemon";
const PAGE_SIZE = 20;
const loadMoreBtn = document.getElementById("load-more-button");
const dialog = document.getElementById("dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogName = document.getElementById("dialog-name");
const dialogTypes = document.getElementById("dialog-types");
const dialogStats = document.getElementById("dialog-stats");

let offset = 0;
let allPokemon = [];
let currentIndex = 0;
let searchResults = [];
let evoCache = {};

const card = document.getElementById("card");
const loader = document.getElementById("loader");

function init() {
    loadPokemon();
}

function getActiveList() {
    return searchResults.length > 0 ? searchResults : allPokemon;
}

async function loadPokemon() {
    loadMoreBtn.disabled = true;
    loader.classList.add("active");
    const response = await fetch(`${API_URL}?limit=${PAGE_SIZE}&offset=${offset}`);
    const data = await response.json();
    const details = await Promise.all(data.results.map(p => fetch(p.url).then(r => r.json())));
    allPokemon.push(...details);
    details.forEach(pokemon => renderCard(pokemon));
    offset += PAGE_SIZE;
    loader.classList.remove("active");
    loadMoreBtn.disabled = false;
}

function renderCard(pokemon) {
    const index = getActiveList().indexOf(pokemon);
    card.innerHTML += cardTemplate(pokemon, index);
}

function typesTemplate(pokemon) {
    return pokemon.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join("");
}

function cardTemplate(pokemon, index) {
    const mainType = pokemon.types[0].type.name;
    const types = typesTemplate(pokemon);
    return `
        <button class="pokemon-card" data-id="card" style="background: var(--type-${mainType})" onclick="openDialog(${index})">
            <img data-id="card-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <div class="card-types">${types}</div>
        </button>
    `;
}

function openDialog(index) {
    const activeList = getActiveList();
    if (index < 0 || index >= activeList.length) return;
    currentIndex = index;
    fillDialog(activeList[index]);
    updateNavButtons(activeList);
    dialog.showModal();
    document.body.classList.add("no-scroll");
}

function updateNavButtons(activeList) {
    document.getElementById("prev-button").style.visibility = currentIndex === 0 ? "hidden" : "visible";
    document.getElementById("next-button").style.visibility = currentIndex === activeList.length - 1 ? "hidden" : "visible";
}

function fillDialog(pokemon) {
    const mainType = pokemon.types[0].type.name;
    dialogImage.src = pokemon.sprites.front_default;
    dialogName.textContent = pokemon.name;
    document.getElementById("dialog-id").textContent = "#" + String(pokemon.id).padStart(4, "0");
    dialogTypes.innerHTML = typesTemplate(pokemon);
    dialogStats.innerHTML = dialogContentTemplate(pokemon);
    document.getElementById("dialog-header").style.background = `var(--type-${mainType})`;
}

function dialogContentTemplate(pokemon) {
    return `
        ${tabsTemplate()}
        ${aboutTemplate(pokemon)}
        ${statsTemplate(pokemon)}
        ${evoTabTemplate()}
    `;
}

function tabsTemplate() {
    return `
        <div class="dialog-tabs">
            <button class="tab active" onclick="showTab('about')">About</button>
            <button class="tab" onclick="showTab('stats')">Base Stats</button>
            <button class="tab" onclick="showTab('evo')">Evolution</button>
        </div>
    `;
}

function evoTabTemplate() {
    return `<div id="tab-evo" style="display:none"></div>`;
}

function aboutTemplate(pokemon) {
    const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");
    const height = (pokemon.height / 10) + " m";
    const weight = (pokemon.weight / 10) + " kg";
    return `
        <div id="tab-about">
            <div class="info-row"><span>Species</span><span>${pokemon.name}</span></div>
            <div class="info-row"><span>Height</span><span>${height}</span></div>
            <div class="info-row"><span>Weight</span><span>${weight}</span></div>
            <div class="info-row"><span>Abilities</span><span>${abilities}</span></div>
        </div>
    `;
}

function statsTemplate(pokemon) {
    return `
        <div id="tab-stats" style="display:none">
            ${pokemon.stats.map(s => statRowTemplate(s)).join("")}
        </div>
    `;
}

function statRowTemplate(stat) {
    return `
        <div class="stat-row">
            <span class="stat-name">${stat.stat.name}</span>
            <span class="stat-val">${stat.base_stat}</span>
            <div class="stat-bar"><div class="stat-fill" style="width:${stat.base_stat}%"></div></div>
        </div>
    `;
}

function showTab(tab) {
    document.getElementById("tab-about").style.display = tab === "about" ? "block" : "none";
    document.getElementById("tab-stats").style.display = tab === "stats" ? "block" : "none";
    document.getElementById("tab-evo").style.display = tab === "evo" ? "block" : "none";
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    event.target.classList.add("active");
    if (tab === "evo") loadEvolution(getActiveList()[currentIndex]);
}

async function loadEvolution(pokemon) {
    const evoBox = document.getElementById("tab-evo");
    if (evoCache[pokemon.id]) {
        evoBox.innerHTML = evoCache[pokemon.id];
        return;
    }
    evoBox.innerHTML = `<p class="evo-loading">Loading...</p>`;
    const species = await fetch(pokemon.species.url).then(r => r.json());
    const chain = await fetch(species.evolution_chain.url).then(r => r.json());
    evoCache[pokemon.id] = evolutionTemplate(getEvolutionStages(chain.chain));
    evoBox.innerHTML = evoCache[pokemon.id];
}

function getEvolutionStages(chain) {
    const stages = [];
    let current = chain;
    while (current) {
        stages.push(evolutionEntry(current.species));
        current = current.evolves_to[0];
    }
    return stages;
}

function evolutionEntry(species) {
    const id = species.url.split("/").filter(Boolean).pop();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return { name: species.name, image };
}

function evolutionTemplate(stages) {
    const items = stages.map(s => `
        <div class="evo-item">
            <img src="${s.image}" alt="${s.name}">
            <span>${s.name}</span>
        </div>
    `).join("");
    return `<div class="evo-chain">${items}</div>`;
}

function closeDialog() {
    dialog.close();
    document.body.classList.remove("no-scroll");
}

function handleDialogClick(event) {
    if (event.target === dialog) {
        closeDialog();
    }
}

function searchPokemon() {
    const input = document.getElementById("search-input").value.toLowerCase();
    if (input.length < 3) {
        card.innerHTML = `<p data-id="not-found">Please enter at least 3 letters.</p>`;
        return;
    }
    searchResults = allPokemon.filter(p => p.name.includes(input));
    card.innerHTML = "";
    loadMoreBtn.style.display = "none";
    renderSearchResults();
}

function renderSearchResults() {
    if (searchResults.length === 0) {
        card.innerHTML = `<p data-id="not-found">No Pokémon found.</p>`;
        return;
    }
    searchResults.forEach(pokemon => renderCard(pokemon));
}

function resetSearch() {
    document.getElementById("search-input").value = "";
    searchResults = [];
    card.innerHTML = "";
    loadMoreBtn.style.display = "block";
    allPokemon.forEach(pokemon => renderCard(pokemon));
}
