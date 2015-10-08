define(function (require) {

	var L = require("leaflet"),
		markerClusterGroup = require("leaflet-markercluster"),
		AwesomeMarkers = require("leaflet-awesomemarkers"),
		PieChartDivIcon = require("src/outlets/pieChartDivIcon"),
		d3 = require("d3");

	var CLUSTER_PIE_STROKE_WIDTH = 1,
		MAX_CLUSTER_RADIUS = 30;

	function OutletMarkerLayer() {
		var self = markerClusterGroup.call(this, {
			maxClusterRadius: 80,
			iconCreateFunction: iconCreateFunction
		});

		self.setData = function (data) {
			self._markers = L.geoJson(data, {
				pointToLayer: defineFeature,
				onEachFeature: addPopup
			});
			self.addLayer(self._markers);
		};

		self.getBounds = function () {
			return self._markers.getBounds();
		};

		return self;
	}

	function iconCreateFunction(cluster) {
		var childMarkers = cluster.getAllChildMarkers(),
			count = childMarkers.length;
			
		return new PieChartDivIcon(cluster.getAllChildMarkers(), {
			strokeWidth: CLUSTER_PIE_STROKE_WIDTH,
			radius: MAX_CLUSTER_RADIUS - (2 * CLUSTER_PIE_STROKE_WIDTH) - (count < 10 ? 12 : count < 100 ? 8 : count < 1000 ? 4: 0),
		});
	}

	function defineFeature(feature, latlng) {
		var categoryVal = feature.properties.outletType.id,
			myClass = 'marker category-' + categoryVal;

		var myIcon = L.divIcon({
			html: feature.properties.outletType.abbreviation,
			className: myClass,
			iconSize: null
		});

		return L.marker(latlng, { icon: myIcon });
	}

	function addPopup(feature, layer) {
		var outlet = feature.properties;
		layer.bindPopup("<div style='text-align: center; padding: 3px;'>" +
			"<b>" + outlet.name + "</b>" + 
			"<div style='padding: 3px;'><i>" + outlet.outletType.name + "</i></div>" + 
			"<div 'display: inline-block;'>" +
				"<a href='http://www.happycow.net/reviews/" + outlet.happyCowUrl + "''><img class='ext-logo happy-cow-logo'/></a>" +
				"<a href='https://www.google.com/maps/@" + outlet.lat + "," + outlet.lng + ",18z'><img class='ext-logo google-maps-logo' /></a>" +
				"<a href='https://www.here.com/?x=ep&map=" + outlet.lat + "," + outlet.lng + ",17,normal'><img class='ext-logo here-logo' /></a></div>" +
			"</div>");
	}

	return OutletMarkerLayer;
});