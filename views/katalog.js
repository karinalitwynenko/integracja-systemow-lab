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

function save(fileType) {
    if(document.getElementsByClassName('error').length > 0) {
        alert('Dane nie mogą zostać wyeksportowane, ponieważ zawierają błędy.');
        return;
    }
    
    let rows = document.getElementById('katalog').getElementsByTagName('tr')
    let data = [];
    let firstRow = true;
    let temp;
    let emptyItemsCount;
    for (let row of rows) {
        if(firstRow) {
            firstRow = false;
        }
        else {
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
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch(fileType === 'txt' ? 'save-txt' : 'save-xml', options)
        .then(response => {
            if(!response.ok) {
                alert('Eksport danych nie był możliwy.');
            }
            else  {
                confirm('Dane zostały wyeksportowane do pliku.');
                window.location.replace("/katalog");
            }   
        }
    );
}

function validate(element, id) {
    if(!VALIDATION_RULES[id].test(element.textContent) && element.textContent !== '') {
        element.classList.add('error')
    }
    else {
        element.classList.remove('error');
    }
}

// create new table row
function add() {
    let catalog = document.getElementById('katalog').childNodes[0]; // tbody
    let newRow = catalog.lastChild.cloneNode(true);
    let index = parseInt(newRow.childNodes[0].textContent) + 1;
    newRow.childNodes.forEach(
        element => {element.textContent = ''; element.setAttribute("class", "")}
    );
    newRow.firstChild.textContent = index;
    catalog.appendChild(newRow);
}