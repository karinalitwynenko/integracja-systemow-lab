window.onload = function loadManufacturers() {
    $.soap({
        ...CatalogService.GetManufacturers(),
        success: function (soapResponse) {
            let select = document.getElementById('manufacturer-select');
            console.log(getSoapBody(soapResponse.toJSON()).GetManufacturersResponse)
            let manufacturers = getSoapBody(soapResponse.toJSON()).GetManufacturersResponse.manufacturers;
            for(let item of manufacturers.manufacturer) {
                let option = document.createElement("option");
                option.value = item['#text'];
                option.text = item['#text'];
                select.appendChild(option);
            }
        },
        error: function (SOAPResponse) {
            console.log(SOAPResponse.toString());
        }
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
        for(let column of laptop.laptop) {
            item = document.createElement('td');
            item.textContent = column['#text'];
            row.appendChild(item);

            if(column != laptop[0]) {
                item.setAttribute('data-col-index', colIndex);
            }

            colIndex++;
        }
    }
}

function displayCountByManufacturer() {
    let select = document.getElementById('manufacturer-select');
    let manufacturer = select.value;

    $.soap({
        ...CatalogService.GetCountByManufacturer(manufacturer),
        success: function (soapResponse) {
            let data = getSoapBody(soapResponse.toJSON()).GetCountByManufacturerResponse.itemCount['#text'];
            document.getElementById('itemCountByManufacturer').innerHTML = 'Liczba laptopów: ' + data;            
        },
        error: function (SOAPResponse) {
            console.log(SOAPResponse.toString());

        }
    });
}

function displayCountByAspectRatio() {
    let select = document.getElementById('aspect-ratio-select');
    let aspectRatio = select.value;

    $.soap({
        ...CatalogService.GetCountByAspectRatio(aspectRatio),
        success: function (soapResponse) {
            let data = getSoapBody(soapResponse.toJSON()).GetCountByAspectRatioResponse.itemCount['#text'];
            document.getElementById('itemCountByAspectRatio').innerHTML = 'Liczba laptopów: ' + data;            
        
            console.log(data);
        },
        error: function (SOAPResponse) {
            console.log(SOAPResponse.toString());
        }
    });
}

function displayByScreenType() {
    let select = document.getElementById('screen-type-select');
    let screenType = select.value;

    $.soap({
        ...CatalogService.GetByScreenType(screenType),
        success: function (soapResponse) {
            console.log(soapResponse.toJSON());
            let data = getSoapBody(soapResponse.toJSON()).GetByScreenTypeResponse.laptop;
            console.log(data);
            clearTable();
            generateLaptopsTable(data);
            document.getElementById('error-message').textContent = '';
            
        },
        error: function (SOAPResponse) {
            console.log(SOAPResponse.toString());
        }
    });
}

function clearTable() {
    let laptopTable = document.getElementById('catalog').getElementsByTagName('tbody')[0];
    laptopTable.textContent = '';
}

function getSoapBody(json) {
    return json['#document']['soap:Envelope']['soap:Body'];
}