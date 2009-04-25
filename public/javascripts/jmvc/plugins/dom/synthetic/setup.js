

/**
 * @constructor
 * Used for creating and dispatching synthetic events.
 * @code_start
 * new MVC.Synthetic('click').send(MVC.$E('id'))
 * @code_end
 * @init Sets up a synthetic event.
 * @param {String} type type of event, ex: 'click'
 * @param {optional:Object} options
 */
MVC.Synthetic = function(type, options){
	this.type = type;
	this.options = options || {};
}
MVC.Synthetic.prototype = 
/* @Prototype*/
{
	/**
	 * Dispatches the event on the given element
	 * @param {HTMLElement} element the element that will be the target of the event.
	 */
    send : function(element){
		this.firefox_autocomplete_off(element);
		
		if(MVC.Browser.Opera && MVC.Array.include(['focus','blur'],this.type)) return this.createEvents(element);
		
		if(this.type == 'focus') return element.focus();
		if(this.type == 'blur') return element.blur();
		if(this.type == 'write') return this.write(element);
		if(this.type == 'drag') return this.drag(element);
		
		return this.create_event(element)
	},
	firefox_autocomplete_off : function(element) {
		if(MVC.Browser.Gecko && element.nodeName.toLowerCase() == 'input' && element.getAttribute('autocomplete') != 'off')
			element.setAttribute('autocomplete','off');
	},
    /**
     * Picks how to create the event
     * @param {Object} element
     */
	create_event: function(element){
		if(document.createEvent) {
			this.createEvent(element);
		} else if (document.createEventObject) {
			this.createEventObject(element);
		} else
			throw "Your browser doesn't support dispatching events";
		return this.event;
	},
    /**
     * Most browsers do this
     * @param {Object} element
     */
	createEvent : function(element) {
		if(MVC.Array.include(['keypress','keyup','keydown'], this.type))
			this.createKeypress(element, this.options.character);
		else if(this.type == 'submit')
			this.createEvents(element);
		else if(MVC.Array.include(['click','dblclick','mouseover','mouseout','mousemove','mousedown','mouseup','contextmenu'],this.type))
			this.createMouse(element);
	},
    /**
     * For IE
     * @param {Object} element
     */
	createEventObject : function(element) {
		this.event = document.createEventObject();
        if(MVC.Array.include(['keypress','keyup','keydown'],this.type))
			this.createKeypressObject(element, this.options.character);
		else if(this.type == 'submit')
			this.createSubmitObject(element);
		else if(MVC.Array.include(['click','dblclick','mouseover','mouseout','mousemove','mousedown','mouseup','contextmenu'],this.type))
			this.createMouseObject(element);
	},
	simulateEvent : function(element) {
		if(element.dispatchEvent) {
			return element.dispatchEvent(this.event);
		} else if(element.fireEvent) {
			return element.fireEvent('on'+this.type, this.event);
		} else
			throw "Your browser doesn't support dispatching events";
	},
	createEvents : function(element) {
        this.event = document.createEvent("Events");
        this.event.initEvent(this.type, true, true ); 
		this.simulateEvent(element);
	},
	createSubmitObject : function(element) {
		// if using controller
		if(MVC.Controller) {
			// look for submit input
			for(var i=0; i<element.elements.length; i++) {
				var el = element.elements[i];
				// if found, click it
				if(el.nodeName.toLowerCase()=='input' && el.type.toLowerCase() == 'submit')
					return (new MVC.SyntheticEvent('click').send(el));
			}
			// if not, find a text input and click enter
			// look for submit input
			for(var i=0; i<element.elements.length; i++) {
				var el = element.elements[i];
				// if found, click it
				if((el.nodeName.toLowerCase()=='input' && el.type.toLowerCase() == 'text') || el.nodeName.toLowerCase() == 'textarea')
					return (new MVC.SyntheticEvent('keypress', {keyCode: 13}).send(el));
			}
		} else {
			// if not using controller, fire event normally 
			//   - should trigger event handlers not using event delegation
	        this.simulateEvent(element);
		}
	},
	createKeypress : function(element, character) {
		if(character && character.match(/\n/)) {
			this.options.keyCode = 13;
			character = 0;
		}
		if(character && character.match(/[\b]/)) {
			this.options.keyCode = 8;
			character = 0;
		}
		var options = MVC.Object.extend({
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			keyCode: this.options.keyCode || (character? character.charCodeAt(0) : 0),
			charCode: (character? character.charCodeAt(0) : 0)
		}, arguments[2] || {});
		try {
			this.event = document.createEvent("KeyEvents");
			this.event.initKeyEvent(this.type, true, true, window, 
			options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
			options.keyCode, options.charCode );
		} catch(e) {
			try {
				this.event = document.createEvent("Events");
			} catch(e2) {
				this.event = document.createEvent("UIEvents");
			} finally {
				this.event.initEvent(this.type, true, true);
				MVC.Object.extend(this.event, options);
			}
		}
		var fire_event = this.simulateEvent(element);
		if(fire_event && this.type == 'keypress' && !MVC.Browser.Gecko && 
            (element.nodeName.toLowerCase() == 'input' || element.nodeName.toLowerCase() == 'textarea')) {
                if(character) element.value += character;
                else if(this.options.keyCode && this.options.keyCode == 8) element.value = element.value.substring(0,element.value.length-1);
        }
	},
	createKeypressObject : function(element, character) {
		if(character && character.match(/\n/)) {
			this.options.keyCode = 13;
			character = 0;
		}
		if(character && character.match(/[\b]/)) {
            this.options.keyCode = 8;
			character = 0;
		}
		
  		this.event.charCode = (character? character.charCodeAt(0) : 0);
  		this.event.keyCode = this.options.keyCode || (character? character.charCodeAt(0) : 0);
		var fire_event = this.simulateEvent(element);
		if(fire_event && this.type == 'keypress' && !MVC.Browser.Gecko && 
            (element.nodeName.toLowerCase() == 'input' || element.nodeName.toLowerCase() == 'textarea')) {
                if(character) element.value += character;
                else if(this.options.keyCode && this.options.keyCode == 8) element.value = element.value.substring(0,element.value.length-1);
        }
	},
    create_mouse_options : function(element){
        var center = MVC.Synthetic.center(element);
        var defaults =MVC.Object.extend({
			bubbles : true,
			cancelable : true,
			view : window,
			detail : 1,
			screenX : 1, screenY : 1,
			clientX : center[0], clientY : center[1],
			ctrlKey : false, altKey : false, shiftKey : false, metaKey : false,
			button : (this.type == 'contextmenu' ? 2 : 1), 
			relatedTarget : null
		}, this.options);
        return defaults;
    },
	createMouse : function(element){
        this.event = document.createEvent('MouseEvents');
		var defaults = this.create_mouse_options(element)
        
		this.event.initMouseEvent(this.type, 
			defaults.bubbles, defaults.cancelable, 
			defaults.view, 
			defaults.detail, 
			defaults.screenX, defaults.screenY,defaults.clientX,defaults.clientY,
			defaults.ctrlKey,defaults.altKey,defaults.shiftKey,defaults.metaKey,
			defaults.button,defaults.relatedTarget);
        this.simulateEvent(element);
	},
	createMouseObject : function(element){
        MVC.Object.extend(this.event, this.create_mouse_options(element));
		
        if(!MVC.Browser.Gecko && 
			(element.nodeName.toLowerCase() == 'input' || 
			(element.type && element.type.toLowerCase() == 'checkbox'))) 
			element.checked = (element.checked ? false : true);
		this.simulateEvent(element);
	}
};




MVC.Synthetic.center= function(element) {
    var d = MVC.Element.dimensions(element);
    var p = MVC.Element.offset(element);
    return p.plus(d.app(function(u){return u /2;})  )
};


