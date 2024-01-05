const express = require('express');
const app = express();
const port = process.env.PORT || 3030;
const routes = require('./app/routes');

(async () => {
    const database = require('./database/db');
    try {
        const resultado = await database.sync();
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