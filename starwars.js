// Object to hold URLs of images for specific Star Wars characters
// If a character is not listed, a default image is used
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
    // Constructor method to initialize the Character object with a name
    constructor(name) {
        this.name = name; // The character's name
    }

    // Method to fetch character data from the Star Wars API (SWAPI)
    async fetchCharacter() {
        // Use the fetch API to get data from SWAPI based on the character's name
        const response = await fetch(`https://swapi.dev/api/people/?search=${this.name}`);
        if (!response.ok) {
            // If the response status is not OK (200), throw an error
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON data from the response
        const data = await response.json();
        // Return the first result from the fetched data (as the search may return multiple results)
        return data.results[0];
    }

    // Static method to display character data in the HTML
    static displayCharacter(character) {
        // Get the HTML element where character information will be displayed
        const characterInfo = document.getElementById('character-info');
        if (!characterInfo) {
            // If the element is not found, log an error and return
            console.error('Element with id="character-info" not found');
            return;
        }
        if (character) {
            // Select the appropriate image for the character or use the default image if not found
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
            // Make the character info section visible
            characterInfo.style.display = 'block';
        } else {
            // If no character data is found, display a 'No character found' message
            characterInfo.innerHTML = '<p>No character found</p>';
            /** Setting the display property to 'block' makes the element a block-level element, 
             * which means it will take up the full width available and start on a new line. 
             * It also makes the element visible if it was previously hidden. */
            characterInfo.style.display = 'block';
        }
    }

    // Static method to save character data to local storage
    static saveToLocalStorage(character) {
        // Convert the character data to a JSON string and save it to local storage with the key 'character'
        localStorage.setItem('character', JSON.stringify(character));
    }

    // Static method to load character data from local storage
    static loadFromLocalStorage() {
        // Retrieve the character data from local storage and parse it from a JSON string back to an object
        return JSON.parse(localStorage.getItem('character'));
    }
}

// Function to simulate a loading process with a spinner
const simulateLoading = (callback) => {
    // Get the spinner element from the HTML
    const spinner = document.getElementById('loading-spinner');
    // Display the spinner by setting its display style to 'block'
    spinner.style.display = 'block';
    // Use setTimeout to simulate a delay of 2 seconds (2000 milliseconds)
    setTimeout(() => {
        // Hide the spinner by setting its display style to 'none'
        spinner.style.display = 'none';
        // Execute the callback function passed to simulateLoading
        callback();
    }, 2000);
};

// Function to populate the character dropdown with options from SWAPI
const populateCharacterSelect = async () => {
    // Get the select element from the HTML where character names will be added
    const selectElement = document.getElementById('character-select');
    if (!selectElement) {
        // If the select element is not found, log an error and return
        console.error('Element with id="character-select" not found');
        return;
    }

    // Fetch data from SWAPI to get a list of characters
    const response = await fetch('https://swapi.dev/api/people/');
    if (!response.ok) {
        // If the response status is not OK (200), throw an error
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON data from the response
    const data = await response.json();
    // Get the list of characters from the parsed data
    const characters = data.results;

    // Loop through the list of characters and add each one as an option in the dropdown
    characters.forEach(character => {
        // Create a new option element
        const option = document.createElement('option');
        // Set the value and text of the option to the character's name
        option.value = character.name;
        option.text = character.name;
        // Add the option to the select element
        selectElement.add(option);
    });
};

// Function to handle form submission and display the selected character's information
const handleFormSubmit = async (event) => {
    // Prevent the default form submission behavior (which would reload the page)
    event.preventDefault();
    // Get the selected character's name from the dropdown menu
    const characterName = document.getElementById('character-select').value;
    // Get the element where character information will be displayed
    const characterInfo = document.getElementById('character-info');

    // Check if a character is selected
    if (characterName === '') {
        // If no character is selected, display an alert message
        alert('Please select a character');
        return;
    }

    // Simulate loading before fetching character data
    simulateLoading(async () => {
        // Create a new Character object with the selected character's name
        const character = new Character(characterName);
        try {
            // Fetch character data and display it
            const characterData = await character.fetchCharacter();
            Character.displayCharacter(characterData);
            // Save character data to local storage
            Character.saveToLocalStorage(characterData);
        } catch (error) {
            // If an error occurs during data fetching, log the error and display an alert message
            console.error('Error fetching character:', error);
            alert('Error fetching character data');
        }
    });
};

// Event listener to ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Log a message to indicate the DOM is fully loaded and parsed
    console.log('DOM fully loaded and parsed');

    // Access necessary HTML elements for later use
    const characterForm = document.getElementById('character-form');
    const characterSelect = document.getElementById('character-select');
    const characterInfo = document.getElementById('character-info');
    const spinner = document.getElementById('loading-spinner');

    // Log the accessed elements to verify they are found
    console.log('character-form:', characterForm);
    console.log('character-select:', characterSelect);
    console.log('character-info:', characterInfo);
    console.log('loading-spinner:', spinner);

    // Check if the character form element exists
    if (!characterForm) {
        // If the form element is not found, log an error and return
        console.error('Element with id="character-form" not found');
        return;
    }

    // Add an event listener for form submission to handle displaying character info
    characterForm.addEventListener('submit', handleFormSubmit);

    // Populate the character dropdown menu with data from SWAPI
    populateCharacterSelect();

    // Load character data from local storage if available and display it
    const savedCharacter = Character.loadFromLocalStorage();
    if (savedCharacter) {
        // If character data is found in local storage, display it
        Character.displayCharacter(savedCharacter);
    }
});
