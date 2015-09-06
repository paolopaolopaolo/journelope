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
	urlRoot: '/ji/',
});