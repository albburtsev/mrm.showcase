	/**
	 * Creates map
	 */
	var	map = mrm.map(_map.get(0), {
		dragging: false,
		touchZoom: false,
		scrollWheelZoom: false,
		doubleClickZoom: false,
		boxZoom: false
	});

	map.removeLayer(map.__layerSchema);
	map.removeControl(map.copyrightControl);
	map.removeControl(map.logoControl);

	var tileLayer = L.tileLayer('http://t{s}maps.mail.ru/tiles/scheme/{z}/{y}/{x}.png', {
		subdomains: '0123456789'
	}).addTo(map);

	tileLayer.on('load', function() {
		_win.trigger('mapinit.showcase');
	});

	window.map = map;
