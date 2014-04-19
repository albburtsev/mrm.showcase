jQuery(function($) {
	'use strict';

	var	_win = $(window),
		_doc = $(document),
		_map = $('.js-map');

	$.ajaxSetup({
		dataType: 'json',
		cache: false
	});

	/**
	 * Adds spinner
	 */
	$('.spinner').each(function() {
		var _this = $(this),
			minSize = Math.min(_this.width(), _this.height());

		new Spinner({
			length: minSize / 7,
			radius: minSize / 7,
			width: minSize / 20,
			className: 'spinner__inner'
		}).spin(this);
	});

	/**
	 * Creates map
	 */
	var map = mrm.map(_map.get(0), {
		dragging: false,
		touchZoom: false,
		scrollWheelZoom: false,
		doubleClickZoom: false,
		boxZoom: false
	});

	map.removeLayer(map.__layerSchema);
	map.removeControl(map.copyrightControl);
	map.removeControl(map.logoControl);

	L.tileLayer('http://t{s}maps.mail.ru/tiles/scheme/{z}/{y}/{x}.png', {
		subdomains: '0123456789'
	}).addTo(map);

	/*
	 * Gets config
	 */
	$.get('static/js/config.json', function(config) {
		if ( typeof showcase !== 'undefined' ) {
			// showcase.init(config, map);
		}
	});

	window.map = map;
});