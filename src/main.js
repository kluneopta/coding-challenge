(function() {
  'use strict';

  var kenyaBounds = new L.LatLngBounds(new L.LatLng(-4.801282, 33.910894),
    new L.LatLng(5.411669, 41.906744));

  L.mapbox.accessToken = 'pk.eyJ1IjoiZHNzcGVuY2UiLCJhIjoiY2oybTRtdXBkMDBtMjJ3bndzOHVvamxmZCJ9.Vh30vw2sCF-K_vhJGCMjAg';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    preferCanvas : true
  }).fitBounds(kenyaBounds)

  var layerLabels = {
    "projects" : "All Projects",
    "clustered" : "Clustered Projects"
  }

  var layerControl = L.control.layers().addTo(map);

  var projects;
  var clusterMarkers = L.markerClusterGroup();

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

}())
