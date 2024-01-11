const express = require('express');
const app = express();
const port = process.env.PORT || 3030;
const routes = require('./app/routes');
const initialization = require ('./scripts/initialization.js');
const database = require('./database/db');

(async () => {
    try {
        await database.sync();
        await initialization.startDB();

        app.use(express.json());
        app.use(routes);
        app.listen(port, () => {
            console.log(`API started! Listening port ${port}!`)
        });
    } catch (error) {
        console.log(`API error at start: ${error.message}`);
        throw new Error(error.message);
    }
})();
