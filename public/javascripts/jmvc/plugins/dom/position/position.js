//From jQuery
/**
 * @add MVC.Element Static
 */
if ( document.documentElement["getBoundingClientRect"] )
    
    MVC.Element.
    /**
     * Returns the position of the element on the page.
     * @plugin dom/position
     * @param {HTMLElement} element
     */
    offset = function(element) {
	        if ( !element ) return { top: 0, left: 0 };
            if ( element == window ) return MVC.Element._offset.window_offset();
	        if ( element === element.ownerDocument.body ) return MVC.Element._offset.bodyOffset( element );
	        var box  = element.getBoundingClientRect(), doc = element.ownerDocument, body = doc.body, docElem = doc.documentElement,
	            clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
	            top  = box.top  + (self.pageYOffset || MVC.Element._offset.box_model && docElem.scrollTop  || body.scrollTop ) - clientTop,
	            left = box.left + (self.pageXOffset || MVC.Element._offset.box_model && docElem.scrollLeft || body.scrollLeft) - clientLeft;
	        return new MVC.Vector(left, top);
    };
else
    MVC.Element.offset = function(element) {
        if ( !element ) return { top: 0, left: 0 };
        if ( element == window ) return MVC.Element._offset.window_offset();
        if ( element === element.ownerDocument.body ) return MVC.Element._offset.bodyOffset( element );
        MVC.Element._offset.initialized || MVC.Element._offset.initialize();

        var elem = element, offsetParent = elem.offsetParent, prevOffsetParent = elem,
            doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
            body = doc.body, defaultView = doc.defaultView,
            prevComputedStyle = defaultView.getComputedStyle(elem, null),
            top = elem.offsetTop, left = elem.offsetLeft;

        while ( (elem = elem.parentNode) && elem !== body && elem !== docElem && elem !== doc ) {
            computedStyle = defaultView.getComputedStyle(elem, null);
            top -= elem.scrollTop;
            left -= elem.scrollLeft;
            if ( elem === offsetParent ) {
                top += elem.offsetTop;
                left += elem.offsetLeft;
                if ( MVC.Element._offset.doesNotAddBorder && !(MVC.Element._offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName)) )
                    top  += parseInt( computedStyle.borderTopWidth,  10) || 0;
                    left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
                prevOffsetParent = offsetParent; offsetParent = elem.offsetParent;
            }
            if ( MVC.Element._offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" )
                top  += parseInt( computedStyle.borderTopWidth,  10) || 0;
                left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
            prevComputedStyle = computedStyle;
        }

        if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ){
            top  += body.offsetTop;
            left += body.offsetLeft;
        }

        if ( prevComputedStyle.position === "fixed" ){
            top  += Math.max(docElem.scrollTop, body.scrollTop);
            left += Math.max(docElem.scrollLeft, body.scrollLeft);
        }
            

        return new MVC.Vector(left, top);
    };

MVC.Element._offset = {
    initialize: function() {
        if ( this.initialized ) return;
        var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, rules, prop, bodyMarginTop = body.style.marginTop,
            html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"cellpadding="0"cellspacing="0"><tr><td></td></tr></table>';

        rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' }
        for ( prop in rules ) container.style[prop] = rules[prop];

        container.innerHTML = html;
        body.insertBefore(container, body.firstChild);
        innerDiv = container.firstChild; 
        checkDiv = innerDiv.firstChild; 
        td = innerDiv.nextSibling.firstChild.firstChild;

        this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
        this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

        innerDiv.style.overflow = 'hidden'; innerDiv.style.position = 'relative';
        this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

        body.style.marginTop = '1px';
        this.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
        body.style.marginTop = bodyMarginTop;

        body.removeChild(container);
        this.initialized = true;
    },

    bodyOffset: function(body) {
        MVC.Element._offset.initialized || MVC.Element._offset.initialize();
        var top = body.offsetTop, left = body.offsetLeft;
        if ( MVC.Element._offset.doesNotIncludeMarginInBodyOffset )
            top  += parseInt( MVC.Element.get_style(body, 'marginTop'), 10 ) || 0;
            left += parseInt( MVC.Element.get_style(body, 'marginLeft'), 10 ) || 0;
        return new MVC.Vector(left, top);
    },
    box_model :!MVC.Browser.IE || document.compatMode == "CSS1Compat",
    window_offset : function(){
        return new MVC.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft,
                              window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop)
    }
};




MVC.Object.extend(MVC.Element, {
  /**
   * Returns if a coordinate is within an element taking scrolling into account.
   * @plugin dom/position
   * @param {HTMLElement} element
   * @param {Number} x pixels on the page
   * @param {Number} y pixels on the page
   * @param {Boolean} cache If present, an object that will be used to cache position lookups
   * @return {Boolean} true if x, y is inside the element, false if otherwise.
   */
  within: function(element, x, y, cache) {
  	if(element == document.documentElement) return true;
    var offset = cache ? 
             MVC.Dom.data(element,"offset") ||  MVC.Dom.data(element,"offset", MVC.Element.offset(element)) :
             MVC.Element.offset(element);
    if(element == document.documentElement) return true;
	var res = this._within_box(x, y, 
		                    offset[0],offset[1],
		                    element.offsetWidth,  element.offsetHeight )
	
	//console.log("width ",cache,  
	//	                    offset[0],offset[1], width,  element.offsetHeight, res )
    return res;
  },
  /**
   * Returns if an element is within a box.
   * @plugin dom/position
   * @param {HTMLElement} element
   * @param {Number} left
   * @param {Number} top
   * @param {Number} width
   * @param {Number} height
   * @param {Boolean} cache
   * @return {Boolean} true if at least part of the element is within the box, false if otherwise.
   */
  within_box : function(element, left, top, width, height, cache){
  	var offset = cache ? 
             MVC.Dom.data(element,"offset") ||  MVC.Dom.data(element,"offset", MVC.Element.offset(element)) :
             MVC.Element.offset(element);
    
	var ew = element.clientWidth, eh = element.clientHeight;

	return !( (offset.y() > top+height) || (offset.y()+eh < top) || (offset.x() > left+width ) || (offset.x()+ew < left));

  },
  _within_box : function(x, y, left, top, width, height ){
	return (y >= top &&
            y <  top + height &&
            x >= left &&
            x <  left + width);
  },
  event_position_relative_to_element : function(element, event, cache){
     var offset = cache ? 
             MVC.Dom.data(element,"offset") ||  MVC.Dom.data(element,"offset", MVC.Element.offset(element)) :
             MVC.Element.offset(element);
     
     var point = MVC.Event.pointer(event);
     
     var xcomp = point.x();
     var ycomp = point.y();
     
     return new MVC.Vector(xcomp -offset[0] , ycomp - offset[1]);
  },
  /**
   * Returns an object with important position and dimension information on the document and window.
   * @plugin dom/position
   * @return {Object}
   */
  window_dimensions: function(){
         var de = document.documentElement, 
             st = window.pageYOffset ? window.pageYOffset : de.scrollTop,
             sl = window.pageXOffset ? window.pageXOffset : de.scrollLeft;
         
         var wh = window.innerHeight ? window.innerHeight : de.clientHeight, 
             ww = window.innerWidth ? window.innerWidth :de.clientWidth;
         if(wh == 0){
             wh = document.body.clientHeight;
             ww = document.body.clientWidth;
         }
         return {
             window_height: wh,
             window_width: ww,
             document_height: MVC.Browser.IE ? document.body.offsetHeight : de.offsetHeight,
             document_width: MVC.Browser.IE ? document.body.offsetWidth :de.offsetWidth,
             scroll_left: sl,
             scroll_top: st,
			 scroll_height: document.documentElement.scrollHeight,
			 scroll_width: document.documentElement.scrollWidth,
             window_right: sl+ ww,
             window_bottom: st+ wh
         }
    },
    // Compare Position - MIT Licensed, John Resig
    /**
     * Compares the position of two nodes and returns at bitmask detailing how they are positioned 
     * relative to each other.  You can expect it to return the same results as 
     * [http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition | compareDocumentPosition].
     * Parts of this documentation and source come from [http://ejohn.org/blog/comparing-document-position | John Resig].
     * @plugin dom/position
     * @param {HTMLElement} a the first node
     * @param {HTMLElement} b the second node
     * @return {Number} A bitmap with the following digit values:
     * <table class='options'>
     *     <tr><th>Bits</th><th>Number</th><th>Meaning</th></tr>
     *     <tr><td>000000</td><td>0</td><td>Elements are identical.</td></tr>
     *     <tr><td>000001</td><td>1</td><td>The nodes are in different documents (or one is outside of a document).</td></tr>
     *     <tr><td>000010</td><td>2</td><td>Node B precedes Node A.</td></tr>
     *     <tr><td>000100</td><td>4</td><td>Node A precedes Node B.</td></tr>
     *     <tr><td>001000</td><td>4</td><td>Node B contains Node A.</td></tr>
     *     <tr><td>010000</td><td>16</td><td>Node A contains Node B.</td></tr>
     *     </tr>
     * </table>
     */
    compare: function(a, b){
        if(a.compareDocumentPosition){
            return a.compareDocumentPosition(b)
        }else if(a.contains){
            
        }
        var number = (a != b && a.contains(b) && 16) + (a != b && b.contains(a) && 8);
        if(a.sourceIndex){
            number += (a.sourceIndex < b.sourceIndex && 4)
            number += (a.sourceIndex > b.sourceIndex && 2)
        }else{
            range = document.createRange();
            range.selectNode(a);
            sourceRange = document.createRange();
            sourceRange.selectNode(b);
            compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
            number += (compare == -1 && 4)
            number += (compare == 1 && 2)
        }
        return number;
    }
    
});







	

