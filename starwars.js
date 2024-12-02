const characterImages = {
    'default': 'https://static.wikia.nocookie.net/starwars/images/c/cc/Star-wars-logo-new-tall.jpg/revision/latest/scale-to-width-down/1000?cb=20190313021755',
    'Luke Skywalker': 'https://media.contentapi.ea.com/content/dam/star-wars-battlefront-2/images/2019/08/swbf2-refresh-hero-large-heroes-page-luke-skywalker-16x9-xl.jpg.adapt.crop16x9.1920w.jpg',
    'Darth Vader': 'https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720',
    'Leia Organa': 'https://lumiere-a.akamaihd.net/v1/images/leia-organa-main_9af6ff81.jpeg?region=187%2C157%2C1400%2C786',
    'C-3PO': 'https://lumiere-a.akamaihd.net/v1/images/c-3po-main_d6850e28.jpeg?region=176%2C0%2C951%2C536',
    'R2-D2': 'https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg?region=273%2C0%2C951%2C536',
    'Owen Lars': 'https://lumiere-a.akamaihd.net/v1/images/owen-lars-main_08c717c8.jpeg?region=0%2C34%2C1053%2C593',
    'Beru Whitesun lars': 'https://lumiere-a.akamaihd.net/v1/images/beru-lars-main_fa680a4c.png?region=342%2C0%2C938%2C527',
    'R5-D4': 'https://lumiere-a.akamaihd.net/v1/images/r5-d4_main_image_7d5f078e.jpeg?region=374%2C0%2C1186%2C666',
    'Biggs Darklighter': 'https://lumiere-a.akamaihd.net/v1/images/image_606ff7f7.jpeg?region=0%2C0%2C1560%2C878',
    'Obi-Wan Kenobi': 'https://lumiere-a.akamaihd.net/v1/images/obi-wan-kenobi-main_3286c63c.jpeg?region=0%2C0%2C1280%2C721'
};

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
        if (!characterInfo) {
            console.error('Element with id="character-info" not found');
            return;
        }
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

    static saveToLocalStorage(character) {
        localStorage.setItem('character', JSON.stringify(character));
    }

    static loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem('character'));
    }
}

const simulateLoading = (callback) => {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none';
        callback();
    }, 2000);
};

const populateCharacterSelect = async () => {
    const selectElement = document.getElementById('character-select');
    if (!selectElement) {
        console.error('Element with id="character-select" not found');
        return;
    }

    const response = await fetch('https://swapi.dev/api/people/');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const characters = data.results;

    characters.forEach(character => {
        const option = document.createElement('option');
        option.value = character.name;
        option.text = character.name;
        selectElement.add(option);
    });
};

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const characterName = document.getElementById('character-select').value;
    const characterInfo = document.getElementById('character-info');

    if (characterName === '') {
        alert('Please select a character');
        return;
    }

    simulateLoading(async () => {
        const character = new Character(characterName);
        try {
            const characterData = await character.fetchCharacter();
            Character.displayCharacter(characterData);
            Character.saveToLocalStorage(characterData);
        } catch (error) {
            console.error('Error fetching character:', error);
            alert('Error fetching character data');
        }
    });
};

// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    // Attempting to access elements
    const characterForm = document.getElementById('character-form');
    const characterSelect = document.getElementById('character-select');
    const characterInfo = document.getElementById('character-info');
    const spinner = document.getElementById('loading-spinner');

    // Logging the results to verify access
    console.log('character-form:', characterForm);
    console.log('character-select:', characterSelect);
    console.log('character-info:', characterInfo);
    console.log('loading-spinner:', spinner);

    // Check and log if elements are found
    if (!characterForm) {
        console.error('Element with id="character-form" not found');
        return;
    }
    
    // Adding basic event listener to check functionality
    characterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Form submitted!');
    });

    // Adding options to select element to verify functionality
    const populateCharacterSelect = () => {
        if (!characterSelect) {
            console.error('Element with id="character-select" not found');
            return;
        }

        const characters = ['Luke Skywalker', 'Darth Vader', 'Leia Organa'];
        characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character;
            option.text = character;
            characterSelect.add(option);
        });
    };

    populateCharacterSelect();
});
