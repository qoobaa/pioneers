/**
 * Mouseover and Mouseout sometimes cause unexpected behavior when using nested elements.
 * Mouseenter and mouseleave will only be called when a mouse enters or leaves an element even if
 * it moves over nested elements.
 * <h3>Example</h3>
@code_start
TasksController = MVC.Controller.extend('tasks',{
  mouseenter : function(params){ params.element.style.background = "red" },
  mouseleave : function(params){ params.element.style.background = "" }
})
@code_end
 * <h3>Install</h3>
@code_start
include.plugins('controller/hover')
@code_end
 */
MVC.Controller.Action.EnterLeave = MVC.Controller.Action.Event.extend(
/* @static */
{
    /* matches "(.*?)\\s?(mouseenter|mouseleave)$" */
    match: new RegExp("(.*?)\\s?(mouseenter|mouseleave)$")
},
//Prototype functions
{    
    /**
     * Sets up the new action to be called appropriately
     * @param {String} action
     * @param {Function} f
     * @param {MVC.Controller} controller
     */
    init: function(action_name, callback, className, element){
		//can't use init, so set default members
        this.action = action_name;
        this.callback = callback;
        this.className = className;
        this.element = element
        this.css_and_event();
        var selector = this.selector();
        this[this.event_type]()
    },
    /**
     * Attaches a mouseover event, but checks that the related target is not within the outer element.
     */
    mouseenter : function(){
        new MVC.Delegator(this.selector(), 'mouseover', MVC.Function.bind( function(params){
            //set a timeout and compare position
			var related_target = params.event.relatedTarget;
			if(params.element == related_target || MVC.$E(params.element).has(related_target)) return true;
			this.callback(params);
            
        }, this));
    },
    /**
     * Attaches a mouseout event, but checks that the related target is not within the outer element.
     */
    mouseleave : function(){
        //add myself to hover outs to be called on the mouseout
        new MVC.Delegator(this.selector(), 'mouseout', MVC.Function.bind( function(params){
            //set a timeout and compare position
			var related_target = params.event.relatedTarget;
			if(params.element == related_target || MVC.$E(params.element).has(related_target)) return true;
			this.callback(params);
        }, this));
    }
});


// Idea, and very small amonts of code taken from Brian Cherne <brian@cherne.net>
// http://cherne.net/brian/resources/jquery.hoverIntent.js  
/**
 * Provides hoverenter and hoverleave Controller actions.  
 * 
 * Hoverenter is called only when a user stops moving their mouse over an element.  This is
 * good to use when mouseover is expensive, or would be annoying to the user.
 * 
 * Hoverout is called on mouseout of an element that has had hoverenter called.
 * <h2>Example</h2>
@code_start
TasksController = MVC.Controller.extend('tasks',{
  hoverenter : function(params){ params.element.style.background = "red" },
  hoverleave : function(params){ params.element.style.background = "" }
})
@code_end
 * <h3>Install</h3>
@code_start
include.plugins('controller/hover')
@code_end
 * <h3>Adjusting Sensitivity and Interval</h3>
 * Change the sensitivity or interval to change how quickly a hoverover will take place.
 */
MVC.Controller.Action.Hover = MVC.Controller.Action.Event.extend(
/* @static */
{
    match: new RegExp("(.*?)\\s?(hoverenter|hoverleave|hovermove)$"),
    /**
     * How many pixels the mouse can move and still trigger a hoverenter
     */
    sensitivity: 4,
    /**
     * Time between requests.
     */
    interval: 110,
    /**
     * Stores hover actions by CSS
     */
    hovers : {}
},
/* @prototype */
{    
    /**
     * If the first called, attaches mouseover, mouseout events
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action_name, callback, className, element){
        this.action = action_name;
        this.callback = callback;
        this.className = className;
        this.element = element;
        this.css_and_event();
        var selector = this.selector();
        var data = MVC.Dom.data(element);
        if(!data.custom) data.custom = {}
        if(!data.custom.hovers) data.custom.hovers = {};
        
        if(! data.custom.hovers[ this.selector() ]){
            data.custom.hovers[ this.selector() ] = {};
            new MVC.Delegator(this.selector(), 'mouseover', MVC.Function.bind(this.mouseover , this), element );
            new MVC.Delegator(this.selector(), 'mouseout', MVC.Function.bind( this.mouseout, this), element);
        }
        data.custom.hovers[this.selector()][this.event_type] = this;
    },
    /**
     * Calls hoverenter if there is one.
     * @param {Object} params
     */
	hoverenter : function(params){
         var hoverenter = MVC.Dom.data(params.delegate).custom.hovers[this.selector()]["hoverenter"];
         if(hoverenter) hoverenter.callback(params);
	},
     /**
     * Calls hoverleave if there is one.
     * @param {Object} params
     */
	hoverleave : function(params){
		var hoverleave = MVC.Dom.data(params.delegate).custom.hovers[this.selector()]["hoverleave"];
        if(hoverleave) hoverleave.callback(params);
	},
    hovermove : function(params){
        var hovermove = MVC.Dom.data(params.delegate).custom.hovers[this.selector()]["hovermove"];
        if(hovermove) hovermove.callback(params);
    },
    
    /**
     * Checks if 2 mouse moves are within sensitivity
     */
    check :function(){
        //var diff = this.starting_position.minus(this.current_position);
        //var size = Math.abs( diff.x() ) + Math.abs( diff.y() );
        //if(size < this.Class.sensitivity){
            //fire hover and set as called
            this.called = true;
            this.hoverenter({element: this.save_element, event: this.mousemove_event, delegate: this.delegate}) 
            MVC.Event.stop_observing(this.save_element, "mousemove", this.mousemove);
        //}else{
        //    this.starting_position = this.current_position
        //    this.timer = setTimeout(MVC.Function.bind(this.check, this), this.Class.interval);
        //}
    },
    /**
     * Called on the mouseover. Sets up the check.
     * @param {Object} params
     */
    mouseover : function(params){
		var related_target = params.event.relatedTarget;
		if(params.element == related_target 
           || MVC.$E(params.element).has(related_target)) return true;

		this.called = false;
        
        this.starting_position = MVC.Event.pointer(params.event);
        this.save_element = params.element;
        this.delegate = params.delegate;
        this.mousemove_event = params.event;
        this.mousemove_function = MVC.Function.bind(this.mousemove , this);
        MVC.Event.observe(params.element, "mousemove", this.mousemove_function  );

        this.timer = setTimeout(MVC.Function.bind(this.check, this), this.Class.interval);
        
    },
    /**
     * Updates the current_position of the mosuemove.  Calls hovermove if it's been moved
     * @param {Object} event
     */
    mousemove : function(event){
        if(this.called){
            this.hovermove({element: this.save_element, event: event, delegate: this.delegate})
        }else{
            clearTimeout(this.timer);
            //save event and position
            this.mousemove_event = event;
            this.current_position = MVC.Event.pointer(event);
            //check again 
            this.timer = setTimeout(MVC.Function.bind(this.check, this), this.Class.interval);
        }
        
    },
    /**
     * 
     * @param {Object} params
     */
    mouseout : function(params){
		var related_target = params.event.relatedTarget;
        if(params.element == related_target 
           || MVC.$E(params.element).has(related_target)) return true;
           
        clearTimeout(this.timer);
        MVC.Event.stop_observing(params.element, "mousemove", this.mousemove_function);
        if(this.called){ //call hoverleave
            this.hoverleave({element: this.save_element, event: params.event, delegate: params.delegate})
        }
    }
});



