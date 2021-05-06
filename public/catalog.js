const INTEGER = /^\d+$/;
const SIZE_GB = /^[1-9][0-9]*GB$/;
const ANY = /./;

const VALIDATION_RULES = [
    ANY, // 0: manufacturer
    /^[1-9][0-9]*"$/, //  1: display size
    /^[1-9][0-9]*x[1-9][0-9]*$/, // 2: screen resolution
    /^matowa$|^blyszczaca$/i, // 3: screen surface type
    /^tak$|^nie$/, // 4: touch screen
    ANY, // 5: cpu
    INTEGER, // 6: number of cores
    INTEGER, // 7: cpu freq
    SIZE_GB, // 8: ram size
    SIZE_GB, // 9: drive size
    /^SSD$|^HDD$/i, // 10: drive type
    ANY, // 11: gpu
    SIZE_GB, // 12: vram
    ANY, // 13: os
    /^brak$|^Blu-Ray$|^DVD$/i // 14: optical drive type
];

var currentData;

function save(target) {
    if(document.getElementsByClassName('error').length > 0) {
        alert('Dane nie mogą zostać wyeksportowane, ponieważ zawierają błędy.');
        return;
    }
    else if(document.getElementById('catalog').getElementsByTagName('tbody')[0].childNodes.length == 0) {
        alert('Nie można eksportować pustej tabeli.');
        return;
    }
    
    let rows = document.getElementById('catalog').getElementsByTagName('tbody')[0].getElementsByTagName('tr')
    let data = [];
    let temp;
    let emptyItemsCount;

    for (let row of rows) {
        temp = [];
        emptyItemsCount = 0;
        for(let item of row.childNodes) {
            if(item !== row.firstChild) {
                if(item.textContent === '')
                    emptyItemsCount++;
                
                temp.push(item.textContent);
            }
        }
        // omit if row is empty
        if(emptyItemsCount != row.childNodes.length - 1)
            data.push(temp);
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch('save/' + target, options)
        .then(response => {
            if(!response.ok) {
                alert('Eksport danych nie był możliwy.');
            }
            else  {
                confirm('Dane zostały wyeksportowane.');
                load(target, false);
            }   
        }
    );
}

function validate() {
    this.parentElement.classList.add('modified');
    if(!VALIDATION_RULES[this.getAttribute('data-col-index')].test(this.textContent) && this.textContent !== '') {
        this.classList.add('error')
    }
    else {
        this.classList.remove('error');
    }
}

// create new table row
function add() {
    let table = document.getElementById('catalog').getElementsByTagName('tbody')[0];
    let row = document.createElement('tr');
    let col;
    for(let i = 0; i < 16; i++) {
        col = document.createElement('td');
        if(i != 0) {
            col.addEventListener('input', validate);
            col.setAttribute('contenteditable', true);
            col.setAttribute('data-col-index', i - 1);
        }
        else {
            col.textContent = table.childNodes.length + 1;
        }

        row.appendChild(col);
        table.appendChild(row);
    }
}

function load(source, compare = true) {
    fetch('catalog/' + source, {method: 'GET'})
    .then(response => response.json())
    .then((newData) => {
        clearTables();
        generateLaptopsTable(newData.laptops);
        generateManufacturersTable(newData.manufacturers);
        if(currentData !== undefined && compare) {
            highlightDuplicates(currentData.laptops, newData.laptops);
        }
        else {
            document.getElementById('record-stats').innerHTML = 
                'Znalezione nowe rekordy: <b>' + (newData.laptops.length) + '</b><br>'
                + 'Znalezione duplikaty: <b>0</b>';
        }
        
        currentData = newData;

        document.getElementById('error-message').textContent = '';
    })
    .catch(error => {
        document.getElementById('error-message').textContent = 'Dane nie mogły zostać załadowane.';
        document.getElementById('record-stats').innerHTML = '';
        clearTables();
        currentData = undefined;
    });

}

function generateLaptopsTable(laptops) {
    let table = document.getElementById('catalog').getElementsByTagName('tbody')[0];
    let row;
    let item;
    let colIndex;

    for (let laptop of laptops) {
        row = document.createElement('tr');
        table.appendChild(row);
        colIndex = -1;
        for(let column of laptop) {
            item = document.createElement('td');
            item.textContent = column;
            row.appendChild(item);

            if(column != laptop[0]) {
                item.addEventListener('input', validate);
                item.setAttribute('contenteditable', true);
                item.setAttribute('data-col-index', colIndex);
            }

            colIndex++;
        }
    }
}

function generateManufacturersTable(manufacturers) {
    let table = document.getElementById('manufacturers').getElementsByTagName('tbody')[0];
    let row;
    let item;
    for(let [key, value] of Object.entries(manufacturers)) {
        row = document.createElement('tr');
        item = document.createElement('td');
        item.textContent = key;
        row.appendChild(item);
        item = document.createElement('td');
        item.textContent = value;
        row.appendChild(item)
        
        table.appendChild(row);
    }
}

function highlightDuplicates(prevLaptops, newLaptops) {
    let duplicates = 0;
    let table = document.getElementById('catalog').getElementsByTagName('tbody')[0];
    for(let newLaptop of newLaptops) {
        for(let prevLaptop of prevLaptops) {
            if(JSON.stringify(newLaptop) === JSON.stringify(prevLaptop)) {
                duplicates++;
                table.childNodes[newLaptop[0] - 1].classList.add('duplicate')
                continue;
            }
        }
    }

    document.getElementById('record-stats').innerHTML = 
        'Znalezione nowe rekordy: <b>' + (newLaptops.length - duplicates) + '</b><br>'
        + 'Znalezione duplikaty: <b>' + duplicates + '</b>';
}

function clearTables() {
    let laptopTable = document.getElementById('catalog').getElementsByTagName('tbody')[0];
    let manufacturerTable = document.getElementById('manufacturers').getElementsByTagName('tbody')[0];
    laptopTable.textContent = '';
    manufacturerTable.textContent = '';
}