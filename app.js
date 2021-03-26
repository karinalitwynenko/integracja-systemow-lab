const express = require('express');
const path = require('path');
const fs = require('fs');
const reader = require('./reader');
const xmlParser = require('./xml-parser');

const app = express();
const PORT = 3000;
const TXT_FILE = 'katalog.txt';
const XML_FILE = 'katalog.xml';

const PRINT_IN_CONSOLE = false; // set true to print the table in the console when the server starts

if(PRINT_IN_CONSOLE) {
    eval(fs.readFileSync('console-reader.js') + '');
}

app.set('view engine', 'pug');

app.use(express.json());

app.listen(PORT, function(error) { 
    if(error) {
        throw error;
    }
    else if(PRINT_IN_CONSOLE) {
        printTable(reader.load(FILE));
    }

    console.log("Server is listening on port " + PORT);
});

app.get('/katalog.txt', function(req, res) {
    res.sendFile(path.resolve('./' + FILE));
});

app.get('/', (req, res) => {
    res.render('katalog');
});

app.get('/katalog', (req, res) => {
    let table = reader.textToMap(reader.load(TXT_FILE));
    res.render('katalog', { data: table, manufacturers: reader.getManufacturerStats(table) });
});

app.post('/save-txt', (req, res) => {
    reader.writeToFile(TXT_FILE, req.body, res);
});

app.post('/save-xml', (req, res) => {
    xmlParser.toXML(req.body, XML_FILE);
});