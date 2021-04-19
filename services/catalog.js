const db = require('../services/db');

function getAll(result) {
    db.connection.query('select * from laptops', function(err, laptops, fields) {
        let i = 1;
        let laptopArray = [];
        for(laptop of laptops) {
            laptopArray.push([
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
        result(laptopArray)
    });
}

function saveAll(laptops, result) {
    if(!laptops || laptops.length == 0) {
        return;
    }

    for(laptop of laptops) {
        laptop.unshift(null);
    }

    db.connection.query('insert into laptops values ?', [laptops], function(err, data, fields) {
        if(err)
            throw err;
        else {
            result(200, 'Crated ' + laptops.length + ' new database records.')
        }
    });
}

function deleteAll(result) {
    db.connection.query('truncate table laptops', function(err, data, fields) {
        if(err)
            throw err;
        else {
            result(true, '\'laptops\' table has been truncated.');
        }
    });
}

module.exports = {
    getAll,
    saveAll,
    deleteAll
}