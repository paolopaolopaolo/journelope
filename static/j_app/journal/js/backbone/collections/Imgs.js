var Imgs = Backbone.Collection.extend({
	model: Img,
	urlRoot: "pages/",
	url: function () {
		return this.urlRoot + this.jid;
	},
	parse: function (response) {
		return _.flatten(_.pluck(response, 'images'));
	},

	initialize: function (attrs, opts) {
		this.jid = opts['jid'];
	},
});