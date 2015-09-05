// BACKBONE MODELS

var JournalPageModel = Backbone.Model.extend({
	url: function () {
		if (this.isNew()) {
			return urlRoot; 
		}
		else {
			return urlRoot + this.attributes['id'];
		}
	},
});

var Journal = JournalPageModel.extend({
	urlRoot: '/j/',
});


var Page = JournalPageModel.extend({
	urlRoot: '/page/',
});

var Img = JournalPageModel.extend({
	urlRoot: '/ji/',
});