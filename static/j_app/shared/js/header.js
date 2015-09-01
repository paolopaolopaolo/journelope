var Header = function () {
	var collapsed;

	collapsed = true;

	// @desc: Sets up Callback to Click Event on header_menu_button
	//        and click event on links
	// @params: None
	// @returns: None
	this._setClickBehavior = function () {
		this.$header_menu.on("click", "li", function (event) {
			var $dest;
			$dest = $(event.target).children('a');
			if ($dest.length === 1) {
				window.location.href = $dest.attr('href');
			}
		});

		this.$header_menu_button.on("click", function (event) {
			this._toggleCollapsed();
		}.bind(this)) 
	};

	// @desc: Sets up jQuery Entities
	// @params: None
	// @returns: None
	this._setEntities = function () {
		this.$header_menu_button = $('.header-username');
		this.$header_menu = $('.header-menu');
	};

	// @desc: Toggles header menu "collapsed" status
	// @params: None
	// @returns: None
	this._toggleCollapsed = function () {
		if (this.collapsed) {
			this.$header_menu.removeClass('collapsed')
		} else {
			this.$header_menu.addClass('collapsed');
		}
		this.collapsed = !this.collapsed;
	};

	// @desc: Initializes everything
	// @params: None
	// @returns: None
	this.initialize = function () {
		this._setEntities();
		this._setClickBehavior();
	};
};

$(document).ready(function () {
	TopLevelApplication.HeaderView = new Header();
	TopLevelApplication.HeaderView.initialize();
});