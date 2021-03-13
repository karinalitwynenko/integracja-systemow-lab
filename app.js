const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


const PORT = 3000;
const {COLUMNS} = require('./columns');

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
    res.sendFile(path.resolve('./katalog.txt'));
});

app.get('/', (req, res) => {
    res.render('katalog');
});

app.get('/katalog', (req, res) => {
    res.render('katalog', { data: csvToMap(load()) });
});

app.post('/save', (req, res) => {
    writeToFile(req.body);
});

function load() {
    return fs.readFileSync('katalog-test.txt', 'utf8', function (err, data) {
		if (err) {
		    console.log(err);
		}
        else {
            return data;
        }
	});
}

function writeToFile(data) {
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

    fs.writeFile('katalog-test.txt', textData, () => console.log('Data saved'));
}

function csvToMap(csv) {
    let rows = csv.split('\n');
    let table = new Map();
    let row;
    for(let i = 0; i < rows.length + 1; i++) {
        row = [];
        if(i == 0) {
            row[0] = 'Lp.';
            row = row.concat(COLUMNS);
            table.set(i, row);
        }
        else {
            row[0] = i + '';
            row = row.concat(rows[i - 1].split(';', COLUMNS.length));
            row.forEach(item => item.trim());
            table.set(i, row);
        }
        
    }

    return table;
}