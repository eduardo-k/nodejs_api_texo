const chai = require('chai');
chai.should();
const { expect } = require('chai');

const fs = require('fs');
const MovieService = require('../../app/services/MovieService');
const Movie = require('../../app/models/Movie');
const movies = require('../fixtures/movies');
const Helpers = require('../helper');

describe('MovieService Integration Tests', () => {

    beforeEach(async () => await Movie.truncate());

    describe('getAll()', () => {
        it('should get all movies', async () => {
            await Movie.bulkCreate(movies);

            const result = await MovieService.getAll();
            const resultAsArray = Helpers.resultsToCleanArray(result);

            resultAsArray.should.be.deep.equal(movies);
        });

        it('should get all movies filtered by winner true', async () => {
            await Movie.bulkCreate(movies);

            const result = await MovieService.getAll({ winner: true });
            const resultAsArray = Helpers.resultsToCleanArray(result);

            winningMovies = [movies[2], movies[3]];

            resultAsArray.should.be.deep.equal(winningMovies);
        });
    });

    describe('getById()', () => {
        it('should get a movie by id', async () => {
            const movieId = 1;
            movies[0].id = movieId;
            await Movie.bulkCreate(movies);

            const result = await MovieService.getById(movieId);
            const resultAsObject = Helpers.resultToCleanObject(result, ['createdAt', 'updatedAt']);

            resultAsObject.should.be.deep.equal(movies[0]);
        });
    });

    describe('delAll()', () => {
        it('should delete all movies', async () => {
            await Movie.bulkCreate(movies);

            const count = await Movie.count();
            count.should.be.equal(4);

            const result = await MovieService.delAll();
            chai.assert.isUndefined(result);
        });
    });

    describe('delById()', () => {
        it('should delete a movie by id', async () => {
            const movieId = 1;
            movies[0].id = movieId;
            await Movie.bulkCreate(movies);

            const count = await Movie.count();
            count.should.be.equal(4);

            const result = await MovieService.delById(movieId);
            const movieId1 = await Movie.findByPk(movieId);

            chai.assert.isUndefined(result);
            chai.assert.isNull(movieId1);
        });
    });

    describe('post()', () => {
        it('should insert a new movie', async () => {
            const movie = {
                year: movies[0].year,
                title: movies[0].title,
                studios: movies[0].studios,
                producers: movies[0].producers,
                winner: movies[0].winner
            }

            const result = await MovieService.post(movie);
            const resultAsObject = Helpers.resultToCleanObject(result);

            resultAsObject.should.be.deep.equal(movie);

            const count = await Movie.count();
            count.should.be.equal(1);
        });
    });

    describe('postFile()', () => {
        it('should insert movies from a csv file', async () => {
            const moviesCSV = 'test/fixtures/movies.csv';
            const result = await MovieService.postFile(fs, moviesCSV);
            result.should.be.equal(true);

            const count = await Movie.count();
            count.should.be.equal(51);
        });
    });

    describe('getWinners()', () => {
        it('should get only award-winning producers', async () => {
            const moviesCSV = 'test/fixtures/movies.csv';
            const postResult = await MovieService.postFile(fs, moviesCSV);
            postResult.should.be.equal(true);

            const count = await Movie.count();
            count.should.be.equal(51);

            const result = await MovieService.getWinners();
            result.length.should.be.equal(32);
        });
    });

    describe('getAnswer()', () => {
        it('should get challenge answer', async () => {
            const answer = {
                min: [
                    {
                        producer: 'Todd Garner',
                        interval: 1,
                        previousWin: 2011,
                        followingWin: 2012                  
                    }
                ],
                max: [
                    {
                        producer: 'Tom Hooper',
                        interval: 5,
                        previousWin: 2014,
                        followingWin: 2019
                    }
                ]
            }

            const moviesCSV = 'test/fixtures/movies.csv';
            const postResult = await MovieService.postFile(fs, moviesCSV);
            postResult.should.be.equal(true);

            const count = await Movie.count();
            count.should.be.equal(51);
    
            const result = await MovieService.getAnswer();
            result.should.be.deep.equal(answer);
        });
    });

});