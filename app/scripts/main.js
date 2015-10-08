(function () {

	function getLibraryScriptPath(scriptFileName) {
		return "lib/" + scriptFileName;
	}
	
	require.config({
		baseUrl: "scripts",
		paths: {
			"d3": getLibraryScriptPath("d3"),
			"jquery": getLibraryScriptPath("jquery-2.1.4.min"),
			"leaflet": getLibraryScriptPath("leaflet"),
			"leaflet-awesomemarkers": getLibraryScriptPath("leaflet.awesome-markers"),
			"leaflet-markercluster": getLibraryScriptPath("leaflet.markercluster"),
			"lodash": getLibraryScriptPath("lodash.compat-2.4.1")
		},
		shim: {
			"leaflet": {
				exports: "L"
			},
			"leaflet-markercluster": {
				deps: ["leaflet"],
				exports: "L.markerClusterGroup"
			},
			"leaflet-awesomemarkers": {
				deps: ["leaflet"],
				exports: "L.AwesomeMarkers"
			}
		}
	});

	require(["src/app"], function (app) {
		app.start();
	});

} ());