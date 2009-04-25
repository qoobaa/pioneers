/**
 * Uses window.name as a cross domain transport
 */
MVC.Model.WindowName = MVC.Model.extend(
{
    init: function(){
        if(!this.className) return;
        if(!this.domain) throw('a domain must be provided for remote model');
        if(!this.controller_name)
            this.controller_name = this.className;
        this.plural_controller_name = MVC.String.pluralize(this.controller_name);
        this._super();
    },
    find_all: function(params, cbs){
        var callbacks = this._clean_callbacks(cbs);
        var callback = callbacks.onSuccess;
        var error_callback = callbacks.onFailure;
        var url = this.find_url ? this.find_url+"?" : this.domain+'/'+this.plural_controller_name+'.html?';
		if(!callback) callback = (function(){});
        
        new MVC.WindowName(url, {
            parameters: params,
            onFailure: cbs.onFailure,
            onComplete: MVC.Function.bind(function(callback_params_str){
				eval("var callback_params = "+callback_params_str);
                var newObjects = this.create_many_as_existing( callback_params);
                callback(newObjects);
            }, this),
            method: 'get'
        })
    },
    create : function(params, cbs) {
        var callbacks = this._clean_callbacks(cbs);
        var callback = callbacks.onSuccess;
        this.add_standard_params(params, 'create');
		var klass = this, className = this.className, 
            url = this.create_url ? this.create_url+"?" : this.domain+'/'+this.plural_controller_name+'.html?';
		if(!callback) callback = (function(){});
        
		params['_method'] = 'POST';
        new MVC.WindowName(url, {
             parameters: params,
             onComplete: MVC.Function.bind( this.single_create_callback(callback), this) ,
             onFailure: callback.onFailure,
             method: 'post'
         });
	},
	add_standard_params : function(params, callback_name){
		if(!params.referer) params.referer = window.location.href;
	},
    domain: null
},
//prototype functions
{});