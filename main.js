var APP_PORT = 9615;

var http = require("http"),
	express = require("express"),
	request = require("request"),
	xml2js = require("xml2js"),
	ld = require('lodash-node'),
	requirejs = require('requirejs');

requirejs.config({
	nodeRequire: require,
	baseUrl: "shared"
});

var Outlet = requirejs("outlets/Outlet");

var app = express();

app.use("/scripts", express.static("app/scripts"));
app.use("/resources", express.static("app/resources"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/app/views/index.html");
});

app.get("/getOutlets", function (req, res) {
	var happyCowRequest = buildHappyCowRequest(req.query.lat, req.query.lng);
	console.log(happyCowRequest);
	request(happyCowRequest, function (err2, res2, body) {
		xml2js.parseString(body, function (err3, res3) {
			var featureCollection = {
				"type": "FeatureCollection",
				"features": ld.map(res3.markers.marker, function (marker) {
					return Outlet.fromHappyCow(marker.$).toGeoJson();
				})
			};
			
			res.header("Content-Type", "application/json");
			res.send(featureCollection);
		});
	});
});

function getFeatureFromMarker(marker) {
	var markerData = marker.$,
		lat = parseFloat(markerData.lat, 10),
		lng = parseFloat(markerData.lng, 10),
		markerFeature = {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [lng, lat]
			},
			"properties": {
				"name": markerData.name,
				"outletType": getOutletTypeFromMarkerData(markerData)
			}
		};
	return markerFeature;
}

function buildHappyCowRequest(lat, lng) {
	return "http://www.happycow.net/gmaps/proximityXML18t.php?lat=" + lat + "&lon=" + lng + "&distance=15&9&V=checked&VR=checked&VF=checked&HR=checked";
}

app.listen(APP_PORT, function () {
	console.log("Server listening at port %s", APP_PORT);
});