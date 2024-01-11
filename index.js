const express = require('express');
const app = express();
const port = process.env.PORT || 3030;
const routes = require('./app/routes');
const initialization = require ('./scripts/initialization.js');

(async () => {
    const database = require('./database/db');
    try {
        await database.sync();
        await initialization.startDB();
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
})();


app.use(express.json());
app.use(routes);
app.listen(port, () => {
    console.log(`API started, listening port ${port}!`)
});