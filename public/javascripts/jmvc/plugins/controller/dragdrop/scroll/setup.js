include.plugins("dom/synthetic");

MVC.Scrollable = MVC.Class.extend({
	init : function(element){
		this.element = element;
	},
	dropover: function(params){
		
	},
	dropped: function(params){
		this.clear_timeout();
	}, 
	dropout : function(params){
		this.clear_timeout();
	},
	dropadd: function(params){
		
	},
	clear_timeout : function(){
		if(this.interval){
            clearTimeout(this.interval)
			this.interval = null;
		}
	},
	distance : function(diff){
		return (30 - diff) / 2;
	},
	dropmove: function(params){
        
        //if we were about to call a move, clear it.
        this.clear_timeout();
        
        //position of the mouse
		var mouse = MVC.Event.pointer(params.event)
        
        //get the object we are going to get the boundries of
        var location_object = params.element == document.documentElement ? window : params.element;
        
        //get the dimension and location of that object
        var dimensions = MVC.Element.dimensions(location_object),
            position = MVC.Element.offset(location_object);
        
        //how close our mouse is to the boundries
        var bottom = position.y()+dimensions.y() - mouse.y(),
            top = mouse.y() - position.y(),
            right = position.x()+dimensions.x() - mouse.x(),
            left = mouse.x() - position.x();
        
        //how far we should scroll
		var dx =0, dy =0;

        
        //check if we should scroll
        if(bottom < 30)
			dy = this.distance(bottom);
        else if(top < 30)
			dy = -this.distance(top)
        if(right < 30)
			dx = this.distance(right);
		else if(left < 30)
			dx = -this.distance(left);
		
        //if we should scroll
        if(dx || dy){
			//set a timeout that will create a mousemove on that object
			this.interval =  setTimeout( 
				MVC.Function.bind(this.move, 
								  this,  
								  params.element,
                                  params.drag.drag_element, 
								  dx, dy, 
								  params.event.clientX, params.event.clientY),15);
		}
	},
    /**
     * Scrolls an element then calls mouse a mousemove in the same location.
     * @param {HTMLElement} scroll_element the element to be scrolled
     * @param {HTMLElement} drag_element
     * @param {Number} dx how far to scroll
     * @param {Number} dy how far to scroll
     * @param {Number} x the mouse position
     * @param {Number} y the mouse position
     */
	move : function(scroll_element, drag_element, dx, dy, x,y){
        scroll_element.scrollTop  = scroll_element.scrollTop + dy;
		scroll_element.scrollLeft = scroll_element.scrollLeft + dx;
        new MVC.Synthetic("mousemove",{clientX: x, clientY: y} ).send(drag_element); //don't need to change position as it is screen
	}
})
