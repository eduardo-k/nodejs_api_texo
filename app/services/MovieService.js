const fs = require('fs');
const Movie = require('../models/Movie');
const NotFoundError = require('../errors/NotFoundError');
const ImportFileError = require('../errors/ImportFileError');

class MovieService {
    /**
     * Get all movies.
     * @param {object} where
     * @param {array} order
     * @returns {array}
     */
    async getAll(where = {}, order = []) {
        return await Movie.findAll({ where, order });
    }

    /**
     * Get a movie by id (primary key)
     * @param {integer} movieId
     * @returns {Movie}
     */
    async getById(movieId) {
        return await Movie.findByPk(movieId);
    }

    /**
     * Delete all movies
     * @returns {void}
     */
    async delAll() {
        try {
            await Movie.truncate();
        } catch (error) {
            throw new Error(`Failed to delete movies: ${error.message}`);
        }
    }

    /**
     * Delete a movie by id (primary key)
     * @param {integer} movieId
     * @returns {void}
     */
    async delById(movieId) {
        const movie = await Movie.findByPk(movieId);
  
        if (!movie) {
          throw new NotFoundError(`Movie id ${movieId} not found`);
        }

        try {
            await movie.destroy();
        } catch (error) {
            throw new Error(`Failed to delete movie id ${movieId}: ${error.message}`);
        }
    }

    /**
     * Post a movie
     * @param {object} movie
     * @returns {void}
     */
    async post(movie) {
        const object = {
            year: movie.year,
            title: movie.title,
            studios: movie.studios,
            producers: movie.producers,
            winner: movie.winner
        }

        return Movie.create(object);
    }

    /** 
     * Load a CSV file of movies
     * @param {fs} fs
     * @param {string} file
     * @returns {void}
    */
    async postFile(fs, file) {
        return new Promise((resolve, reject) => {
            const { parse } = require("csv-parse");
            const results = [];

            fs.createReadStream(file)
            .pipe(parse({ delimiter: ";", from_line: 2 }))
            .on("data", function (row) {
                const arrayProducers = row[3].split(/, and | and |, /);
                const cleanArrayProducers = arrayProducers.map(function(item) {
                    return item.trim();
                });
        
                results.push(
                    Movie.create({
                        year: row[0],
                        title: row[1],
                        studios: row[2],
                        producers: cleanArrayProducers,
                        winner: (row[4] == "yes") ? true : false
                    })
                );
            })
            .on("end", async () => {
                try {
                    await Promise.all(results);
                    resolve(true);
                } catch (error) {
                    reject(new ImportFileError(error.message));
                }
            })
            .on("error", function (error) {
                reject(new ImportFileError(error.message));
            });
        });
    }

    /**
     * Get all winning producers
     * @returns {array}
     */
    async getWinners() {
        let producers = [];
        const winningMovies = await this.getAll({ winner: true }, [['year', 'ASC']]);
    
        winningMovies.forEach(function(movie) {
            movie.producers.forEach(function(movieProducer) {
    
                const producer = producers.filter(
                    (producer) => producer.name === movieProducer
                );
        
                if (producer.length === 0) {
                    producers.push({
                        name: movieProducer,
                        awards: [movie.year]
                    });
                }
                else {
                    producer[0].awards.push(movie.year);
                }
            });
        });

        return producers;
    }

    /**
     * Get the answer of the challenge
     * @returns {object}
     */
    async getAnswer() {
        const producers = await this.getWinners();

        let counter = { min: null, max: null };
        let answer = { min: [], max: [] };

        producers.forEach(function(producer) {
            if (producer.awards.length < 2) {
              return;
            }

            let firstAward;
            let lastAward;

            producer.awards.forEach(function(year) {
                if (firstAward === undefined) {
                    firstAward = year;
                    lastAward = year;
                    return;
                }

                const minPeriod = (year - lastAward);
                counter.min = counter.min ?? minPeriod;

                if (minPeriod <= counter.min) {
                    if (minPeriod < counter.min) {
                        answer.min = [];
                        counter.min = minPeriod;
                    }

                    answer.min.push({
                        producer: producer.name,
                        interval: counter.min,
                        previousWin: lastAward,
                        followingWin: year
                    });
                }
                lastAward = year;

                const maxPeriod = (year - firstAward);
                counter.max = counter.max ?? maxPeriod;

                if (maxPeriod >= counter.max) {
                    if (maxPeriod > counter.max) {
                        answer.max = [];
                        counter.max = maxPeriod;
                    }

                    answer.max.push({
                        producer: producer.name,
                        interval: counter.max,
                        previousWin: firstAward,
                        followingWin: year
                    });
                }
            });
        });

        return answer;
    }
}

module.exports = new MovieService();