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
    document.querySelector('.list').innerHTML = '';
    const getApi = await sendRequest(url);
    nextUrl = getApi.next;
    prevUrl = getApi.previous;
    checkPrevDisabling();

    getApi.results.forEach(element => {
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
        document.querySelector('.list').append(pokemonButton);
        pokemonButton.innerHTML = `${this.name}`;
        pokemonButton.addEventListener('click', () => this.drawPokemonCard());
    }

    async drawPokemonCard(){
        const getMoreData = new PokemonApi(this.url);
        const data = await getMoreData.getInfo();
        console.log(data)
        this.drawCard(data)
    }

    drawCard(data){
        let card = document.createElement('div');
        card.className = 'pokemon';
        document.querySelector('.pokemonCardsContent').append(card);

        const pokemonName = document.createElement('div')
        pokemonName.className = 'pokemonName';
        card.append(pokemonName);
        pokemonName.innerHTML = `${data.name}`;

        const spriteBlock = document.createElement('div');
        spriteBlock.className = 'sprite';
        pokemonName.after(spriteBlock);
        spriteBlock.innerHTML = `<img src="${data.img}">`

        const statsBlock = document.createElement('div');
        statsBlock.className = 'stats';
        spriteBlock.after(statsBlock);
        statsBlock.innerHTML = `<span>HP: ${data.stats[0].base_stat}</span><span>ATK: ${data.stats[1].base_stat}</span><span>DEF: ${data.stats[2].base_stat}</span>`

        const abilitiesBlock = document.createElement('div');
        abilitiesBlock.className = 'abilities';
        statsBlock.after(abilitiesBlock);

        const closeButton = document.createElement('button');
        closeButton.className = 'close';
        pokemonName.append(closeButton);
        closeButton.innerHTML = '<img class="xMark" src="src/xmark-solid.svg">';
        closeButton.addEventListener('click', () => this.closeCard(card))

        data.ability.forEach(element =>{
            const abilityText = document.createElement('p');
            abilityText.className = 'skill';
            abilitiesBlock.append(abilityText);
            abilityText.innerHTML = `${element.name}: ${element.effect}`
        })

    }

    closeCard(card){
        card.remove()
    };
};

class PokemonApi {
    constructor(url){
        this.url = url;
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
                    skill.effect = element.short_effect;
                };
            });
            ability.push(skill);
        };
        return ability;
    }
};

main(apiUrl);