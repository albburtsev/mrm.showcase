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
