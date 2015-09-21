var JournalView = Backbone.View.extend({

	el: ".journal-view",
	template: _.template($("#journal-view-template").html()),

	events: {
		'click .journal' : '_emitGetJournalPages', 
		'click .add-journal': '_createNewJournal',
		'click .delete-journal': '_deleteJournal',
	},


	// @desc: Deletes the journal object
	// @params: Event Object
	// @returns: None
	_deleteJournal: function (event) {
		var _id = $(event.currentTarget).parent().attr('data-jid'),
			confirmation = confirm("Delete this journal?");

		if (confirmation) {
			this.collection.get(_id)
						   .destroy()
						   .done(_.bind(function (response) {
						   		// Emit page delete signal
						   		this.parent.trigger('clearPageView'); 
						   }, this));
		}
	},

	// @desc: Creates a journal object
	// @params: Event Object OR JS Object
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
				this.parent.trigger('getJournalPage', 
					{
						id: response.id,
						localStore: {
							text: event['text'],
							images: event['images']
						}
					});
			}
		}, this));
	},

	// @desc: Emits a 'getJournalPage' event with id number
	// @params: Event Object
	// @returns: None
	_emitGetJournalPages: function (event) {
		var _id = $(event.currentTarget).attr('data-jid');
		this.parent.trigger('getJournalPage', {id: _id});
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
		if (window.localStorage.getItem('demo-entry-text') || 
			window.localStorage.getItem('demo-entry-img')) {
			this._createNewJournal({
						fromLocalStorage: true,
						text: window.localStorage.getItem('demo-entry-text'),
						images: window.localStorage.getItem('demo-entry-img')
					});
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
		this.collection = new Journals(JOURNALS);

		if (this.collection.length > 0) {
			jid1 = this.collection.last().attributes['id'];
		} else {
			jid1 = undefined;
		}

		this.parent.PageView = new PageView({jid: jid1, parent: this.parent}); 
		this._checkLocalStorage();

		this.listenTo(this.collection, "add change remove", this.render);
		this.listenTo(this.parent, "changeJournalName", this._changeJournalName);
		this.render();
		
	},

});

