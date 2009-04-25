/*
 * JavaScriptMVC - include
 * (c) 2008 Jupiter ITS
 * 
 * 
 * This file does the following:
 * 
 * -Checks if the file has already been loaded, if it has, calls include.end
 * -Defines the MVC namespace.
 * -Defines MVC.File
 * -Inspects the DOM for the script tag that included include.js, with it extracts:
 *     * the location of include
 *     * the location of the application directory
 *     * the application's name
 *     * the environment (development, compress, test, production)
 * -Defines include
 * -Loads more files depending on environment
 *     * Development/Compress -> load the application file
 *     * Test -> Load the test plugin, the application file, and the application's test file
 *     * Production -> Load the application's production file.
 */

//put everything in function to keep space clean
(function(){
	
// Check if include has already been loaded, if it has call end.
if(typeof include != 'undefined' && typeof include.end != 'undefined'){
    return include.end();
}else if(typeof include != 'undefined' && typeof include.end == 'undefined')
	throw("Include is defined as function or an element's id!");

/**
 * @class MVC
 * Default values in MVC namespace.
 */
MVC = typeof MVC == 'undefined' ? {} : MVC;
MVC.Object =  { 
        /**
         * Extends the attributes of destination with source and returns the result.
         * @param {Object} d
         * @param {Object} s
         */
        extend: function(d, s) { for (var p in s) d[p] = s[p]; return d;} 
    }
MVC.Object.extend(MVC,{                                   
	Test: {},        
	_no_conflict: false,    
    /**
     * Call to set no conflict mode.
     */                                    
	no_conflict: function(){ MVC._no_conflict = true  },
	/**
	 * Used to ignore Rhino
	 * @param {Object} f
	 */
    runner: function(f){
		if(!MVC.Browser.Rhino) f();
	},
	Ajax: {},
    IO: {},
    _env : "development",
    env : function(arg){
        MVC._env = arg || MVC._env;
        return MVC._env;
    },
    /**
     * Has booleans for different browsers.  Browser include:
     * MVC.Browser. IE, Opera, WebKit, Gecko, MobileSafari, Rhino
     */
	Browser: {
	    IE:     !!(window.attachEvent && !window.opera),
	    Opera:  !!window.opera,
	    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
	    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
	    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
        Rhino : !!window._rhino
	},
    /**
     * Where the jmvc folder is.
     */
	mvc_root: null,
    /**
     * The path to include in the script tag that loads include and the application.  String.
     */
	include_path: null,
    /**
     * The root folder for the application
     * @param {Object} id
     */
	root: null,
    /**
     * The directory where the page is located
     */
    page_dir : null,
    /**
     * Default functions on a JavaScript Object {}.
     * @param {Object} id
     */
	Object:  { 
        /**
         * Extends the attributes of destination with source and returns the result.
         * @param {Object} d
         * @param {Object} s
         */
        extend: function(d, s) { for (var p in s) d[p] = s[p]; return d;} 
    },
    /**
     * @function $E
     * Helper function for getting an element by ID.
     * @param {Object} id
     */
	$E: function(id){ return typeof id == 'string' ? document.getElementById(id): id },
    /**
     * The application name loaded by the script tag.
     * @param {Object} length
     */
	app_name: 'app',
    /**
     * Returns a random string.
     * @param {Object} length
     */
    get_random: function(length){
    	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    	var randomstring = '';
    	for (var i=0; i<length; i++) {
    		var rnum = Math.floor(Math.random() * chars.length);
    		randomstring += chars.substring(rnum,rnum+1);
    	}
        return randomstring;
    },
    /**
     * Empty function
     */
    K : function(){}
});
/**
 * A static random number.
 */
MVC.random = MVC.get_random(6);





MVC.Ajax.factory = function(){ return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();};


/**
 * @Constructor
 * Used for getting information out of a path
 * @init
 * Takes a path
 * @param {String} path 
 */
MVC.File = function(path){ this.path = path; };
var File = MVC.File;

MVC.File.prototype = 
/* @Prototype */
{
	/**
	 * Removes hash and params
	 * @return {String}
	 */
    clean: function(){
		return this.path.match(/([^\?#]*)/)[1];
	},
    /**
     * Returns everything before the last /
     */
	dir: function(){
		var last = this.clean().lastIndexOf('/');
		return last != -1 ? this.clean().substring(0,last) : ''; //this.clean();
	},
    /**
     * Returns the domain for the current path.
     * Returns null if the domain is a file.
     */
	domain: function(){ 
		if(this.path.indexOf('file:') == 0 ) return null;
		var http = this.path.match(/^(?:https?:\/\/)([^\/]*)/);
		return http ? http[1] : null;
	},
    /**
     * Joins url onto path
     * @param {Object} url
     */
	join: function(url){
		return new File(url).join_from(this.path);
	},
    /**
     * 
     * @param {Object} url
     * @param {Object} expand
     */
	join_from: function( url, expand){
		if(this.is_domain_absolute()){
			var u = new File(url);
			if(this.domain() && this.domain() == u.domain() ) 
				return this.after_domain();
			else if(this.domain() == u.domain()) { // we are from a file
				return this.to_reference_from_same_domain(url);
			}else
				return this.path;
		}else if(url == MVC.page_dir && !expand){
			return this.path;
		}else{
			if(url == '') return this.path.replace(/\/$/,'');
			var urls = url.split('/'), paths = this.path.split('/'), path = paths[0];
			if(url.match(/\/$/) ) urls.pop();
			while(path == '..' && paths.length > 0){
				paths.shift();
				urls.pop();
				path =paths[0];
			}
			return urls.concat(paths).join('/');
		}
	},
    /**
     * Joins the file to the current working directory.
     */
    join_current: function(){
        return this.join_from(include.get_path());
    },
    /**
     * Returns true if the file is relative
     */
	relative: function(){		return this.path.match(/^(https?:|file:|\/)/) == null;},
    /**
     * Returns the part of the path that is after the domain part
     */
	after_domain: function(){	return this.path.match(/(?:https?:\/\/[^\/]*)(.*)/)[1];},
	/**
	 * 
	 * @param {Object} url
	 */
    to_reference_from_same_domain: function(url){
		var parts = this.path.split('/'), other_parts = url.split('/'), result = '';
		while(parts.length > 0 && other_parts.length >0 && parts[0] == other_parts[0]){
			parts.shift(); other_parts.shift();
		}
		for(var i = 0; i< other_parts.length; i++) result += '../';
		return result+ parts.join('/');
	},
    /**
     * Is the file on the same domain as our page.
     */
	is_cross_domain : function(){
		if(this.is_local_absolute()) return false;
		return this.domain() != new File(location.href).domain();
	},
	is_local_absolute : function(){	return this.path.indexOf('/') === 0},
	is_domain_absolute : function(){return this.path.match(/^(https?:|file:)/) != null},
    /**
     * For a given path, a given working directory, and file location, update the path so 
     * it points to the right location.
     */
	normalize: function(){
		var current_path = include.get_path();
		//if you are cross domain from the page, and providing a path that doesn't have an domain
		var path = this.path;
        if(new File(include.get_absolute_path()).is_cross_domain() && !this.is_domain_absolute() ){
			//if the path starts with /
			if( this.is_local_absolute() ){
				var domain_part = current_path.split('/').slice(0,3).join('/');
				path = domain_part+path;
			}else{ //otherwise
				path = this.join_from(current_path);
			}
		}else if(current_path != '' && this.relative()){
			path = this.join_from( current_path+(current_path.lastIndexOf('/') === current_path.length - 1 ? '' : '/')  );
		}
		return path;
	}
};



// Extract information about the page and how include is loaded.
// -Inspects the DOM for the script tag that included include.js, with it extracts:
//     * the location of include
//     * the location of the application directory
//     * the application's name
//     * the environment (development, compress, test, production)
MVC.page_dir = new File(window.location.href).dir();

//find include
var scripts = document.getElementsByTagName("script");
for(var i=0; i<scripts.length; i++) {
	var src = scripts[i].src;
	if(src.match(/include\.js/)){  //if script has include.js
		MVC.include_path = src;
		MVC.mvc_root = new File( new File(src).join_from( MVC.page_dir ) ).dir();
		var loc = MVC.mvc_root.match(/\.\.$/) ?  MVC.mvc_root+'/..' : MVC.mvc_root.replace(/jmvc$/,'');
		if(loc.match(/.+\/$/)) loc = loc.replace(/\/$/, '');
		MVC.root = new File(loc);
		if(src.indexOf('?') != -1) MVC.script_options = src.split('?')[1].split(',');
	}
}


/**
 * @class MVC.Options
 * Holds config options for JMVC.
 */
MVC.Options = {
    /**
     * Load the production file in production, set to false if you package include with your project
     */
    load_production: true,
    /**
     * Development environment, typically gets set automatically
     */
    env: 'development',
    /**
     * Location of your production file
     */
    production: '/javascripts/production.js',
    /**
     * Encoding for all requests, default is "utf-8"
     */
    encoding : "utf-8",
    /**
     * Lets browsers handle loading files if they need to.  Defaults to true, set to false to always
     * load file.
     */
    cache_include : true
}





// variables used while including
var first = true ,                                 //If we haven't included a file yet
	first_wave_done = false,                       //If all files have been included 
	included_paths = [],                           //a list of all included paths
	cwd = '',                                      //where we are currently including
	includes=[],                                   //    
	current_includes=[],                           //includes that are pending to be included
	total = [];                                    //





/**
 * @class include
 * Include is used to load and compress JavaScript files. 
 * You can load files relative to your current file and compress all your application 
 * files into one with no extra coding.
 * <h2>How to Use</h2>
 * <h3>Create an application</h3>
 * Create an application by running:
 * @code_start no-highlight
 * js jmvc\generate\app APP_NAME
 * @code_end
 * <h3>Add to your page</h3>
 * In your HTML, right before the closing &lt;/body> tag add a script tag like:
 * @code_start no-highlight
 * &lt;script src="include.js?APP_NAME,development" type="text/javascript">
 * &lt;/script>
 * @code_end
 * The parameters after the include are the application name and the development mode.
 * You can also create a page that loads your app by running:
 * @code_start no-highlight
 * js jmvc\generate\page APP_NAME location\to\page.html
 * @code_end
 * <h3>Include JavaScript files</h3>
 * In your application file at <i>'apps\APP_NAME.js'</i>, include the files you need 
 * in your project.
 * @code_start
 * include('../resources/', 'javascripts/myapplication');
 * @code_end
 * Includes are performed relative to the including file. 
 * Files are included last-in-first-out after the current file has been loaded and run.
 * <h3>Compress your application</h3>
 * Run
 * @code_start no-highlight
 * js apps\APP_NAME\compress.js
 * @code_end
 * <h3>Run in proudction</h3>
 * Switch to the production mode by changing development to production:
 * @code_start no-highlight
 * &lt;script src="include.js?APP_NAME,production" type="text/javascript">
 * &lt;/script>
 * @code_end
 * <h2>Script Load Order</h2>
 * The load order for your scripts follows a consistent last-in first-out order across all browsers. 
 * This is the same way the following document.write would work in IE, Firefox, or Safari:
 * @code_start
 * document.write('<script type="text/javascript" src="some_script.js"></script>')
 * @code_end
 * An example helps illustrate this.
 * <img src='http://javascriptmvc.com/images/last_in_first_out.png'/>
 * <table class="options">
				<tr class="top">
					<th>Load Order</th>
					<th class="right">File</th>
				</tr>
				<tbody>
				<tr>
					<td>1</td>
					<td class="right">1.js</td>
				</tr>
				<tr>
					<td>2</td>
					<td class="right">3.js</td>
				</tr>
				<tr>
					<td>3</td>
					<td class="right">4.js</td>
				</tr>
				<tr>
					<td>4</td>
					<td class="right">2.js</td>
				</tr>
				<tr>
					<td>5</td>
					<td class="right">5.js</td>
				</tr>
				<tr class="bottom">
					<td>6</td>
					<td class="right">6.js</td>
				</tr>
	</tbody></table>
 */
include = function(){
	if(include.get_env().match(/development|compress|test/)){
		
        for(var i=0; i < arguments.length; i++) 
            include.add( include.add_defaults(arguments[i]) );
            
	}else{
        //production file
		if(!first_wave_done) return; 
		for(var i=0; i < arguments.length; i++){
            include.add( include.add_defaults(arguments[i]) );
        }
		return;
	}
    //do first insert after include
	if(first && !MVC.Browser.Opera){
		first = false;
        insert();
	}
};


MVC.Object.extend(include,
/* @Static */
{
	//Adds defaults to an included parameter
    add_defaults : function(inc){
    	if(typeof inc == 'string') 
          inc = {path: inc.indexOf('.js') == -1  ? inc+'.js' : inc};            //add .js to it, if not there
    	if(typeof inc != 'function'){
            inc.original_path = inc.path;
            inc = MVC.Object.extend( {}, inc);       //extend with default options
            //if(force) inc.compress = false
        }
    	return inc;
    },
    /**
	 * Sets up the current environment, and where the production file is.
	 * @param {Object} o
	 */
    setup: function(o){
        //good place to set other params
        MVC.Object.extend(MVC.Options, o || {});

		MVC.Options.production = MVC.Options.production+(MVC.Options.production.indexOf('.js') == -1 ? '.js' : '' );

		if(MVC.Options.env == 'test')  include.plugins('test');
		if(MVC.Options.env == 'production' && ! MVC.Browser.Opera && MVC.Options.load_production)
			return document.write('<script type="text/javascript" src="'+include.get_production_name()+'"></script>');
	},
    /**
     * Returns what the environment is
     */
	get_env: function() { return MVC.Options.env;},
    /**
     * Gets the location of the production file
     */
	get_production_name: function() { return MVC.Options.production;},
	/**
	 * Sets the current directory.
	 * @param {Object} p
	 */
    set_path: function(p) {
        cwd = p;
    },
    /**
     * Gets the current working directory
     */
	get_path: function() { 
		return cwd;
	},
	get_absolute_path: function(){
		var fwd = new File(cwd);
		return fwd.relative() ? fwd.join_from(MVC.root.path, true) : cwd;
	},
    // Adds an include to the pending list of includes.
	add: function(newInclude){
        //If include is a function, adjust the function to first set the path right before including
        if(typeof newInclude == 'function'){
            var path = include.get_path();
            var adjusted = function(){
                include.set_path(path);
                newInclude();
            }
            include.functions.push(adjusted); //add to the list of functions

            current_includes.unshift(  adjusted ); //add to the front
            
            return;
        }
        
        //if we have already performed loads, insert new includes in head
        if(first_wave_done) 
            return include.insert_head(newInclude.path);
        
        
        //get the normalized path, and absolute path, and new start path for the file
		var pf = new File(newInclude.path);
		newInclude.path = pf.normalize();
		newInclude.absolute = pf.relative() ? pf.join_from(include.get_absolute_path(), true) : newInclude.path;
		newInclude.start = new MVC.File(newInclude.path).dir();
        
        //now we should check if it has already been included or added earlier in this file
        if(include.should_add(newInclude.absolute)){
            //but the file could still be in the list of includes but we need it earlier, so remove it and add it here
            for(var i = 0; i < includes.length; i++){
                if(includes[i].absolute == newInclude.absolute){
                    includes.splice(i,1);
                    break;
                }
            } 
            current_includes.unshift(  newInclude );
        }else{
           
        }
	},
    should_add : function(path){
        for(var i = 0; i < total.length; i++) if(total[i].absolute == path) return false;
    	for(var i = 0; i < current_includes.length; i++) if(current_includes[i].absolute == path) return false;
        return true;
    },
    /**
     * Includes something if it has been included or not.
     */
    force : function(){
        for(var i=0; i < arguments.length; i++){
            //basically convert from jmvc
            include.insert_head(MVC.root.join(arguments[i]));
        }
    },
    /**
     * Used to close a document that has been openned.  This is useful for writing to popup windows.
     */
    close_time : function(){
        setTimeout(function(){ document.close(); },10)
    },
    close : function(){
        if(include.get_env()=='production') include.close_time();
        else    include._close= true;
    },
    // Called after every file is loaded.  Gets the next file and includes it.
	end: function(src){
        // add includes that were just added to the end of the list
        
        includes = includes.concat(current_includes);
		
        // take the last one
        var latest = includes.pop();
        
        // if there are no more
		if(!latest) {
			first_wave_done = true;
			if(include.get_env()=='compress') setTimeout( include.compress, 10 );
            if(typeof MVCOptions != 'undefined' && MVCOptions.done_loading) MVCOptions.done_loading();
            
            if(include._close){ 
                this.close_time();
            }
			return;
		};
        
        //add to the total list of things that have been included, and clear current includes
		total.push( latest);
		current_includes = [];
        
        //if a function
        if(typeof latest == 'function'){
            //run function and continue to next included
            latest();
            insert();
        }else{
            //set current path, and what is being included
            include.set_path(latest.start);
    		include.current = latest.path;
    		if(include.get_env()=='compress'){
                //get text and print location if you are in compress mode
                var parts = latest.path.split("/")
                if(parts.length > 4) parts = parts.slice(parts.length - 4);
                print("   "+parts.join("/"));
                latest.text = include.request(MVC.root.join(latest.path));
            }

    		latest.ignore ? insert() : insert(latest.path);
        }
	},
    //include.end_of_production is written at the end of the production script to call this function
	end_of_production: function(){ first_wave_done = true; },
	compress: function(){
        MVCOptions.compress_callback(total)
	},
	opera: function(){
		include.opera_called = true;
		if(MVC.Browser.Opera){
			MVC.Options.env == 'production' ? 
                document.write('<script type="text/javascript" src="'+include.get_production_name()+'"></script>') : 
                include.end();
		}
	},
	opera_called : false,
    plugin: function(plugin_name) {
		var current_path = include.get_path();
		include.set_path("");
		include('jmvc/plugins/'+ plugin_name+'/setup');
		include.set_path(current_path);
	},
    engine : function(engine_name){
        var current_path = include.get_path();
		include.set_path("");
		include('engines/'+ engine_name+'/apps/'+engine_name+".js");
		include.set_path(current_path);
    },
    /**
     * Includes a list of plugins
     */
	plugins: function(){
		for(var i=0; i < arguments.length; i++) include.plugin(arguments[i]);
	},
    /**
     * Includes a list of engines
     */
    engines: function(){
		for(var i=0; i < arguments.length; i++) include.engine(arguments[i]);
	},
    // Returns a function that applies a function to a list of arguments.  Then includes those
    // arguments.
	app: function(f){
		return function(){
            for (var i = 0; i < arguments.length; i++) {
				arguments[i] = f(arguments[i]);
			}
			include.apply(null, arguments);
		}
	},
    functions: [],
    next_function : function(){
        var func = include.functions.pop();
        if(func) func();
    },
    /**
     * Includes CSS
     */
    css: function(){
        var arg;
        for(var i=0; i < arguments.length; i++){
            arg = arguments[i];
            var current = new MVC.File("../stylesheets/"+arg+".css").join_current();
            include.create_link( MVC.root.join(current)  );
        }
    },
    /**
     * Creates a css link and appends it to head.
     * @param {Object} location
     */
    create_link: function(location){
        var link = document.createElement('link');
    	link.rel = "stylesheet";
    	link.href =  location;
    	link.type = 'text/css';
        head().appendChild(link);
    },
    /**
     * Returns true or false if a file exists.  This isn't 'locking' in FF3.
     * @param {Object} path
     * @return {Boolean}
     */
    check_exists: function(path){		
    	var xhr=MVC.Ajax.factory();
    	try{ 
    		xhr.open("HEAD", path, false);
    		xhr.send(null); 
    	} catch(e) { return false; }
    	if ( xhr.status > 505 || xhr.status == 404 || xhr.status == 2 || 
    		xhr.status == 3 ||(xhr.status == 0 && xhr.responseText == '') ) 
    			return false;
        return true;
    },
    /**
     * Synchronously requests a file.
     * @param {Object} path
     */
    request: function(path, content_type){
       var contentType = content_type || "application/x-www-form-urlencoded; charset="+MVC.Options.encoding
       var request = MVC.Ajax.factory();
       request.open("GET", path, false);
       request.setRequestHeader('Content-type', contentType)
       if(request.overrideMimeType) request.overrideMimeType(contentType);

       try{request.send(null);}
       catch(e){return null;}
       if ( request.status == 500 || request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
       return request.responseText;
    },
    /**
     * Inserts a script tag in head with the encoding.
     * @param {Object} src
     * @param {Object} encode
     */
    insert_head: function(src, encode){
    	encode = encode || "UTF-8";
        var script= script_tag();
    	script.src= src;
    	script.charset= encode;
    	head().appendChild(script);
    },
    write : function(src, encode){
        encode = encode || "UTF-8";
        document.write('<script type="text/javascript" src="'+src+'" encode="+encode+"></script>');
    }
});
/**
 * @function controllers
 */
include.controllers = include.app(function(i){return '../controllers/'+i+'_controller'});
/**
 * @function models
 */
include.models = include.app(function(i){return '../models/'+i});
/**
 * @function resources
 */
include.resources = include.app(function(i){return '../resources/'+i});




var script_tag = function(){
	var start = document.createElement('script');
	start.type = 'text/javascript';
	return start;
};

var insert = function(src){
    // source we need to know how to get to jmvc, then load 
    // relative to path to jmvc
    if(src){
        var src_file = new MVC.File(src);
		if(!src_file.is_local_absolute() && !src_file.is_domain_absolute())
	        src = MVC.root.join(src);
	}
    if(! document.write){
        if(src){
            load(new MVC.File( src ).clean());
        }
        load( new MVC.File( MVC.include_path ).clean()  )
    }else if(MVC.Browser.Opera||MVC.Browser.Webkit){
		if(src) {
			var script = script_tag();
			script.src=src+'?'+MVC.random;
			document.body.appendChild(script);
		}
		var start = script_tag();
		start.src = MVC.include_path+'?'+MVC.random;
		document.body.appendChild(start);
	}else{
        document.write(
			(src? '<script type="text/javascript" src="'+src+(MVC.Options.cache_include ? '': '?'+MVC.random )+'"></script>':'')+
			call_end()
		);
	}
};

var call_end = function(src){
    return MVC.Browser.Gecko ? '<script type="text/javascript">include.end()</script>' : 
    '<script type="text/javascript" src="'+MVC.include_path+'?'+MVC.random+'"></script>'
}

var head = function(){
	var d = document, de = d.documentElement;
	var heads = d.getElementsByTagName("head");
	if(heads.length > 0 ) return heads[0];
	var head = d.createElement('head');
	de.insertBefore(head, de.firstChild);
	return head;
};



// The following code tries to load initial files by default.  The 
// environment and application name are provided by the parameters in the script
// include tag.


if(MVC.script_options){
	first = false;
    MVC.apps_root =  MVC.root.join('apps')
	MVC.app_name = MVC.script_options[0];
    if(MVC.Browser.Rhino)
        MVC.script_options[1] = MVCOptions.env
    var hash_match = window.location.hash.match(/&jmvc\[env\]=(\w+)/)
    if(hash_match){
        MVC.script_options[1] = hash_match[1];
    }
    if(MVC.script_options.length > 1){
        if(!MVC.script_options[1].match(/^(?:production|development|test|compress)$/)) 
            throw "env should be one of: production,development,test,compress";
        include.setup(
            {env: MVC.script_options[1], 
             production: MVC.apps_root+'/'+MVC.script_options[0]+'/production'});
    }
        
	
    include('apps/'+MVC.app_name);
	
    if(MVC.script_options[1] == 'test'){
        // have to include these plugins again (they were included in test already), in case prototype or jquery is included
        include.plugins('lang','dom/query')
		var load_test = function(){
			include('apps/'+MVC.app_name+'/test');
		}
		// check exists doesn't block other scripts from loading in FF3, so this causes problems
		if (navigator.userAgent.match(/Firefox\/3/)) { // FF 3
			load_test();
		} else {
			if(include.check_exists(MVC.apps_root+'/'+MVC.app_name+'/test.js')){
				load_test();
	    	}else{
	    		setTimeout(function(){
	                MVC.Console.log("There is no application test file at:\n    \"apps/"+MVC.app_name+"/test.js\"\nUse it to include your test files.\n\nTest includes:\n    include.unit_tests('product')\n    include.functional_tests('widget')")
	            },1000)
	    	}
		}
    }
	if(!MVC.Browser.Opera) insert();
    include.opera();//for opera
}
if(MVC.Browser.Opera) 
    setTimeout(function(){ if(!include.opera_called && MVC.Options.load_production){ alert("You forgot include.opera().")}}, 10000);
    

})();

