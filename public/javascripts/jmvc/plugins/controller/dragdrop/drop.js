/**
 * Adds droppable element to controller actions by adding the following events:
<table class='options'>
    <tr><th>Event</th><th>Description</th></tr>
    <tr>
        <td>dropadd</td>
        <td>Called when drops are added to the list of drops.  This happens when a drag starts.</td>
    </tr>
    <tr>
        <td>dropover</td>
        <td>Called when a drag moves over a drop element</td>
    </tr>
    <tr>
        <td>dropout</td>
        <td>Called when a drag is moved out of a drop element</td>
    </tr>
    <tr>
        <td>dropmove</td>
        <td>Called as an element moves over a drop element</td>
    </tr>
    <tr>
        <td>dropped</td>
        <td>Called when a drag is dropped on the drop element</td>
    </tr>
</table>

Drop actions are called with [MVC.Controller.Params.Drop].  Use Params.Drop to adjust drop functionality
 * and cache drop points.  For more information on how Drops work read [MVC.Droppables]
 * <h3>Install</h3>
@code_start
include.plugins('controller/dragdrop')
@code_end
 */
MVC.Controller.Action.Drop = MVC.Controller.Action.Event.extend(
/* @static */
{
    /**
     * matches "(.*?)\\s?(dropover|dropped|dropout|dropadd|dropmove)$"
     */
    match: new RegExp("(.*?)\\s?(dropover|dropped|dropout|dropadd|dropmove)$")
},
/* @prototype */
{    
    /**
     * 
     * @param {Object} action
     * @param {Object} f
     * @param {Object} controller
     */
    init: function(action_name, callback, className, element){
        this.action = action_name;
        this.callback = callback;
        this.className = className;
        this.element = element
        this.css_and_event();
        var selector = this.selector();
        
		// add selector to list of selectors:
        if(! MVC.Droppables.selectors[selector]) MVC.Droppables.selectors[selector] = {};
        MVC.Droppables.selectors[selector][this.event_type] = callback; 
    }
});
/**
 * @constructor MVC.Controller.Params.Drop
 * [MVC.Controller.Action.Drop Drop actions] are called with Params.Drop.  
 * The most important param function is cache_position.  If your drop elements are not
 * changing position after dragstart, use cache_position for large performance improvements.
 * 
   <h3>Passing data from drag events to drop events</h3>
   
 * Drop params include a drag attribute, which contains the contents of the MVC.Draggable object 
 * that represented the drag.  If you want to pass data to a drop event from your drag, you 
 * can save it in MVC.Controller.Params.Drag's drag_action attribute, and recover it from 
 * MVC.Controller.Params.Drop's drag attribute.  For example:
 * 
 * <h3>Drag Controller</h3>
@code_start
    dragstart: function(params){
		params.drag_action.data = {some: "data"};
    }
@code_end
 * 
 * <h3>Drop Controller</h3>
@code_start
    dropped: function(params){
		var data = params.drag.data;
    }
@code_end
 * 
 * @init
 * Same functionality as [MVC.Controller.Params]
 */
MVC.Controller.Params.Drop = MVC.Controller.Params

MVC.Controller.Params.Drop.prototype = new MVC.Controller.Params();
MVC.Object.extend(MVC.Controller.Params.Drop.prototype, 
/* @prototype */
{
    /**
     * Caches positions of draggable elements.  This should be called in dropadd.  For example:
     * @code_start
     * dropadd : function(params){ params.cache_position() }
     * @code_end
     */
	cache_position: function(value){
        this._cache = value != null ? value : true;
    },
	/**
	 * cancels this drop
	 */
    cancel : function(){
        this._cancel = true;
    }
});




/**
 * @class MVC.Droppables
 * @hide
 * A collection of all the drop elements.
 */
MVC.Droppables = MVC.Class.extend('drop',
/* @static */
{
	drops: [],
	selectors: {},
	/**
	 * Creates a new droppable and adds it to the list.
	 * @param {Object} element
	 * @param {Object} callbacks callback functions for drop events: dropover, dropped, dropout,dropadd,dropmove
	 */
	add: function(element, callbacks) {
        element = MVC.$E(element);
		
		callbacks.element = element;
		var droppable = callbacks; //new MVC.Controller.Params.Drop(callbacks);
		if(droppable.dropadd) droppable.dropadd(droppable);
		if(!droppable._canceled){
		    MVC.Element.make_positioned(element);
		    this.drops.push(droppable);
		}
	},
	/**
	* For a list of affected drops, finds the one that is deepest in
	* the dom.
	* @param {Object} drops
	* @return {MVC.Controller.Params.Drop} deepest
	*/
	findDeepestChild: function(drops) {
		//return right away if there are no drops
		if(drops.length == 0) return null;
		var deepest = drops[0];
		  
		for (i = 1; i < drops.length; ++i)
		  if (  MVC.Element.has(deepest.element,drops[i].element))
		    deepest = drops[i];
		
		return deepest;
	},
	/**
	 * Tests if a drop is within the point.
	 * @param {Object} point
	 * @param {Object} element
	 * @param {Object} drop
	 */
	isAffected: function(point, element, drop) {
        return (
		  (drop.element!=element) && 
		  MVC.Element.within(drop.element, point[0], point[1], drop._cache ) ) ;
	},
	/**
	 * Calls dropout and sets last active to null
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	deactivate: function(drop, drag, event) {
		this.last_active = null;
		if(drop.dropout) drop.dropout( {element: drop.element, drag: drag, event: event });
	}, 
	/**
	 * Calls dropover
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	activate: function(drop, drag, event) { //this is where we should call over
		this.last_active = drop;
		if(drop.dropover) drop.dropover( {element: drop.element, drag: drag, event: event });
	},
    dropmove : function(drop, drag, event){
        if(drop.dropmove) drop.dropmove( {element: drop.element, drag: drag, event: event, position: drop.position_on_element});
    },
	/**
	* Gives a point, the object being dragged, and the latest mousemove event.
	* Go through each droppable and see if it is affected.  Called on every mousemove.
	* @param {Object} point
	* @param {Object} drag
	* @param {Object} event
	*/
	show: function(point, drag, event) {
		
		var element = drag.drag_element;
		if(!this.drops.length) return;
		var drop, affected = [], temp;
        for(var d =0 ; d < this.drops.length; d++ ){
            if( (temp = MVC.Droppables.isAffected(point, element, this.drops[d])  )) {
				this.drops[d].position_on_element = temp;
				affected.push(this.drops[d]);
			}
				   
		}
		drop = MVC.Droppables.findDeepestChild(affected);
        
        //if we've activated something, but it is not this drop, deactivate (dropout)
		if(this.last_active && this.last_active != drop) 
		    this.deactivate(this.last_active, drag, event);
        
		//if we have something, dropover it
        if (drop && drop != this.last_active) 
          this.activate(drop, drag, event);
          
        //call move on everyone
        for (var i = 0; i < affected.length; i++) {
            this.dropmove(affected[i], drag, event)
        }
        
		
        
        
	},
	/**
	 * Called on mouse up of a dragged element.
	 * @param {Object} event
	 * @param {Object} element
	 */
	fire: function(event, drag) {
		if(!this.last_active) return;
		//MVC.Element._prepare();
		
		if( this.isAffected(MVC.Event.pointer(event), drag.drag_element, this.last_active) && //last is still activated
			this.last_active.dropped	){ 											//drop was ok
			
            this.last_active.dropped({drag: drag, event: event, element: this.last_active.element}); 
		    return true; 
		}
	},
	/**
	* Called when the user first starts to drag.  Uses query to get
	* all possible droppable elements and adds them.
	*/
	compile : function(){
	  for(var selector in MVC.Droppables.selectors){
	      var sels = MVC.Query(selector)
	      for(var e= 0; e < sels.length; e++){
	          //make sure we clear the offset cache
              MVC.Dom.remove_data(sels[e],"offset")
              MVC.Droppables.add(sels[e], new MVC.Controller.Params.Drop(MVC.Droppables.selectors[selector]))
	      }
	  }
	},
	/**
	* Called after dragging has stopped.
	*/
	clear : function(){
	  this.drops = [];
	}
},{});
