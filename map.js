var map = L.map("map").setView([46.2335, 7.3605], 17);
var publicToken =
  "pk.eyJ1IjoidG9rb25vbW8iLCJhIjoiY2toaTY1M3Y0MG9qNDJzcDlnbzJoZTI4ZyJ9.FwqCfi82ZxqeitStLwtkWA";

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
    publicToken,
  {
    maxZoom: 19,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: publicToken,
  }
).addTo(map);

var base_geojson;
var highlighted_geojson;
var base_layer = L.layerGroup().addTo(map);
var highlighted_layer = L.layerGroup().addTo(map);
var modal = document.getElementById("myModal");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption")


var selected_target;

function style(feature) {
  return {
    fillColor: "#9e2c18",
    weight: 2,
    opacity: 1,
    color: "#FFF",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

function highlighted_style(feature) {
  return {
    fillColor: "#fffb00",
    weight: 2,
    opacity: 1,
    color: "#FFF",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

function highlightFeature(e) {
  var layer = e.target;

  if (selected_target && layer == selected_target.target) {
    return;
  }
  layer.setStyle({
    weight: 5,
    color: "#000000",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlight(e) {
  if (selected_target && e.target == selected_target.target) {
    return;
  }

  var layer = e.target;
  layer.setStyle({
    weight: 2,
    opacity: 1,
    color: "#FFF",
    dashArray: "3",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: function (e) {
      $(".selection").removeClass("hidden");

      id_vallesia = feature.properties.IDVallesia;
      $("#parcelle_title").html(id_vallesia);

      DL1 = feature.properties.dubuis_lugon_I;
      DL2 = feature.properties.dubuis_lugon_II;
      DL3 = feature.properties.dubuis_lugon_III;
      DL4 = feature.properties.dubuis_lugon_IV;
      wikidata = feature.properties.Wikidata;

      if(wikidata){
          console.log(wikidata)
          $("#wikidata").attr("href", "https://www.wikidata.org/wiki/"+wikidata)
          $("#wikidata").show()
      }
      else{
        $("#wikidata").attr("href", "")
        $("#wikidata").hide()
      }

      if (DL1) {
        owner_table_html = "";
        for (var i = 0; i < DL1.length; i++) {
        
            var name = DL1[i]["name"]
            if(!name){
                name = "avec " + DL1[i]["ref_letter"]+ DL1[i]["ref_number"]
            }
          owner_table_html +=
            "<tr> <td>" +
            DL1[i]["start_year"] +
            " - " +
            DL1[i]["end_year"] +
            "</td><td>" +
            name +
            "</td></tr>";
        }
        $("#owner_table").html(owner_table_html);
      }

      else{
        $("#owner_table").html("");
      }

      if (DL2) {
        //Do nothing for now
      }

      dummy_list = ["assets/img/CH-AEV-24-79_001.jpg","assets/img/CH-AEV-24-81_001.jpg", "assets/img/CH-AEV-24-83_001.jpg"];
      if (DL3) {
        additional_data_tables = "";
        for (var i = 0; i < DL3.length; i++) {
          date = new Date(DL3[i]["date"]);
          date_text =
            date.getDate() +
            "." +
            (date.getMonth() + 1) +
            "." +
            date.getFullYear();
          additional_data_tables +=
            '<tr><td><a href="#additional-data" class="cotes" alt="' +
            dummy_list[i % dummy_list.length].slice(11, -4) +
            '" src="' +
            dummy_list[i % dummy_list.length] +
            '">' +
            DL3[i]["cote"] +
            "</a></td><td>" +
            date_text +
            "</td><td>" +
            DL3[i]["cote_type"] +
            "</td><td>" +
            DL3[i]["text"] +
            "</td></tr>";
        }
        $("#additional_data_tables").html(additional_data_tables);
      }
      else{
        $("#additional_data_tables").html("");
      }

      if (DL4) {
        $("#topo_data").html(DL4["text"]);
      }
      else{
        $("#topo_data").html("");
      }

      var cotes = document.getElementsByClassName("cotes");
      for (var i = 0; i < cotes.length; i++) {
        cotes[i].onclick = function () {
          modal.style.display = "block";
          modalImg.src = this.getAttribute("src");
          captionText.innerHTML = this.getAttribute("alt");
          $('#map').toggle()
        };
      }

      var old_selected = selected_target;
      selected_target = e;
      if (old_selected) {
        resetHighlight(old_selected);
      }

      layer.setStyle({
        weight: 5,
        color: "#FF6666",
        dashArray: "",
        fillOpacity: 0.7,
      });
    },
  });
}

base_geojson = L.geoJson(parcelles, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(base_layer);

function custom_search() {
  owner = $("#input_owner_name").val();
  start_year = $("#start").val();
  end_year = $("#end").val();

  if (start_year < 1600 || end_year > 1800) {
    return;
  }

  const corresponding_parcelles = [];
  const non_corresponding_parcelles = [];

  for (var i = 0; i < parcelles.features.length; i++) {
    included = false;
    var dubuis_lugon_I =
      parcelles["features"][i]["properties"]["dubuis_lugon_I"];
    if (dubuis_lugon_I) {
      for (var j = 0; j < dubuis_lugon_I.length; j++) {
        if (!dubuis_lugon_I[j].name) {
          continue;
        }
        if (
          !(owner == "") &&
          dubuis_lugon_I[j].name
            .toString()
            .toLowerCase()
            .includes(owner.toLowerCase()) &&
          start_year <= dubuis_lugon_I[j].start_year &&
          end_year >= dubuis_lugon_I[j].end_year
        ) {
          included = true;
          break;
        }
      }
      if (included) {
        corresponding_parcelles.push(parcelles["features"][i]);
      } else {
        non_corresponding_parcelles.push(parcelles["features"][i]);
      }
    }
  }

  var highlighted_parcelles = empty_parcelles["features"];
  var base_parcelles = empty_parcelles["features"];

  highlighted_parcelles = corresponding_parcelles;
  base_parcelles = non_corresponding_parcelles;
  highlighted_layer.clearLayers();
  highlighted_geojson = L.geoJson(highlighted_parcelles, {
    style: highlighted_style,
    onEachFeature: onEachFeature,
  }).addTo(highlighted_layer);
}

document
  .getElementById("input_owner_name")
  .addEventListener("input", custom_search, false);
document
  .getElementById("start")
  .addEventListener("input", custom_search, false);
document.getElementById("end").addEventListener("input", custom_search, false);



// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  $("#map").toggle()
}
