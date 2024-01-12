const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const { expect } = require('chai');
const MovieService = require('../../app/services/MovieService');

describe('Movie Acceptance Tests', function() {
    this.timeout(5000);
    let app;
    
    before(async () => {
        app = await require('../../index');
    });

    after(() => {
        require('../../index').stop();
    });

    describe('route GET /answer', () => {
        it('should get answer in default movie list', (done) => {
            const expectedResult = {
                min: [
                    {
                        producer: 'Joel Silver',
                        interval: 1,
                        previousWin: 1990,
                        followingWin: 1991
                    }
                ],
                max: [
                    {
                        producer: 'Matthew Vaughn',
                        interval: 13,
                        previousWin: 2002,
                        followingWin: 2015
                    }
                ]
            }

            chai.request(app)
                .get('/answer')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.deep.equal(expectedResult);
                    done();
                });
        });

        it('should get answer with new movies on the list', done => {
            const movie1 = {
                year: 1980,
                title: 'Test 1',
                studios: 'Test 1',
                producers: ['Matthew Vaughn'],
                winner: true
            }
            MovieService.post(movie1);

            const movie2 = {
                year: 2003,
                title: 'Test 2',
                studios: 'Test 2',
                producers: ['Matthew Vaughn'],
                winner: true
            }
            MovieService.post(movie2);

            const movie3 = {
                year: 2037,
                title: 'Test 3',
                studios: 'Test 3',
                producers: ['Matthew Vaughn'],
                winner: true
            }
            MovieService.post(movie3);

            const expectedResult = {
                min: [
                    {
                        producer: 'Matthew Vaughn',
                        interval: 1,
                        previousWin: 2002,
                        followingWin: 2003
                    },
                    {
                        producer: 'Joel Silver',
                        interval: 1,
                        previousWin: 1990,
                        followingWin: 1991
                    }
                ],
                max: [
                    {
                        producer: 'Matthew Vaughn',
                        interval: 22,
                        previousWin: 1980,
                        followingWin: 2002
                    },
                    {
                        producer: 'Matthew Vaughn',
                        interval: 22,
                        previousWin: 2015,
                        followingWin: 2037
                    }
                ]

            };

            chai.request(app)
                .get('/answer')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.deep.equal(expectedResult);
                    done();
                });
        });
    });

});