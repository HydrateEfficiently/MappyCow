define(function (require) {

	var L = require("leaflet"),
		OutletMarkerLayer = require("src/outlets/outletMarkerLayer");

	var map,
		outletMarkerLayer;

	function start() {
		map = L.map("map").setView([51.505, -0.09], 13);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: "michaelfry2002.ciffh9mgk00klsxlxqg3hm7bz",
			accessToken: "pk.eyJ1IjoibWljaGFlbGZyeTIwMDIiLCJhIjoiY2lmZmg5bW9tMDBrb3R0a25sY2hrczhqYyJ9.6gUxriXEPeyvWQbq7znCAg"
		}).addTo(map);

		map.locate({
			setView: true
		});

		map.on("contextmenu", onMapContextMenu);

		initialiseOutputMarkerLayer();
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