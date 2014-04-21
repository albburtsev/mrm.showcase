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