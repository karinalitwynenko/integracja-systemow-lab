var express = require('express');
var router = express.Router();
const reader = require('../reader');
const xmlParser = require('../xml-parser');
const db = require('../services/db');
const catalog = require('../services/catalog');

const TXT_FILE = './data/katalog.txt';
const XML_FILE = './data/katalog.xml';

const ERROR_NO_DATA = 'Wybrane źródło nie zawiera danych.';

router.get('/', (req, res) => {
    return res.redirect('/catalog.html');
});

router.get('/catalog/txt', (req, res) => {
    let textData = reader.read(TXT_FILE);
    if(textData !== undefined && textData !== '') {
        laptopArray = reader.textToArray(textData);
        res.json({ laptops: laptopArray, manufacturers: Object.fromEntries(reader.getManufacturerStats(laptopArray)) });
    }
    else {
        res.status(500);
    }
});

router.get('/catalog/xml', (req, res) => {
    laptopArray = xmlParser.readFromXML(XML_FILE);
    if(laptopArray && laptopArray.length != 0) {
        res.json({ laptops: laptopArray, manufacturers: Object.fromEntries(reader.getManufacturerStats(laptopArray)) });
    }
    else {
        res.status(500);
    }
});

router.get('/catalog/db', (req, res) => {
    catalog.getAll((laptops) => {
        res.json({ laptops: laptops, manufacturers: Object.fromEntries(reader.getManufacturerStats(laptops)) });
    });
});

router.post('/save', (req, res) => {
    if(req.query.target === 'txt') {
        reader.writeToFile(req.body, TXT_FILE, (status, message) => {
            console.log(message);
            res.sendStatus(status);
        });
    }
    else if(req.query.target === 'xml') {
        xmlParser.writeToXML(req.body, XML_FILE, (status, message) => {
            console.log(message);
            res.sendStatus(status);
        });
    }
    else if(req.query.target === 'db') {
        catalog.deleteAll((success, message) => {
            console.log(message)
            if(success) {
                catalog.saveAll(req.body, (status, message) => {
                    console.log(message);
                    res.sendStatus(status);
                });
            }
            else {
                console.log('Error: new records were not saved.')
            }
        });
    }
});


module.exports = router;
