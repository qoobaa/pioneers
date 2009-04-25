/**
 * Lasso and [MVC.Controller.Action.Selectable Selectables] let users select elements by dragging a box across 
 * an element.  To use the lasso, you must have a lasso action on the element you want to drag in.
 * 
 * You can use one of the following event names to start a lasso:
<table class='options'>
    <tr><th>Event</th><th>Description</th></tr>
    <tr>
        <td>lassostart</td>
        <td>Called when a lasso drag starts.</td>
    </tr>
    <tr>
        <td>lassomove</td>
        <td>Called with every lasso move.</td>
    </tr>
    <tr>
        <td>lassoend</td>
        <td>Called when the lasso is released.</td>
    </tr>
</table>
 * 
 * For more information on how Lasso works read [MVC.Lasso]
 * <h3>Install</h3>
@code_start
include.plugins('controller/lasso')
@code_end
 * <h3>Potential Issues</h3>
 * If IE lasso area isn't responding, try setting its position to relative.
 */
MVC.Controller.Action.Lasso = MVC.Controller.Action.Event.extend(
/* @static */
{
    /**
     * Matches "(.*?)\\s?(lassostart|lassoend|lassomove)$"
     */
    match: new RegExp("(.*?)\\s?(lassostart|lassoend|lassomove)$"),
    mousemove : function(event){
        if(!MVC.Lasso.current ) return;  //do nothing if nothing is being dragged.
        var current = MVC.Lasso.current;
        var pointer = MVC.Event.pointer(event);
        if(current._start_position && current._start_position.equals(pointer)) return;
        MVC.Delegator.add_kill_event(event);
        event.kill();
        MVC.Lasso.current.draw(pointer, event); //update draw
        return false;
    },
    mouseup : function(event){
        MVC.Delegator.add_kill_event(event);
        //if there is a current, we should call its dragstop
        if(MVC.Lasso.current && MVC.Lasso.current.moved){
            MVC.Lasso.current.end(event);
    		MVC.Droppables.clear();
        }
    
        MVC.Lasso.current = null;
        MVC.Event.observe(document, 'mousemove', MVC.Controller.Action.Lasso.mousemove)
        MVC.Event.observe(document, 'mouseup', MVC.Controller.Action.Lasso.mouseup);
    }
},
/* @prototype */
{    
    /**
     * Creates the Lasso action
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action_name, callback, className, element){
		//can't use init, so set default members
        this.action = action_name;
        this.callback = callback;
        this.className = className;
        this.element = element
        this.css_and_event();
        var selector = this.selector();
		var jmvc = MVC.Delegator.jmvc(this.element)
        if(!jmvc.custom) jmvc.custom = {};
        if(!jmvc.custom.lasso) jmvc.custom.lasso = {};
        var lasso = jmvc.custom.lasso;
        //If the selector has already been added, just add this action to its list of possible action callbacks
		if(lasso[selector]) {
            lasso[selector].callbacks[this.event_type] = callback;
            return;
        }
		//create a new mousedown event for selectors that match our mouse event
        lasso[selector] = 
			new MVC.Delegator(selector, 'mousedown', MVC.Function.bind(this.mousedown, this, element), element);
        lasso[selector].callbacks = {};
        lasso[selector].callbacks[this.event_type] = callback;
    },
	/**
	 * Called when someone mouses down on a draggable object.
	 * Gathers all callback functions and creates a new Lasso.
	 */
	mousedown : function(element, params){
       var jmvc= MVC.Delegator.jmvc(element);
       if(jmvc.responding == false) return;
       var lasso = jmvc.custom.lasso
       MVC.Object.extend(params, lasso[this.selector()].callbacks)
	   MVC.Lasso.current = new MVC.Lasso(params);
       params.event.prevent_default();
       MVC.Event.observe(document, 'mousemove', MVC.Controller.Action.Lasso.mousemove)
       MVC.Event.observe(document, 'mouseup', MVC.Controller.Action.Lasso.mouseup);
	   return false;
	}
});
/**
 * @constructor MVC.Lasso
 * Blah
 * @hide 
 * @init abc
 */
MVC.Lasso = function(params){
    this.element = params.element; 		//the element that has been clicked on
    this.moved = false;					//if a mousemove has come after the click
    this._cancelled = false;			//if the drag has been cancelled
	

	
	//Add default functions to be called.
    this.lassostart = params.lassostart || MVC.Lasso.k;
    this.lassoend = params.lassoend || MVC.Lasso.k;
    this.lassomove = params.lassomove || MVC.Lasso.k;
};

MVC.Lasso.k = function(){};

MVC.Lasso.prototype = 
/* @prototype */
{
    /**
     * 
     */
    style_element : function(){
		var s = this.lasso_element.style;
		s.position = 'absolute';
		//s.display = 'none'
		s.border="dotted 1px Gray";
		s.zIndex = 1000;
	},
    /**
     * 
     * @param {Object} event
     */
	position_lasso : function(event){
		var current = MVC.Event.pointer(event);
		//find the top left event
		this.top = current.top() < this.start_position.top() ? current.top() : this.start_position.top();
		this.left = current.left() < this.start_position.left() ? current.left() : this.start_position.left();
		this.height = Math.abs( current.top() - this.start_position.top()  );
		this.width = Math.abs( current.left() - this.start_position.left()  );

		var s = this.lasso_element.style;
        s.top =  this.top+"px";
        s.left =  this.left+"px";	
		s.width = this.width+"px"
		s.height = this.height+"px"
	},
	/**
     * Called the first time we start dragging.
     * This will call drag start with MVC.Controller.LassoParams
     * @param {Object} event
     */
	start: function(event){
		this.moved = true;					//we have been moved
        this.lasso_element = document.createElement('div');
		
		document.body.appendChild(this.lasso_element)
		this.style_element();
		MVC.Element.make_positioned(this.lasso_element);
		
		this.start_position = MVC.Event.pointer(event);

		
		//Call the Controller's drag start if they have one.
		var params = {
            event: event,
            element: this.element,
            lasso_element: this.lasso_element,
            lasso_action: this
        };
        this.lassostart(params);
        
		//Check what they have set and respond accordingly
       
        
        
        
		//Get the list of Droppables.  
        MVC.Selectables.compile(); 
    },
    /**
     * Returns the position of the drag_element by taking its top and left.
     * @return {Vector}
     */
    currentDelta: function() {
        return new MVC.Vector( parseInt(MVC.Element.get_style(this.lasso_element,'left') || '0'), 
                            parseInt(MVC.Element.get_style(this.lasso_element,'top') || '0'))   ;
    },
    //draws the position of the dragging object
    draw: function(pointer, event){
        //on first move, call start
		if (!this.moved) this.start(event) 
		
		// only drag if we haven't been cancelled;
		if(this._cancelled) return;
		
		//Adjust for scrolling
        //MVC.Element._prepare();
		
		//Calculate where we should move the drag element to

		this.position_lasso(event);
        
		//Call back to dragging
        var params = 
				{ event: event, 
				  element: this.element, 
				  lasso_action: this, 
				  lasso_element: this.lasso_element};
        this.lassomove(params);
		
		//Tell dropables where mouse is
		MVC.Selectables.show(pointer, this, event);  
    },
	/**
	 * Called on drag up
	 * @param {Event} event a mouseup event signalling drag/drop has completed
	 */
    end : function(event){
        //Call drag end
		var drag_data = { 	element: this.element, 
							event: event, 
							lasso_element: this.lasso_element, 
							lasso_action: this };
        this.lassoend(drag_data);
        document.body.removeChild(this.lasso_element);
		//tell droppables a drop has happened
		//MVC.Droppables.fire(event, this);
		
		//Handle closing animations if necessary
        
    },
	/**
	 * Cleans up drag element after drag drop.
	 */
    cleanup : function(){
        if(this.drag_element != this.element)
                this.drag_element.style.display = 'none';
    },
	contains: function(selectable){
		return MVC.Element.within_box(selectable.element, 
			this.left, this.top, this.width, this.height, selectable);
	}
}
MVC.Lasso.selectors = {};

//==============================================================================

MVC.Lasso.current = null;


//Observe all mousemoves and mouseups.
MVC.Event.observe(document, 'mousemove', function(event){
    if(!MVC.Lasso.current ) return;  //do nothing if nothing is being dragged.
    MVC.Delegator.add_kill_event(event);
    event.kill();
    MVC.Lasso.current.draw(MVC.Event.pointer(event), event); //update draw
    return false;
});

MVC.Event.observe(document, 'mouseup', function(event){
    MVC.Delegator.add_kill_event(event);
    //if there is a current, we should call its dragstop
    if(MVC.Lasso.current && MVC.Lasso.current.moved){
        MVC.Lasso.current.end(event);
		MVC.Selectables.fire(event, MVC.Lasso.current);
		MVC.Selectables.clear();
    }

    MVC.Lasso.current = null;
});


