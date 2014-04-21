jQuery(function($) {
	'use strict';

	var utils = {
		/**
		 * Simple inflection 
		 */
		inflect: function (i, forms) { // 
			var index,
				dec = (i = parseInt(i, 10)) % 10,
				hun = i % 100;

			if (dec == 1 && hun != 11) {
				index = 0;
			} else if (dec >= 2 && dec <= 4 && Math.floor(hun / 10) != 1) {
				index = 1;
			} else {
				index = 2;
			}
			return forms[index];
		},

		/**
		 * Inverts multypolyline [[[lon, lat], [lon, lat]]] to polyline [[lat, lon], [lat, lon]]
		 */
		invertCoords: function(coords) {
			for (var i = 0, polyline, inverted = []; i < coords.length; i++) {
				polyline = coords[i];
				for (var j = 0, lonlat; j < polyline.length; j++) {
					lonlat = polyline[j];
					inverted.push([lonlat[1], lonlat[0]]);
				}
			}

			return inverted;
		},

		/**
		 * Returns color tag for jams score
		 */
		scoreColor: function(score) {
			score = parseInt(score);
			score = Math.min(score, 10);
			score = Math.max(score, 0);
			if ( score <= 4 ) {
				return 'green';
			} else if ( score <= 7 ) {
				return 'yellow';
			} else {
				return 'red';
			}
		}
	};

	var	_win = $(window),
		_map = $('.js-map'),
		_title = $('.js-title'),
		_titleScore = $('.js-score', _title),

		isLoading = 'is-loading',
		config;

	$.ajaxSetup({
		dataType: 'json',
		cache: false
	});

	/**
	 * Adds road path on map
	 */
	function addPath(key, data) {
		var road = config[key];

		if ( road.polyline ) {
			return;
		}

		road.polyline = mrm
			.polyline(utils.invertCoords(data.points), {
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

	_win.on('score.showcase', function(e, score) {
		var colorTag = utils.scoreColor(score),
			data = _titleScore.data(),
			forms = data.forms.split(','),
			classPrefix = data.classPrefix;

		_titleScore
			.removeClass(['', 'red', 'yellow', 'green'].join(' ' + classPrefix))
			.addClass(classPrefix + colorTag)
			.html(score + ' ' + utils.inflect(score, forms));
		_title.removeClass(isLoading);
	});

	/*
	 * Gets config
	 */
	$.get('static/js/config.json', function(data) {
		config = data;
		// _win.trigger('init.showcase');
	});

	/**
	 * Gets jams score
	 */
	_win.on('mapinit.showcase', function() {
		var mailru = window.mailru || {};
		mailru.maps = mailru.maps || {};
		window.mailru = mailru;

		mailru.maps.cityjams = function(data) {
			var moscowId = '77';

			data = data || {};
			data = data[moscowId];
			
			if ( data && data.score !== undefined ) {
				_win.trigger('score.showcase', data.score);
			}
		};
		
		$.getScript('http://maps.mail.ru/jams/jams.jsonp');
	});


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

});