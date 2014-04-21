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
