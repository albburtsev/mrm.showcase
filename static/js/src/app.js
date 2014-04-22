	var	_win = $(window),
		_map = $('.js-map'),
		_body = $('body'),
		_sidebarHead = $('.js-sidebar-head'),
		_sidebarHeadScore = $('.js-sidebar-score'),

		tplTitle = _.template($('#tpl_title').html()),
		isLoading = 'is-loading',
		isShort = 'is-short',
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

		// UGLY: .removeClass('inactive'); does not work for SVG-elements
		// http://bugs.jquery.com/ticket/10329
		$('.path.inactive').each(function() {
			var _this = $(this);
			_this
				.focus().blur() // repaint before transition
				.attr('class', _this.attr('class').replace('inactive', ''));
		});
	}

	_win.on('opentitle.showcase', function() {
		var	_title = $(tplTitle());
		_title
			.appendTo(_body)
			.focus().blur() // repaint before transition
			.removeClass(isShort);
	});

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

	/**
	 * Shows sidebar head with score
	 */
	_win.on('score.showcase', function(e, score) {
		var colorTag = utils.scoreColor(score),
			data = _sidebarHeadScore.data(),
			forms = data.forms.split(','),
			classPrefix = data.classPrefix;

		_sidebarHeadScore
			.removeClass(['', 'red', 'yellow', 'green'].join(' ' + classPrefix))
			.addClass(classPrefix + colorTag)
			.html(score + ' ' + utils.inflect(score, forms));

		_sidebarHead
			.on('transitionend', function() {
				_win.trigger('getconfig.showcase');
			})
			.removeClass(isLoading);
	});

	/*
	 * Gets config
	 */
	_win.on('getconfig.showcase', function() {
		$.get('static/js/config.json', function(data) {
			config = data;
			_win
				.trigger('init.showcase')
				.trigger('opentitle.showcase');
		});
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
