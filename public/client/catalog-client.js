window.onload = function loadManufacturers() {
    $.soap({
        ...CatalogService.GetManufacturers(),
        success: function (soapResponse) {
            let select = document.getElementById('manufacturer-select');
            let manufacturers = getSoapBody(soapResponse.toJSON()).GetManufacturersResponse.manufacturers;
            if(manufacturers != undefined && manufacturers.manufacturer != undefined && manufacturers.manufacturer.length != 0) {
                for(let item of manufacturers.manufacturer) {
                    let option = document.createElement("option");
                    option.value = item['#text'];
                    option.text = item['#text'];
                    select.appendChild(option);
                }
            }
            else {
                document.getElementById('general-error-message').innerHTML = 
                    'Brak danych o producentach. Wystąpił błąd lub źródło nie zawiera danych.';
            }
        },
        error: function (SOAPResponse) {
            document.getElementById('general-error-message').innerHTML =
                'Brak danych o producentach. Wystąpił błąd podczas pobierania danych.';
        }
    });
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
        error: function (soapResponse) {
            document.getElementById('general-error-message').innerHTML = 'Wystąpił błąd przy pobieraniu danych.';
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
        },
        error: function (soapResponse) {
            document.getElementById('general-error-message').innerHTML = 'Wystąpił błąd przy pobieraniu danych.';
        }
    });
}

function displayByScreenType() {
    let select = document.getElementById('screen-type-select');
    let screenType = select.value;

    $.soap({
        ...CatalogService.GetByScreenType(screenType),
        success: function (soapResponse) {
            let data = getSoapBody(soapResponse.toJSON()).GetByScreenTypeResponse.laptops;
            clearTable();
            generateLaptopsTable(data);
            document.getElementById('error-message').textContent = '';
        },
        error: function (soapResponse) {
            document.getElementById('general-error-message').innerHTML = 'Wystąpił błąd przy pobieraniu danych.';
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

function generateLaptopsTable(laptops) {
    let table = document.getElementById('catalog').getElementsByTagName('tbody')[0];
    let row;
    let item;

    for (let laptop of laptops.laptop) {
        row = document.createElement('tr');
        table.appendChild(row);
        for(let column of laptop.item) {
            item = document.createElement('td');
            item.textContent = column['#text'];
            row.appendChild(item);
        }
    }
}