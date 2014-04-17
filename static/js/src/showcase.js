var showcase = (function() {
	return {
		init: function(config, map) {
			this.config = config;
			this.map = map;

			for (var key in config) {
				var road = config[key],
					directions = road.directions;

				for (var i = directions.length, direction; i--;) {
					direction = directions[i];

					var self = this;
					$.ajax('http://maps.mail.ru/mroutes', {
						key: key,
						data: {
							wtype: 1,
							points: direction.points.join(',')
						},
						success: function(data) {
							self.addPolyline(this.key, data);
						}
					});
				}
			}
		},

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

		addPolyline: function(key, data) {
			var road = this.config[key];

			if ( road.polyline ) {
				return;
			}

			road.polyline = mrm
				.polyline(this.invertCoords(data.points), {
					weight: 10,
					opacity: 1,
					lineCap: 'round',
					lineJoin: 'bevel',
					className: 'path inactive'
				})
				.addTo(map);

			setTimeout(function() {
				// UGLY: .removeClass('inactive'); don't work for SVG-elements
				// http://bugs.jquery.com/ticket/10329
				$('.path.inactive').each(function() {
					var _this = $(this);
					_this.attr('class', _this.attr('class').replace('inactive', ''));
				});
			}, 1);
		}
	};
})();