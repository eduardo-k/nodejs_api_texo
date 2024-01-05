const {Router} = require('express');
const routes = new Router();
const MovieController = require('./controllers/MovieController');

routes.get('/', MovieController.getAll);
routes.get('/winners', MovieController.getWinners);
routes.get('/answer', MovieController.getAnswer);
routes.get('/:movieId', MovieController.getById);
routes.post('/', MovieController.post);
routes.post('/file', MovieController.postFile);
routes.delete('/', MovieController.delAll);
routes.delete('/:movieId', MovieController.delById);

module.exports = routes;