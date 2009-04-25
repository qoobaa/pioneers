

/**
 * @constructor
 * Used for creating and dispatching synthetic events.
 * @code_start
 * new MVC.SyntheticEvent('click').send(MVC.$E('id'))
 * @code_end
 * @init Sets up a synthetic event.
 * @param {String} type type of event, ex: 'click'
 * @param {optional:Object} options
 */
MVC.SyntheticEvent = function(type, options){
	this.type = type;
	this.options = options || {};
}
MVC.SyntheticEvent.prototype = 
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
	create_event: function(element){
		if(document.createEvent) {
			this.createEvent(element);
		} else if (document.createEventObject) {
			this.createEventObject(element);
		} else
			throw "Your browser doesn't support dispatching events";
		return this.event;
	},
	createEvent : function(element) {
		if(MVC.Array.include(['keypress','keyup','keydown'], this.type))
			this.createKeypress(element, this.options.character);
		else if(this.type == 'submit')
			this.createEvents(element);
		else if(MVC.Array.include(['click','dblclick','mouseover','mouseout','mousemove','mousedown','mouseup','contextmenu'],this.type))
			this.createMouse(element);
	},
	createEventObject : function(element) {
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
	        this.event = document.createEventObject();
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
		this.event = document.createEventObject();
		
  		this.event.charCode = (character? character.charCodeAt(0) : 0);
  		this.event.keyCode = this.options.keyCode || (character? character.charCodeAt(0) : 0);
		var fire_event = this.simulateEvent(element);
		if(fire_event && this.type == 'keypress' && !MVC.Browser.Gecko && 
            (element.nodeName.toLowerCase() == 'input' || element.nodeName.toLowerCase() == 'textarea')) {
                if(character) element.value += character;
                else if(this.options.keyCode && this.options.keyCode == 8) element.value = element.value.substring(0,element.value.length-1);
        }
	},
	createMouse : function(element){
		this.event = document.createEvent('MouseEvents');
		var center = MVC.Test.center(element);
		var defaults = MVC.Object.extend({
			bubbles : true,cancelable : true,
			view : window,
			detail : 1,
			screenX : 366, screenY : 195,clientX : center[0], clientY : center[1],
			ctrlKey : false, altKey : false, shiftKey : false, metaKey : false,
			button : (this.type == 'contextmenu' ? 2 : 0), 
			relatedTarget : null
		}, this.options);
		
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
		this.event = document.createEventObject();
		var center = MVC.Test.center(element);
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
		
		MVC.Object.extend(this.event, defaults);
		if(!MVC.Browser.Gecko && 
			(element.nodeName.toLowerCase() == 'input' || 
			(element.type && element.type.toLowerCase() == 'checkbox'))) 
			element.checked = (element.checked ? false : true);
		this.simulateEvent(element);
	},
	drag: function(target){
		//get from and to
		
		var addxy = function(part, options){
			if(!options[part].x || !options[part].y ){
				if(typeof options[part] == 'string') options[part] = document.getElementById(options[part])
				var center = MVC.Test.center(options[part]);
				options[part].x = center.left;
				options[part].y = center.top;
			}
		}
		addxy('from', this.options);
		addxy('to', this.options);
		if(this.options.duration){
			return new MVC.Test.Drag(target, this.options)
		}
		var x = this.options.from.x;
		var y = this.options.from.y;
		var steps = this.options.steps || 100;
		this.type = 'mousedown';
		this.options.clientX = x;
		this.options.clientY = y;
		this.create_event(target);
		this.type = 'mousemove';
		for(var i = 0; i < steps; i++){
			x = this.options.from.x + (i * (this.options.to.x - this.options.from.x )) / steps;
			y = this.options.from.y + (i * (this.options.to.y - this.options.from.y )) / steps;
			this.options.clientX = x;
			this.options.clientY = y;
			this.create_event(target);
		}
	},
	// syntax 1: this.Write(input_params.element, 'Brian');
	// syntax 2: this.Write(input_params.element, {text: 'Brian', callback: this.next_callback()});
	write : function(element) {
		element.focus();
		return new MVC.Test.Write(element, this.options)
	}
};

MVC.Test.Write = function(element, options){
	this.delay = 100;
	if(typeof options == 'string') {
		this.text = options;
		this.synchronous = true;
	} else {
		if(options.callback) 			this.callback = options.callback;
		if(options.text) 				this.text = options.text;
		if(options.synchronous == true) this.synchronous = true;
	}
	this.element = element;
	this.text_index = 1;
	if(this.synchronous == true) {
		for(var i = 0; i < this.text.length; i++) {
			this.write_character(this.text.substr(i,1));
		}
	} else {
		this.write_character(this.text.substr(0,1));
		setTimeout(this.next_callback(), this.delay);
	}
};
MVC.Test.Write.prototype = {
	next: function(){
		if( this.text_index >= this.text.length){
			if(this.callback) 	
				this.callback({element: this.target});
			else
				return;
		}else{
			this.write_character(this.text.substr(this.text_index,1));
			this.text_index++;
			setTimeout(this.next_callback(), this.delay);
		}
	},
	write_character : function(character) {
		new MVC.SyntheticEvent('keydown', {character: character}).send(this.element);
		new MVC.SyntheticEvent('keypress', {character: character}).send(this.element);
		new MVC.SyntheticEvent('keyup', {character: character}).send(this.element);
	},
	next_callback : function(){
		var t = this;
		return function(){
			t.next();
		};
	}
};
MVC.Test.Drag = function(target , options){
	this.callback = options.callback;
	this.start_x = options.from.x;
	this.end_x = options.to.x;
	this.delta_x = this.end_x - this.start_x;
	this.start_y = options.from.y;
	this.end_y = options.to.y;
	this.delta_y = this.end_y - this.start_y;
	this.target = target;
	this.duration = options.duration ? options.duration*1000 : 1000;
	this.start = new Date();
	new MVC.SyntheticEvent('mousedown', {clientX: this.start_x, clientY: this.start_y}).send(target);
	
	this.pointer = document.createElement('div');
	this.pointer.style.width = '10px';
	this.pointer.style.height = '10px';
	this.pointer.style.backgroundColor = 'RED';
	this.pointer.style.position = 'absolute';
	this.pointer.style.left = ''+this.start_x+'px';
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var pointerY = this.start_y+scrollTop;
	this.pointer.style.top = ''+pointerY+'px';
	this.pointer.style.lineHeight = '1px';
	document.body.appendChild(this.pointer);
	setTimeout(this.next_callback(), 20);
};
MVC.Test.Drag.prototype = {
	next: function(){
		var now = new Date();
		var difference = now - this.start;
		if( difference > this.duration ){
			new MVC.SyntheticEvent('mousemove', {clientX: this.end_x, clientY: this.end_y}).send(this.target);
			var event = new MVC.SyntheticEvent('mouseup', {clientX: this.end_x, clientY: this.end_y}).send(this.target);
			this.pointer.parentNode.removeChild(this.pointer);
			if(this.callback) this.callback({event: event, element: this.target});
		}else{
			var percent = difference / this.duration;
			var x =  this.start_x + percent * this.delta_x;
			var y = this.start_y + percent * this.delta_y;
			
			this.pointer.style.left = ''+x+'px';
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
            var pointerY = y+scrollTop;
			this.pointer.style.top = ''+pointerY+'px';
			new MVC.SyntheticEvent('mousemove', {clientX: x, clientY: y}).send(this.target);
			setTimeout(this.next_callback(), 20);
		}
	},
	next_callback : function(){
		var t = this;
		return function(){
			t.next();
		};
	}
};

// get_dimensions and center are adapted from Prototype
//  Prototype JavaScript framework, version 1.6.0.1
//  (c) 2005-2007 Sam Stephenson

MVC.Test.get_dimensions = function(element){

    var display = element.style.display;
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
}

MVC.Test.center= function(element) {
    var d = MVC.Test.get_dimensions(element)
	var valueT = d.height / 2, valueL =d.width / 2;
	do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;
	valueT = valueT - scrollTop;
	valueL = valueL - scrollLeft;
	var result = [valueL, valueT];
	
	result.left = valueL;
	result.top = valueT;
    return result;
};


