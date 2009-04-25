// Several of the methods in this plugin use code adapated from Prototype
//  Prototype JavaScript framework, version 1.6.0.1
//  (c) 2005-2007 Sam Stephenson

MVC.String = {};
MVC.String.strip = function(string){
	return string.replace(/^\s+/, '').replace(/\s+$/, '');
};


MVC.Function = {};
MVC.Function.params = function(func){
	var ps = func.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",");
	if( ps.length == 1 && !ps[0]) return [];
	for(var i = 0; i < ps.length; i++) ps[i] = MVC.String.strip(ps[i]);
	return ps;
};

/**
 * @class MVC.Native
 */
MVC.Native ={};
MVC.Native.
/**
 * 
 * @param {Object} class_name
 * @param {Object} source
 */
extend = function(class_name, source){
	if(!MVC[class_name]) MVC[class_name] = {};
	var dest = MVC[class_name];
	for (var property in source){
		dest[property] = source[property];
		if(!MVC._no_conflict){
			window[class_name][property] = source[property];
			if(typeof source[property] == 'function'){
				var names = MVC.Function.params(source[property]);
    			if( names.length == 0) continue;
				//var first_arg = names[0];
				//if( first_arg.match(class_name.substr(0,1).toLowerCase()  ) || (first_arg == 'func' && class_name == 'Function' )  ){
					MVC.Native.set_prototype(class_name, property, source[property]);
				//}
			}
		}
	}
};
MVC.Native.set_prototype = function(class_name, property_name, func){
	if(!func) func = MVC[class_name][property_name];
    window[class_name].prototype[property_name] = function(){
		var args = [this];
		for (var i = 0, length = arguments.length; i < length; i++) args.push(arguments[i]);
		return func.apply(this,args  );
	};
};

/**
 * @class MVC.Native.Object
 * @alias MVC.Object
 * Object helpers
 */
MVC.Native.Object = {};

MVC.Native.Object.
/**
 * Copies one object to another
 * @param {Object} destination
 * @param {Object} source
 * @return {Object} the destination object
 */
extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

MVC.Native.Object.
/**
 * For an object, returns url params.
 * @param {Object} object
 * @param {Object} name
 */
to_query_string = function(object,name){
	if(typeof object != 'object') return object;
	return MVC.Native.Object.to_query_string.worker(object,name).join('&');
};
MVC.Native.Object.to_query_string.worker = function(obj,name){
	var parts2 = [];
	for(var thing in obj){
		if(obj.hasOwnProperty(thing)) {
			var value = obj[thing];
            if(value && value.constructor === Date){
                
                value =  value.getUTCFullYear()+'-'+
                    MVC.Number.to_padded_string(value.getUTCMonth() + 1,2) + '-' +
                    MVC.Number.to_padded_string(value.getUTCDate(),2) + ' ' +
                    MVC.Number.to_padded_string(value.getUTCHours(),2) + ':' +
                    MVC.Number.to_padded_string(value.getUTCMinutes(),2) + ':' +
                    MVC.Number.to_padded_string(value.getUTCSeconds(),2);
            }
			if(value instanceof Array && value.length){
				var newer_name = encodeURIComponent(name ? name+'['+thing+']' : thing) ;
                for(var i = 0; i < value.length; i++){
                    var nice_val = encodeURIComponent(value[i].toString());
                    parts2.push( newer_name+'='+nice_val )  ;
                }
            }else if(typeof value != 'object'){
				var nice_val = encodeURIComponent(value.toString());
				var newer_name = encodeURIComponent(name ? name+'['+thing+']' : thing) ;
				parts2.push( newer_name+'='+nice_val )  ;
			}else{
				parts2 = parts2.concat( MVC.Native.Object.to_query_string.worker(value,  name ? name+'['+thing+']' : thing ))
			}
		}
	}
	return parts2;
};

/* 
 * @class MVC.Native.String
 * @alias MVC.String
 * When not in no-conflict mode, JMVC adds the following helpers to string
 */
MVC.Native.extend('String', 
/* @Static*/
{
    /*
     * Capitalizes a string
     * @param {String} s the string to be lowercased.
     * @return {String} a string with the first character capitalized, and everything else lowercased
     */
	capitalize : function(s) {
		return s.charAt(0).toUpperCase()+s.substr(1).toLowerCase();
	},
    /**
     * Returns if a string has another string inside it.
     * @param {String} string String that is being scanned
     * @param {String} pattern String that we are looking for
     * @return {Boolean} true if the string has pattern, false if otherwise
     */
	include : function(s, pattern){
		return s.indexOf(pattern) > -1;
	},
    /**
     * Returns if string ends with another string
     * @param {String} s String that is being scanned
     * @param {String} pattern What the string might end with
     * @return {Boolean} true if the string ends wtih pattern, false if otherwise
     */
	ends_with : function(s, pattern) {
	    var d = s.length - pattern.length;
	    return d >= 0 && s.lastIndexOf(pattern) === d;
	},
    /**
     * Capitalizes a string from something undercored. Examples:
     * @code_start
     * MVC.String.camelize("one_two") //-> "oneTwo"
     * "three-four".camelize() //-> threeFour
     * @code_end
     * @param {String} s
     * @return {String} a the camelized string
     */
	camelize: function(s){
		var parts = s.split(/_|-/);
		for(var i = 1; i < parts.length; i++)
			parts[i] = MVC.String.capitalize(parts[i]);
		return parts.join('');
	},
    /**
     * Like camelize, but the first part is also capitalized
     * @param {String} s
     * @return {String}
     */
	classize: function(s){
		var parts = s.split(/_|-/);
		for(var i = 0; i < parts.length; i++)
			parts[i] = MVC.String.capitalize(parts[i]);
		return parts.join('');
	},
    /*
     * @function strip
     * @param {String} s returns a string with leading and trailing whitespace removed.
     */
	strip : MVC.String.strip
});

//Date Helpers, probably should be moved into its own class

/* 
 * @class MVC.Native.Array
 * @alias MVC.Array
 * When not in no-conflict mode, JMVC adds the following helpers to array
 */
MVC.Native.extend('Array',
/* @static*/
{ 
	/**
	 * Searchs an array for item.  Returns if item is in it.
	 * @param {Object} array
	 * @param {Object} item an item that is matched with ==
	 * @return {Boolean}
	 */
    include: function(a, item){
		for(var i=0; i< a.length; i++){
			if(a[i] == item) return true;
		}
		return false;
	}
});
MVC.Array.
    /**
     * Creates an array from another object.  Typically, this is used to give arguments array like properties.
     * @param {Object} iterable an array like object with a length property.
     * @return {Array}
     */
	from= function(iterable){
		 if (!iterable) return [];
		var results = [];
	    for (var i = 0, length = iterable.length; i < length; i++)
	      results.push(iterable[i]);
	    return results;
	}
MVC.Array.
    /**
     * Returns if the object is an array
     * @param {Object} array a possible array object
     * @return {Boolean}
     */
    is = function(array){
        return Object.prototype.toString.call(a) === '[object Array]';
    }

/* 
 * @class MVC.Native.Function
 * @alias MVC.Function
 * When not in no-conflict mode, JMVC adds the following helpers to function
 */
MVC.Native.extend('Function', 
/* @static*/
{
	/**
	 * Binds a function to another object.  The object the function is binding
	 * to is the second argument.  Additional params are added to the callback function.
	 * @code_start
	 * //basic example
	 * var callback1 = MVC.Function.bind(function(){alert(this.library)}, {library: "jmvc"});
	 * //shows with prepended args
	 * var callback2 = MVC.Function.bind(
	 *     function(version, os){
	 *         alert(this.library+", "+version+", "+os);
	 *     },
	 *     {library: "jmvc"},
	 *     "1.5")
	 * @code_end
	 * @param {Function} f The function that is being bound.
	 * @param {Object} obj The object you want to bind to.
	 * @return {Function} the wrapping function.
	 */
    bind: function(f, obj) {
	  var args = MVC.Array.from(arguments);
	  args.shift();args.shift();
	  var __method = f, object = arguments[1];
	  return function() {
	    return __method.apply(object, args.concat(MVC.Array.from(arguments) )  );
	  }
	},
	params: MVC.Function.params
});
/* 
 * @class MVC.Native.Number
 * @alias MVC.Number
 * When not in no-conflict mode, JMVC adds the following helpers to number
 */
MVC.Native.extend('Number', 
/* @static*/
{
    /**
     * Changes a number to a string, but includes preceeding zeros.
     * @param {Object} number the number to be converted
     * @param {Object} length the number of zeros
     * @param {optional:Object} radix the numeric base (defaults to base 10);
     * @return {String} 
     */
    to_padded_string: function(n, len, radix) {
        var string = n.toString(radix || 10);
        var ret = '', needed = len - string.length;
        
        for(var i = 0 ; i < needed; i++) 
            ret += '0';
        return ret + string;
    }
})

MVC.Native.Array = MVC.Array
MVC.Native.Function = MVC.Function
MVC.Native.Number = MVC.Number
MVC.Native.String = MVC.String
MVC.Object = MVC.Native.Object
if(!MVC._no_conflict)
    Array.from = MVC.Array.from