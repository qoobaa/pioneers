MVC.Tree = new XML.ObjTree();
MVC.Tree.attr_prefix = "@";
/**
 * To create a new XMLRest:
 * @code_start
 * Todo = Model.XMLRest.extend('todos')
 * @code_end
 */
MVC.Model.XmlRest = MVC.Model.Ajax.extend(
{
    init: function(){
        if(!this.className) return;
        this.plural_name = MVC.String.pluralize(this.className);
        this.singular_name =  this.className;
        this._super();
    },
    find_one_get_url : function(params){ return '/'+this.plural_name+'/'+params.id+'.xml'},
	find_one_get_success : function(transport, callback){
		var doc = MVC.Tree.parseXML(transport.responseText);
		var obj = doc[this.singular_name];
		var instance = this.create_as_existing(this._attributesFromTree(obj));
		return instance;
	},
    find_all_get_url : function(){ return '/'+this.plural_name+'.xml'},
    find_all_get_success : function(transport){  //error is either success, complete or error
        var doc = MVC.Tree.parseXML(transport.responseText);
		
		// convert dashes to underscores for second and third level hash keys
		for(var key in doc) {
			if(key.match(/-/) && typeof doc[key] == 'object' ){
				doc[key.replace(/-/,'_')] = doc[key];
				delete doc[key];
			}
		}
		for(var key in doc) {
			if (typeof doc[key] == 'object') {
				for (var second_key in doc[key]) {
					if (second_key.match(/-/) && typeof doc[key][second_key] == 'object') {
						doc[key][second_key.replace(/-/, '_')] = doc[key][second_key];
						delete doc[key][second_key];
					}
				}
			}
		}
        if(!doc[this.plural_name]) return [];
        

		if(!(doc[this.plural_name][this.singular_name] instanceof Array))
    		doc[this.plural_name][this.singular_name] = [doc[this.plural_name][this.singular_name]];
    	
      
        collection = [];
    	var attrs = doc[this.plural_name][this.singular_name];
    	for(var i = 0; i < attrs.length; i++){
    		collection.push(this.create_as_existing(this._attributesFromTree(attrs[i])))
    	}
        return collection;
    },
	create_post_url : function(){ return '/'+this.plural_name+'.xml'},
    create_request: function(attributes, defaultURL){
        var instance = new this(attributes);
        instance.validate()
        if( !instance.valid() ) return instance;
        var params = {};
        params[this.singular_name] = attributes;
		var url = typeof this.create_post_url == 'function'? this.create_post_url() : this.create_post_url;
        this.request(url, params, {method: 'post'}, instance );
        return instance;
    },
    create_success: function(transport, callback, instance){
          if (/\w+/.test(transport.responseText)) {
            var errors = instance._errorsFromXML(transport.responseText);
            if (errors)
            	instance.add_errors(errors);
            else {
                var attributes;
                var doc = MVC.Tree.parseXML(transport.responseText);
                if(doc && doc[this.singular_name]) attributes = this._attributesFromTree(doc[this.singular_name]);
                if(attributes) instance._resetAttributes(attributes);
            }
          }
    
          // Get ID from the location header if it's there
          if (instance.is_new_record() && transport.status == 201) {
    	  	var id = this.get_id(transport);
            if (!isNaN(id)) instance._setProperty("id", id );
          }
    	  return instance;
    },
	update_put_url : function(id){ return '/'+this.plural_name+'/'+id+'.xml'},
    update_request: function(id, attributes, defaultURL){
        delete attributes.id
        var params = {};
        params[this.singular_name] = attributes;
        var instance = this.create_as_existing(attributes);
        instance.id = id;
        
        instance.validate()
        if( !instance.valid() ) return instance;
        
        this.request(this.update_put_url(id), params, {method: 'put'}, instance );
    },
    update_success: function(transport, callback, instance){
        if (/\w+/.test(transport.responseText)) {
            var errors = instance._errorsFromXML(transport.responseText);
            if (errors)
              instance.add_errors(errors);
            else {
                var attributes;
                var doc = MVC.Tree.parseXML(transport.responseText);
                
                if (doc && doc[this.singular_name]) attributes = this._attributesFromTree(doc[this.singular_name]);
            
                if (attributes) instance._resetAttributes(attributes);
            }
        }
        return instance;
    },
    destroy_delete_url : function(id){ return '/'+this.plural_name+'/'+id+'.xml' },
    destroy_delete_failure: function(){ return false;},
    destroy_delete_success: function(transport){ return transport.status == 200},
    elementHasMany: function(element) {
          if(!element)
          	return false;
          var i = 0;
          var singular = null;
          var has_many = false;
          for (var val in element) {
          	if(element.hasOwnProperty(val)){
        	    if (i == 0)
        	      singular = val;
        	    i += 1;
        	}
          }
          return (element[singular] && typeof(element[singular]) == "object" && element[singular].length != null && i == 1);
    },
    _attributesFromTree : function(elements) {
        var attributes = {};
        for (var attr in elements) {
          if(! elements.hasOwnProperty(attr)) continue;
    	  // pull out the value
          var value = elements[attr];
          if (elements[attr] && elements[attr]["@type"]) {
            if (elements[attr]["#text"])
              value = elements[attr]["#text"];
            else
              value = undefined;
          }
          
          // handle empty value (pass it through)
          if (!value) var a = {};
          
          // handle scalars
          else if (typeof(value) == "string") {
            // perform any useful type transformations
            if (elements[attr]["@type"] == "integer") {
              var num = parseInt(value);
              if (!isNaN(num)) value = num;
            }
            else if (elements[attr]["@type"] == "boolean")
              value = (value == "true");
            else if (elements[attr]["@type"] == "datetime") {
              var date = MVC.Date.parse(value);
              if (!isNaN(date)) value = date;
            }
          }
          // handle arrays (associations)
          else {
            var relation = value; // rename for clarity in the context of an association
            
            // first, detect if it's has_one/belongs_to, or has_many
            var i = 0;
            var singular = null;
            var has_many = false;
            for (var val in relation) {
              if(relation.hasOwnProperty(val)){
    			  if (i == 0)	
    	            singular = val;
    	          i += 1;
    		  }
            }
            
            // has_many
            if (relation[singular] && typeof(relation[singular]) == "object" && i == 1) {
              alert('has_many')
              var value = [];
              var plural = attr;
              var name = MVC.String.classize(singular);
              
              // force array
              if (!(elements[plural][singular].length > 0))
                elements[plural][singular] = [elements[plural][singular]];
              
              elements[plural][singular].each( MVC.Function.bind(function(single) {
                // if the association hasn't been modeled, do a default modeling here
                // hosted object's prefix and format are inherited, singular and plural are set
                // from the XML
                if (eval("typeof(" + name + ")") == "undefined") {
                  MVC.Resource.model(name, {prefix: this._prefix, singular: singular, plural: plural, format: this._format});
                }
                var base = eval(name + ".create_as_existing(this._attributesFromTree(single))");
                value.push(base);
              },this));
            }
            // has_one or belongs_to, or nothing
            else {
              singular = attr;
              var name = MVC.String.classize(singular);
              
              // if the association hasn't been modeled, do a default modeling here
              // hosted object's prefix and format are inherited, singular is set from the XML
              if (eval("typeof(" + name + ")") != "undefined") {
                value = eval(name + ".create_as_existing(this._attributesFromTree(value))");
                //MVC.Resource.model(name, {prefix: this._prefix, singular: singular, format: this._format});
              }else{
                  value = null;
              }
              
            }
          }
          
          // transform attribute name if needed
          attribute = attr.replace(/-/g, "_");
          attributes[attribute] = value;
        }
        return attributes;
	}
},
{
    
    _errorsFromXML : function(xml) {
        if (!xml) return false;
        var doc = MVC.Tree.parseXML(xml);
    
        if (doc && doc.errors) {
          var errors = [];
          if (typeof(doc.errors.error) == "string") doc.errors.error = [doc.errors.error];
          
          for(var i=0; i < doc.errors.error.length; i++){
              //check if 
              var error = doc.errors.error[i];
              var matches = error.match(/(\w+) (.*)/)
              errors.push([matches[1].toLowerCase(), matches[2].toLowerCase()]);
          }
          return errors;
        }
        else return false;
    }
    
    
}
)