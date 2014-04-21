	var	_win = $(window),
		_map = $('.js-map'),
		config;

	$.ajaxSetup({
		dataType: 'json',
		cache: false
	});

	/**
	 * Inverts multypolyline [[[lon, lat], [lon, lat]]] to polyline [[lat, lon], [lat, lon]]
	 */
	function invertCoords(coords) {
		for (var i = 0, polyline, inverted = []; i < coords.length; i++) {
			polyline = coords[i];
			for (var j = 0, lonlat; j < polyline.length; j++) {
				lonlat = polyline[j];
				inverted.push([lonlat[1], lonlat[0]]);
			}
		}

		return inverted;
	}

	/**
	 * Adds road path on map
	 */
	function addPath(key, data) {
		var road = config[key];

		if ( road.polyline ) {
			return;
		}

		road.polyline = mrm
			.polyline(invertCoords(data.points), {
				weight: 10,
				opacity: 1,
				lineCap: 'round',
				lineJoin: 'bevel',
				className: 'path inactive'
			})
			.addTo(map);

		setTimeout(function() {
			// UGLY: .removeClass('inactive'); does not work for SVG-elements
			// http://bugs.jquery.com/ticket/10329
			$('.path.inactive').each(function() {
				var _this = $(this);
				_this.attr('class', _this.attr('class').replace('inactive', ''));
			});
		}, 1);
	}

	/**
	 * Inits showcase app
	 */
	_win.on('init.showcase', function() {
		for (var key in config) {
			var road = config[key],
				directions = road.directions;

			for (var i = directions.length, direction; i--;) {
				direction = directions[i];

				$.ajax('http://maps.mail.ru/mroutes', {
					key: key,
					data: {
						wtype: 1,
						points: direction.points.join(',')
					},
					success: function(data) {
						addPath(this.key, data);
					}
				});
			}
		}
	});

	/*
	 * Gets config
	 */
	$.get('static/js/config.json', function(data) {
		//if ( typeof showcase !== 'undefined' ) {
			// showcase.init(config, map);
		//}

		config = data;
		_win.trigger('init.showcase');
	});
