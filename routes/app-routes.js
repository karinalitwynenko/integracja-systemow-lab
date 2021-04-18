var express = require('express');
var router = express.Router();
const reader = require('../reader');
const xmlParser = require('../xml-parser');
const db = require('../services/db');
const catalog = require('../services/catalog');
const { format } = require('mysql2');

const TXT_FILE = './data/katalog.txt';
const XML_FILE = './data/katalog.xml';

router.get('/', (req, res) => {
    res.render('catalog');
});

router.get('/catalog', (req, res) => {
    let dataArray = [];
    if(req.query.source === 'txt') {
        let textData = reader.read(TXT_FILE);
        if(textData !== undefined)
            dataArray = reader.textToArray(textData);
    }
    else if(req.query.source === 'xml') {
        dataArray = xmlParser.readFromXML(XML_FILE);
    }
    else if(req.query.source === 'db') {
        catalog.getAll((laptops) => {
            let i = 1;
            for(laptop of laptops) {
                dataArray.push([
                    i++,
                    laptop.manufacturer,
                    laptop.size,
                    laptop.resolution,
                    laptop.screenType,
                    laptop.touch,
                    laptop.processorName,
                    laptop.physicalCores,
                    laptop.clockSpeed,
                    laptop.ram,
                    laptop.storage,
                    laptop.discType,
                    laptop.graphicCardName,
                    laptop.vram,
                    laptop.os,
                    laptop.discReader
                ]);
            }
            // TODO: errorMessage: 'Baza danych nie zawiera rekordów.'
            res.render('catalog', { data: dataArray, manufacturers: reader.getManufacturerStats(dataArray) });
        });
        
        return;
    }
    
    if(dataArray !== undefined)
        res.render('catalog', { data: dataArray, manufacturers: reader.getManufacturerStats(dataArray) });
    else {
        res.render('catalog', {errorMessage: 'Wybrany plik nie istnieje.'});
    }
});

router.post('/save-txt', (req, res) => {
    reader.writeToFile(TXT_FILE, req.body, res);
});

router.post('/save-xml', (req, res) => {
    xmlParser.writeToXML(req.body, XML_FILE, res);
});

module.exports = router;
