var PageView = Backbone.View.extend({

	el: ".page-view-ctr",
	template: _.template($("#page-view-template").html()),

	events: {
		'click .prev-page': '_prevPage',
		'click .next-page': '_nextPage',
	},

	// @desc:
	// @params:
	// @returns:
	_resetCollection: function (jid) {
		this.collection.jid = jid;
		this.collection.fetch({remove: true});
	},

	// @desc:
	// @params:
	// @returns:
	_enableImgTxtHybrid: function () {

	},

	// @desc:
	// @params:
	// @returns:
	_prevPage: function () {
		this.current_idx--;
		if (this.current_idx < 0) {
			this.current_idx = this.collection.length - 1;
			this.model.set(this.collection.last().attributes);
		} else {
			this.model.set(this.collection.at(this.current_idx).attributes);
		}
	},

	// @desc:
	// @params:
	// @returns:
	_nextPage: function () {
		this.current_idx++;
		if (this.collection.length -1 < this.current_idx ) {
			this.current_idx = 0;
			this.model.set(this.collection.first().attributes);
		} else {
			this.model.set(this.collection.at(this.current_idx).attributes);
		}
	},

	// @desc: Renders the first page of the journal
	// @params: Boolean
	// @returns: None
	render: function () {
		var context;
		this.$el.find('.page-view').empty();
		context = _.clone(this.model.attributes);

		this.$el.find('.page-view').append(this.template(context));

		if (this.collection.length > 1) {
			this.$el.find('.page-ctrl').show();
		} else {
			this.$el.find('.page-ctrl').hide();
		}

		this.$el.find('.editable-box').imgTxtHybrid({imagecss: {}});
		this.$el.find('.editable-box').html(stringConvJStoHTML(context.page.text));


		_.each(context.images, _.bind(function (image) {  
			createAndAppendImgDivs(
				undefined,
				image.imageFile,
				{ 
					top: image.top.toString() + 'px',
					left: image.left.toString() + 'px',
					height: image.height.toString() + 'px',
					width: image.width.toString() + 'px',
				},
				this.$el.find('.editable-box'));
		}, this));


		this.$el.find('.editable-box').refreshImgInteractions();
	},

	// @desc:
	// @params:
	// @returns:
	_setFirstModel: function () {
		this.model.set((this.collection.length > 0 ? this.collection.first().attributes : {}));
	},

	// @desc: Initialize Page View
	// @params: JS Object (attrs)
	// @returns: None
	initialize: function (attrs) {
		this.parent = attrs['parent'];
		this.current_journal = attrs['jid'];

		this.current_idx = 0;
		this.collection = new Pages([], {jid: this.current_journal});
		this.model = new Page();

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.collection, 'sync', this._setFirstModel);
		this.listenTo(this, 'getJournalPage', this._resetCollection);
		
		this.collection.fetch();
	},
});