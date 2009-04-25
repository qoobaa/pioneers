// Modified version of Ajax.Request from prototype
//  Prototype JavaScript framework, version 1.6.0.1
//  (c) 2005-2007 Sam Stephenson
/**
 * 
 * @class MVC.IO
 */

(function(){
	var factory = MVC.Ajax.factory;
	
    /**
     * @constructor MVC.IO.Ajax
     * @alias MVC.Ajax
     * Ajax is used to perform Ajax requests. It mimics the Prototype library's Ajax functionality.
     * @init Initiates and processes an AJAX request.
     * @param {String} url the url where the request is directed
     * @param {Object} options a hash of optiosn with the following attributes:
     * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>asynchronous</td>
						<td>true</td>
						<td>Determines whether XMLHttpRequest is used asynchronously or not. 
						</td>
					</tr>
					<tr>
						<td>contentType</td>
						<td>'application/x-www-form-urlencoded'</td>
						<td>The Content-Type header for your request. 
						You might want to send XML instead of the regular URL-encoded format, 
						in which case you would have to change this.
						</td>
					</tr>
					<tr>
						<td>method</td>
						<td>'post'</td>
						<td>The HTTP method to use for the request. The other widespread possibility is 'get'.
						</td>
					</tr>
					<tr>
						<td>parameters</td>
						<td>''</td>
						<td>The parameters for the request, which will be encoded into the URL for a 'get' method, or into the request body for the other methods. This can be provided either as a URL-encoded string or as any Hash-compatible object (basically anything), with properties representing parameters.
						</td>
					</tr>
					<tr>
						<td>requestHeaders</td>
						<td>See text</td>
						<td>Request headers are passed as an object, with properties representing headers.
						</td>
					</tr>
					<tr>
						<td>cache</td>
						<td>true </td>
						<td>true to cache template.
						</td>
					</tr>
					
				</tbody></table>
		    <h4>Option callbacks</h4>
		    <p style="margin-bottom: 0px;">Callbacks are called at various points in the life-cycle of a request, and always feature the same list of arguments. 
		    They are passed to requesters right along with their other options.</p>
		    <table class="options">
					<tbody><tr><th>Callback</th><th>Description</th></tr>
					<tr>
						<td>onComplete</td>
						<td>Triggered at the very end of a request's life-cycle, 
						once the request completed, status-specific callbacks were called, 
						and possible automatic behaviors were processed.
						</td>
					</tr>
			</tbody></table>
     */
    MVC.Ajax = function(url,options){
		this.options = {
	      method:       'post',
	      asynchronous: true,
	      contentType:  'application/x-www-form-urlencoded',
	      encoding:     'UTF-8',
	      parameters:   ''
	    };
		this.url = url;
	    MVC.Object.extend(this.options, options || { });
		
		this.options.method = this.options.method.toLowerCase();
		
		if (!MVC.Array.include(['get', 'post'],this.options.method)) {
	      // simulate other verbs over post
	      if(this.options.parameters == ''){
		  	this.options.parameters = {_method : this.options.method};
		  }else if(typeof this.options.parameters == "string" || typeof this.options.parameters == "number")
            this.options.parameters = ""+this.options.parameters+"&_method="+this.options.method;
          else
		  	this.options.parameters['_method'] = this.options.method;
	      this.options.method = 'post';
	    }
	
		if (this.options.method == 'get' && this.options.parameters != '' ){
            this.url += (MVC.String.include(this.url,'?') ? '&' : '?') + MVC.Object.to_query_string(this.options.parameters);
            delete this.options.parameters;
        }
		//else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
		//   params += '&_=';
	    
		if(!this.options.parameters)
			var parameters = null;
		else if(options.json_string)
			var parameters = MVC.Object.to_json(this.options.parameters);
		else
			var parameters = MVC.Object.to_query_string(this.options.parameters)
		
		this.transport = MVC.Ajax.factory();
		
		if(this.options.asynchronous == false){
		   this.transport.open(this.options.method, this.url, this.options.asynchronous);
		   this.set_request_headers(options.headers);
		   try{this.transport.send(parameters);}
		   catch(e){return null;}
		   return this.transport;
		}else{
		   this.transport.onreadystatechange = MVC.Function.bind(function(){
				var state = MVC.Ajax.Events[this.transport.readyState];
				
				if(state == 'Complete'){
					if(!this.options.onSuccess) ; // do nothing
					else if(this.success()) this.options.onSuccess(this.transport);
					else if(this.options.onFailure) this.options.onFailure(this.transport);
				}
				if(this.options['on'+state]){
					this.options['on'+state](this.transport);
				}
			},this);
			
			this.transport.open(this.options.method, this.url, true);
		    this.set_request_headers(options.headers);
			
			this.transport.send(parameters  || " ");
		}
	};
	MVC.Ajax.factory = factory;
})();

MVC.Ajax.className = 'Ajax'
MVC.Ajax.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
/* @Prototype*/
MVC.Ajax.prototype = {
  
  /**
   * Returns true if the function returned succesfully.
   * @return {Boolean}
   */
  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus: function() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },
  /**
   * This function is used by Ajax to set the transport's request headers if possible.
   * @param {Object} user_headers headers supplied by the user in options.headers
   * 
   */
  set_request_headers: function(user_headers) {
    var headers = {};//{'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'};

    if (this.options.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    for (var name in headers){
		if(headers.hasOwnProperty(name)){
			this.transport.setRequestHeader(name, headers[name]);
		}
	}
	
	if(user_headers) {
		for(var header in user_headers) 
			this.transport.setRequestHeader(header, user_headers[header]);
		}
	}
};
MVC.IO.Ajax = MVC.Ajax;
if(!MVC._no_conflict) Ajax = MVC.Ajax;
