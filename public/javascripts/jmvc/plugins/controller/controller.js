// submitted by kangax
MVC.Object.is_number = function(o){
    return o &&(  typeof o == 'number' || ( typeof o == 'string' && !isNaN(o) ) );
};

/* 
 * Controllers respond to events. If something happens in your application, be it a click, or
 * a [MVC.Model Model] being updated, a controller should respond to it.
 * <h3>Example</h3>
@code_start
//Instead of:
$('.tasks').click(function(e){ ... })
//do this
TasksController = MVC.Controller.extend('tasks',{
  click: function(params){...}
})
@code_end
 * <h2>Actions</h2>
 * To respond to events, controllers simply name their event handling functions to match
 * an [MVC.Controller.Action Action].  
 *
 * In the previous example, TasksController's click action is matched by the [MVC.Controller.Action.Event Event] Action. 
 * Event matches functions that are combination of CSS selector and event name.  Here's another example:
@code_start
TasksController = MVC.Controller.extend('tasks',{
  ".delete mouseover": function(params){ ... }
})
@code_end
 * <h3>Types of Actions</h3>
 * There are many types of Actions.  By default, Controller will match [MVC.Controller.Action.Event Event] and
 * [MVC.Controller.Action.Subscribe Subscribe] actions.  To match other actions, include their plugins.
 * 
<table>
	<tr>
        <th>Action</th><th>Format</th><th>Description</th>
    </tr>
    <tbody  style="font-size: 10px;">
    <tr>
        <td>[MVC.Controller.Action.Event Event]</td>
        <td>[CSS] [change|click|...]</td>
        <td>Matches standard DOM events</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Subscribe Subscribe]</td>
        <td>[OpenAjax.hub event] subscribe</td>
        <td>Subscribes this action to OpenAjax hub.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Drag Drag]</td>
        <td>[CSS] [dragstart|dragging|...]</td>
        <td>Matches events on a dragged object</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Drop Drop]</td>
        <td>[CSS] [dropadd|dropover|...]</td>
        <td>Matches events on a droppable object</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.EnterLeave EnterLeave]</td>
        <td>[CSS] [mouseenter|mouseleave.]</td>
        <td>Similar to mouseover, mouseout, but handles nested elements.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Hover Hover]</td>
        <td>[CSS] [hoverenter|hoverleave.]</td>
        <td>Similar to mouseenter, but only gets called if the user stops on an element.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Lasso Lasso]</td>
        <td>[CSS] [lassostart|...]</td>
        <td>Allows you to lasso elements.</td>
    </tr>
    <tr>
        <td>[MVC.Controller.Action.Selectable Selectable]</td>
        <td>[CSS] [selectadd|...]</td>
        <td>Matches events on elements that can be selected by the lasso.</td>
    </tr>
    </tbody>
</table>
 * 
 * <h2>Naming Controllers</h2>
 * Controllers use their name to limit the DOM they act upon.  Depending if the controller name is 
 * plural, singular or main, it changes which elements it responds to.
 * <h3>Singular Controllers</h3>
 * Singluar controllers respond to events in or on an element with an id that matches the controller name.
@code_start
//matches &lt;div id="file_manager"&gt;&lt;/div&gt;
FileManagerController = MVC.Controller.extend('file_manager')
@code_end
 * <h3>Plural Controllers</h3>
 * Plural controllers respond to events in or on elements with classNames that match the singular 
 * controller name.
@code_start
//matches &lt;div class="task"&gt;&lt;/div&gt;
TasksController = MVC.Controller.extend('tasks')
@code_end
 * If you want to match events on an element with the id, add '#' to the start of your action.  For example:
@code_start
TasksController = MVC.Controller.extend('tasks',{
  click : function(){ .. }     //matches &lt;div class="task"&gt;&lt;/div&gt;
  "# click" : function(){ .. } //matches &lt;div id="tasks"&gt;&lt;/div&gt;
})
@code_end
 * <h3>Main Controllers</h3>
 * Controllers with the name 'main' can match events anywhere in the DOM.  
 * 
 * <h2>Params</h2>
 * Controller actions get called with an instance of [MVC.Controller.Params].  Params
 * provide aditional functionality based on the param data.  Killing events is a good example.
 * Some actions get called with classes that inherit from MVC.Controller.Params.
 * Check your action's params for the data that gets passed to your event handling functions.
 */
MVC.Controller = MVC.Class.extend(
/* @Static*/
{
    /*
     * Looks for controller actions and hooks them up to delegator
     */
    init: function(){
        if(!this.className) return;
        this.singularName =  MVC.String.singularize(this.className);
        if(!MVC.Controller.controllers[this.className]) MVC.Controller.controllers[this.className] = [];
        MVC.Controller.controllers[this.className].unshift(this);
        var val, act;
        
        if(!this.modelName)
            this.modelName = MVC.String.is_singular(this.className) ? this.className : MVC.String.singularize(this.className)
        if(this._should_attach_actions)
            this._create_actions();
        //load tests
        if(include.get_env() == 'test'){
            var path = MVC.root.join('test/functional/'+this.className+'_controller_test.js');
    		
    		var exists = include.check_exists(path);
    		if (exists) {
				MVC.Console.log('Loading: "test/functional/' + this.className + '_controller_test.js"');
                include('../test/functional/'+this.className+'_controller_test.js');
			}
			else {
				MVC.Console.log('Test Controller not found at "test/functional/' + this.className + '_controller_test.js"');
			}
        }
        this._path =  include.get_path().match(/(.*?)controllers/)[1]+"controllers";
    },
    _should_attach_actions : true,
    _create_actions : function(){
        this.actions = {};
        for(var action_name in this.prototype){
    		val = this.prototype[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < MVC.Controller.actions.length; a++){
                    act = MVC.Controller.actions[a];
                    if(act.matches(action_name)){
                        var callback = this.dispatch_closure(action_name);
                        this.actions[action_name] =new act(action_name, callback, this.className, this._element, this._events);
                    }
                }
            }
	    }
    },
    dispatch_closure: function(f_name){
        return MVC.Function.bind(function(params){
            params = params || {};
            params.action = f_name;
            params.controller = this;
            params = params.constructor == MVC.Controller.Params ? params : new MVC.Controller.Params(params)
			return this.dispatch(f_name,  params );
		},this);
    },
    /**
     * Calls the Controller prototype function specified by action_name with the given params.
     * @param {String} action_name The name of the action to be called.
     * @param {Controller.Params} params The params the action will be called with.
     */
    dispatch: function(action_name, params){
		if(!action_name) action_name = 'index';
		
		if(typeof action_name == 'string'){
			if(!(action_name in this.prototype) ) throw 'No action named '+action_name+' was found for '+this.Class.className+' controller.';
		}else{ //action passed TODO:  WHERE IS THIS USED?
			action_name = action_name.name;
		}
        var instance = this._get_instance(action_name , params);
		return this._dispatch_action(instance,action_name, params );
	},
    _get_instance : function(action_name,  params){
          return new this(action_name, params);
    },
	_dispatch_action: function(instance, action_name, params){
        if(!this._listening) return;
        instance.params = params;
		instance.action_name = action_name;
        return instance[action_name](params);
	},
    controllers : {},
    actions: [],
    publish: function(message, params){
        //var subscribers = MVC.Controller.Action.Subscribe.events[message];
        //if(!subscribers) return;
        //for(var i =0 ; i < subscribers.length; i++){
        //    subscribers[i](params);
        //}
        OpenAjax.hub.publish(message, params);
    },
    get_controller_with_name_and_action: function(controller_name, action) {
        var controllers = MVC.Controller.controllers[controller_name];
        if(!controllers) return null;
		for(var i = 0; i < controllers.length; i++) {
            var controller = controllers[i];
            if (controller.prototype[action]) return controller;
        }
        return null;
     },
     /**
      * The name of the model this controller can uses for param functions like element_instance
      */
     modelName: null,
     /**
      * A flag if controllers can respond to events.
      */
     _listening : true,
     _events : MVC.Delegator.events,
     _element : document.documentElement
},
/* @Prototype*/
{
    /*
     * Returns a function that when called, calls the action with parameters passed to the function. 
     * This is very useful for creating callbacks for Ajax functionality. 
     * The callback is called on the same controller instance that created the callback. 
     * This allows you to easily pass objects between request and response without resorting to closures. 
     * Example:
@code_start
Controller('todos',{
   "a click" : function(params){ 
      this.element = params.element;
	  this.element.innerHTML = 'deleting ...';
	  new Ajax('delete', {onComplete: this.continue_to('deleted')}
   },
   deleted : function(response){
      this.element.parentNode.removeChild(this.element);
   }
});
@code_end
     * @param {String} action Name of prototype function you want called
     * @return {Function} function that when called, directs to another controller function
     */
    continue_to :function(action){
		var args = MVC.Array.from(arguments)
        var action = args.shift();
		if(typeof this[action] != 'function'){ throw 'There is no action named '+action+'. ';}
		return MVC.Function.bind(function(){
			this.action_name = action;
			this[action].apply(this, args.concat(MVC.Array.from(arguments)));
		}, this);
	},
    /**
     * Calls an action after some delay
     * @param {Object} delay
     * @param {Object} action_name
     * @param {Object} params
     */
    delay: function(delay, action_name, params){
		if(typeof this[action_name] != 'function'){ throw 'There is no action named '+action_name+'. ';}
		
        return setTimeout(MVC.Function.bind(function(){
			this.Class._dispatch_action(this, action_name ,  params )
		}, this), delay );
    },
    /**
     * Publishes a message to OpenAjax.hub.  Other controllers 
     * @param {String} message
     * @param {Object} data
     */
    publish: function(message, data){
        this.Class.publish(message,data);
    }
});



/*
 * MVC.Controller.Action is and abstract base class.
 * Controller Action classes are used to match controller prototype functions. 
 * Inheriting classes must provide a static matches function.
 * 
 * When a new controller is created, it iterates through its prototype functions and tests
 * each action if it matches.  If there is a match, the controller creates a new action.
 * 
 * The action is responsible to callback the function when appropriate.  It typically uses
 * dispatch_closure to call functions appropriately.  
 */
MVC.Controller.Action = MVC.Class.extend(
/* @Static */
{
    /**
     * If the class has provided a matches function, adds this class to the list of 
     * controller actions.
     */
    init: function(){
        if(this.matches) MVC.Controller.actions.push(this);
    }
},
/* @Prototype */
{
    /**
     * Called with prototype functions that match this action.
     * @param {String} action_name
     * @param {Function} f
     * @param {MVC.Controller} controller
     */
    init: function(action_name, callback, className, element){
        this.action = action_name;
        this.callback = callback;
        this.className = className;
        this.element = element
    },
    /**
     * Disables an action.
     */
    destroy: function(){
        
    }
});
/**
 * Subscribes to an OpenAjax.hub event.
 * <h3>Example</h3>
@code_start javascript
TasksController = MVC.Controller.extend('tasks',
{
  "task.create subscribe" : function(params){
     var published_data = params.data; //published data always in params.data
  }
});
@code_end
 */
MVC.Controller.Action.Subscribe = MVC.Controller.Action.extend(
/* @Static*/
{
    
    match: new RegExp("(.*?)\\s?(subscribe)$"),
    /**
     * Matches "(.*?)\\s?(subscribe)$"
     * @param {String} action_name
     */
    matches: function(action_name){
        return this.match.exec(action_name);
    }
},
/* @Prototype*/
{
    /**
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action_name, callback, className, element){
        this._super(action_name, callback, className, element);
        this.message();
        this.subscription = OpenAjax.hub.subscribe(this.message_name, MVC.Function.bind(this.subscribe, this) );
    },
    /**
     * Gets the message name from the action name.
     */
    message: function(){
        this.parts = this.action.match(this.Class.match);
        this.message_name = this.parts[1];
    },
    subscribe : function(event_name, data){
        var params = data || {};
        params.event_name = event_name
        this.callback(params)
    },
    destroy : function(){
        OpenAjax.hub.unsubscribe(this.subscription)
        this._super();
    }
})
/*
 * Default event delegation based actions
 */
MVC.Controller.Action.Event = MVC.Controller.Action.extend(
/* @Static*/
{
    /**
     * Matches change, click, contextmenu, dblclick, keydown, keyup, keypress, mousedown, mousemove, mouseout, mouseover, mouseup, reset, resize, scroll, select, submit, dblclick, focus, blur, load, unload
     * @param {Object} action_name
     */
    match: new RegExp("^(?:(.*?)\\s)?(change|click|contextmenu|dblclick|keydown|keyup|keypress|mousedown|mousemove|mouseout|mouseover|mouseup|reset|resize|scroll|select|submit|dblclick|focus|blur|load|unload)$"),
    /*
     * Matches change, click, contextmenu, dblclick, keydown, keyup, keypress, mousedown, mousemove, 
     * mouseout, mouseover, mouseup, reset, resize, scroll, select, submit, dblclick, 
     * focus, blur, load, unload
     * @return {Boolean} true if a prototype function name matches an action.
     */
    matches: function(action_name){
        return this.match.exec(action_name);
    }
},
/* @Prototype*/
{    
    init: function(action_name, callback, className, element){
        this._super(action_name, callback, className, element);
        this.css_and_event();
        
        var selector = this.selector();
        if(selector != null){
            this.delegator = new MVC.Delegator(selector, this.event_type, callback, element );
        }
    },
    /*
     * Splits the action name into its css and event parts.
     */
    css_and_event: function(){
        this.parts = this.action.match(this.Class.match);
        this.css = this.parts[1] || "";
        this.event_type = this.parts[2];
    },
    /*
     * Deals with main controller specific delegation (blur and focus)
     */
    main_controller: function(){
	    if(!this.css && MVC.Array.include(['blur','focus'],this.event_type)){
            MVC.Event.observe(window, this.event_type, MVC.Function.bind(function(event){
                this.callback({event: event, element: window})
            }, this))
            return;
        }
        return this.css;
    },
    /*
     * Handles a plural controller name
     * @return {String} the css with the controller name included
     */
    plural_selector : function(){
		if(this.css == "#" || this.css.substring(0,2) == "# "){
			var newer_action_name = this.css.substring(2,this.css.length)
            if(this.element == document.documentElement){
                return '#'+this.className + (newer_action_name ?  ' '+newer_action_name : '') ;
            }else{
                return (newer_action_name ?  ' '+newer_action_name : '') ;
            }
		}else{
            //if(this.element == document.documentElement){
			    return '.'+MVC.String.singularize(this.className)+(this.css? ' '+this.css : '' );
            //}else{
            //    return this.css;
            //}
		}
	},
    /*
     * Handles a singular controller name
     * @return {String} the css with the controller name included
     */
    singular_selector : function(){
        if(this.element == document.documentElement)
            return '#'+this.className+(this.css? ' '+this.css : '' );
        else
            return this.css;
    },
    /*
     * Gets the full css selector for this action
     * @return {String/null} returns a string css if Delegator should be used, null if otherwise.
     */
    selector : function(){
        if(MVC.Array.include(['load','unload','resize','scroll'],this.event_type)){
            MVC.Event.observe(window, this.event_type, MVC.Function.bind(function(event){
                this.callback({event: event, element: window})
            }, this));
            return;
        }
        //if(!this.className){
        //    this.css_selector = this.css
        //}else 
        if(this.className == 'main') 
            this.css_selector = this.main_controller();
        else
            this.css_selector = MVC.String.is_singular(this.className) ? 
                this.singular_selector() : this.plural_selector();
        return this.css_selector;
    },
    destroy : function(){
        if(this.delegator) this.delegator.destroy();
        this._super();
    }
});

/* @Constructor
 * Instances of Controller.Params are passed to Event based actions.
 * 
 * <h3>Example</h3>
@code_start
MVC.Controller.extend('todos', {
   mouseover : function(params){ 
      <span class="magic">params</span>.element.style.backgroundColor = 'Red';
   },
   mouseout : function(params){
      <span class="magic">params</span>.element.style.backgroundColor = '';
      <span class="magic">params</span>.event.stop();
   },
   "img click" : function(params){
   	  <span class="magic">params</span>.class_element().parentNode.removeSibiling(params.class_element());
   }
})
@code_end
 * @init Creates a new Controller.Params object.
 * @param {Object} params An object you want to pass to a controller
 */

MVC.Controller.Params = function(params){
	var params = params || {};
    var killed = false;
	this.kill = function(){
		killed = true;
        if(params.event && params.event.kill) params.event.kill();
	};
	this.is_killed = function(){return params.event.is_killed ?  params.event.is_killed() :  killed ;};
    
    for(var thing in params){
		if( params.hasOwnProperty(thing) ) this[thing] = params[thing];
	}
    this.constructor = MVC.Controller.Params;
};

/* @Prototype*/
MVC.Controller.Params.prototype = {
	/*
	 * Returns data in a hash for a form.
	 * @return {Object} Nested form data.
	 */
    form_params : function(){
		var data = {};
		if(this.element.nodeName.toLowerCase() != 'form') return data;
		var els = this.element.elements, uri_params = [];
		for(var i=0; i < els.length; i++){
			var el = els[i];
			if(el.type.toLowerCase()=='submit') continue;
			var key = el.name || el.id, key_components = key.match(/(\w+)/g), value;
            if(!key) continue;     
			/* Check for checkbox and radio buttons */
			switch(el.type.toLowerCase()) {
				case 'checkbox':
				case 'radio':
					value = !!el.checked;
					break;
				default:
					value = el.value;
					break;
			}
			//if( MVC.Object.is_number(value) ) value = parseFloat(value);
			if( key_components.length > 1 ) {
				var last = key_components.length - 1;
				var nested_key = key_components[0].toString();
				if(! data[nested_key] ) data[nested_key] = {};
				var nested_hash = data[nested_key];
				for(var k = 1; k < last; k++){
					nested_key = key_components[k];
					if( ! nested_hash[nested_key] ) nested_hash[nested_key] ={};
					nested_hash = nested_hash[nested_key];
				}
				nested_hash[ key_components[last] ] = value;
			} else {
		        if (key in data) {
		        	if (typeof data[key] == 'string' ) data[key] = [data[key]];
		         	data[key].push(value);
		        }
		        else data[key] = value;
			}
		}
		return data;
	},
    /*
     * Returns the class element for the element selected
     * @return {HTMLElement} the element that shares the controller's id or classname
     */
	class_element : function(){
		var start = this.element;
		var className = this._className();
        var has_class = function(el){
            var parts = el.className.split(" ")
            for(var i =0; i < parts.length; i++){
                if(parts[i] == className) return true;
            }
            return false;
        }
        while(start && !has_class(start) ){
			start = start.parentNode;
			if(start == document) return null;
		}
		return MVC.$E(start);
	},
    /*
     * Returns if the event happened directly on the element in the params.
     * @return {Boolean} true if the event's target is the element, false if otherwise.
     */
	is_event_on_element : function(){ return this.event.target == this.element; },
    _className : function(){
		return this.controller.singularName;
	},
    /**
     * Returns the model instance associated with dom this action acted on.  
     * It finds the class_element, then looks if it has an id that matches
     * <i>modelName</i>_<i>instanceId</i>.  It uses instanceID to look
     * up the instnace in the model's [MVC.Store store].
     * If you change the controller's [MVC.Controller.static.modelName modelName]
     * it will use a different model to look up the data.
     */
    element_instance : function(){
        var ce, matches, model, modelName = this.controller.modelName, id,  matcher = new RegExp("^"+modelName+"_(.*)$");
        if(! (model=MVC.Model.models[modelName])  ) throw "No model for the "+ this.controller.className+ " controller!";
        ce = this.class_element();
        //first check the class
        return Model._find_by_element(ce, modelName, model)
    }
};

if(!MVC._no_conflict && typeof Controller == 'undefined'){
	Controller = MVC.Controller
}