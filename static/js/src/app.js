(function() {
	'use strict';

	var	_map = d3
		.select('.js-map')
		.node();

	/**
	 * Create a map
	 */
	var map = mrm.map(_map);

	map.removeLayer(map.__layerSchema);
	map.removeControl(map.copyrightControl);
	map.removeControl(map.logoControl);

	L.tileLayer('https://a.tiles.mapbox.com/v3/{mapid}/{z}/{x}/{y}.png', {
		mapid: 'examples.map-9ijuk24y'
	}).addTo(map);

	// map.jamsOn();

	window.map = map;
})();