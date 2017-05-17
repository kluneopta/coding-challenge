# Ushahidi Coding Challenge
    
### Installation Instructions

* To avoid Cross-Origin Resource Sharing errors it should be served with a development HTTP Server such as that included with Python:

    ```python -m SimpleHTTPServer 8000```
  
  
* The site can then be accessed at http://localhost:8000 in your browser
* You may need to change the port number if 8000 is already in use

### Code Overview & Notes

* For simplicity's sake everything is done in client side Javascript.  In a real world project I would invest more in the modular organization of code (Require.js, Webpack, Browserify ...) and building out the server side.
* I'm utilizing the built in overlay control to switch between map styles (All Projects, Clustered Markers (Default for faster loading), and County Choropleth)
* It would be nice to include a loading indicator so the user knows when a large dataset isn't ready.
* Since the raw project markers and clustered markers share the same data we only need to parse that GeoJSON once.
* Instead of joining the datasets in code on the county value, I added a project count column to the counties.geojson file.
* If I had more time I wouldn't bind the popup project info data until the user clicks on the marker to improve performance.
* I've cleaned up the projects dataset that had spelling variations and capitalization issues.  I recategorized 5 projects, which listed Konoin instead of Bomet for the proper county.  There was another marker with coordinates inside of Nairobi county but a missing county value that I fixed.
* There was a stray polygon in the counties dataset that should be part of the Kisumu county boundary.
* I didn't assign projects without a latitude and longitude value to the centerpoint of its county but that would be another improvementt to make.
* As part of the bonus I condensed the projects dataset somewhat by converting properties with 'Unspecified' to null.  I then minified the file, which removed whitespace and remapped the property keys.
* On a real server the GeoJSON can be gzipped or we can use something like JSONP or another binary format that could stream the data.

### Credits & Libraries

* [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate) for the basic foundation and css cross-browser compatibility
* [Mapbox.js](https://github.com/mapbox/mapbox.js) wrapper around Leaflet offering enhancements such as legend controls, templating, and mobile support
* [Leaflet](https://github.com/Leaflet/Leaflet) underlying mapping engine and API included with Mapbox.js
* [JQuery](https://github.com/jquery/jquery/) for simplifying AJAX requests to load GIS data
* [Leaflet.markercluster Plugin](https://github.com/Leaflet/Leaflet.markercluster) Leaflet plugin for automatically clustering markers on zoom
* [Carto](https://carto.com) for fast editing and exploring of GeoJSON files
* [Color Brewer](http://colorbrewer2.org/) helped generate sequential hex colors for choropleth

* [Leaflet Marker Cluster Example](http://leafletjs.com/examples/choropleth/)
* [Mapbox Choropleth Example](https://www.mapbox.com/mapbox.js/example/v1.0.0/choropleth/)
* [Minify GeoJSON](https://www.npmjs.com/package/minify-geojson)