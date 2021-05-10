const express = require('express');
const soap = require('soap');
const routes = require('./routes/app-routes.js');
const db = require('./services/db.js');
const catalogSOAPService = require('./services/catalog-soap.js');

const app = express();
const PORT = 3000;

const PRINT_IN_CONSOLE = false; // set true to print the table in the console when the server starts

if(PRINT_IN_CONSOLE) {
    eval(fs.readFileSync('console-reader.js') + '');
}

app.use(express.json());
app.use(express.static('public'))
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

    var xml = require('fs').readFileSync('catalog.wsdl', 'utf8');

    var soapService = soap.listen(app, '/catalog-service', catalogSOAPService.catalogService, xml, function() {
        console.log('soap initialized');
    });

    soapService.log = function(type, data) {
        console.log('type ' + type);
        console.log('data ' + data);
    };

});