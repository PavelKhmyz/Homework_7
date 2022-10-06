let apiData;
let nextUrl = 'https://pokeapi.co/api/v2/pokemon/';
let prevUrl; 

document.addEventListener('DOMContentLoaded', () => main(nextUrl));

const buttonNext = document
                        .querySelector('#next')
                        .addEventListener('click', () => main(nextUrl));
const buttonPrev = document
                        .querySelector('#prev')
                        .addEventListener('click', () => main(prevUrl));

async function main(option){
    document.querySelector('.container').innerHTML = '';
    await sendRequest(option);
    createPokemonList();
    changeUrl();
    checkPrevDisabling();    
};

async function sendRequest(url){
    const response = await fetch(url);
    apiData = await response.json();
};

function createPokemonList () {
    for (let i = 0; i < apiData.results.length; i++){
        let info = apiData.results[i];
        const card = new AddPokemon(info);
    };
};

function changeUrl(){
    nextUrl = apiData.next;
    prevUrl = apiData.previous;
};

function checkPrevDisabling(){
    if (prevUrl){
        document.querySelector('#prev').disabled = false;
    }
    else{
        document.querySelector('#prev').disabled = true;
    }
};

class AddPokemon {
    constructor(pokemon){
        this.name = pokemon.name;
        this.url = pokemon.url;

        const CARD = document.createElement('button');
        CARD.className = 'card';
        document.querySelector('.container').append(CARD);
        CARD.innerHTML = `${this.name}`

        CARD.addEventListener('click', () => this.getPokemonInfo());
    }

    async getPokemonInfo(){
        const response = await fetch(this.url);
        const data = await response.json();
        
        let abilities = [];
        for(let i = 0; i < data.abilities.length; i++){
            const secondResponse = await fetch(data.abilities[i].ability.url)
            const abilitiesData = await secondResponse.json();
            abilities.push(abilitiesData)
        }

        this.recordPokemonInfo(data, abilities);
    }

    recordPokemonInfo(data, abilities){
        document.querySelector('.pokeName').innerHTML = `${data.name}`;

        document.querySelector('.pokeImg').innerHTML = `<img src="${data.sprites.front_default}" class="pokemonPic">`;

        document.querySelector('.hpValue').innerHTML = `${data.stats[0].base_stat}`;
        document.querySelector('.atkValue').innerHTML = `${data.stats[1].base_stat}`;
        document.querySelector('.defValue').innerHTML = `${data.stats[2].base_stat}`;

        document.querySelector('.firstSkillName').innerHTML = `${abilities[0].name}`;
        document.querySelector('.firstSkillEffect').innerHTML = `${abilities[0].effect_entries[0].short_effect}`;

        document.querySelector('.secondSkillName').innerHTML = `${abilities[1].name}`;
        document.querySelector('.secondSkillEffect').innerHTML = `${abilities[1].effect_entries[0].short_effect}`;
        
        document.querySelector('.bigContainer').style.display = 'flex';
        document.querySelector('.closeButton').addEventListener('click', closeCard);
    }
}

function closeCard(){
    document.querySelector('.bigContainer').style.display = '';
}