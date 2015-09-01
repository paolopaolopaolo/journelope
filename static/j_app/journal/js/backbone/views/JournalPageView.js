var JournalPageView = Backbone.View.extend({
	el: "body",
	side_bar_collapse: false,

	events: {
		'click .side-caret': '_toggleSideBarCollapse',
	},

	_toggleSideBarCollapse: function (event) {
		if (!this.side_bar_collapse) {
			this.$el.find('.sidebar').addClass('vert-collapsed');
			this.$el.find('.sidebar').find('i')
									 .addClass('fa-chevron-right')
									 .removeClass('fa-chevron-left');
			this.$el.find('.journal-view').hide();
		} else {
			this.$el.find('.sidebar').removeClass('vert-collapsed');
			this.$el.find('.sidebar').find('i')
									 .removeClass('fa-chevron-right')
									 .addClass('fa-chevron-left');
		 	this.$el.find('.journal-view').show();
		}
		this.side_bar_collapse = !this.side_bar_collapse;
	},

	initialize: function () {
		this.JournalView = new JournalView();
	},	
});

TopLevelApplication.JournalPageView = new JournalPageView();