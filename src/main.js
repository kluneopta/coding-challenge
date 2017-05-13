(function() {
  'use strict'

  var kenyaBounds = new L.LatLngBounds(new L.LatLng(-4.801282, 33.910894),
    new L.LatLng(5.411669, 41.906744));

  L.mapbox.accessToken = 'pk.eyJ1IjoiZHNzcGVuY2UiLCJhIjoiY2oybTRtdXBkMDBtMjJ3bndzOHVvamxmZCJ9.Vh30vw2sCF-K_vhJGCMjAg';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    preferCanvas : true
  }).fitBounds(kenyaBounds)

}())
