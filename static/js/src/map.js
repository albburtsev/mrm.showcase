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

	L.tileLayer('http://t{s}maps.mail.ru/tiles/scheme/{z}/{y}/{x}.png', {
		subdomains: '0123456789'
	}).addTo(map);

	window.map = map;
