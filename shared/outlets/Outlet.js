define(function (require) {

	var OutletType = require("outlets/OutletType");

	function Outlet(data) {
		this.lat = data.lat;
		this.lng = data.lng;
		this.name = data.name;
		this.outletType = data.outletType;
		this.happyCowUrl = data.happyCowUrl;
	}

	Outlet.prototype.toGeoJson = function () {
		return {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [this.lng, this.lat]
			},
			properties: this
		};
	};

	Outlet.fromGeoJson = function (data) {
		return new Outlet(data.properties);
	};

	Outlet.fromHappyCow = function (data) {
		return new Outlet({
			lat: parseFloat(data.lat, 10),
			lng: parseFloat(data.lng, 10),
			name: data.name,
			happyCowUrl: data.pretty_url,
			outletType: OutletType.fromHappyCow(data)
		});
	};

	return Outlet;
});