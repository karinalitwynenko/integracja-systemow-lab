var Parser = require('fast-xml-parser').j2xParser;
const fs = require('fs');

module.exports = {
    toXML
};

let tags = new Map();
tags.set('manufacturer', 0);

// screen
tags.set('size', 1);
tags.set('resolution', 2);
tags.set('type', 3);
tags.set('touch', 4);

// processor
tags.set('name', 5);
tags.set('physical_cores', 6);
tags.set('clock_speed', 7);

// ram
tags.set('ram', 8);

// disc
tags.set('type', 10);
tags.set('storage', 9);

// gpu
tags.set('graphic_card_name', 11);
tags.set('memory', 12);

tags.set('os', 13);
tags.set('disc_reader', 14);

var defaultOptions = {
    attrNodeName: "@",
    format: true,
    indentBy: "  ",
    supressEmptyNode: true,
};

function toXML(data, file) {
    var date = new Date();
    var datestring = 
        date.getFullYear() + "-" + 
        (date.getMonth()+1).toString().padStart(2, 0) + "-" + 
        date.getDate().toString().padStart(2, 0) + " T " +
        date.getHours() + ":" + date.getMinutes();
    
    let intermediateObj = {
        laptopy: {
            '@' : {
                moddate: datestring
            },
            laptop: []
        }
    };

    let screenTouch;
    let i = 1;
    for (let row of data) {
        screenTouch = row[tags.get('touch')]; 
        intermediateObj.laptopy.laptop.push(
            {
                '@' : {
                    id: i
                },
                manufacturer: row[tags.get('manufacturer')],
                screen: {
                    '@': {
                        touch : screenTouch == 'tak' ? 'yes' : (screenTouch === '' ? '' : 'no'),
                    },
                    size: row[tags.get('size')],
                    resolution: row[tags.get('resolution')],
                    type: row[tags.get('type')]
                },
                processor: {
                    name: row[tags.get('name')],
                    physical_cores: row[tags.get('physical_cores')],
                    clock_speed: row[tags.get('clock_speed')]
                },
                ram: row[tags.get('ram')],
                disc: {
                    '@': {
                        type: row[tags.get('type')]
                    },
                    storage: row[tags.get('storage')]
                },
                graphic_card: {
                    name: row[tags.get('graphic_card_name')],
                    memory: row[tags.get('memory')]
                },
                os: row[tags.get('os')],
                disc_reader: row[tags.get('disc_reader')]
            }
        )

        i++;
    };

    var parser = new Parser(defaultOptions);
    var xml = parser.parse(intermediateObj);

    fs.writeFile(file, xml, (err) => {
        if (err) {
            throw err;
        }
        else {
            console.log('Data has been saved to file: ' + file);
        }
    });
}

