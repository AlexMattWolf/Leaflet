//Define color pallette for magnitude scaling, import data from USGS for 1 day, 1 week, 1 month, later used with legend
var color = ["#22E600","#67EE00","#B1F700","#FFFF00","#FF6F00","#FF000A"]
days7 = bakenshake("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");
days1 = bakenshake("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
days30 = bakenshake("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson");

// Define scaling color function for circles.
function paint(mag) {
  var scl = [1,2,3,4,5,10]
  var fill;

  for (var i = 0; i < scl.length; i++) {
    if (mag < scl[i]) {
      fill = color[i]
      break;
    }
  }
  return fill;
};

//Function to render earthquake layers in circlemarkers.
function bakenshake(usgs) {

  var eqs = [];
  d3.json(usgs, function(data) {
    eqs.push(L.geoJson(data, {
      pointToLayer: function(feature, coords) {
        return L.circleMarker(coords, {
          fillColor: paint(feature.properties.mag),
          color: paint(feature.properties.mag),
          fillOpacity: .7,
          radius: (((feature.properties.mag)**2))/2,
          }).bindPopup("<b>Magnitude</b>: " + feature.properties.mag +
            "<br><b>Latitude</b>: " + feature.geometry.coordinates[1] + 
            "<br><b>Longitude</b>: " + feature.geometry.coordinates[0] + 
            "<br><b>Time</b>: " + (new Date(feature.properties.time)))
        }}));
    });
    return eqs;
  }

  var platesjson = "static/data/GeoJSON/PB2002_plates.json";
  var boundjson =  "static/data/GeoJSON/PB2002_boundaries.json";
  //bother things to put in if I get bored
  // var link = "static/data/GeoJSON/PB2002_orogens.json";
  // var link = "static/data/GeoJSON/PB2002_steps.json";

//Creates bright and distinguishable colors, avoids whites, light grays, and blacks to make plate coloring easier to see against base maps.
function crayon() {
    var t = []
    function r() {
      var r = Math.random();
      if (r < .3 && t.includes(0) == false) {
        r = 0
      };
      t.push(r);
      return (255 - (r * 150));
    }
    var color = d3.rgb(r(),r(),r())
    return color;
};

var shaker = [];
    d3.json(platesjson, function(data) {
  
      // console.log("Tectonics", data)
      shaker.push(L.geoJson(data, {
        //Use style function to make each plate a different color.
        style: function(feature) { 
          return {
            color: "#31C1B3",
            fillColor: crayon(),
            weight: .25,
            fillOpacity: 0,
          }},

          //on each tectonic plate add a popup containing plate name and code, highlights when hovered, transparent when not
          onEachFeature: function(feat, layer) {

          var str = `<b>Plate</b>: ${feat.properties.PlateName}<br><b>Code</b>: ${feat.properties.Code}`;
          layer.bindPopup(str,{autoPan: false});
          
          //set popup to occur when mouseover, highlighting tectonic plate. Use map to close close popup when off (includes when mouse is off window)
          layer.on({
            mouseover: function(event) {
              layer.openPopup();
              layer = event.target
              layer.setStyle({
                fillOpacity: .4,
              });
            },
            mouseout: function(event) {
              layer.closePopup();
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0,
              });
            },
        })
      }
    }))
    });
  
  //Create Tectonic lines
  var lines = [];
    d3.json(boundjson, function(data) {
      lines.push(L.geoJson(data, {
          style: {
            color: "#00FFFD",
            weight: 2,
            fillOpacity: 0
          },
      }))
    })

  //IMPORT ALL THE BASE MAPS!!!! or at least just these four: sat, outdoors, light, dark.

var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
})

var outmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
})

var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
})

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY,
})

// Due to large size of month data and large size of plates data, timer and function needed to prevent mapper from rendering before layers are defined, otherwise
// empty renders empty maps.
setTimeout(mapper, 5000)

//Create the map.
var earth, plates, bounds, steps, week, day, month;

  function mapper() {

    // Define Layers as Overlay and Bases maps
    day = L.layerGroup(days1);
    week = L.layerGroup(days7);
    month = L.layerGroup(days30);
    plates = L.layerGroup(shaker);
    bounds = L.layerGroup(lines);

    var bases = {
        "Satelitte": satmap,
        "Outdoor": outmap,
        "Grey-Scale": lightmap ,
        "Dark": darkmap,
      };
      
    var overlays = {
        "Earthquakes: (24 Hours)": day,
        "Earthquakes: (7 Days)": week,
        "Earthquakes: (1 Month)": month,
        "Tectonic Plates": plates,
        "Tectonic Boundries": bounds,
    };
      
      earth = L.map("map", {
        // Centered in Vegas, time to party
        center: [36.102533, -115.172827],
        zoom: 2,
        layers: [satmap, plates, week],
        // Seeing Tectonic plates is easier when they wrap *cough* pacific
        worldCopyJump: true,
      });

    //Make legend, use previously defined colors for scale., position bottom right, create list for each entry. use css to format accordingly
    L.control.layers(bases, overlays, {
        collapsed: false,
      }).addTo(earth);

      var legend = L.control({ position: 'bottomright' });
      legend.onAdd = function() {
        var colors = color;
        var text = [];
        var lgnd = L.DomUtil.create('div', 'legend');
        var intervals = ['0-1','1-2','2-3','3-4','4-5','5+'];

        var header = '<h3>Richter Scale</h3>';
    
        lgnd.innerHTML = header;
    
        intervals.forEach(function(int, index) {
          text.push(`<li><b>${int}</b>` + `<text class='color' style='background-color: ${colors[index]};'></text></li>`)   ;
        });
        
        // combine header with list items for legend
        lgnd.innerHTML += `<ul>${text.join('')}</ul>`;
        return lgnd;
      };
      legend.addTo(earth);
    }