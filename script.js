const API_URL = "https://pokeapi.co/api/v2/pokemon";
const PAGE_SIZE = 20;
const loadMoreBtn = document.getElementById("load-more-button");

let offset = 0;
let allPokemon = [];

const card = document.getElementById("card");
const loader = document.getElementById("loader");

function init() {
    loadPokemon()
}

async function loadPokemon() {
    loadMoreBtn.disabled = true;
    const response = await fetch(`${API_URL}?limit=${PAGE_SIZE}&offset=${offset}`);
    const data = await response.json();
    const details = await Promise.all(
        data.results.map(p => fetch(p.url).then(r => r.json()))
        );
        allPokemon.push(...details);
        details.forEach(pokemon => renderCard(pokemon));
    offset += PAGE_SIZE;
    loadMoreBtn.disabled = false;
    console.log(offset);
}

function renderCard(pokemon) {
    const mainType = pokemon.types[0].type.name;
    card.innerHTML += `
        <div class="pokemon-card" style="background: var(--type-${mainType})">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p>${pokemon.types[0].type.name}</p>
        </div>
    `;
}