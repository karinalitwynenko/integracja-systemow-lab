const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


const PORT = 3000;
const {COLUMNS, MANUFACTURER} = require('./columns');
const FILE = 'katalog-test.txt';

eval(fs.readFileSync('text-file-reader.js') + '');

app.set('view engine', 'pug');

app.use(express.json())
app.listen(PORT, function(error){ 
    if(error) {
        throw error;
    }
    // else {
    //     printTable(load());
    // }
});

app.get('/katalog.txt', function(req, res) {
    res.sendFile(path.resolve('./' + FILE));
});

app.get('/', (req, res) => {
    res.render('katalog');
});

app.get('/katalog', (req, res) => {
    let table = csvToMap(load());
    res.render('katalog', { data: table, manufacturers: getManufacturerStats(table) });
});

app.post('/save', (req, res) => {
    writeToFile(req.body, res);
});

function load() {
    return fs.readFileSync(FILE, 'utf8', function (err, data) {
		if (err) {
		    console.log(err);
		}
        else {
            return data;
        }
	});
}

function writeToFile(data, res) {
    let textData = '';
    let isFirst = true;
    for (let row of data) {
        if(isFirst) {
            isFirst = false;
        }
        else {
            textData += '\n';
        }

        for (let item of row) {
            textData += item + ";";
        }
    }

    fs.writeFile(FILE, textData, (err) => {
        if (err) {
            throw err;
        }
        else {
            console.log('Data has been saved to file: ' + FILE);
        }
    });
}

function csvToMap(csv) {
    let rows = csv.split('\n');
    let table = new Map();
    let row;
    for(let i = 0; i < rows.length + 1; i++) {
        row = [];
        if(i == 0) {
            row = COLUMNS;
            table.set(i, row);
        }
        else {
            row[0] = i + '';
            row = row.concat(rows[i - 1].split(';', COLUMNS.length - 1));
            row.forEach(item => item.trim());
            table.set(i, row);
        }
    }

    return table;
}

function getManufacturerStats(table) {
    let manufacturers = new Map();
    manufacturers.set('header', ['Producent', 'Liczba laptopów']);
    let isFirst = true;

    table.forEach(row => {
        if(isFirst) {
            isFirst = false;
            return;
        }

        if(manufacturers.get(row[MANUFACTURER]) === undefined) {
            manufacturers.set(row[MANUFACTURER], 1);
        }
        else {
            manufacturers.set(row[MANUFACTURER], manufacturers.get(row[MANUFACTURER]) + 1);
        }
    });

    return manufacturers;
}