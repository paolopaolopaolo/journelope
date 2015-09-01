var JournalView = Backbone.View.extend({

	el: ".journals",
	template: _.template($("#journal-view-template").html()),

	events: {
		'click .journal' : '_getJournalPages', 
	},

	_emitGetJournalPages: function (event) {
		var _id = $(event.currentTarget).attr('data-jid');
		this.trigger('getJournalPage')
	}

	render: function () {
		var attributes = _.pluck(this.collection.models, "attributes");
		this.$el.empty();
		this.$el.append(this.template({attrs: attributes}));
	},

	initialize: function () {
		this.collection = new Journals(JOURNALS);
		this.render();
	},

});

