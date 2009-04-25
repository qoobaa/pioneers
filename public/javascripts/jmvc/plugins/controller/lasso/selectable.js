/**
 * Selectable and [MVC.Controller.Action.Lasso Lasso] let users select elements by dragging a box across 
 * an element.  To use the lasso, you must have a lasso action on the element you want to drag in, and
 * selectable elements.
 * 
 * You can use one of the following event names to:
<table class='options'>
    <tr><th>Event</th><th>Description</th></tr>
    <tr>
        <td>selectadd</td>
        <td>Called when a selectable is added to the list of selectables.</td>
    </tr>
    <tr>
        <td>selectmove</td>
        <td>Called when the lasso mouse moves over the selectable</td>
    </tr>
    <tr>
        <td>selectover</td>
        <td>Called when the lasso moves onto a selectable</td>
    </tr>
    <tr>
        <td>selectout</td>
        <td>Called when the lasso moves out of a selectable</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>Calls when the selectable is released on selected elements</td>
    </tr>
</table>

For more information on how Selectables work read [MVC.Selectable] and [MVC.Selectables]
 * <h3>Example</h3>
@code_start
TasksController = MVC.Controller.extend('tasks',{
    '# lassostart' : function(){}, //allows lassing in element w/ id = tasks
    selectadd : function(params){
      params.cache_position();
    },
    selectover : function(params){
      params.element.style.backgroundColor = "red"
    },
    selectout : function(params){
      params.element.style.backgroundColor = ""
    },
    selected : function(params){
      params.element.style.backgroundColor = "green"
    }
})
@code_end
 * <h3>Install</h3>
 * <pre>include.plugins('controller/lasso')</pre>
 */
MVC.Controller.Action.Selectable = MVC.Controller.Action.Event.extend(
/* @static */
{
    /**
     * matches "(.*?)\\s?(selectover|selected|selectout|selectadd|selectmove)$"
     */
    match: new RegExp("(.*?)\\s?(selectover|selected|selectout|selectadd|selectmove)$")
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
		//can't use init, so set default members
        this.action = action_name;
        this.callback = callback;
        this.className = className;
        this.element = element
        this.css_and_event();
        var selector = this.selector();
        
		// add selector to list of selectors:
        if(! MVC.Selectables.selectors[selector]) MVC.Selectables.selectors[selector] = {};
        MVC.Selectables.selectors[selector][this.event_type] = callback; 
    }
});
/**
 * @constructor MVC.Selectable
 * @inherits MVC.Controller.Params
 * @hide
 * @init abc
 */
MVC.Selectable = MVC.Controller.Params

MVC.Selectable.prototype = new MVC.Controller.Params();
MVC.Object.extend(MVC.Selectable.prototype, 
/* @prototype */
{
    /**
     * Caches positions of draggable elements.  Call in dropadd
     */
	cache_position: function(){
        this._cache = true;
    },
	/**
	 * cancels this drop
	 */
    cancel : function(){
        this._cancel = true;
    }
})
/**
 * @class MVC.Selectables
 * @hide
 */
MVC.Selectables = {
	selectables: [],
	selectors: {},
	/**
	 * Creates a new droppable and adds it to the list.
	 * @param {Object} element
	 * @param {Object} functions - callback functions for drop events
	 */
	add: function(element, functions) {
		element = MVC.$E(element);
		functions = MVC.Object.extend({
			selectover: MVC.Lasso.k,
			selected:MVC.Lasso.k,
			selectout:MVC.Lasso.k,
			selectadd:MVC.Lasso.k,
			selectmove:MVC.Lasso.k
		},functions)
		functions.element = element;
		functions._is_selected = false;
		var selectable = new MVC.Selectable(functions);
		if(selectable.selectadd) selectable.selectadd(selectable);
		if(!selectable._canceled){
		    MVC.Element.make_positioned(element);
		    this.selectables.push(selectable);
		}
	    
	},
	/**
	* For a list of affected selectables, finds the one that is deepest in
	* the dom.
	* @param {Object} selectables
	* @return {MVC.Selectable} deepest
	*/
	findDeepestChild: function(selectables) {
		//return right away if there are no selectables
		if(selectables.length == 0) return null;
		var deepest = selectables[0];
		  
		for (i = 1; i < selectables.length; ++i)
		  if (MVC.Element.has(selectables[i].element, deepest.element))
		    deepest = selectables[i];
		
		return deepest;
	},
	/**
	 * Tests if a drop is within the point.
	 * @param {Object} point
	 * @param {Object} element
	 * @param {Object} drop
	 */
	isAffected: function(lasso, selectable) {
		return ( lasso.contains(selectable) );
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
        if(drop.dropmove) drop.dropmove( {element: drop.element, drag: drag, event: event });
    },
	/**
	* Gives a point, the object being dragged, and the latest mousemove event.
	* Go through each droppable and see if it is affected.  Called on every mousemove.
	* @param {Object} point
	* @param {Object} drag
	* @param {Object} event
	*/
	show: function(point, lasso, event) {
		
		//var element = drag.drag_element;
		if(!this.selectables.length) return;
		
		var drop, affected = [];
		
		for(var d =0 ; d < this.selectables.length; d++ ){
			var select = this.selectables[d]
		    var ef = MVC.Selectables.isAffected(lasso, this.selectables[d])
			//if(ef) affected.push(this.selectables[d]);  
			if(ef && ! select._is_selected){
				select.selectover({element: select.element})
				select._is_selected = true;
			}
			if(ef){
				select.selectmove({element: select.element});
			}
			if(!ef && select._is_selected){
				select._is_selected = false;
				select.selectout({element: select.element})
			}
		}
		//need to cal

		//drop = MVC.Selectables.findDeepestChild(affected);
		
        
		//if we've activated something, but it is not this drop, deactivate (dropout)
		//if(this.last_active && this.last_active != drop) 
		//    this.deactivate(this.last_active, drag, event);
		
		//if we have something, dropover it
		//if (drop && drop != this.last_active) 
		//  this.activate(drop, drag, event);
		
        //if(drop && this.last_active){
        //  this.dropmove(drop, drag, event);
        //}
	},
	/**
	 * Called on mouse up of a dragged element.
	 * @param {Object} event
	 * @param {Object} element
	 */
	fire: function(event, lasso) {
		//if(!this.last_active) return;
		//MVC.Element._prepare();
		for(var d =0 ; d < this.selectables.length; d++ ){
			var select = this.selectables[d]
		    var ef = MVC.Selectables.isAffected(lasso, this.selectables[d])
			if(ef){
				select.selected({element: select.element, event: event});
			}
		}
	},
	/**
	* Called when the user first starts to drag.  Uses query to get
	* all possible droppable elements and adds them.
	*/
	compile : function(){
	  var elements = [];
	  for(var selector in MVC.Selectables.selectors){
	      var sels = elements.concat( MVC.Query(selector) )
	      for(var e= 0; e < sels.length; e++){
	          MVC.Selectables.add(sels[e], MVC.Selectables.selectors[selector])
	      }
	  }
	},
	/**
	* Called after dragging has stopped.
	*/
	clear : function(){
	  this.selectables = [];
	}
};
