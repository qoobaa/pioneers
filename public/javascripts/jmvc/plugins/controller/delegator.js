/**
 * @constructor
 * Attaches listeners for delegated events.
 * @init Creates a new delegator listener
 * @param {String} selector a css selector
 * @param {String} event a dom event
 * @param {Function} f a function to call
 */
MVC.Delegator = function(selector, event, f, element){
    this._event = event;
    this._selector = selector
    this._func = f;
    this.element = element || document.documentElement;
    MVC.Delegator.jmvc(this.element)
    if(event == 'contextmenu' && MVC.Browser.Opera) return this.context_for_opera();
    if(event == 'submit' && MVC.Browser.IE) return this.submit_for_ie();
	if(event == 'change' && MVC.Browser.IE) return this.change_for_ie();
	if(event == 'change' && MVC.Browser.WebKit) return this.change_for_webkit();
	
    this.add_to_delegator();
};

MVC.Object.extend(MVC.Delegator,
/* @Static*/
{
    /**
     * Adds _jmvc to elements to keep track of delegation events.
     * @param {Object} element
     * @return {Object} the jmvc object.
     */
    jmvc : function(element){
        var data = MVC.Dom.data(element);
        if(!data.delegation_events) data.delegation_events = {};
        if(data.responding == null) data.responding = true;
        return data;
    },
    /**
     * Adds kill() on an event.
     * @param {Object} event
     */
    add_kill_event: function(event){ //this should really be in event
		if(!event.kill){
			if(!event) event = window.event;
            var killed = false;
			event.kill = function(){
				killed = true;
			    try{
				    if (event.stopPropagation)  event.stopPropagation(); 
				    if (event.preventDefault)  event.preventDefault();
			    }catch(e){}
			};
			event.is_killed = function(){return killed;};
            event.stop_propagation = function(){
                killed = true;
                try{
			        if (event.stopPropagation)  event.stopPropagation(); 
			    }catch(e){}
            }
            event.prevent_default = function(){
                try{
			        if (event.preventDefault)  event.preventDefault(); 
			    }catch(e){}
            }
		}	
	},
    /**
     * Used for sorting events on an object
     * @param {Object} a
     * @param {Object} b
     * @return {Number} -1,0,1 depending on how a and b should be sorted.
     */
    sort_by_order: function(a,b){
    	if(a.order < b.order) return 1;
    	if(b.order < a.order) return -1;
    	var ae = a._event, be = b._event;
    	if(ae == 'click' &&  be == 'change') return 1;
    	if(be == 'click' &&  ae == 'change') return -1;
    	return 0;
    },
    /**
     * Stores all delegated events
     */
    events: {},
    onload_called : false
})
MVC.Event.observe(window, 'load', function(){
    MVC.Delegator.onload_called = true;
})
/* @Prototype*/
MVC.Delegator.prototype = {
    /*
     * returns the event that should actually be used.  In practice, this is just used to switch focus/blur
     * to activate/deactivate for ie.
     * @return {String} the adjusted event name.
     */
    event: function(){
    	if(MVC.Browser.IE){
            if(this._event == 'focus')
    			return 'activate';
    		else if(this._event == 'blur')
    			return 'deactivate';
    	}
    	return this._event;
    },
    /*
     * Returns if capture should be used (blur and focus)
     * @return {Boolean} true for focus / blur, false if otherwise
     */
    capture: function(){
        return MVC.Array.include(['focus','blur'],this._event);
    },
    /**
     * If there are no special cases, this is called to add to the delegator.
     * @param {String} selector - css selector
     * @param {String} event - event selector
     * @param {Function} func - a function that will be called
     */
    add_to_delegator: function(selector, event, func){
        var s = selector || this._selector;
        var e = event || this.event();
        var f = func || this._func;
        var delegation_events = MVC.Dom.data(this.element,"delegation_events");
        if(!delegation_events[e] || delegation_events[e].length == 0){
            var bind_function = MVC.Function.bind(this.dispatch_event, this)
            MVC.Event.observe(this.element, e, bind_function, this.capture() );
            delegation_events[e] = [];
            delegation_events[e]._bind_function = bind_function;
		}
		delegation_events[e].push(this);
    },
    _remove_from_delegator : function(event_type){
        var event = event_type || this.event();
        var events = MVC.Dom.data(this.element,"delegation_events")[event];
        for(var i = 0; i < events.length;i++ ){
            if(events[i] == this){
                events.splice(i, 1);
                break;
            }
        }
        if(events.length == 0){
            MVC.Event.stop_observing(this.element, event, events._bind_function, this.capture() );
        }
    },
    /*
     * Handles the submit case for IE.  It checks if a keypress return happens in an
     * input area or a submit button is clicked.
     */
    submit_for_ie : function(){
		this.add_to_delegator(null, 'click');
        this.add_to_delegator(null, 'keypress');
        
        this.filters= {
			click : function(el, event, parents){
				//check you are in a form
                if(el.nodeName.toUpperCase() == 'INPUT' && el.type.toLowerCase() == 'submit'){
                    for(var e = 0; e< parents.length ; e++) if(parents[e].tag == 'FORM') return true;
                }
                return false;
                
			},
			keypress : function(el, event, parents){
				if(el.nodeName.toUpperCase()!= 'INPUT') return false;
				var res = typeof Prototype != 'undefined' ? (event.keyCode == 13) : (event.charCode == 13)
                if(res){
                    for(var e = 0; e< parents.length ; e++) if(parents[e].tag == 'FORM') return true;
                }
                return false;
			}
		};
	},
    /*
     * Handles change events for IE.
     */
	change_for_ie : function(){
		this.add_to_delegator(null, 'click');
        this.add_to_delegator(null, 'keyup');
        this.add_to_delegator(null, 'beforeactivate')
        //return if right or not
        this.end_filters= {
			click : function(el, event){
				switch(el.nodeName.toLowerCase()){
                    case "select":
                        if(typeof el.selectedIndex == 'undefined') return false;
                        var data = MVC.Dom.data(el);
                        if( data._change_old_value == null){
        					data._change_old_value = el.selectedIndex.toString();
        					return false;
        				}else{
        					if(data._change_old_value == el.selectedIndex.toString()) return false;
        					data._change_old_value = el.selectedIndex.toString();
        					return true;
        				}
                        break;
                     case "input":
                         if(el.type.toLowerCase() =="checkbox" ) return true;
                         return false;
                     
                }
                return false;
			},
            keyup : function(el, event){
                if(el.nodeName.toLowerCase() != "select") return false;
                if(typeof el.selectedIndex == 'undefined') return false;
                var data = MVC.Dom.data(el);
                if( data._change_old_value == null){
                    data._change_old_value = el.selectedIndex.toString();
					return false;
				}else{
					if(data._change_old_value == el.selectedIndex.toString()){
                        return false;
                    }
					data._change_old_value = el.selectedIndex.toString();
					return true;
				}
            },
            beforeactivate : function(el, event){
                //we should probably check that onload has been called.
                return el.nodeName.toLowerCase() == 'input' 
                    && el.type.toLowerCase() =="radio" 
                    && !el.checked
                    && MVC.Delegator.onload_called  //IE selects this on the start
            }
		};
	},
    /*
     * Handles a change event for Safari.
     */
	change_for_webkit : function(){
		this.add_to_delegator(null, 'change');
		this.end_filters= {
			change : function(el, event){
                if(el.nodeName.toLowerCase() == 'input') return true;
				if(typeof el.value == 'undefined') return false; //sometimes it won't exist yet
				var old = el.getAttribute('_old_value');
				el.setAttribute('_old_value', el.value);
				return el.value != old;
			}
		};
	},
    /**
     * Handles a right click for Opera.  It looks for clicks with shiftkey pressed.
     */
    context_for_opera : function(){
        this.add_to_delegator(null, 'click');
        this.end_filters= {
			click : function(el, event){
				return event.shiftKey;
			}
        }
    },
    regexp_patterns:  {tag :    		/^\s*(\*|[\w\-]+)(\b|$)?/,
        				id :            /^#([\w\-\*]+)(\b|$)/,
    					className :     /^\.([\w\-\*]+)(\b|$)/},
    /*
     * returns and caches the select order for the css patern.
     * @retun {Array} array of objects that are used to match with the node_path
     */
    selector_order : function(){
		if(this.order) return this.order;
		var selector_parts = this._selector.split(/\s+/);
		var patterns = this.regexp_patterns;
		var order = [];
        if(this._selector)
		for(var i =0; i< selector_parts.length; i++){
			var v = {}, r, p =selector_parts[i];
			for(var attr in patterns){
				if( patterns.hasOwnProperty(attr) ){
					if( (r = p.match(patterns[attr]))  ) {
						if(attr == 'tag')
							v[attr] = r[1].toUpperCase();
						else
							v[attr] = r[1];
						p = p.replace(r[0],'');
					}
				}
			}
			order.push(v);
		}
		this.order = order;
		return this.order;
	},
    /**
     * Tests if an event matches an element.
     * @param {Object} el the element we are testing
     * @param {Object} event the event
     * @param {Object} parents an array of node order objects for the element
     * @return {Object} returns an object with node, order, and delegation_event attributes.
     */
    match: function(el, event, parents){
        if(this.filters && !this.filters[event.type](el, event, parents)) return null;
		//if(this.controller.className != 'main' &&  (el == document.documentElement || el==document.body) ) return false;
		var matching = 0;
		var selector_order = this.selector_order();
        if(selector_order.length == 0){ //attached to top node
            return {node: parents[0].element, order: 0, delegation_event: this}
        } 
        for(var n=0; n < parents.length; n++){
			var node = parents[n], match = selector_order[matching], matched = true;
			for(var attr in match){
				if(!match.hasOwnProperty(attr) || attr == 'element') continue;
				if(match[attr] && attr == 'className'){
					if(! MVC.Array.include(node.className.split(' '),match[attr])) matched = false;
				}else if(match[attr] && node[attr] != match[attr]){
					matched = false;
				}
			}
			if(matched){
				matching++;
                if(matching >= selector_order.length) {
                    if(this.end_filters && !this.end_filters[event.type](el, event)) return null;
                    return {node: node.element, order: n, delegation_event: this};
                }
			}
		}
		return null;
    },
    /**
     * Goes through the delegated events for the given event type (e.g. Click).  Orders the matches
     * by how nested they are in the dom.  Adds the kill function on the event, then dispatches each
     * event.  If kill is called, it will stop dispatching other events.
     * @param {Event} event the DOM event returned by a normal event handler.
     */
	dispatch_event: function(event){
        var target = event.target, matched = false, ret_value = true,matches = [];
		var delegation_events = MVC.Dom.data(this.element,"delegation_events")[event.type];
        var parents_path = this.node_path(target);
		for(var i =0; i < delegation_events.length;  i++){
			var delegation_event = delegation_events[i];
			var match_result = delegation_event.match(target, event, parents_path);
			if(match_result){
				matches.push(match_result);
			}
		}

		if(matches.length == 0) return true;
		MVC.Delegator.add_kill_event(event);
		matches.sort(MVC.Delegator.sort_by_order);
        var match;
		for(var m = 0; m < matches.length; m++){
            match = matches[m];
            ret_value = match.delegation_event._func( {event: event, element: MVC.$E(match.node), delegate: this.element} ) && ret_value;
			if(event.is_killed()) return false;
		}
	},
    /**
     * Returns an array of objects that represent the path of the node to documentElement.  Each item in the array
     * has a tag, className, id, and element attribute.
     * @param {Object} el element in the dom that is nested under the documentElement
     * @return {Array} representation of the path between the element and the DocumentElement
     */
    node_path: function(el){
        var body = this.element,parents = [],iterator =el;
		if(iterator == body) return [{tag: iterator.nodeName, className: iterator.className, id: iterator.id, element: iterator}]
        do{
            parents.unshift({tag: iterator.nodeName, className: iterator.className, id: iterator.id, element: iterator});
        }while(((iterator = iterator.parentNode) != body )&& iterator)
        if(iterator)
            parents.unshift({tag: iterator.nodeName, className: iterator.className, id: iterator.id, element: iterator});
        return parents;
	},
    destroy : function(){
        //remove from events
        if(this._event == 'contextmenu' && MVC.Browser.Opera){
            return this._remove_from_delegator("click");
        }
        if(this._event == 'submit' && MVC.Browser.IE) {
            this._remove_from_delegator("keypress");
            return this._remove_from_delegator("click");
        }
    	if(this._event == 'change' && MVC.Browser.IE){
            this._remove_from_delegator("keyup");
            this._remove_from_delegator("beforeactivate");
            return this._remove_from_delegator("click");
        } 
    	//if(this._event == 'change' && MVC.Browser.WebKit){
        //    return this._remove_from_delegator();
        //}
        this._remove_from_delegator()
    }
};
