// BACKBONE MODELS

var JournalPageModel = Backbone.Model.extend({
	url: function () {
		if (this.isNew()) {
			return this.urlRoot; 
		}
		else {
			return this.urlRoot + this.attributes['id'];
		}
	},
});

var Journal = JournalPageModel.extend({
	urlRoot: '/j/',
});


var Page = JournalPageModel.extend({
	urlRoot: '/page/',
	parse: function (response) {
		return response['page'];
	},
});

var Img = JournalPageModel.extend({
	urlRoot: '/page/',
	destroy: function (attrs, opts) {
		this.urlRoot = '/ji/';
		return Backbone.Model.prototype.destroy.apply(this, arguments);
	},
	save: function (attrs, opts) {
		this.urlRoot = '/ji/';
		return Backbone.Model.prototype.save.apply(this, arguments);
	},
	fetch: function (opts) {
		this.urlRoot = '/page/';
		return Backbone.Model.prototype.fetch.apply(this, arguments);

	},
});