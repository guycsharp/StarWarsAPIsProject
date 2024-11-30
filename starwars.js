// starwars.js

// Static image URLs for some characters
const characterImages = {
    'default':'https://static.wikia.nocookie.net/starwars/images/c/cc/Star-wars-logo-new-tall.jpg/revision/latest/scale-to-width-down/1000?cb=20190313021755',
    'Luke Skywalker': 'https://media.contentapi.ea.com/content/dam/star-wars-battlefront-2/images/2019/08/swbf2-refresh-hero-large-heroes-page-luke-skywalker-16x9-xl.jpg.adapt.crop16x9.1920w.jpg',
    'Darth Vader': 'https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720',
    'Leia Organa': 'https://lumiere-a.akamaihd.net/v1/images/leia-organa-main_9af6ff81.jpeg?region=187%2C157%2C1400%2C786',
    'C-3PO': 'https://lumiere-a.akamaihd.net/v1/images/c-3po-main_d6850e28.jpeg?region=176%2C0%2C951%2C536',
    'R2-D2': 'https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg?region=273%2C0%2C951%2C536',
    'Owen Lars':'https://lumiere-a.akamaihd.net/v1/images/owen-lars-main_08c717c8.jpeg?region=0%2C34%2C1053%2C593',
    'Beru Whitesun lars':'https://lumiere-a.akamaihd.net/v1/images/beru-lars-main_fa680a4c.png?region=342%2C0%2C938%2C527',
    'R5-D4':'https://static.wikia.nocookie.net/starwars/images/3/3f/R5D4-AG.png/revision/latest?cb=20230317020800',
    'Biggs Darklighter':'https://static.wikia.nocookie.net/starwars/images/0/00/BiggsHS-ANH.png/revision/latest?cb=20130305010406https://static.wikia.nocookie.net/starwars/images/0/00/BiggsHS-ANH.png/revision/latest?cb=20130305010406',
    'Obi-Wan Kenobi':'https://lumiere-a.akamaihd.net/v1/images/obi-wan-kenobi-main_3286c63c.jpeg?region=0%2C0%2C1280%2C721'
};

// Character class with methods to fetch and display data
class Character {
    constructor(name) {
        this.name = name;
    }

    async fetchCharacter() {
        const response = await fetch(`https://swapi.dev/api/people/?search=${this.name}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results[0];
    }

    static displayCharacter(character) {
        const characterInfo = document.getElementById('character-info');
        if (character) {
            const characterImage = characterImages[character.name] || characterImages['default'];
            characterInfo.innerHTML = `
                <img src="${characterImage}" alt="${character.name}" class="img-fluid mb-3">
                <h2>${character.name}</h2>
                <p><strong>Height:</strong> ${character.height} cm</p>
                <p><strong>Mass:</strong> ${character.mass} kg</p>
                <p><strong>Hair Color:</strong> ${character.hair_color}</p>
                <p><strong>Skin Color:</strong> ${character.skin_color}</p>
                <p><strong>Eye Color:</strong> ${character.eye_color}</p>
                <p><strong>Birth Year:</strong> ${character.birth_year}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
            `;
            characterInfo.style.display = 'block';
        } else {
            characterInfo.innerHTML = '<p>No character found</p>';
            characterInfo.style.display = 'block';
        }
    }
}

// Function to populate the dropdown with character options
const populateCharacterSelect = async () => {
    const selectElement = document.getElementById('character-select');
    const response = await fetch('https://swapi.dev/api/people/');
    const data = await response.json();
    const characters = data.results;

    characters.forEach(character => {
        const option = document.createElement('option');
        option.value = character.name;
        option.text = character.name;
        selectElement.add(option);
    });
};

// Function to handle form submission
const handleFormSubmit = async (event) => {
    event.preventDefault();
    const characterName = document.getElementById('character-select').value;
    const spinner = document.getElementById('loading-spinner');
    const characterInfo = document.getElementById('character-info');

    if (characterName === '') {
        alert('Please select a character');
        return;
    }

    spinner.style.display = 'block'; // Show spinner
    characterInfo.style.display = 'none'; // Hide character info

    const character = new Character(characterName);
    try {
        const characterData = await character.fetchCharacter();
        Character.displayCharacter(characterData);
    } catch (error) {
        console.error('Error fetching character:', error);
        alert('Error fetching character data');
    } finally {
        spinner.style.display = 'none'; // Hide spinner
    }
};

// Adding event listener to the form
document.getElementById('character-form').addEventListener('submit', handleFormSubmit);

// Populate the character select dropdown on page load
document.addEventListener('DOMContentLoaded', populateCharacterSelect);
