var parser = require('fast-xml-parser');
const fs = require('fs');
const read = require('./reader').read;

module.exports = {
    writeToXML,
    readFromXML
};

let tags = new Map();
tags.set('manufacturer', 0);

// screen
tags.set('size', 1);
tags.set('resolution', 2);
tags.set('screen_type', 3);
tags.set('touch', 4);

// processor
tags.set('name', 5);
tags.set('physical_cores', 6);
tags.set('clock_speed', 7);

// ram
tags.set('ram', 8);

// disc
tags.set('disc_type', 10);
tags.set('storage', 9);

// gpu
tags.set('graphic_card_name', 11);
tags.set('memory', 12);

tags.set('os', 13);
tags.set('disc_reader', 14);

const options = {
    attributeNamePrefix : "",
    attrNodeName: "@",
    format: true,
    indentBy: "  ",
    supressEmptyNode: true,
    parseAttributeValue : false, // parse attributes to float, integer, or boolean
    parseNodeValue: false, // parse nodes to float, integer, or boolean
    ignoreAttributes : false,
};

function writeToXML(data, file, result) {
    var date = new Date();
    var datestring = 
        date.getFullYear() + "-" + 
        (date.getMonth()+1).toString().padStart(2, 0) + "-" + 
        date.getDate().toString().padStart(2, 0) + " T " +
        date.getHours() + ":" + date.getMinutes();
    
    let intermediateObj = {
        laptops: {
            '@' : {
                moddate: datestring
            },
            laptop: []
        }
    };

    let screenTouch, discType;
    let i = 1;
    let laptopObj;
    for (let row of data) {
        laptopObj = {
            '@' : {
                id: i
            },
            manufacturer: row[tags.get('manufacturer')],
            screen: {
                size: row[tags.get('size')],
                resolution: row[tags.get('resolution')],
                type: row[tags.get('screen_type')]
            },
            processor: {
                name: row[tags.get('name')],
                physical_cores: row[tags.get('physical_cores')],
                clock_speed: row[tags.get('clock_speed')]
            },
            ram: row[tags.get('ram')],
            disc: {
                storage: row[tags.get('storage')]
            },
            graphic_card: {
                name: row[tags.get('graphic_card_name')],
                memory: row[tags.get('memory')]
            },
            os: row[tags.get('os')],
            disc_reader: row[tags.get('disc_reader')]
        }
        
        screenTouch = row[tags.get('touch')];
        discType = row[tags.get('disc_type')];
        if(screenTouch !== '')
            laptopObj.screen['@'] = {touch: screenTouch == 'tak' ? 'yes' : 'no'};
        if(discType !== '')
            laptopObj.disc['@'] = {type: discType}
        intermediateObj.laptops.laptop.push(laptopObj);
        i++;
    };

    let j2xparser = new parser.j2xParser(options);
    let xml = j2xparser.parse(intermediateObj);

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
    fs.writeFile(file, xml, (err) => {
        if (err) {
            throw err;
        }
        else {
            result(200, 'Data has been saved to file: ' + file);
        }
    });
}

function readFromXML(file) {
    let textData = read(file);
    if(textData === undefined) {
        return;
    }
    let tObj = parser.getTraversalObj(textData, options);
    let dataObj = parser.convertToJson(tObj, options);
    let dataArray = [];
    let i = 1;
    let touch;
    let discType;
    
    for(laptop of dataObj.laptops.laptop) {
        if(laptop.screen['@'] !== undefined) {
            touch = laptop.screen['@'].touch === 'yes' ? 'tak' : 'nie';
        }
        else {
            touch = ''; 
        }

        discType = laptop.disc['@'] !== undefined ? laptop.disc['@'].type : '';
        dataArray.push(
            [
                (i++) + '',
                laptop.manufacturer,
                laptop.screen.size,
                laptop.screen.resolution,
                laptop.screen.type,
                touch,
                laptop.processor.name,
                laptop.processor.physical_cores,
                laptop.processor.clock_speed,
                laptop.ram,
                laptop.disc.storage,
                discType,
                laptop.graphic_card.name,
                laptop.graphic_card.memory,
                laptop.os,
                laptop.disc_reader
            ]
        )
    }

    return dataArray;
}

