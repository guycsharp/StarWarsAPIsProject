describe('Character Class', function() {
    it('should create a Character instance', function() {
        const character = new Character('Luke Skywalker');
        expect(character.name).toBe('Luke Skywalker');
    });

    it('should fetch character data from API', function(done) {
        const character = new Character('Luke Skywalker');
        character.fetchCharacter().then(data => {
            expect(data.name).toBe('Luke Skywalker');
            done();
        }).catch(done.fail);
    });

    it('should save and load character data from local storage', function() {
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
        Character.saveToLocalStorage(characterData);
        const loadedData = Character.loadFromLocalStorage();
        expect(loadedData.name).toBe('Luke Skywalker');
    });
});
