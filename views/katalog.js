function save() {
    let rows = document.getElementById('katalog').getElementsByTagName('tr')
    let data = [];
    let firstRow = true;
    let temp;
    for (let row of rows) {
        if(firstRow) {
            firstRow = false;
        }
        else {
            temp = [];
            for(let item of row.childNodes) {
                if(item !== row.firstChild)
                    temp.push(item.textContent);
            }
            data.push(temp);
        }
    }

    console.log(data)
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch('save', options)
        .then(response => {
            if(!response.ok)
                throw Error(response.statusText)
            else
                return  response.text()
        })
        .then(() => {
            console.log('ok');
        })
}