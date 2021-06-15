function run() {
    let rowToModify = document.getElementById('row-index-input').value;
    if(!rowToModify || rowToModify === '') {
        window.alert('Nie wskazano rekordu do modyfikacji.');
        return;
    }

    let rows = document.getElementById('parameters').getElementsByTagName('tr')
    let params = {
        rowIndex: rowToModify,
        indices: [],
        values: [],
        exportToXML: false,
        previousScreenType: '',
        previousManufacturer: '',
    };

    let paramIndex = 0;
    for (let row of rows) {
        if(row.children[1].firstChild.checked) {
            if(paramIndex == 15) {
                params.exportToXML = true;
            }
            else {
                params.indices.push(paramIndex);
                params.values.push(row.children[2].firstChild.value);
            }
        }
        paramIndex++;
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    };

    fetch('http://localhost:3000/runAutomatedTask', options)
        .then(response => {
            if(response.ok) {
                alert('Proces zostanie uruchomiony w nowym oknie');
            } 
        }
    );
}