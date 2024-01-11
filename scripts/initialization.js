const fs = require('fs');
const MovieService = require('../app/services/MovieService');

class initialization {
    async startDB() {
        try {
            const file = 'docs/movielist.csv';
        
            await MovieService.delAll();
            await MovieService.postFile(fs, file);
            console.log('Movies loaded!');
        } catch (error) {
            throw new Error(`Failed to load movies file: ${error.message}`);
        }
    }
}

module.exports = new initialization();