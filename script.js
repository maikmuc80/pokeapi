const API_URL = "https://pokeapi.co/api/v2/pokemon";
const PAGE_SIZE = 20;
const loadMoreBtn = document.getElementById("load-more-button");
const dialog = document.getElementById("dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogName = document.getElementById("dialog-name");
const dialogTypes = document.getElementById("dialog-types");
const dialogStats = document.getElementById("dialog-stats");
const closeBtn = document.getElementById("close-dialog-button");
const prevBtn = document.getElementById("prev-button");
const nextBtn = document.getElementById("next-button");

let offset = 0;
let allPokemon = [];
let currentIndex = 0;

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
    const index = allPokemon.indexOf(pokemon);
    card.innerHTML += `
        <div class="pokemon-card" style="background: var(--type-${mainType})" onclick="openDialog(${index})">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p class="type-badge">${pokemon.types[0].type.name}</p>
        </div>
    `;
}

function openDialog(index) {
    currentIndex = index;
    const pokemon = allPokemon[index];
    dialogImage.src = pokemon.sprites.front_default;
    dialogName.textContent = pokemon.name.toUpperCase();
    dialogTypes.innerHTML = pokemon.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join("");
    dialogStats.innerHTML = pokemon.stats.map(s => `<p>${s.stat.name}: ${s.base_stat}</p>`).join("");
    dialog.showModal();
    document.body.classList.add("no-scroll");
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


  const results = allPokemon.filter(p => p.name.includes(input));
  
  card.innerHTML = "";
  
  if (results.length === 0) {
    card.innerHTML = `<p data-id="not-found">No Pokémon found.</p>`;
    return;
  }

  results.forEach(pokemon => renderCard(pokemon));
}