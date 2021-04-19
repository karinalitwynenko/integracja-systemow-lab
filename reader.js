module.exports = {
    read,
    writeToFile,
    textToArray,
    getManufacturerStats
};

const fs = require('fs');

const MANUFACTURER = 1;
const COLUMNS_COUNT = 16;

function read(file) {
    let data;
    try {
        data = fs.readFileSync(file, 'utf8');
    } 
    catch (err) {
        console.log(err);
    }

    return data;
}

function writeToFile(data, file, result) {
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
            result(200, 'Data has been saved to file: ' + file);
        }
    });
}

function textToArray(textData) {
    let rows = textData.split('\n');
    let table = [];
    let row;
    for(let i = 0; i < rows.length; i++) {
        row = [(i + 1) + ''];
        row = row.concat(rows[i].split(';', COLUMNS_COUNT - 1));
        row.forEach(item => item.trim());
        table[i] = row;
    }
    return table;
}

function getManufacturerStats(dataArray) {
    if(!dataArray || dataArray.length === 0)
        return;

    let manufacturers = new Map();

    for(let i = 0; i < dataArray.length; i++) {
        if(manufacturers.get(dataArray[i][MANUFACTURER]) === undefined) {
            manufacturers.set(dataArray[i][MANUFACTURER], 1);
        }
        else {
            manufacturers.set(dataArray[i][MANUFACTURER], manufacturers.get(dataArray[i][MANUFACTURER]) + 1);
        }  
    }

    return manufacturers;
}  