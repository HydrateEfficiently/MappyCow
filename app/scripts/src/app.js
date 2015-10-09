define(function (require) {

	var L = require("leaflet"),
		Locate = require("leaflet-locate"),
		OutletMarkerLayer = require("src/outlets/outletMarkerLayer");

	var map,
		outletMarkerLayer;

	function start() {
		map = L.map("map").setView([51.505, -0.09], 15);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
			attributionControl: false,
			maxZoom: 18,
			id: "michaelfry2002.ciffh9mgk00klsxlxqg3hm7bz",
			accessToken: "pk.eyJ1IjoibWljaGFlbGZyeTIwMDIiLCJhIjoiY2lmZmg5bW9tMDBrb3R0a25sY2hrczhqYyJ9.6gUxriXEPeyvWQbq7znCAg"
		}).addTo(map);

		var locationControl = new Locate({
			keepCurrentZoomLevel: true
		});

		locationControl.addTo(map);
		locationControl.start();

		map.on("locationfound", function () {
			onMapContextMenu();
		});

		initialiseOutputMarkerLayer();
	}

	function onLocationFound(e) {
		var radius = e.accuracy / 2,
			myIcon = L.divIcon({
				className: "marker category-gps",
				iconSize: null
			});

		L.marker(e.latlng, { icon: myIcon }).addTo(map);

		L.circle(e.latlng, radius).addTo(map);

		onMapContextMenu();
	}

	function onMapContextMenu(e) {
		require(["src/outlets/outletLoader"], function (outletLoader) {
			outletLoader.getData(
				map.getCenter(),
				function () {
				},
				function (data) {
					outletMarkerLayer.setData(data);
					map.fitBounds(outletMarkerLayer.getBounds());
					console.log(data);
				});
		});
	}

	function initialiseOutputMarkerLayer() {
		if (outletMarkerLayer) {
			throw "OutletMarkerLayer already exists!";
		}
		outletMarkerLayer = new OutletMarkerLayer();
		map.addLayer(outletMarkerLayer);
	}

	return {
		start: start
	};
	
});