const API_URL = "https://pokeapi.co/api/v2/pokemon";
const PAGE_SIZE = 20;

let offset = 0;
let allPokemon = [];

const card = document.getElementById("card");
const loader = document.getElementById("loader");

function init() {
    loadPokemon()
}

async function loadPokemon() {
    const response = await fetch(`${API_URL}?limit=${PAGE_SIZE}&offset=${offset}`);
    const data = await response.json();
    const details = await Promise.all(
        data.results.map(p => fetch(p.url).then(r => r.json()))
        );
        allPokemon.push(...details)
    details.forEach(pokemon => renderCard(pokemon));
}

function renderCard(data) {
    card.innerHTML += `
        <div class="pokemon-card">
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <h2>${data.name}</h2>
            <p>${data.types[0].type.name}</p>
        </div>
    `
}