// Object to hold URLs of images for specific Star Wars characters
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


// Class to handle fetching, displaying, and storing character data
class Character {
    constructor(name) {
        // Initialize with the character's name
        this.name = name;
    }

    // Method to fetch character data from SWAPI
    async fetchCharacter() {
        const response = await fetch(`https://swapi.dev/api/people/?search=${this.name}`);
        if (!response.ok) {
            // If the response is not okay, throw an error
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON data from the response
        const data = await response.json();
        // Return the first result (as the search can return an array)
        return data.results[0];
    }

    // Method to display character data in the HTML
    static displayCharacter(character) {
        const characterInfo = document.getElementById('character-info');
        // Check if the element for displaying character info exists
        if (!characterInfo) {
            console.error('Element with id="character-info" not found');
            return;
        }
        // If character data is provided, display it
        if (character) {
            // Select the appropriate character image or use the default
            const characterImage = characterImages[character.name] || characterImages['default'];
            // Update the HTML content with character information
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
            // Make the character info visible
            characterInfo.style.display = 'block';
        } else {
            // If no character is found, display a message
            characterInfo.innerHTML = '<p>No character found</p>';
            characterInfo.style.display = 'block';
        }
    }

    // Method to save character data to local storage
    static saveToLocalStorage(character) {
        localStorage.setItem('character', JSON.stringify(character));
    }

    // Method to load character data from local storage
    static loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem('character'));
    }
}

// Function to simulate a loading process with a spinner
const simulateLoading = (callback) => {
    const spinner = document.getElementById('loading-spinner');
    // Display the spinner
    spinner.style.display = 'block';
    // Wait for 2 seconds (2000 milliseconds)
    setTimeout(() => {
        // Hide the spinner and execute the callback function
        spinner.style.display = 'none';
        callback();
    }, 2000);
};

// Function to populate the character dropdown with options from SWAPI
const populateCharacterSelect = async () => {
    const selectElement = document.getElementById('character-select');
    // Check if the select element exists
    if (!selectElement) {
        console.error('Element with id="character-select" not found');
        return;
    }

    const response = await fetch('https://swapi.dev/api/people/');
    // If the response is not okay, throw an error
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const characters = data.results;

    // Add each character as an option in the dropdown menu
    characters.forEach(character => {
        const option = document.createElement('option');
        option.value = character.name;
        option.text = character.name;
        selectElement.add(option);
    });
};

// Function to handle form submission and display the selected character's information
const handleFormSubmit = async (event) => {
    event.preventDefault();
    const characterName = document.getElementById('character-select').value;
    const characterInfo = document.getElementById('character-info');

    // Check if a character is selected
    if (characterName === '') {
        alert('Please select a character');
        return;
    }

    // Simulate loading before fetching character data
    simulateLoading(async () => {
        const character = new Character(characterName);
        try {
            // Fetch character data and display it
            const characterData = await character.fetchCharacter();
            Character.displayCharacter(characterData);
            // Save character data to local storage
            Character.saveToLocalStorage(characterData);
        } catch (error) {
            console.error('Error fetching character:', error);
            alert('Error fetching character data');
        }
    });
};

// Event listener to ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Access necessary HTML elements
    const characterForm = document.getElementById('character-form');
    const characterSelect = document.getElementById('character-select');
    const characterInfo = document.getElementById('character-info');
    const spinner = document.getElementById('loading-spinner');

    // Log the elements for debugging
    console.log('character-form:', characterForm);
    console.log('character-select:', characterSelect);
    console.log('character-info:', characterInfo);
    console.log('loading-spinner:', spinner);

    // Check if the character form element exists
    if (!characterForm) {
        console.error('Element with id="character-form" not found');
        return;
    }

    // Add event listener for form submission
    characterForm.addEventListener('submit', handleFormSubmit);

    // Populate the character dropdown menu with data from SWAPI
    populateCharacterSelect();

    // Load character from local storage if available and display it
    const savedCharacter = Character.loadFromLocalStorage();
    if (savedCharacter) {
        Character.displayCharacter(savedCharacter);
    }
});
