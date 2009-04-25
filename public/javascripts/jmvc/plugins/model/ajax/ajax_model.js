/**
 * Model.Ajax makes it easy to write models that handle the request / reponse cycle of most
 * Ajax driven applications.  It helps you escape transporting callbacks.</br>
 * It uses convention to tie function names to resouces/ urls.  This is best shown with an example:
 * First, lets say we wanted an FTP model to be able to requests data from /ftp/dir.  We could create that
 * model like this:
 * 
@code_start
Ftp = MVC.Model.Ajax.extend('ftp',
{
   dir_get_success: function(transport){
       return transport.responseText;
   }
},{})
@code_end
You could make a request to /ftp/dir like this:
@code_start
callback = function(data){alert(data)};
Ftp.dir({path: "/"}, callback)
@code_end

There are a few things to notice here.
<ul>
    <li>Ftp.dir function expects params as its first argument.  These will post path="/" to /ftp/dir</li>
    <li>There are no callbacks in the Ftp model.  You return the data you want passed to the callback in dir_get_success</li>
    <li>dir_get_success is called with the result of the transport.</li>
    <li>The get makes the request use the HTTP verb get.  You can use put/post/get/delete.  If no verb is present, it defaults 
    to post.</li>
</ul>

Model.Ajax allows you to expand on this pattern in several ways:
<h3>Changing the request path</h3>
If /ftp/dir was actually ftp_directory, you can change the directory name by adding the following:
@code_start
Ftp = MVC.Model.Ajax.extend('ftp',
{
   dir_get_url: '/ftp_directory'
   dir_get_success: function(transport){
       return transport.responseText;
   }
},{})
@code_end
dir_get_url could also be a function that dynamically returns the url.  For example,
@code_start
...
   dir_get_url: function(params){
       return "/ftp/dir/"+encodeURIComponent(params.path)
   }
...
@code_end
   would return "/ftp/dir/%2F" for Ftp.dir({path: "/"}, callback)

<h3>Customizing and validating the request</h3>
You can completely customize the request by making a function like X_request.  Where X matches one of your success functions.
The following example validates that params must include a path.
@code_start
...
   dir_get_request: function(params){
       if(!params.path) throw "Path does not exist!"
   }
...
@code_end
In a request function, you can also completely customize the request with the temporary this.request function.
Example:
@code_start
...
   dir_get_request: function(params){
       if(!params.path) throw "Path does not exist!"
       this.request("/ftp/dir/"+encodeURIComponent(params.path)+".json")
   }
...
@code_end

<h3>Respond to errors</h3>
Finally, you can respond to Transport errors in the same way you respond to success:
@code_start
Ftp = MVC.Model.Ajax.extend('ftp',
{
   dir_get_success: function(transport){
       return transport.responseText;
   },
   dir_get_failure: function(transport){
       return "error data"
   }
},{})
@code_end
 */
MVC.Model.Ajax = MVC.Model.extend(
/* @Static*/
{
    transport: MVC.Ajax,
    
    request : function(){
        
    },
    _matching : /(\w+?)_?(get|post|delete|update|)_success$/, 
    /**
     * Goes through the list of static functions.  If they end with _success, creates
     * a requesting function for them.
     */
    init: function(){
        if(!this.className) return;
        var val, act, matches;
        this.actions = {};
        for(var action_name in this){
    		val = this[action_name];
    		if( typeof val == 'function' && action_name != 'Class' && (matches = action_name.match(this._matching))){
                this.add_req(matches, val)
            }
	    }
        this._super();
    },
    _default_options: function(cleaned_name, method, remaining_args, callbacks){
        var defaultOptions = {};
        this._add_default_callback(defaultOptions, 'success', method, cleaned_name, remaining_args, callbacks);
        this._add_default_callback(defaultOptions, 'failure', method, cleaned_name, remaining_args, callbacks);
        return defaultOptions;
    },
    _add_default_callback : function(defaultOptions, callback_name,method, cleaned_name, remaining_args, callbacks ){
        var camel_name = 'on'+MVC.String.capitalize(callback_name);
        var fname1 = cleaned_name+'_'+method+'_'+callback_name;
        var fname2 = cleaned_name+'_'+callback_name;
        var fname = this[fname1] ? fname1 : (this[fname2] ? fname2 : null )
        
        if(fname) 
            defaultOptions[camel_name] = 
                    MVC.Function.bind(function(response){ 
                        var cb_called = false;
                        var cb = function(){
                            cb_called = true;
                            callbacks[camel_name].apply(arguments);
                        }
                        remaining_args.unshift(response, cb);
                        var result = this[fname].apply(this, remaining_args);
                        if(!cb_called) callbacks[camel_name](result);
                    }, this);
    },
    _make_public : function(cleaned_name, method){
        var defaultURL = this.base_url+"/"+cleaned_name;
        
        
        return function(params){
            
            if(this[cleaned_name+"_"+method+"_url"]) 
            defaultURL=typeof this[cleaned_name+"_"+method+"_url"] == 'function' ?
                        this[cleaned_name+"_"+method+"_url"](params) : this[cleaned_name+"_"+method+"_url"];
            
            //get arguments 
            var cleaned_args = MVC.Array.from(arguments);
            var callbacks = this._clean_callbacks(cleaned_args[cleaned_args.length - 1]);
            params = cleaned_args.length > 1 ? params : {}; //make sure it isn't just a callback
            //save old request (if compounded)
            var oldrequest = this.request;
            

            
            var defaultOptions = {method: method}
            var request_called = false;
            /**
             * @function request
             * Request is only available inside generated request functions.  
             * If the first argument is not a string, it assumes the first 2 arguments are
             * the request params and the options.  If there are more than 3 arguments, those
             * arguments
             * will be used when calling back the success or failure functions.
             * @param {optional:Object} url
             * @param {Object} request_params parameters passed to the request
             * @param {Object} options options sent to the transport
             */
            this.request = function(url, request_params, options){
                //url is optional!
                request_called = true;
                request_params = typeof request_params != 'undefined' ? request_params : params;
                options = options || defaultOptions;
                var remaining_args = MVC.Array.from(arguments).splice(2, arguments.length - 2);
                if(typeof url != 'string'){
                    options = params; params = url;
                    url = this.base_url+"/"+cleaned_name;
                }else
                    remaining_args.shift();
                
                var defaultOptions = this._default_options(cleaned_name, method, remaining_args, callbacks);
                options = MVC.Object.extend(defaultOptions, options);
                options.parameters = MVC.Object.extend(request_params, options.parameters);
                new this.transport(url, options );
            }
            var result;
            //check if (name)_(method)_request exists
            if(this[cleaned_name+"_"+method])
                result = this[cleaned_name+"_"+method].apply(this, arguments);
            else if( this[cleaned_name+"_request"] )
                result = this[cleaned_name+"_request"].apply(this, arguments);
                
            //if it doesn't call request with the appropriate functions
            if(!request_called) this.request(defaultURL, params, defaultOptions );
            return result;
        }
    },
    add_req : function(matches, func){
       var action_name = matches[0];
       var cleaned_name = matches[1];
       var method = matches[2] || 'post'

       this[cleaned_name] = this._make_public(cleaned_name, method)
    },
    /**
     * Gets the id of a response from the responseHeader.  This is commonly used in REST
     * based calls
     * @param {Object} transport
     */
    get_id : function(transport){
        var loc = transport.responseText;
	  	try{loc = transport.getResponseHeader("location");}catch(e){};
        if (loc) {
          //todo check this with prototype
		  var mtcs = loc.match(/\/[^\/]*?(\w+)?$/);
		  if(mtcs) return parseInt(mtcs[1]);
        }
        return null;
    },    
    /**
     * overwrite this function if you don't want to eval js
     * @param {Object} json_string json string
     * @return {Object} json converted to data
     */
    json_from_string : function(json_string){
        return eval('('+json_string+')'); //
    }
    
},
//prototype methods
{}
);

if(!MVC._no_conflict && typeof Model.Ajax == 'undefined'){
	Model.Ajax = MVC.Model.Ajax;
}