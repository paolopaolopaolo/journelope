var PageView = Backbone.View.extend({

	el: '.page-view-ctr',
	template: _.template($('#page-view-template').html()),
	inJournalEditMode: false,

	current_idx: 0,
	events: {
		'click .prev-page': '_prevPage',
		'click .next-page': '_nextPage',
		'keyup .editable-box': '_savePageText',
		'click .add-page': '_addPage',
		'click .delete-page': '_deletePage',
		'click .edit-journal-name': '_toggleJournalEditButton',
	},

	// @desc: Delete
	// @params: None
	// @returns: None
	_deletePage: function () {
		var confirm_delete = confirm("Delete this page?");
		if (confirm_delete) {
			if (this.collection.length > 1) {
				this.collection.at(this.current_idx)
							   .destroy();
			}
			else {
				alert('No more pages to delete!');
			} 
		}
	},

	// @desc: Toggle journal edits
	// @params: Event Object
	// @returns: None
	_toggleJournalEditButton: function (event) {
		var current_name, input_version, span_version;

		if (!this.inJournalEditMode) {
			$(event.currentTarget).find('.fa')
								  .removeClass('fa-pencil')
								  .addClass('fa-check');
			current_name = this.$el.find('.j-head-text').text();
			
			input_version = document.createElement('input');
			input_version.setAttribute('type', 'text');
			input_version.setAttribute('class', 'j-head-text-input');
			
			$(input_version).val(current_name);
			this.$el.find('.j-head-text').replaceWith($(input_version));
		} else {
			$(event.currentTarget).find('.fa')
								  .removeClass('fa-check')
								  .addClass('fa-pencil');

			current_name = this.$el.find('.j-head-text-input').val();
			this.parent.trigger('changeJournalName',
								{
									id: this.current_journal,
									name: current_name,
								});
			span_version = document.createElement('span');
			span_version.setAttribute('class', 'j-head-text');

			$(span_version).text(current_name);
			this.$el.find('.j-head-text-input').replaceWith($(span_version));
		}
		
		this.inJournalEditMode = !this.inJournalEditMode;
	},

	// @desc: Save PageText on mouseup
	// @params: Event Object
	// @returns: None
	_savePageText: function (event) {
		var _id = this.model.attributes['id'],
			$editbox = this.$el.find('.editable-box'),
			$save_status = this.$el.find('.save-status'),
			js_string = ($editbox.stringConvHTMLtoJS() ? $editbox.stringConvHTMLtoJS() : ''),
			target_model;

		if (this.keyPressTimeout) {
			clearTimeout(this.keyPressTimeout);
		}
		this.keyPressTimeout = setTimeout(_.bind(function () {
			$save_status.show()
						.html('<i class="fa fa-spinner fa-pulse"></i>&nbsp;Saving...');
			if (this.model.isNew()) {
				target_model = this.collection.last();
			} else {
				target_model = this.collection.get(_id);
			}
			target_model.save({text: js_string})
					  	.done(_.bind(function (response) {
					  		target_model.set({id: response['id']});
					  		$save_status.html('Saved!')
					  					.fadeOut(3000);
					  }, this));
		}, this), 1000);
	},

	// @desc: Sets collection to appropriate journal
	// @params: Integer or String
	// @returns: None
	_resetCollection: function (jid) {
		this.current_journal = jid;
		this.current_idx = 0;
		this.collection.reset();
	},

	// @desc: Cycle leftwards thru page
	// @params: None
	// @returns: None
	_prevPage: function () {
		this.current_idx--;
		if (this.current_idx < 0) {
			this.current_idx = this.collection.length - 1;
			this.model.set(this.collection.last().attributes);
		} else {
			this.model.set(this.collection.at(this.current_idx).attributes);
		}
	},

	// @desc: Next Page
	// @params: None
	// @returns: None
	_nextPage: function () {
		this.current_idx++;
		if (this.collection.length -1 < this.current_idx ) {
			this.current_idx = 0;
			this.model.set(this.collection.first().attributes);
		} else {
			this.model.set(this.collection.at(this.current_idx).attributes);
		}
	},

	// @desc: 
	// @params: Integer
	// @returns: None
	_renderImages: function () {
		var image_objects, _id;

		_id = this.model.attributes.id;

		image_objects = this.images.filter(function (image) {
				return image.attributes.page.id === _id;
		});


		_.each(image_objects, _.bind(function (image) {  
			createAndAppendImgDivs(
				undefined,
				image.attributes.imageFile,
				{ 
					top: image.attributes.top.toString() + 'px',
					left: image.attributes.left.toString() + 'px',
					height: image.attributes.height.toString() + 'px',
					width: image.attributes.width.toString() + 'px',
				},
				this.$el.find('.editable-box'));
		}, this));


		this.$el.find('.editable-box').refreshImgInteractions();
	},

	// @desc: Renders the first page of the journal
	// @params: Backbone Model object
	// @returns: None
	render: function (model) {
		var context;
		this.$el.find('.page-view').empty();
		context = _.clone(this.model.attributes);
		context['page_num'] = this.current_idx + 1;
		context['len'] = this.collection.length;

		this.$el.find('.page-view').append(this.template(context));

		if (this.collection.length > 1) {
			this.$el.find('.page-ctrl').show();
		} else {
			this.$el.find('.page-ctrl').hide();
		}

		this.$el.find('.editable-box').imgTxtHybrid({imagecss: {}});
		this.$el.find('.editable-box').html(stringConvJStoHTML(context.text));

		this._renderImages(model.attributes.id);
	},

	

	// @desc: Sets the view model to the first model in the collection
	// @params: None
	// @returns: None
	_setFirstModel: function () {
		this.collection.jid = this.current_journal;
		this.images.jid = this.current_journal;

		this.current_idx = 0;
		
		this.collection.fetch().done(_.bind(function () {
			this.model.set(this.collection.first().attributes);
			this.images.fetch({remove: true});
		}, this));
	},

	// @desc: Sets the view model to the last model in the collection
	// @params: Backbone Model, Backbone Collection
	// @returns: None
	_newPage: function (model, collection) {
		this.model.set(this.collection.last().attributes);
	},

	// @desc: Sets the view model to the last model in the collection
	// @params: Event Object
	// @returns: None
	_addPage: function (event) {
		var journal = this.parent.JournalView.collection.get(this.current_journal),
			newpage_attrs = {
				id: undefined,
				journal: journal.attributes,
				date: new Date().toISOString(),
				scrollpos: 0,
				text: ''
			};
		this.collection.add(new Page(newpage_attrs));
		this.current_idx = this.collection.length - 1;
	},

	// @desc: Clear Page View
	// @params: JS Object (attrs)
	// @returns: None
	_clearPageView: function () {
		this.$el.find('.page-view').empty();
	},

	// @desc: Initialize Page View
	// @params: JS Object (attrs)
	// @returns: None
	initialize: function (attrs) {
		this.parent = attrs['parent'];
		this.current_journal = attrs['jid'];

		this.current_idx = 0;
		this.collection = new Pages([], {jid: this.current_journal});
		this.images = new Imgs([], {jid: this.current_journal});
		this.model = new Page();

		this.listenTo(this.parent, 'clearPageView', this._clearPageView);
		this.listenTo(this.model, 'change:id', this.render);
		this.listenTo(this.collection, 'add', this._newPage);
		this.listenTo(this.collection, 'reset', this._setFirstModel);
		this.listenTo(this.collection, 'remove', this._prevPage);
		this.listenTo(this.parent, 'getJournalPage', this._resetCollection);
		this.listenTo(this.images, 'update', this._renderImages);
		
		this.parent.trigger('getJournalPage', this.current_journal);
	},
});