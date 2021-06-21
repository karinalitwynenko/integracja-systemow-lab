statusFilter = ['Active', 'De-Orbited', 'Abandoned'];
typeFilter = ['Government', 'Commercial'];
sortBy = 'name';

function request() {
    $.ajax({
        url: "https://ll.thespacedevs.com/2.0.0/spacestation/?limit=100",
        type: 'GET',
        success: function(d) {
            data = d.results;
            display(data, statusFilter, typeFilter, sortBy);
        },
        error: function(xhr, status, error) {
            window.alert('Nie udało się załadować danych. ' +
                xhr.status == 429 ? 'Wysłano zbyt dużo żadań do API. Proszę spróbować za kilka minut.' : '');
        }
    });
}

window.onload = function() {
    request();
    var statusCheckboxes = $("input[name=status]");
    for(checkbox of statusCheckboxes) {
        checkbox.addEventListener('change', function() {
            statusFilter = [];
            if ($('#active')[0].checked) statusFilter.push('Active');
            if ($('#de-orbited')[0].checked) statusFilter.push('De-Orbited');
            if ($('#abandoned')[0].checked) statusFilter.push('Abandoned');

            display(data, statusFilter, typeFilter, sortBy);
        });
    }

    var typeCheckboxes = $("input[name=type]");
    for(checkbox of typeCheckboxes) {
        checkbox.addEventListener('change', function() {
            typeFilter = [];
            if ($('#government')[0].checked) typeFilter.push('Government');
            if ($('#commercial')[0].checked) typeFilter.push('Commercial');

            display(data, statusFilter, typeFilter, sortBy);
        });
    }

    $("select.sort")[0].addEventListener('change', function() {
        sortBy = $(this).children("option:selected").val();
        display(data, statusFilter, typeFilter, sortBy);
    });
}

function display(data, status, type, sortBy) {
    $(".grid-container").empty();

    if(sortBy == 'founded') {
        data.sort(function(a, b) {
            if (new Date(a.founded).getTime() < new Date(b.founded).getTime())
                return 1
            else if (new Date(a.founded).getTime() > new Date(b.founded).getTime())
                return -1
            else return 0
        });
    }
    else if(sortBy == 'deorbited') {
        data.sort(function(a, b) {
            if (new Date(a.deorbited).getTime() < new Date(b.deorbited).getTime())
                return 1
            else if (new Date(a.deorbited).getTime() > new Date(b.deorbited).getTime())
                return -1
            else return 0
        });
    }
    else if(sortBy == 'name') {
        data.sort(function(a, b) {
            if(a.name < b.name) { return -1; }
            else if(a.name > b.name) { return 1; }
            else return 0;
        });
    }

    let i = 0;
    for(item of data) {
        if(!status.includes(item.status.name) || !type.includes(item.type.name))
            continue;

        $(".grid-container").append( 
            "<div class='station'>" +
                "<p class='name'>Name: " + item.name  +  "</p>" +
                "<table>" +
                    `<tr><td><b>Orbit:</b></td><td>${item.orbit}</td></tr>` +
                    `<tr><td><b>Status:</b></td><td>${item.status.name}</td></tr>` +

                    `<tr><td><b>Description:</b></td><td><span class='hidden'>${item.description}</span><a onclick='showDesc(event)'>show</a></td></tr>` +

                    `<tr><td><b>Type:</b></td><td>${item.type.name}</td></tr>` +
                    `<tr><td><b>Founded:</b></td><td>${item.founded}</td></tr>` +
                    `<tr><td><b>Deorbited:</b></td><td>${item.deorbited == null ? '-' : item.deorbited}</td></tr>` +
                    `<tr><td><b>Owners:</b></td><td>${item.owners[0].name}</td></tr>` +

                "</table>" +
            "</div>" 
        );   

        i++;
    }

    $('#record-count').text('Records found: ' + i);
}

function showDesc(e) {
    e = e || window.event;

    var target = e.target || e.srcElement;
    target.parentElement.children[0].classList.remove('hidden');
    target.parentElement.removeChild(target);
}