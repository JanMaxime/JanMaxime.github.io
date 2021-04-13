var map = L.map('map').setView([46.53, 6.63], 14);
var publicToken = 'pk.eyJ1IjoidG9rb25vbW8iLCJhIjoiY2toaTY1M3Y0MG9qNDJzcDlnbzJoZTI4ZyJ9.FwqCfi82ZxqeitStLwtkWA';

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + publicToken, {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: publicToken
}).addTo(map);



var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var on = false
var greenMarker;

function highlightMarker(position) {
    if (on) {
        map.removeLayer(greenMarker)
    }
    greenMarker = new L.marker(position, { icon: greenIcon }).addTo(map);
    map.addLayer(greenMarker);
    on = true;
}

function fillSelectedFields(latlng) {
    key = latlng["lat"].toString() + latlng["lng"].toString();
    document.getElementById("selected_street").innerHTML = markers_data.get(key)[0];
    document.getElementById("selected_owner").innerHTML = markers_data.get(key)[1];
    document.getElementById("selected_renter_forname").innerHTML = markers_data.get(key)[2];
    document.getElementById("selected_renter_lastname").innerHTML = markers_data.get(key)[3];
    document.getElementById("selected_job").innerHTML = markers_data.get(key)[4];
    document.getElementById("selected_use").innerHTML = markers_data.get(key)[5];
}


var data;
$.getJSON("https://JanMaxime.github.io/data.json", function(json) {
    data = json

});

$.getJSON("https://JanMaxime.github.io/polygon.json", function(json) {
    var polygones = json;

    for (var i = 0; i < polygones.length; i++) {
        L.polygon(polygones[i]).setStyle({ color: '#FF0000', weight: 2 }).addTo(map);
    }

});

var job;
var street;
var forname;
var name_;
var layerGroup = L.layerGroup().addTo(map);

markers_data = new Map();

function custom_search() {
    if (on) {
        map.removeLayer(greenMarker)
    }
    layerGroup.clearLayers();
    layerGroup = L.layerGroup().addTo(map);

    var input_street = $("#input_street").val()
    var input_owner_name = $("#input_owner_name").val()
    var input_job = $("#input_job").val()
    var input_use = $("#input_use").val()

    for (var i = 0; i < data.length; i++) {

        if ((data[i]["street"].includes(input_street) || input_street == "") &&
            (data[i]["owner"].includes(input_owner_name) || input_owner_name == "") &&
            (data[i]["use"].includes(input_use) || input_use == "") &&
            (data[i]["job"].includes(input_job) || input_job == "")) {
            markers_data.set(data[i]["position"][0].toString() + data[i]["position"][1].toString(), [data[i]["street"], data[i]["owner"], data[i]["renter_forname"], data[i]["renter_lastname"], data[i]["job"], data[i]["use"]])
            L.marker(data[i]["position"]).addTo(layerGroup).on('click', function(e) {
                map.setView(e.latlng);
                highlightMarker(e.latlng);
                fillSelectedFields(e.latlng);
            });
        }
    }
}

document.getElementById("searchButton").addEventListener("click", custom_search, false)