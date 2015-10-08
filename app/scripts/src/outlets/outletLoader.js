define(function (require) {

	function getData(latLng, error, result) {
		require(["jquery"], function ($) {
			$.ajax("/getOutlets?" + buildQueryString(latLng), {
				success: result,
				error: error
			});
		});
	}

	function buildQueryString(latLng) {
		return "lat=" + latLng.lat + "&lng=" + latLng.lng;
	}

	return {
		getData: getData
	};
});