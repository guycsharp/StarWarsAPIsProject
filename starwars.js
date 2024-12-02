const characterImages = {
    'default': 'https://static.wikia.nocookie.net/starwars/images/c/cc/Star-wars-logo-new-tall.jpg/revision/latest/scale-to-width-down/1000?cb=20190313021755',
    // Other character images...
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
    
    const characterForm = document.getElementById('character-form');
    if (!characterForm) {
        console.error('Element with id="character-form" not found');
        return;
    }

    console.log('character-form element found:', characterForm);

    // Add a simple event listener to test
    characterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Form submitted!');
    });
});
