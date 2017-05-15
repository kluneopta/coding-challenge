(function() {
  'use strict';

  // Calculated from county dataset bounds
  var kenyaBounds = new L.LatLngBounds(new L.LatLng(-4.801282, 33.910894),
    new L.LatLng(5.411669, 41.906744));

  L.mapbox.accessToken = 'pk.eyJ1IjoiZHNzcGVuY2UiLCJhIjoiY2oybTRtdXBkMDBtMjJ3bndzOHVvamxmZCJ9.Vh30vw2sCF-K_vhJGCMjAg';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    preferCanvas : true
  }).fitBounds(kenyaBounds)

  var layerLabels = {
    "projects" : "All Projects",
    "clustered" : "Clustered Projects",
    "counties" : "Projects by County"
  }

  var layerControl = L.control.layers().addTo(map);
  var legendCtl = L.mapbox.legendControl()
  var legendDOM = document.querySelector("#legend").innerHTML
  legendCtl.addLegend(legendDOM)

  map.on('baselayerchange', function(event) {
    if(event.name == layerLabels["counties"]) {
      toggleLegend(true)
    } else {
      toggleLegend(false)
      window.clearInterval(closeTooltip);
    }
  })

  function toggleLegend(showLegend) {
    if(showLegend) {
      legendCtl.addTo(map)
    } else {
      legendCtl.remove()
    }
  }

  // Map baselayers
  var projects;
  var clusterMarkers = L.markerClusterGroup();
  var kenyaCounties

  $.getJSON('data/projects.geojson')
    .done(function(data) {
      projects = L.geoJson(data, {
        onEachFeature: eachProjectFeature
      })
      clusterMarkers.addTo(map)
      layerControl.addBaseLayer(clusterMarkers, layerLabels["clustered"])
      layerControl.addBaseLayer(projects, layerLabels["projects"]);
    })
    .fail(function(error) {
      console.error("Failed to load Kenya Projects GeoJson " + error);
    })

  function eachProjectFeature(feature, layer) {
    layer.bindPopup(getPopupContent(feature));
    clusterMarkers.addLayer(layer);
  }

  var projectTemplate =
    "<div class='project-info'> \
      <h3 class='title'>{{project_title}}</h3> \
      <p class='description'> \
        <strong>Description</strong>: {{project_description}} \
      </p> \
      <p class='objectives'> \
        <strong>Objectives</strong>: {{project_objectives}} \
      </p> \
    </div>";

  function getPopupContent(feature) {
    // We could compile this template with something like Handlebars
    return L.mapbox.template(projectTemplate, {
      project_title: (feature.properties.project_title || "No title"),
      project_description: (feature.properties.project_description || "No description"),
      project_objectives: (feature.properties.project_objectives || "No objectives")
    });
  }

  $.getJSON('data/counties_projects.geojson')
    .done(function(data) {
      kenyaCounties = L.geoJson(data, {
        style: getCountyStyle,
        onEachFeature: eachCountyFeature
      })
      layerControl.addBaseLayer(kenyaCounties, layerLabels["counties"])
    })
    .fail(function(error) {
      console.error("Failed to load Kenya Counties GeoJSON " + error)
    })

  function eachCountyFeature(feature, layer) {
    layer.on({
      mousemove: hoverFeature,
      mouseout: featureExit,
    })
  }

  var popup = new L.Popup();
  var closeTooltip;
  var countyProjTemplate = "<div class='county-info'> \
    <h3>{{county_name}}</h3><h4>{{project_count}} project(s)</h4></div>"

  function hoverFeature(event) {
    var layer = event.target
    popup.setLatLng(event.latlng);
    popup.setContent(L.mapbox.template(countyProjTemplate, {
       "county_name" : layer.feature.properties.county_nam,
       "project_count" : layer.feature.properties.proj_count
    }));

    if (!popup._map) {
      popup.openOn(map);
    }
    window.clearInterval(closeTooltip);

    layer.setStyle({
      weight: 3,
      opacity: 0.3,
      fillOpacity: 1.0
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function featureExit(event) {
    kenyaCounties.resetStyle(event.target)
    closeTooltip = window.setInterval(function() {
      map.closePopup();
    }, 100);
  }

  function getCountyStyle(feature) {
    return {
      weight: 2,
      opacity: 0.1,
      color: 'black',
      fillOpacity: 0.8,
      fillColor: getCountyColor(feature.properties.proj_count)
    };
  }

  // These could be generated mathmatically but I thought it lost too much
  // detail on the bottom range because the max value is an outlier
  function getCountyColor(projCount) {
    return projCount >= 106 ? '#99000d' :
           projCount >= 72  ? '#cb181d' :
           projCount >= 50  ? '#ef3b2c' :
           projCount >= 35  ? '#fb6a4a' :
           projCount >= 27  ? '#fc9272' :
           projCount >= 13  ? '#fcbba1' : '#fee5d9';
  }
}())
