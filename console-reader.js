const MANUFACTURER = 1;

const COLUMN_NAMES  = "Lp.; nazwa     ; przekątna; rozdzielczość; rodzaj     ; ekran   ; nazwa    ; liczba    ; prędkość  ; wielkość; pojemność; rodzaj; nazwa      ; pamięć     ; nazwa       ; rodzaj napędu".split(';');
const COLUMN_NAMES_2 = "   ; producenta; ekranu   ; ekranu       ; powierzchni; dotykowy; procesora; rdzeni    ; taktowania; pamięci ; dysku    ; dysku ; układu     ; układu     ; systemu     ; fizycznego".split(';');
const COLUMN_NAMES_3 = "   ;           ;          ;              ; ekranu     ;         ;          ; fizycznych; MHz       ; RAM     ;          ;       ; graficznego; graficznego; operacyjnego; w komputerze".split(';');

function printTable(textData) {
    let lines = textData.split('\n');
    let maxColumnsWidth = [COLUMN_NAMES.length];
    let itemsArray = [];
    let itemParts = [];

    for(let i = 0; i < COLUMN_NAMES.length; i++) {
        maxColumnsWidth[i] = COLUMN_NAMES_2[i].length > COLUMN_NAMES[i].length ? COLUMN_NAMES_2[i].length : COLUMN_NAMES[i].length;
        maxColumnsWidth[i] = COLUMN_NAMES_3[i].length > maxColumnsWidth[i] ? COLUMN_NAMES_3[i].length : maxColumnsWidth[i];

        for(let j = 0; j < lines.length; j++) {

            if(itemsArray[j] === undefined) {
                lines[j] = (j + 1) + ';' + lines[j];
                itemsArray[j] = lines[j].split(';');
            }

            itemParts = itemsArray[j][i].split(' ');
            if(itemParts[0].length > maxColumnsWidth[i])
                maxColumnsWidth[i] = itemParts[0].length;
            else if(itemParts.slice(1).join(' ').length > maxColumnsWidth[i])
                maxColumnsWidth[i] = itemParts.slice(1).join(' ').length;
        }
    }

    printHeader(maxColumnsWidth);
    
    let padding;
    let firstLine = [];
    let secondLine = [];
    let printSecondLine;
    for(let i = 0; i < itemsArray.length; i++) {

        secondLine = [COLUMN_NAMES.length];
        printSecondLine = false;

        for(let j = 0; j < COLUMN_NAMES.length; j++) {

            itemsArray[i][j] = itemsArray[i][j].trim();
            itemParts = itemsArray[i][j].split(' ');

            if(itemParts.length > 1) {
                secondLine[j] = itemParts.slice(1).join(' ');
                padding = maxColumnsWidth[j] - secondLine[j].length;
                secondLine[j] = secondLine[j].padEnd(maxColumnsWidth[j] - Math.ceil(padding/2), ' ');
                secondLine[j] = secondLine[j].padStart(maxColumnsWidth[j], ' ');
                printSecondLine = true;
            }
            else {
                secondLine[j] = new Array(maxColumnsWidth[j] + 1).join(' ');
            }

            padding = maxColumnsWidth[j] - itemParts[0].length;
            firstLine[j] = itemParts[0].padEnd(maxColumnsWidth[j] - Math.ceil(padding/2), ' ');
            firstLine[j] = firstLine[j].padStart(maxColumnsWidth[j], ' ');
        }

        console.log("│" + firstLine.join("│") + "│");
        if(printSecondLine) {
            console.log("│" + secondLine.join("│") + "│");
        }
        console.log(new Array(firstLine.join("│").length + 3).join('─'));
    }

    printManufacturerStats(itemsArray);
}

function printHeader(maxColumnsWidth) {
    let padding;
    for(let i = 0; i < COLUMN_NAMES.length; i++) {
        COLUMN_NAMES[i] = COLUMN_NAMES[i].trim();
        padding = maxColumnsWidth[i] - COLUMN_NAMES[i].length;
        COLUMN_NAMES[i] = COLUMN_NAMES[i].padEnd(maxColumnsWidth[i] - Math.ceil(padding/2), ' ');
        COLUMN_NAMES[i] = COLUMN_NAMES[i].padStart(maxColumnsWidth[i], ' ');
        
        COLUMN_NAMES_2[i] = COLUMN_NAMES_2[i].trim();
        padding = maxColumnsWidth[i] - COLUMN_NAMES_2[i].length;
        COLUMN_NAMES_2[i] = COLUMN_NAMES_2[i].padEnd(maxColumnsWidth[i] - Math.ceil(padding/2), ' ');
        COLUMN_NAMES_2[i] = COLUMN_NAMES_2[i].padStart(maxColumnsWidth[i], ' ');

        COLUMN_NAMES_3[i] = COLUMN_NAMES_3[i].trim();
        padding = maxColumnsWidth[i] - COLUMN_NAMES_3[i].length;
        COLUMN_NAMES_3[i] = COLUMN_NAMES_3[i].padEnd(maxColumnsWidth[i] - Math.ceil(padding/2), ' ');
        COLUMN_NAMES_3[i] = COLUMN_NAMES_3[i].padStart(maxColumnsWidth[i], ' ');
    }
    console.log(new Array(COLUMN_NAMES.join('│').length + 3).join('━'));
    console.log("│" + COLUMN_NAMES.join('│') + ('│'));
    console.log("│" + COLUMN_NAMES_2.join('│') + ('│'));
    console.log("│" + COLUMN_NAMES_3.join('│') + ('│'));
    console.log(new Array(COLUMN_NAMES.join('│').length + 3).join('━'));
}

function printManufacturerStats(items) {
    let manufacturers = new Map();
    let manufacturerMaxNameLen = 'Producent'.length;
    items.forEach(row => {
        if(manufacturers.get(row[MANUFACTURER]) === undefined) {
            manufacturers.set(row[MANUFACTURER], 1);
        }
        else {
            manufacturers.set(row[MANUFACTURER], manufacturers.get(row[MANUFACTURER]) + 1);
        }

        if(row[MANUFACTURER].length > manufacturerMaxNameLen)
            manufacturerMaxNameLen = row[MANUFACTURER].length;
    });

    let header = '│' + 'Producent'.padEnd(manufacturerMaxNameLen, ' ') + '│'
                 + 'Liczba laptopów'.padEnd(manufacturerMaxNameLen, ' ') + '│';
    
    console.log();
    console.log('Liczba laptopów poszczególnych producentów: ');
    console.log(new Array(header.length + 1).join('━'));
    console.log(header);
    console.log(new Array(header.length + 1).join('━'));

    let countHeaderLen = 'Liczba laptopów'.length;
    manufacturers.forEach(function(value, key) {
        console.log(
                    '│' + key.padEnd(manufacturerMaxNameLen, ' ') + '│' 
                    + (value + "").padEnd(countHeaderLen - (countHeaderLen - (value + "").length)/2, ' ').padStart(countHeaderLen, ' ')
                    + '│'
        );
    });

    console.log(new Array(header.length + 1).join('─'));
}