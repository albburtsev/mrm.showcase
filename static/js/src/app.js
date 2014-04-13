jQuery(function() {
	'use strict';

	var	_map = $('.js-map');

	/**
	 * Create a map
	 */
	var map = mrm.map(_map.get(0));

	map.removeLayer(map.__layerSchema);
	map.removeControl(map.copyrightControl);
	map.removeControl(map.logoControl);

	L.tileLayer('https://a.tiles.mapbox.com/v3/{mapid}/{z}/{x}/{y}.png', {
		mapid: 'examples.map-9ijuk24y'
	}).addTo(map);

	// map.jamsOn();

	window.map = map;
});