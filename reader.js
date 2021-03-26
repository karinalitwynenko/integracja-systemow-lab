module.exports = {
    load,
    writeToFile,
    textToMap,
    getManufacturerStats
};

const fs = require('fs');

const MANUFACTURER = 1;
const COLUMNS = 'Lp.; nazwa producenta; przekątna ekranu; rozdzielczość ekranu; rodzaj powierzchni ekranu; czy ekran jest dotykowy; nazwa procesora; liczba rdzeni fizycznych; prędkość taktowania MHz; wielkość pamięci RAM; pojemność dysku; rodzaj dysku; nazwa układu graficznego; pamięć układu graficznego; nazwa systemu operacyjnego; rodzaj napędu fizycznego w komputerze'.split(';');

function load(file) {
    return fs.readFileSync(file, 'utf8', function (err, data) {
		if (err) {
		    console.log(err);
		}
        else {
            return data;
        }
	});
}

function writeToFile(file, data, res) {
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

    fs.writeFile(file, textData, (err) => {
        if (err) {
            throw err;
        }
        else {
            console.log('Data has been saved to file: ' + file);
            res.sendStatus(200);
        }
    });
}

function textToMap(textData) {
    let rows = textData.split('\n');
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