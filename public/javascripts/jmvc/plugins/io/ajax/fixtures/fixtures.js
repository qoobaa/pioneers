(function(){
	var request = MVC.Ajax;

	MVC.Ajax = function(url,options){
        var options = MVC.Ajax.setup_request(url,options);
		return MVC.Ajax.make_request(options.url,options);
	};
    
	MVC.Ajax.setup_request= function(url,options){
		
        var using = options.use_fixture != false
        if( using  ){
		    var testurl = url;
            testurl = testurl.replace(/%2F/g,"~").replace(/%20/g,"_");

            if(options.parameters && options.method == "get") 
                testurl += (MVC.String.include(testurl,'?') ? '&' : '?') + MVC.Object.to_query_string(options.parameters)
            delete options.parameters
            
            var match = testurl.match(/^(?:https?:\/\/[^\/]*)?\/?([^\?]*)\??(.*)?/);
			var left = match[1];
			
			var right = options.method ? '.'+options.method.toLowerCase() : '.post';
			if(match[2]){
				left += '/';
				right = match[2].replace(/\#|&/g,'-').replace(/\//g, '~')+right;
			}
            if(!options.repeat_fixture)
			    right = right+MVC.Ajax.add_url(left+right);
			if(include.get_env() != 'test' && MVC.Console)
                MVC.Console.log('Requesting "'+url+'".  As a fixture it would be:\n    "test/fixtures/'+left+right);

			if(MVC.Console) MVC.Console.log('Loading "test/fixtures/'+left+right+'" for\n        "'+url+'"' );
			
            url = MVC.root.join('test/fixtures/'+left+encodeURIComponent( right));
			options.method = 'get';
            
		}
		options.url = url;
		return options;
	}
    
	MVC.Ajax.make_request= function(url,options){
		var req =  new request(url,options);
		return req;
	}
	MVC.Object.extend(MVC.Ajax, request);
	
	if(!MVC._no_conflict && typeof Prototype == 'undefined') Ajax = MVC.Ajax;
	
	MVC.Ajax.urls = {};
	
	MVC.Ajax.add_url = function(url){
		if(!  MVC.Ajax.urls[url] ){
			MVC.Ajax.urls[url] = 1;
			return '';
		}
		return '.'+(++MVC.Ajax.urls[url]);
	};
	
	MVC.CometAjax = function(url,options){
		var options = MVC.Ajax.setup_request(url,options);
		var url = options.url;
		this.poll = setInterval(MVC.Function.bind(function(){
			// MVC.CometAjax.urls is an ordered array of urls
			// if the first url is found in MVC.Ajax.urls, the Comet request is made, 
			// and this url is pushed off the queue
			if(!(MVC.CometAjax.urls.length > 0)) return;
			if (MVC.Ajax.urls[MVC.CometAjax.urls[0].name]) {
				clearTimeout(this.poll);
				delete this.poll;
				MVC.Ajax.make_request(url, options);
				MVC.CometAjax.urls[0].count -= 1;
				if(MVC.CometAjax.urls[0].count == 0)
					MVC.CometAjax.urls.shift();
			}
		},this), MVC.CometAjax.delay);
	};
	
	// number of seconds between comet responses, change to whatever you like
	MVC.CometAjax.delay = 500;
})();