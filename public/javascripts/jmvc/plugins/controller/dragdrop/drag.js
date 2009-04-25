/**
 * Adds drag functionality to controller actions with the following events:
<ul>
    <li><b>dragstart</b> - called when a drag is first moved.</li>
    <li><b>dragging</b> -  called everytime the drag moves</li>
    <li><b>dragend</b> - called when someone releases a dragable object (mouseup)</li>
</ul>
 * Drags actions are called with [MVC.Controller.Params.Drag].  Use the drag params to change the behavior
 * of the drag.
 * 
 * For more information on how Drag works read [MVC.Draggable].
 * <h3>Install</h3>
@code_start
include.plugins('controller/dragdrop')
@code_end
 * <h3>Example</h3>
@code_start
TasksController = MVC.Controller.extend('tasks',{
  ".handle dragstart" : function(params){
      //set something else to be dragged instead of this object
      params.representitive(MVC.$E('dragitem'), 15, 15);
      params.revert();
  },
  ".handle dragging" : function(params){
  
  },
  ".handle dragend" : function(params){
  
  }
}
@code_end
 */
MVC.Controller.Action.Drag = MVC.Controller.Action.Event.extend(
/* @static */
{
    /**
     * Matches "(.*?)\\s?(dragstart|dragend|dragging)$"
     */
    match: new RegExp("(.*?)\\s?(dragstart|dragend|dragging)$"),
    mousemove : function(event){
        if(!MVC.Draggable.current ) return;  //do nothing if nothing is being dragged.
        var current = MVC.Draggable.current;
        var pointer = MVC.Event.pointer(event);
        if(current._start_position && current._start_position.equals(pointer)) return;
        MVC.Delegator.add_kill_event(event);
        event.kill();
        MVC.Draggable.current.draw(pointer, event); //update draw
        return false;
    },
    mouseup : function(event){
        MVC.Delegator.add_kill_event(event);
        //if there is a current, we should call its dragstop
        if(MVC.Draggable.current && MVC.Draggable.current.moved){
            MVC.Draggable.current.end(event);
    		MVC.Droppables.clear();
        }
    
        MVC.Draggable.current = null;
        MVC.Event.observe(document, 'mousemove', MVC.Controller.Action.Drag.mousemove)
        MVC.Event.observe(document, 'mouseup', MVC.Controller.Action.Drag.mouseup);
    }
},
/* @prototype */
{    
    /**
     * Attaches a delegated mousedown function to the css selector for this action.  Saves additional actions
     * in callbacks.
     * @param {String} action_name the name of the function
     * @param {Function} f the function itself
     * @param {MVC.Controller} controller the controller this action belongs to
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
        if(!jmvc.custom.drag) jmvc.custom.drag = {};
        var drag = jmvc.custom.drag;
        //If the selector has already been added, just add this action to its list of possible action callbacks
		if(drag[selector]) {
            drag[selector].callbacks[this.event_type] = callback;
            return;
        }
		//create a new mousedown event for selectors that match our mouse event
        drag[selector] = 
			new MVC.Delegator(selector, 'mousedown', MVC.Function.bind(this.mousedown, this, element), element);
        drag[selector].callbacks = {};
        drag[selector].callbacks[this.event_type] = callback;
    },
	/**
	 * Called when someone mouses down on a draggable object.
	 * Gathers all callback functions and creates a new Draggable.
	 */
	mousedown : function(element, params){
       var isLeftButton = params.event.which == 1;
       var jmvc= MVC.Delegator.jmvc(element);
       if(jmvc.responding == false || !isLeftButton) return;
       var drag = jmvc.custom.drag
       MVC.Object.extend(params, drag[this.selector()].callbacks)
       if(MVC.Draggable.current) return;
	   MVC.Draggable.current = new MVC.Draggable(params);
       params.event.prevent_default();
       MVC.Event.observe(document, 'mousemove', MVC.Controller.Action.Drag.mousemove)
       MVC.Event.observe(document, 'mouseup', MVC.Controller.Action.Drag.mouseup);
	   return false;
	}
});




/**
 * @constructor
 * @hide
 * A draggable object, created on mouse down.  This basically preps a possible drag.
 * Start is called on the first mouse move after the mouse down.  This is to prevent drag from
 * being called on a normal click.
 * This function should do as little as possible.  Start should do more work because we are actually
 * dragging at that point.
 * @init
 * Takes a mousedown even params
 * @param {MVC.Controller.Params} params a mousedown event, the element it is on, and dragstart, dragend, and dragging
 */
MVC.Draggable = function(params){
    this.element = params.element; 		//the element that has been clicked on
    this.moved = false;					//if a mousemove has come after the click
    this._cancelled = false;			//if the drag has been cancelled
	this._start_position =              //starting position, used to make sure a move happens
        MVC.Event.pointer(params.event);
    this._compile = true;
	//used to know where to position element relative to the mouse.
	this.mouse_position_on_element = 
		MVC.Event.pointer(params.event).
			minus( MVC.Element.offset(params.element) );
	
	//Add default functions to be called.
    this.dragstart = params.dragstart || MVC.Draggable.k;
    this.dragend = params.dragend || MVC.Draggable.k;
    this.dragging = params.dragging || MVC.Draggable.k;
    this.scroll_window = true;
};
/* @static */
MVC.Draggable.
/* */
k = function(){};

MVC.Draggable.prototype = 
/* @prototype */
{
    /**
     * Called the first time we start dragging.
     * This will call drag start with MVC.Controller.Params.Drag
     * @param {Object} event
     */
	start: function(event){
		//MVC.Element._prepare();
        this._start_position = null;        //we no longer care about this
        this.moved = true;					//we have been moved
        this.drag_element = this.element;	//drag_element is what people should use to referrer to 
        									//what has been dragged
		
		//Call the Controller's drag start if they have one.
		var params = new MVC.Controller.Params.Drag({
            event: event,
            element: this.element,
            drag_element: this.drag_element,
            drag_action: this
        });
        this.dragstart(params);
        
		//Check what they have set and respond accordingly
        if(this._cancelled == true) return;
        
        this.drag_element = params.drag_element;  //if they have set the drag element, update it
        
		//style the drag element for dragging
        MVC.Element.make_positioned(this.drag_element);
        //if it is something else (absolutely positioned on the page)
        //this should probably get it's offset minus its left top
        if(this.drag_element != this.element){
            this.start_position = 
                MVC.Element.offset(this.drag_element)
                    //.minus( 
                    //new MVC.Vector( 
                    //    parseInt(MVC.Element.get_style(this.drag_element,'left') || '0'), 
                    //        parseInt(MVC.Element.get_style(this.drag_element,'top') || '0')))
        }
        else
            this.start_position = this.currentDelta(); //if it is us
            
        this.drag_element.style.zIndex = 1000;
        
		//Get the list of Droppables.  
        if(this._compile)
            MVC.Droppables.compile(); 
    },
    /**
     * Returns the position of the drag_element by taking its top and left.
     * @return {Vector}
     */
    currentDelta: function() {
        return new MVC.Vector( parseInt(MVC.Element.get_style(this.drag_element,'left') || '0'), 
                            parseInt(MVC.Element.get_style(this.drag_element,'top') || '0'))   ;
    },
    //draws the position of the dragging object
    draw: function(pointer, event){
        //on first move, call start
		if (!this.moved) this.start(event) 
		
		// only drag if we haven't been cancelled;
		if(this._cancelled) return;
		
		//Adjust for scrolling
        
		
		//Calculate where we should move the drag element to
		this.current_position = MVC.Element.offset(this.drag_element);
		var pos = 													//Drag element's starting coords on the page if it had top=0, left=0
				this.current_position	//Drag element's actual coords on the page
				.minus(this.currentDelta());						//How far Drag has moved from its starting coords
        
        var p = 													//Drag element's Top/Left that will move the element to be under the mouse in the right spot
				pointer.											//Where the mouse is
				minus(pos)											//Drag element's starting coords.
				.minus( this.mouse_position_on_element ); 			//the position relative to the container

        var s = this.drag_element.style;
        
        var params = new MVC.Controller.Params.Drag(
				{ event: event, 
				  element: this.element, 
				  drag_action: this, 
				  drag_element: this.drag_element,
                  _position: p});
        this.dragging(params);
        
        
        if(!this._horizontal)    s.top  =  params._position.top()+"px";
        if(!this._vertical)      s.left =  params._position.left()+"px";		
        
		//Call back to dragging
        
		
		//Tell dropables where mouse is
		MVC.Droppables.show(pointer, this, event);  
    },
	/**
	 * Called on drag up
	 * @param {Event} event a mouseup event signalling drag/drop has completed
	 */
    end : function(event){
        //Call drag end
		//tell droppables a drop has happened
		MVC.Droppables.fire(event, this);
        
        var drag_data = { 	element: this.element, 
							event: event, 
							drag_element: this.drag_element, 
							drag_action: this };
        this.dragend(new MVC.Controller.Params.Drag(drag_data));
        
		
		
		//Handle closing animations if necessary
        if(this._revert){
            new MVC.Animate(this.drag_element, 
                {top: this.start_position.top(), 
                 left: this.start_position.left()},
                 null, null, MVC.Function.bind(this.cleanup, this));
        }else{
            if (this.ghosted_element && this.element.parentNode) {
                MVC.Element.remove(this.element);
            }
            if(this.drag_element != this.element)
                this.drag_element.style.display = 'none';
        }
    },
	/**
	 * Cleans up drag element after drag drop.
	 */
    cleanup : function(){
        if(this.drag_element != this.element)
                this.drag_element.style.display = 'none';
    }
}
MVC.Draggable.selectors = {};

//==============================================================================

MVC.Draggable.current = null;


//Observe all mousemoves and mouseups.




/**
 * @constructor MVC.Controller.Params.Drag
 * [MVC.Controller.Action.Drag Drag] actions are called with Params.Drag.  Use Params.Drag to
 * alter drag functionality including:
 * <ul>
 *     <li>Stop Dragging</li>
 *     <li>Ghost drag</li>
 *     <li>Change the drag element</li>
 *     <li>Revert the drag element</li>
 * </ul>
 * Drag actions are also called with the following attributes:
<table class='options'>
    <tr><th>Attribute</th><th>Description</th></tr>
    <tr>
        <td>drag_action</td>
        <td>[MVC.Draggable] object that represents this drag</td>
    </tr>
    <tr>
        <td>drag_element</td>
        <td>The element that is actually being dragged</td>
    </tr>
    <tr>
        <td>element</td>
        <td>The element that represents the action</td>
    </tr>
    <tr>
        <td>event</td>
        <td>On dragstart+dragging, this is a mousemove event. On dragend, it is a mouseup.</td>
    </tr>
</table>
   <h3>Adding to drag params</h3>
   You might want to add your own functionality to draggable items.  Adding to 
   MVC.Controller.Params.Drag.prototype will make those functions always available.
   
 * @inherits MVC.Controller.Params
 * @init
 * Same functionality as [MVC.Controller.Params]
 */
MVC.Controller.Params.Drag = MVC.Controller.Params

MVC.Controller.Params.Drag.prototype = new MVC.Controller.Params();
MVC.Object.extend(MVC.Controller.Params.Drag.prototype, 
/* @prototype */
{
	/**
	 * Stops drag from running.
	 */
	cancel_drag: function() {
        this.drag_action._cancelled = true;
		this.drag_action.end(this.event);
		MVC.Droppables.clear();
		MVC.Draggable.current = null;
    },
	/**
	 * Clones an element and uses it as the representitive element.
	 * @param {Function} callback
	 */
    ghost: function(callback) {
        // create a ghost by cloning the source element and attach the clone to the dom after the source element
        var ghost = this.element.cloneNode(true);
        MVC.Element.insert(this.element, { after: ghost });
        
        // store the original element and make the ghost the dragged element
        this.drag_element = ghost;
    },
	/**
	 * Use a representitive element, instead of the drag_element.
	 * @param {HTMLElement} element the element you want to actually drag
	 * @param {Number} offsetX the x position where you want your mouse on the object
	 * @param {Number} offsetY the y position where you want your mouse on the object
	 */
    representitive : function( element, offsetX, offsetY ){
        
        this._offsetX = offsetX || 0;
		this._offsetY = offsetY || 0;
		
		var p = MVC.Event.pointer(this.event);
        
        this.drag_element = MVC.$E(element);
        var s = this.drag_element.style;
        s.top =  (p.top()-offsetY)+"px";
        s.left =  (p.left()-offsetX)+"px";
        s.display = '';
		this.drag_action.mouse_position_on_element = new MVC.Vector(offsetX, offsetY)
    },
	/**
	 * Makes the drag_element go back to its original position after drop.
	 */
    revert : function(){
        this.drag_action._revert = true;
    },
    /**
     * Isolates the drag to vertical movement.
     */
    vertical : function(){
        this.drag_action._vertical = true;
    },
    /**
     * Isolates the drag to horizontal movement.
     */
    horizontal : function(){
        this.drag_action._horizontal = true;
    },
    /**
     * Gets or sets the new position
     * @param {MVC.Vector} newposition
     * @param {MVC.Vector} the position the page will be updated to
     */
    position: function(newposition){
        if(newposition)
            this._position = newposition;
        return this._position;
    },
	scrolls : function(elements){
		for(var i = 0 ; i < elements.length; i++){
			MVC.Droppables.add(elements[i], new MVC.Scrollable(elements[i]))
		}
	},
    drag_only : function(){
        this.drag_action._compile = false;
    }
})
