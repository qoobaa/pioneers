//Heavily borrowed from prototype.org

/**
 *  @add  MVC.Native.Number  Static
 */
MVC.Object.extend(MVC.Number, {
    /**
     * @plugin lang/json
     * @param {Object} number
     */
    to_json: function(number) {
        return isFinite(number) ? number.toString() : 'null';
    }
});

/**
 *  @add  MVC.Native.Date  Static
 */
if(!MVC.Date) MVC.Date = {};
MVC.Object.extend(MVC.Date, {
    /**
     * @plugin lang/json
     * @param {Object} date
     */
    to_json: function(date) {
      return '"' + date.getUTCFullYear() + '-' +
        MVC.Number.to_padded_string(date.getUTCMonth() + 1, 2) + '-' +
        MVC.Number.to_padded_string(date.getUTCDate(), 2)+ 'T' +
        MVC.Number.to_padded_string(date.getUTCHours(), 2) + ':' +
        MVC.Number.to_padded_string(date.getUTCMinutes(), 2) + ':' +
        MVC.Number.to_padded_string(date.getUTCSeconds(), 2) + 'Z"';
    }
});
/**
 *  @add  MVC.Native.String  Static
 */
MVC.Object.extend(MVC.String, {
    /**
     * @plugin lang/json
     * @param {Object} string
     */
    to_json: function(string) {
        var specialChar= {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '\\': '\\\\'
        };
        
        var escapedString = string.replace(/[\x00-\x1f\\]/g, function(match) {
          var character = specialChar[match[0]];
          return character ? character : '\\u00' + MVC.Number.to_padded_string(match[0].charCodeAt(), 2, 16);
        });
        return '"' + escapedString.replace(/"/g, '\\"') + '"';
    }
});
/**
 *  @add  MVC.Native.Array  Static
 */
MVC.Object.extend(MVC.Array,{
    /**
     * @plugin lang/json
     * @param {Object} array
     * @param {Object} nested
     */
    to_json: function(array,nested) {
        var results = [];
        for(var i=0; i < array.length; i++){
            var val =  MVC.Object.to_json(array[i],true);
            if(typeof val != 'undefined') results.push(val);
        }
        return '[' + results.join(', ') + ']';
    }
});
/**
 *  @add  MVC.Native.Object  Static
 */
MVC.Object.
/**
 * @plugin lang/json
 * @param {Object} object
 * @param {Object} nested
 */
to_json = function(object, nested){
    var type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
      case 'string' : return MVC.String.to_json(object);
      case 'number' : return MVC.Number.to_json(object);
    }

    if (object === null) return 'null';
    
    
    switch (object.constructor){
        case Array : return MVC.Array.to_json(object);
        case Date : return MVC.Array.to_json(object);
    }
    
    if (object.to_json) return object.to_json();
    if (object.nodeType == 1) return;

    var results = [];
    for (var property in object) {
      var value = MVC.Object.to_json(object[property], true);
      if (typeof value != 'undefined')
        results.push(MVC.String.to_json(property) + ': ' + value);
    }
    return '{' + results.join(', ') + '}';
};
