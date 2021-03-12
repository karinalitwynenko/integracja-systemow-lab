const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = 3000;
const {COLUMNS} = require('./columns');

eval(fs.readFileSync('text-file-reader.js') + '');

app.set('view engine', 'pug');
app.get('/katalog.txt', function(req, res) {
    res.sendFile(path.resolve('./katalog.txt'));
});
app.get('/', (req, res) => {
    res.render('katalog');
});

app.get('/katalog', (req, res) => {
    res.render('katalog', { data: csvToMap(load()) });
});

app.listen(PORT, function(error){ 
    if(error) {
        throw error;
    }
    // else {
    //     printTable(load());
    // }
});

function load() {
    return fs.readFileSync('katalog.txt', 'utf8', function (err, data) {
		if (err) {
		    console.log(err);
		}
        else {
            return data;
        }
	});
}

function csvToMap(csv) {
    let rows = csv.split('\n');
    rows.forEach(item => item.trim());
    let table = new Map();
    let row;
    for(let i = 0; i < rows.length; i++) {
        if(i == 0) {
            row = COLUMNS;
        }
        else {
            row = rows[i].split(';', COLUMNS.length);
        }
        row.forEach(item => item.trim());
        for(let j = 0; j < row.length; j++) {
            table.set(i, row);
        }
    }

    return table;
}