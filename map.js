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


var data;
$.getJSON("JanMaxime.github.io/data.json", function(json) {
    data = json
});

function custom_search() {
    var street_name = $("#street_name").val()
    console.log(street_name);
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]["street"])
        if (data[i]["street"] == street_name) {
            L.marker(data[i]["position"]).addTo(map).on('click', function(e) {
                map.setView(e.latlng);
                highlightMarker(e.latlng);
            });
        }
    }
}

document.getElementById("searchButton").addEventListener("click", custom_search, false)