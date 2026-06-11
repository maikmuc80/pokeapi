const API_URL = "https://pokeapi.co/api/v2/pokemon/1";
const PAGE_SIZE = 20;

let offset = 0;
let allPokemon = [];

const card = document.getElementById("card");
const loader = document.getElementById("loader");

function init() {
    console.log("start");
    loadFirstPokemon()
}

async function loadFirstPokemon() {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data);
    renderCard(data);
}

function renderCard(data) {
    card.innerHTML = `
        <div class="pokemon-card">
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <h2>${data.name}</h2>
            <p>${data.types[0].type.name}</p>
        </div>
    `
}