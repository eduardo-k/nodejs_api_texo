const express = require('express');
const app = express();
const port = process.env.PORT || 3030;
const routes = require('./app/routes');
const initialization = require ('./scripts/initialization.js');
const database = require('./database/db');

let server;

async function initializeApp() {
    try {
        await database.sync();
        await initialization.startDB();

        app.use(express.json());
        app.use(routes);
        server = app.listen(port, () => {
            console.log(`API started! Listening port ${port}!`)
        });
    } catch (error) {
        console.log(`API error at start: ${error.message}`);
        throw new Error(error.message);
    }
};

function stop() {
    server.close();
    console.log('API server closed');
};

module.exports = (async () => {
    await initializeApp();
    return app;
})();

module.exports.stop = stop;