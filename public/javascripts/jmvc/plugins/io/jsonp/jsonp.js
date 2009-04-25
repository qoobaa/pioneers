/**
 * @constructor MVC.IO.JsonP
 * @alias MVC.JsonP
 * Provides JSONP functionality similar to [MVC.IO.Ajax MVC.Ajax]
 * @init a
 */
MVC.JsonP = function(url, options){
    this.url = url;
    this.options = options || {};
    this.remove_script = this.options.remove_script == false ? false : true;
    this.options.parameters = this.options.parameters || {};
    this.error_timeout = this.options.error_timeout*1000 || 1000*70; 
    this.send();
    
}

MVC.JsonP.prototype = {
    send : function(){
        var n = 'c'+MVC.get_random(5);

        if(this.options.session){
            var session = typeof this.options.session == 'function' ? this.options.session() : this.options.session;
            this.url += (MVC.String.include(this.url,';') ? '&' : ';') + MVC.Object.to_query_string(session);
        }

        var params  = typeof this.options.parameters == 'function' ? this.options.parameters() : this.options.parameters; //will eval everytime
        

        this.url += (MVC.String.include(this.url,'?') ? '&' : '?') + MVC.Object.to_query_string(params);
        this.add_method();
        var callback_name = this.callback_and_random(n);
        
        
        var error_timer = this.check_error(this.url, this.options.onFailure);
        
        MVC.JsonP._cbs[callback_name] = MVC.Function.bind(function(callback_params){
            clearTimeout(error_timer);
			this.remove_scripts();
            //convert to a transport
            var transport = {};
            if(callback_params == null){
            	transport.responseText = "";
            }else if(typeof callback_params == 'string'){
            	transport.responseText = callback_params
            }else{
            	transport = callback_params;
            	transport.responseText = callback_params.toString();
            }
            var success = true;
            if(this.options.onSuccess)
                success = this.options.onSuccess(transport);
            
            if(this.options.onComplete && success)
                this.options.onComplete(transport);
            
            delete MVC.JsonP._cbs[callback_name];
		},this);
        include({path: this.url});
    },
    add_method : function(){
        if(this.options.method && this.options.method != 'get') this.url += "&_method="+this.options.method;
    },
    callback_and_random : function(n){
        
        
        //if(this.options.callback){
        //    this.url += "&callback=" +this.options.callback+"&"+n
        //    return this.options.callback;
        //}
        this.options.callback = "MVC.JsonP._cbs."+n;
        this.url += "&callback=" +this.options.callback;
        return n;
    },
    check_error : function(url, error_callback){
        return setTimeout(function(){
            if(error_callback)
                error_callback(url);
            else
                throw "URL:"+url+" timedout!";
        }, this.error_timeout)
    },
    remove_scripts : function(){
         if(this.remove_script)
             setTimeout(MVC.Function.bind(this._remove_scripts,this), 2000 )  
    },
    _remove_scripts : function(){
        var scripts = document.getElementsByTagName('script');
        var search = new RegExp(this.url);
        for(var s = 0; s < scripts.length; s++){
            var script = scripts[s];
            if(MVC.String.include( script.src.toLowerCase() ,this.url.toLowerCase())) script.parentNode.removeChild(script);
        }
    }
}
MVC.JsonP._cbs = {};
MVC.IO.JsonP = MVC.JsonP;