(function(){
	var factory = MVC.Ajax.factory;
	MVC.Ajax = Ajax.Request;
	MVC.Ajax.prototype.set_request_headers = MVC.Ajax.setRequestHeaders;
	MVC.Ajax.factory = factory;
    Ajax.getTransport = MVC.Ajax.factory;
})();


