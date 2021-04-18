const express = require('express');
const routes = require('./routes/app-routes.js');
const db = require('./services/db.js');

const app = express();
const PORT = 3000;

const PRINT_IN_CONSOLE = false; // set true to print the table in the console when the server starts

if(PRINT_IN_CONSOLE) {
    eval(fs.readFileSync('console-reader.js') + '');
}

app.set('view engine', 'pug');

app.use(express.json());
app.use('/', routes);

app.listen(PORT, function(error) { 
    if(error) {
        throw error;
    }
    else if(PRINT_IN_CONSOLE) {
        printTable(reader.read(FILE));
    }

    db.createTable();
    console.log("Server is listening on port " + PORT);
});