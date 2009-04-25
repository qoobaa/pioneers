/**
 * Models wrap an application's data layer.  This is done in two ways:
 * <ul>
 *     <li>Requesting data from and interacting with services</li>
 *     <li>Wrap service data with a domain-specific representation</li>
 * </ul>
 * A strong model layer keeps your code organized and maintainable, but it typically
 * is the least developed part of the MVC architecture.  This guide introduces you
 * to the basics of how a model should work.  Note that much of what it demonstrates could be 
 * done easier with a different base Model class such as [MVC.Model.Ajax|Model.Ajax].
 * <h2>Services</h2>
 * Your models should be the way you communicate with the server.  Instead of using 
 * Ajax/XHR requests directly, perform those requests in a model.  
 * 
 * For example:
@code_start
//instead of:
new Ajax('/tasks.json', {onComplete: find_tasks_next_week })
//do this:
Task.find('all', find_tasks_next_week)

//instead of
new Ajax('/tasks/'+id+'/complete.json',{onComplete: task_completed})
//do this:
task.complete(task_completed)
@code_end
Typically there are two types of services any application connects to:
<ul>
     <li>Group - operate on many instances.  Ex: getting all tasks for a user.</li>
     <li>Singular - operate on one instance. Ex: completing a task. </li>
</ul>
For these types of services, you will want to build them in slightly different ways.
<h3>Group Services</h3>
Group services that request data should look like the following:
@code_start
Task = MVC.Model.extend('task',
{
  find : function(params, callback){
    new Ajax('/tasks.json', {onComplete: MVC.Function.bind(function(response){
        //get data into the right format for create_as_existing
        var data =  eval('('+json_string+')');     
        //call create_as_existing to create instances
        var instances = this.create_many_as_existing(data);
        //call back with data.
        callback(instances)
    }) })
  }
},
{})
@code_end
Note this function uses [MVC.Model.static.create_many_as_existing|create_many_as_existing]
to create new instances.  By using create_many_as_existing, the model will also publish
[OpenAjax|OpenAjax.hub] messages that can be listed to by controllers.
<h3>Singular Service</h3>
Singular services that minipulate data might look like:
@code_start
Task = MVC.Model.extend('task',
{},
{
  complete: function(callback){
    new Ajax('/tasks/'+this.id+'/complete.json', {onComplete: MVC.Function.bind(function(response){
        this.completed = true;
        callback(this)
        this.publish("completed")
    }) })
  }
})
@code_end
<h2>Wrapping Data</h2>
Now that you have instances, you can wrap their data in useful ways.  This is done by adding
functions to the Model's prototype methods.  For example:
@code_start
Task = MVC.Model.extend('task',
{},
{
  status : function(){
    return this.complete ? "COMPLETE" : "INCOMPLETE"
  }
})
@code_end
<h3>P</h3>
 * <ul>
 *     <li>Model.find_one(params, callbacks)</li>
 *     <li>Model.find_all(params, callbacks)</li>
 *     <li>Model.create(attributes, callbacks)</li>
 *     <li>Model.update(id, attributes, callbacks)</li>
 *     <li>Model.destroy(id, callbacks)</li>
 * </ul>
 * 
 * <h2>Using Stores</h2>
 * Model keeps all instances of a class in a [MVC.Store|Store].  Stores provide an easy way of
 * looking up instances by id.  
 * 
 * <h2>Using OpenAjax</h2>
 * 
 */
MVC.Model = MVC.Class.extend(
/* @Static*/
{
	store_type: MVC.Store,
    /**
     * Finds objects in this class
     * @param {Object} id the id of a object
     * @param {Object} params params passed to the 
     * @param {Object} callbacks a single onComplete callback or a hash of callbacks
     * @return {Model} will return instances of the model if syncronous
     */
	init: function(){
		if(!this.className) return;
        MVC.Model.models[this.className] = this;
        this.store = new this.store_type(this);
	},
    find : function(id, params, callbacks){
        if(!params)  params = {};
        if(typeof params == 'function') {
            callbacks = params;
            params = {};
        }
        if(id == 'all'){
            return this.create_many_as_existing( this.find_all(params, callbacks)  );
        }else{
            if(!params[this.id] && id != 'first')
                params[this.id] = id;
            return this.create_as_existing( this.find_one(id == 'first'? null : params, callbacks) );
        }
    },
    asynchronous : true,
    /**
     * Used to create an existing object from attributes
     * @param {Object} attributes
     * @return {Model} an instance of the model
     */
    create_as_existing : function(attributes){
        if(!attributes) return null;
        if(attributes.attributes) attributes = attributes.attributes();
        var inst = new this(attributes);
        inst.is_new_record = this.new_record_func;
        
        this.publish("create.as_existing", {data: inst});
        
        //if(MVC.Controller) MVC.Controller.publish(this.className + ":create_as_existing", );
        return inst;
    },
    /**
     * Creates many instances
     * @param {Object} instances
     * @return {Array} an array of instances of the model
     */
    create_many_as_existing : function(instances){
        if(!instances) return null;
        var res = [];
        for(var i =0 ; i < instances.length; i++)
            res.push( this.create_as_existing(instances[i]) );  
        return res;
    },
    /**
     * The name of the id field.  Defaults to 'id'
     */
    id : 'id', //if null, maybe treat as an array?
    new_record_func : function(){return false;},
    validations: [],
    has_many: function(){
        for(var i=0; i< arguments.length; i++){
            this._associations.push(arguments[i]);
        }
    },
    belong_to: function(){
        for(var i=0; i< arguments.length; i++){
            this._associations.push(arguments[i]);
        }
    },
    _associations: [],
    /**
     * Takes an element ID like 'todo_5' and returns '5'
     * @param {Object} element_id
     * @return {String} 
     */
    element_id_to_id: function(element_id){
        var re = new RegExp(this.className+'_', "i");
        return element_id.replace(re, '');
    },
    /**
     * Returns an instance if one can be found in the store.
     * @param {Object} el
     */
	find_by_element: function(el){
		return this._find_by_element(MVC.$E(el), this.className, this);
	},
    _find_by_element: function(ce, modelName, model){
        var matches, id,  matcher = new RegExp("^"+modelName+"_(.*)$");
        if(ce && ce.id && (matches= ce.id.match(matcher) ) && matches.length > 1){
            id = matches[1]
        }else{
            id = ce.has_class(matcher)[1]
        }
        return model.store.find_one(id);
    },
    /**
     * Adds an attribute to the list of attributes for this class.
     * @param {String} property
     * @param {String} type
     */
    add_attribute : function(property, type){
        if(! this.attributes[property])
            this.attributes[property] = type;
        if(! this.default_attributes[property])
            this.default_attributes[property] = null;
    },
    attributes: {},
    default_attributes: {},
    /**
     * Used for converting callbacks to to seperate failure and succcess
     * @param {Object} callbacks
     */
    _clean_callbacks : function(callbacks){
        if(!callbacks) {
            callbacks = function(){};
        }
        if(typeof callbacks == 'function')
            return {onSuccess: callbacks, onFailure: callbacks};
        if(!callbacks.onSuccess && !callbacks.onComplete) throw "You must supply a positive callback!";
        if(!callbacks.onSuccess) callbacks.onSuccess = callbacks.onComplete;
        if(!callbacks.onFailure && callbacks.onComplete) callbacks.onFailure = callbacks.onComplete;
		return callbacks;
    },
    models : {},
    /**
     * Creates a callback function that will call back the function on the static class.
     * If other arguments are passed, they will be added before the parameters used to call the callback.
     * @param {String} fname
     * @return {Function} a callback function useful for Ajax calls
     */
    callback : function(fname){
        var f = typeof fname == 'string' ? this[fname] : fname;
        var args = MVC.Array.from(arguments);
        args.shift();
        args.unshift(f, this);
        return MVC.Function.bind.apply(null, args);
    },
    /**
     * Publishes to open ajax hub.  Always adds the className.event
     * @param {Object} event
     * @param {Object} data
     */
    publish : function(event, data){
        OpenAjax.hub.publish(   this.className + "."+event, data);
    },
    /**
     * Namespaces are used to publish messages to a specific namespace.
     * @code_start
     * Org.Task = MVC.Model.extend('task',{
     *   namespace: "org"
     * },
     * {
     *   update: function(){
     *     this.publish("update") // publishes 'this' to 'org.task.update'
     *   }
     * })
     * @code_end
     */
    namespace : null
},
/* @Prototype*/
{   
    /**
     * Creates, but does not save a new instance of this class
     * @param {Object} attributes -> a hash of attributes
     */
    init : function(attributes){
        //this._properties = [];
        this.errors = [];
        
        this.set_attributes(this.Class.default_attributes || {});
        this.set_attributes(attributes);
    },
    /**
     * Sets a hash of attributes for this instance
     * @param {Object} attributes
     */
    set_attributes : function(attributes)
    {
        for(var key in attributes){ 
			if(attributes.hasOwnProperty(key)) 
				this._setAttribute(key, attributes[key]);
		}
        return attributes;
    }, 
    /**
     * Sets the attributes on this instance and calls save.
     * @param {Object} attributes
     * @param {Object} callback
     */
    update_attributes : function(attributes, callback)
    {
        this.set_attributes(attributes);
        return this.save(callback);
    },
    valid : function() {
      	return  this.errors.length == 0;
    },
    /**
     * Validates this instance
     */
    validate : function(){
        //run validate function and any error functions  
        
    },
    _setAttribute : function(attribute, value) {
        if (MVC.Array.include(this.Class._associations, attribute))
          this._setAssociation(attribute, value);
        else
          this._setProperty(attribute, value);
    },
    /**
     * Checks if there is a set_<i>property</i> value.  If it returns true, lets it handle; otherwise
     * saves it.
     * @param {Object} property
     * @param {Object} value
     */
    _setProperty : function(property, value) {  
        if(this["set_"+property] && ! this["set_"+property](value) ){
            return;
        }
        //add to cache, this should probably check that the id isn't changing.  If it does, should update the cache
        var old = this[property]
        
            

        this[property] = MVC.Array.include(['created_at','updated_at'], property) ? MVC.Date.parse(value) :  value;
        if(property == this.Class.id && this[property]){
			this.is_new_record = this.Class.new_record_func;
			if(this.Class.store){
				if(!old){
                	this.Class.store.create(this);
	            }else if(old != this[property]){
	                this.Class.store.destroy(old);
	                this.Class.store.create(this);
	            }
			}
            
        }
        //if (!(MVC.Array.include(this._properties,property))) this._properties.push(property);  
        
        this.Class.add_attribute(property, MVC.Object.guess_type(value)  );
    },
    _setAssociation : function(association, values) {
        this[association] = function(){
            if(! MVC.String.is_singular(association ) ) association = MVC.String.singularize(association);
            var associated_class = window[MVC.String.classize(association)];
            if(!associated_class) return values;
            return associated_class.create_many_as_existing(values);
        }
        
    },
    /**
     * Returns a list of attribues.
     * @return {Object}
     */
    attributes : function() {
        var attributes = {};
        var cas = this.Class.attributes;
        for(var attr in cas){
            if(cas.hasOwnProperty(attr) ) attributes[attr] = this[attr];
        }
        //for (var i=0; i<this.attributes.length; i++) attributes[this._properties[i]] = this[this._properties[i]];
        return attributes;
    },
    /**
     * Returns if the instance is a new object
     */
    is_new_record : function(){ return true;},
    /**
     * Saves the instance
     * @param {optional:Function} callbacks onComplete function or object of callbacks
     */
    save: function(callbacks){
        var result;
        this.errors = [];
        this.validate();
        if(!this.valid()) return false;
        result = this.is_new_record() ? 
            this.Class.create(this.attributes(), callbacks) : 
            this.Class.update(this[this.Class.id], this.attributes(), callbacks);

        this.is_new_record = this.Class.new_record_func;
        return true;
    },
    /**
     * Destroys the instance
     * @param {optional:Function} callback or object of callbacks
     */
    destroy : function(callback){
        this.Class.destroy(this[this.Class.id], callback);
        this.Class.store.destroy(this[this.Class.id]);
    },
    add_errors : function(errors){
        if(errors) this.errors = this.errors.concat(errors);
    },
    _resetAttributes : function(attributes) {
        this._clear();
        /*for (var attr in attributes){
    		if(attributes.hasOwnProperty(attr)){
    			this._setAttribute(attr, attributes[attr]);
    		}
    	}*/
    },
    _clear : function() {
        var cas = this.Class.default_attributes;
        for(var attr in cas){
            if(cas.hasOwnProperty(attr) ) this[attr] = null;
        }
    },
    /**
     * Returns the suggested element id for this instance
     */
    element_id : function(){
        return this.Class.className+'_'+this[this.Class.id];
    },
    /**
     * Returns the element found by using element_id for this instance
     */
    element : function(){
        return MVC.$E(this.element_id());;
    },
    elements : function(){
          return MVC.Query("."+this.element_id());
    },
    /**
     * Publishes to open ajax hub
     * @param {String} event
     * @param {optional:Object} data if missing, uses the instance in {data: this}
     */
    publish : function(event, data){
        this.Class.publish(event, data||{data: this});
    },
    /**
     * Creates a callback function that will call back the function on the instance.
     * If other arguments are passed, they will be added before the parameters used to call the callback.
     * @param {String} fname
     * @return {Function} a callback function useful for Ajax calls
     */
    callback : function(fname){
        var f = typeof fname == 'string' ? this[fname] : fname;
        var args = MVC.Array.from(arguments);
        args.shift();
        args.unshift(f, this);
        return MVC.Function.bind.apply(null, args);
    }
});


MVC.Object.guess_type = function(object){
    if(typeof object != 'string'){
        if(object == null) return typeof object;
        if( object.constructor == Date ) return 'date';
        if(object.constructor == Array) return 'array';
        return typeof object;
    }
    //check if true or false
    if(object == 'true' || object == 'false') return 'boolean';
    if(!isNaN(object)) return 'number'
    return typeof object;
}

if(!MVC._no_conflict && typeof Model == 'undefined'){
	Model = MVC.Model;
}