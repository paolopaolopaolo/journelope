var JournalPageView = Backbone.View.extend({
	el: "body",
	side_bar_collapse: false,

	events: {
		'click .side-caret': '_toggleSideBarCollapse',
	},

	// @desc: Toggles collapsing Side Bar
	// @params: Event Object
	// @returns: None
	_toggleSideBarCollapse: function (event) {
		if (!this.side_bar_collapse) {
			this.$el.find('.sidebar').addClass('vert-collapsed');
			this.$el.find('.side-caret')
					.find('i')
					.addClass('fa-chevron-right')
					.removeClass('fa-chevron-left');
			this.$el.find('.journal-view').hide();
		} else {
			this.$el.find('.sidebar').removeClass('vert-collapsed');
			this.$el.find('.side-caret')
					.find('i')
					.removeClass('fa-chevron-right')
					.addClass('fa-chevron-left');
		 	this.$el.find('.journal-view').show();
		}
		this.side_bar_collapse = !this.side_bar_collapse;
	},

	// @desc: Initializes the JournalView
	// @params: Event Object
	// @returns: None
	initialize: function (attrs) {
		this.parent = attrs.parent;
		$.removeCookie('j_app_guid');
		this.JournalView = new JournalView({parent: this});
	},	
});

TopLevelApplication.JournalPageView = new JournalPageView({parent: TopLevelApplication});