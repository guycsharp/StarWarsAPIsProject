// starwars.js

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
            characterInfo.innerHTML = `
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
