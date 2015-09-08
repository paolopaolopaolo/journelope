var JournalView = Backbone.View.extend({

	el: ".journal-view",
	template: _.template($("#journal-view-template").html()),

	events: {
		'click .journal' : '_emitGetJournalPages', 
		'click .add-journal': '_createNewJournal',
	},

	// @desc: 
	// @params:
	// @returns:
	_createNewJournal: function (event) {
		var new_journal;
		new_journal = new Journal();
		new_journal.save({
			id: undefined,
			user: USER,
			date: new Date().toISOString(),
			textFilename: 'Untitled_' + Math.random().toString().slice(2, -1),
			order: 1,
			"public": false,
		}).done(_.bind(function (response) {
			this.collection.add(response);
			if (event.fromLocalStorage){

			} else {

			}
		}, this));

	},

	// @desc: Emits a 'getJournalPage' event with id number
	// @params: Event Object
	// @returns: None
	_emitGetJournalPages: function (event) {
		var _id = $(event.currentTarget).attr('data-jid');
		this.parent.trigger('getJournalPage', _id);
	},

	// @desc: Empties .journal list and repopulates with collection
	// @params: None
	// @returns: None
	render: function () {
		var attributes = _.pluck(this.collection.models, 'attributes');
		this.$el.find('.journals').empty();
		this.$el.find('.journals').append(this.template({attrs: attributes}));
	},

	// @desc: Checks local storage for stuff, creates a new journal if so
	// @params: None
	// @returns: None
	_checkLocalStorage: function () {
		if (localStorage.getItem('demo-entry-text') || 
			localStorage.getItem('demo-entry-img')) {
			this._createNewJournal({
						fromLocalStorage: true,
						text: localStorage.getItem('demo-entry-text'),
						images: localStorage.getItem('demo-entry-img')
					});
			localStorage.clear();
		}
	},

	// @desc: Change 
	// @params: None
	// @returns: None
	_changeJournalName: function (attrs) {
		this.collection.get(attrs['id'])
					   .save({
					   		textFilename: attrs['name']
					   });
	},

	// @desc: Sets collection with bootstrap_vars and renders (also sets event listeners)
	// @params: None
	// @returns: None
	initialize: function (attrs) {
		var jid1;
		this.parent = attrs['parent'];
		this._checkLocalStorage();
		this.collection = new Journals(JOURNALS);

		if (this.collection.length > 0) {
			jid1 = this.collection.models[0].attributes['id'];
		} else {
			jid1 = undefined;
		}
		this.parent.PageView = new PageView({jid: jid1, parent: this.parent}); 

		this.listenTo(this.collection, "add change", this.render);
		this.listenTo(this.parent, "changeJournalName", this._changeJournalName);
		this.render();
		
	},

});

