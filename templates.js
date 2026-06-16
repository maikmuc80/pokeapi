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

function evolutionTemplate(stages) {
    const items = stages.map(s => `
        <div class="evo-item">
            <img src="${s.image}" alt="${s.name}">
            <span>${s.name}</span>
        </div>
    `).join("");
    return `<div class="evo-chain">${items}</div>`;
}
