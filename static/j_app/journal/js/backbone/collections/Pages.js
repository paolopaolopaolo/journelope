var Pages = Backbone.Collection.extend({
	model: Page,
	urlRoot: "pages/",
	url: function () {
		return this.urlRoot + this.jid;
	},
	initialize: function (attrs, opts) {
		this.jid = opts['jid'];
	},
});