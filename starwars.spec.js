// Describe a test suite named "Character Class"
describe('Character Class', function() {

    // Test case to check if a Character instance is created correctly
    it('should create a Character instance', function() {
        // Create a new Character instance with the name "Luke Skywalker"
        const character = new Character('Luke Skywalker');
        // Check if the name property of the character instance is "Luke Skywalker"
        expect(character.name).toBe('Luke Skywalker');
    });

    // Test case to check if character data is fetched correctly from the API
    it('should fetch character data from API', function(done) {
        // Create a new Character instance with the name "Luke Skywalker"
        const character = new Character('Luke Skywalker');
        // Call the fetchCharacter method to get data from the API
        character.fetchCharacter().then(data => {
            // Check if the fetched data has the name "Luke Skywalker"
            expect(data.name).toBe('Luke Skywalker');
            // Indicate that the asynchronous test is complete
            done();
        }).catch(done.fail); // Handle any errors that occur during the API call
    });

    // Test case to check if character data is saved and loaded correctly from local storage
    it('should save and load character data from local storage', function() {
        // Create a mock character data object
        const characterData = {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male'
        };
        // Save the character data to local storage
        Character.saveToLocalStorage(characterData);
        // Load the character data from local storage
        const loadedData = Character.loadFromLocalStorage();
        // Check if the loaded data has the name "Luke Skywalker"
        expect(loadedData.name).toBe('Luke Skywalker');
    });
});
