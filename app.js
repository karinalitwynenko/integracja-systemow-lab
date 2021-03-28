const express = require('express');
const path = require('path');
const fs = require('fs');
const reader = require('./reader');
const xmlParser = require('./xml-parser');

const app = express();
const PORT = 3000;
const TXT_FILE = 'data/katalog.txt';
const XML_FILE = 'data/katalog.xml';

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
        printTable(reader.read(FILE));
    }

    console.log("Server is listening on port " + PORT);
});

app.get('/', (req, res) => {
    res.render('katalog');
});

app.get('/katalog', (req, res) => {
    let dataArray;
    if(req.query.fileType === 'txt') {
        let textData = reader.read(TXT_FILE);
        if(textData !== undefined)
            dataArray = reader.textToArray(textData);
    }
    else if(req.query.fileType === 'xml') {
        dataArray = xmlParser.readFromXML(XML_FILE);
    }
    
    if(dataArray !== undefined)
        res.render('katalog', { data: dataArray, manufacturers: reader.getManufacturerStats(dataArray) });
    else {
        res.render('katalog', {errorMessage: 'Wybrany plik nie istnieje.'});
    }
});

app.post('/save-txt', (req, res) => {
    reader.writeToFile(TXT_FILE, req.body, res);
});

app.post('/save-xml', (req, res) => {
    xmlParser.writeToXML(req.body, XML_FILE, res);
});