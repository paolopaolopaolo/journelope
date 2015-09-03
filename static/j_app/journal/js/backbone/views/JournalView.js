var JournalView = Backbone.View.extend({

	el: ".journals",
	template: _.template($("#journal-view-template").html()),

	events: {
		'click .journal' : '_emitGetJournalPages', 
	},

	// @desc: 
	// @params:
	// @returns:
	_createNewJournal: function (text, images) {

	},

	// @desc: Emits a 'getJournalPage' event with id number
	// @params: Event Object
	// @returns: None
	_emitGetJournalPages: function (event) {
		var _id = $(event.currentTarget).attr('data-jid');
		this.parent.PageView.trigger('getJournalPage', _id);
	},

	// @desc: Empties .journal list and repopulates with collection
	// @params: None
	// @returns: None
	render: function () {
		var attributes = _.pluck(this.collection.models, 'attributes');
		this.$el.empty();
		this.$el.append(this.template({attrs: attributes}));
	},

	// @desc: Checks local storage for stuff, creates a new journal if so
	// @params: None
	// @returns: None
	_checkLocalStorage: function () {
		if (localStorage.getItem('demo-entry-text') || 
			localStorage.getItem('demo-entry-img')) {
			this._createNewJournal(
									localStorage.getItem('demo-entry-text'),
									localStorage.getItem('demo-entry-img')
									);
			localStorage.clear();
		}
	},

	// @desc: Sets collection with bootstrap_vars and renders (also sets event listeners)
	// @params: None
	// @returns: None
	initialize: function (attrs) {
		var jid1;
		this.parent = attrs['parent'];
		this.collection = new Journals(JOURNALS);
		this._checkLocalStorage();

		if (this.collection.length > 0) {
			jid1 = this.collection.models[0].attributes['id'];
			this.parent.PageView = new PageView({jid: jid1, parent: this.parent}); 
		}

		this.render();
	},

});

