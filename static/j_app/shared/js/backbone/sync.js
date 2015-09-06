if (Backbone) {
	var oldSync = Backbone.sync;
	Backbone.sync = function(method, model, options){
	    options.beforeSend = function(xhr){
	        xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
	    };
	    return oldSync(method, model, options);
	};
		
}