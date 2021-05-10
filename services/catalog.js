const db = require('../services/db');

function getAll(result) {
    db.connection.query('select * from laptops', function(err, laptops, fields) {
        let i = 1;
        let laptopArray = [];
        for(laptop of laptops) {
            pushLaptop(laptop, laptopArray, (i++));
        }
        result(laptopArray)
    });
}

function getManufacturers(result) {
    db.connection.query("select distinct manufacturer from laptops " +
                        "where manufacturer != ''", 
                        function(err, manufacturers, fields) {
                            result(
                                manufacturers.map(element => element.manufacturer)
                            )
                        }
                    );
}

function getCountByScreenResolution(resolutions, result) {
    db.connection.query('select count(*) as itemCount from laptops where resolution in (' + resolutions + ')', function(err, res, fields) {
        console.log(res)
        result(res[0].itemCount);
    });
}

function getCountByManufacturer(manufacturer, result) {
    db.connection.query('select count(*) as itemCount from laptops where manufacturer = \'' + manufacturer + '\'', function(err, res, fields) {
        result(res[0].itemCount);
    });
}

function getByScreenType(screenType, result) {
    let query = screenType === 'any' ? 
        'select * from laptops' :
        'select * from laptops where screenType = \'' + screenType + '\'';
    db.connection.query(query, function(err, laptops, fields) {
        let i = 1;
        let laptopArray = [];
        for(laptop of laptops) {
            pushLaptop(laptop, laptopArray, (i++));
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
            result(200, 'Created ' + laptops.length + ' new database records.')
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

function pushLaptop(laptop, array, index) {
    array.push([
        index + '',
        laptop.manufacturer,
        laptop.size,
        laptop.resolution,
        laptop.screenType,
        laptop.touch,
        laptop.processorName,
        laptop.physicalCores == 0 ? '' : laptop.physicalCores + '',
        laptop.clockSpeed == 0 ? '' : laptop.clockSpeed + '',
        laptop.ram,
        laptop.storage,
        laptop.discType,
        laptop.graphicCardName,
        laptop.vram,
        laptop.os,
        laptop.discReader
    ]);
}

module.exports = {
    getAll,
    getManufacturers,
    getCountByManufacturer,
    getCountByScreenResolution,
    getByScreenType,
    saveAll,
    deleteAll
}