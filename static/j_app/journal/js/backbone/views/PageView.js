var PageView = Backbone.View.extend({

	el: ".page-view-ctr",
	template: _.template($("#page-view-template").html()),
	events: {
		'click .prev-page': '_prevPage',
		'click .next-page': '_'
	},

	_resetCollection: function (jid) {
		this.collection.jid = jid;
		this.collection.fetch({remove: true});
		this.render(true);
	},

	_enableImgTxtHybrid: function () {

	},

	_prevPage: function () {

	},

	_nextPage: function () {

	},

	// @desc: 
	// @params: Boolean
	// @returns: None
	render: function (initial) {
		var context;
		this.$el.find('.page-view').empty();
		if (initial) {
			if (this.collection.length > 0) {
				this.model = this.collection.first();
			}
		}
		context = _.clone(this.model.attributes);
		this.$el.find('.page-view').append(this.template(context));
	},

	initialize: function (attrs) {
		this.parent = attrs['parent'];
		this.current_journal = attrs['jid'];

		this.current_idx = 0;
		// Populate collection
		this.collection = new Pages([], {jid: this.current_journal});
		this.collection.fetch();
		
		this.render(true);

		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(this, 'getJournalPage', this._resetCollection);
	},
});