/**
 * Controller.Stateful provides state for controller instances.  Controller.Stateful is  useful for
 * creating self-contained widgets or when there are many instances of an object that has complex state.  
 * Read the <a href="http://docs.javascriptmvc.com/demos/fixedbox.html">fixedbox demo</a>
 * for good an example of using Controller.Stateful.
 * <h2>Example</h2>
 * The following is a a small piece of the SliderController.
 * @code_start
 * SliderController = MVC.Controller.Stateful('slider',{
 *   init : function(element, options){
 *     this.options = options ||{}
 *     this._super(MVC.$E(element))
 *   },
 *   '.slider dragstart' : function(params){
 *       params.horizontal()
 *   },
 *   '.slider dragging' : function(params){
 *     //check pos
 *     this.options.sliding(pos, params) //callback with position
 *   }
 * })
 * @code_end
 * You would create a new Slider like:
 * @code_start
 * new SliderController('element_id',{sliding: function(pos){console.log(pos)});
 * @code_end
 * <h2>Naming</h2>
 * Naming works just similar to regular controllers.  If the Controller's className is plural, it will insert an implicit
 * <i>.singular_name</i> before this controller's [MVC.Controller.Action.Event|event actions].  If the controller is a singular name
 * nothing is added to the delegation class name.
 * <h2>How Stateful works</h2>
 * New stateful instances create a new delegation listening point on the element passed into the base 
 * [MVC.Controller.Stateful.prototype.init|init] function.  As events happen on the element or child elements
 * of the instance, they call back to the controller instance.
 */
MVC.Controller.Stateful = MVC.Controller.extend(
/* @Static*/
{
    _should_attach_actions: false,

    _events : null,
    _element : null
},
/* @Prototype */
{
    /**
     * Called when aa new instance is created.  you must provide 
     * @param {HTMLElement} element the element this instance operates on.
     */
    init: function(element){
        //needs to go through prototype, and attach events to this instance
        MVC.Delegator.jmvc(element)
        this._actions = [];
        for(var action_name in this){
    		val = this[action_name];
    		if( typeof val == 'function' && action_name != 'Class'){
                for(var a = 0 ; a < MVC.Controller.actions.length; a++){
                    act = MVC.Controller.actions[a];
                    if(act.matches(action_name)){
                        var callback = this.dispatch_closure(action_name);
                        this._actions.push(new act(action_name, callback, this.Class.className,element ));
                    }
                }
            }
	    }
        this._children = [];
        this.action_name = "init";
        this.element = element;
    },

    /**
     * Removes all actions on this instance.
     */
    destroy: function(){
        if(this._destroyed) throw this.Class.className+" controller instance has already been deleted";
        for(var i = 0; i < this._actions.length; i++){
            this._actions[i].destroy();
        }
        var delegation_events = MVC.Dom.data(this.element).delegation_events;
        if(this.element && delegation_events){
            //take out any listeners on this guy
            for(var event_type in delegation_events){
                var events = delegation_events[event_type]
                for(var i = 0; i < events.length; i++){
                    events[i].destroy();
                }
            }
        }
        //remove if we've been added to the parent
        if(this._parent){
            this._parent.remove(this);
        }
        if(this.element && this.element.parentNode)
            this.element.parentNode.removeChild(this.element);
        this._destroyed = true;
    },
    /**
     * Used to call back to this instance
     * @param {Object} f_name
     */
    dispatch_closure: function(f_name){
        return MVC.Function.bind(function(params){
            if(! MVC.Dom.data(this.element).responding ) return;
            params = params || {};
            params.action = f_name;
            params.controller = this.Class;
            params = params.constructor == MVC.Controller.Params ? params : new MVC.Controller.Params(params)
			
            //this.params = params;
    		this.action_name = f_name;
            return this[f_name](params);
		},this);
    },
    /**
     * Queries from the current element.
     * @param {Object} selector
     */
    query: function(selector){
        return MVC.Query.descendant(this.element, selector)
    },
    /**
     * Can 'shut' down this controller, preventing it from responding to any event.
     * @param {Boolean} respond true to respond to events, false to repond to nothing.
     */
    respond: function(respond){
		MVC.Dom.data(this.element).responding = respond;
    },
    /**
     * Adds child Statefuls to this Stateful.  They will be destroyed when this parent is destroyed.
     * @param {MVC.Controller.Stateful} child
     * @return {MVC.Controller.Stateful} 
     */
    add_child : function(child){
        child._parent = this;
        this._children.push(child);
        return child;
    },
    /**
     * Removes children Statefuls from this Stateful.
     */
    remove_child : function(child){
        for(var i = 0; i < this._children.length;i++ ){
            if(this._children[i] === child){
                this._children[i].splice(i, 1);
                break;
            }
        }
    }
});