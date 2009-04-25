/**
 * Model for accessing JSON rest resources.<br/>
 * 
 * To create a new JSONModel:
 * @code_start
 * Todo = JSONRestModel.extend('todos')
 * @code_end
 * 
 * To change the find url:
 * @code_start
 * Todo = JSONRestModel.extend('todos',{
 *   find_all_get_url: "application/todos.json"
 *},{})
 * @code_end
 * Examples of how data should be returned to use JSONModel
 * @code_start
 * // /recipes.json should return 
 *    [ 
 *       {attributes: 
 *           {title: "Chicken Soup", id: "48", 
 *            instructions: "Call Mom!\nBring chicken",
 *            id: 1}  }, 
 *       {attributes: 
 *           {title: "Toast", id: "49", 
 *            instructions: "Heat Bread",
 *            id: 1}  } 
 *     ]
 *     
 * // /recipes/1.json should return
 *     {attributes: 
 *           {title: "Chicken Soup", id: "48", 
 *            instructions: "Call Mom!\nBring chicken",
 *            id: 1}  } 
 * @code_end
 * 
 */
MVC.Model.JsonRest = MVC.Model.Ajax.extend(
/* @Static*/
{
    init: function(){
        if(!this.className) return;
        this.plural_name = MVC.String.pluralize(this.className);
        this.singular_name =  this.className;
        this._super();
    },
    /**
     * Returns the URL for find all requests
     * @retunn {String}
     */
    find_all_get_url : function(){ return '/'+this.plural_name+'.json'},
    /**
     * When a find comes back successful, callsback with the data converted into instances of this class
     * @param {Object} transport
     * @return {Array} Array of json model instances that get passed to the callback 
     */
    find_all_get_success : function(transport){  //error is either success, complete or failure
        var data = this.json_from_string(transport.responseText);
        return this.convert_response_into_instances(data);
    },

    convert_response_into_instances: function(data) {
        var collection = [];
    	for(var i = 0; i < data.length; i++){
    		var unit = data[i];
            var inst = this.create_as_existing( unit.attributes  );
            if(unit.errors) inst.add_errors(unit.errors);
            collection.push(inst);
    	}
        return collection;
    },

    /**
     * Posts attributes to /plural_name.json.
     * @param {Object} attributes
     */
    create_request: function(attributes){
        var instance = new this(attributes);
        instance.validate()
        if( !instance.valid() ) return instance;
        var params = {};
        params[this.singular_name] = attributes;
        this.request('/'+this.plural_name+'.json', params, {method: 'post'}, instance );
        return instance;
    },
    /**
     * After a successful create request, this gets the id from the header 
     * and returns the new instance.
     * @param {Object} transport
     * @param {Object} callback success callback passed into create
     * @param {Object} instance the instance this call is creating
     * @return {jsonmodel} a new instance
     */
    create_success: function(transport, callback, instance){
          if (/\w+/.test(transport.responseText)) {
            var errors = this.json_from_string(transport.responseText);
            if (errors) instance.add_errors(errors);
          }
    
          // Get ID from the location header if it's there
          if (instance.is_new_record() && transport.status == 201) {
    	  	var id = this.get_id(transport);
            if (!isNaN(id)) instance._setProperty("id", id );
          }
    	  return instance;
    },
    /**
     * Posts data to /plural_name/id.json
     * @param {Number} id the id of the instance we are updating
     * @param {Object} attributes updated attributes
     */
    update_request: function(id, attributes){
        delete attributes.id
        var params = {};
        params[this.singular_name] = attributes;
        var instance = this.create_as_existing(attributes);
        instance.id = id;
        
        instance.validate()
        if( !instance.valid() ) return instance;
        
        this.request('/'+this.plural_name+'/'+id+'.json', params, {method: 'put'}, instance );
    },
    update_success: function(transport, callback, instance){
        if(/\w+/.test(transport.responseText)) {
            var errors = this.json_from_string(transport.responseText);
            if (errors) instance.add_errors(errors);
        }
        return instance;
    },
    /**
     * Returns the delete url
     * @param {Object} id
     * @return {String} /plural_name/id.xml
     */
    destroy_delete_url : function(id){return  '/'+this.plural_name+'/'+id+'.xml' },
    destroy_delete_failure: function(){ return false;},
    destroy_delete_success: function(transport){ return transport.status == 200}
},
{
    
})