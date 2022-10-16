const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
let nextUrl;
let prevUrl;

const buttonNext = document
                        .querySelector('#next')
                        .addEventListener('click', () => main(nextUrl));
const buttonPrev = document
                        .querySelector('#prev')
                        .addEventListener('click', () => main(prevUrl));

async function main(url){
    document.querySelector('.container').innerHTML = '';
    const data = await sendRequest(url);
    nextUrl = data.next;
    prevUrl = data.previous;
    checkPrevDisabling();

    data.results.forEach(element => {
       const pokemon = new DrawPokemon(element.name, element.url);
       pokemon.createPokemonList();
    });
};

async function sendRequest(url){
    const response = await fetch(url);
    const apiData = await response.json();
    return apiData;
};

function checkPrevDisabling(){
    if (prevUrl){
        document.querySelector('#prev').disabled = false;
    }
    else{
        document.querySelector('#prev').disabled = true;
    };
};

class DrawPokemon {
    constructor(name, url){
        this.name = name;
        this.url = url;
    }

    createPokemonList(){
        const pokemonButton = document.createElement('button');
        pokemonButton.className = 'card';
        document.querySelector('.container').append(pokemonButton);
        pokemonButton.innerHTML = `${this.name}`;
        pokemonButton.addEventListener('click', () => this.drawPokemonCard());
    }

    async drawPokemonCard(){
        const getMoreData = new PokemonApi(this.url);
        const data = await getMoreData.getInfo();
        console.log(data)
    }
};

class PokemonApi {
    constructor(url){
        this.url = url;
        console.log(this.url)
    }

    async getInfo(){
        let pokemonData = {};
        const response = await sendRequest(this.url);
        pokemonData.name = response.name;
        pokemonData.img = response.sprites.front_default;
        pokemonData.stats = response.stats;
        pokemonData.ability = await this.getAbilities(response);
        
        return pokemonData;
    }

    async getAbilities(response){
        let ability = [];
        for (let i = 0; i < response.abilities.length; i++){
            const abilitiesData = await sendRequest(response.abilities[i].ability.url);
            const skill = {};
            skill.name = abilitiesData.name;            
            abilitiesData.effect_entries.forEach(element => {
                if (element.language.name === 'en'){
                    skill.effect = element.effect;
                };
            });
            ability.push(skill);
        };
        return ability;
    }
};

main(apiUrl);