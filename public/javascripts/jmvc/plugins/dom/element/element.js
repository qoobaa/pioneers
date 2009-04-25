//Much of the code in this plugin is adapated from Prototype
// Prototype JavaScript framework, version 1.6.0.1
// (c) 2005-2007 Sam Stephenson


/* @constructor
 * The Element API provides useful functions for manipulating and traversing the DOM. 
 * All of these elements are classed under $E. When using the Element or $E function, 
 * all Element functions that have their first argument as element are added to the element.
 * 
 * <h3>Examples</h3>
@code_start
Element('element_id') //-> HTMLElement
$E('element_id') //-> HTMLElement

$E('element_id').next() //-> HTMLElement
Element.next('element_id') //-> HTMLElement

$E('element_id').insert({after: '&lt;p&gt;inserted text&lt;/p&gt;'})
@code_end
 * @init the HTML Element for the given id with functions in Element.  This is also aliased as MVC.$E()
 * @param {String/HTMLElement} element Either an HTMLElement or a string describing the element's id.
 * @return {HTMLElement} the HTML Element for the given id with functions in Element.
 */
MVC.Element = function(element){
	if(typeof element == 'string')
		element = document.getElementById(element);
    if (!element) return element;
	return element._mvcextend ? element : MVC.Element.extend(element);
};
/* @Static*/
MVC.Object.extend(MVC.Element, {
    /**
     * Inserts HTML into the page relative to the given element.
     * @param {String/HTMLElement} element Either an HTML Element or a string describing the element's id. 
     * @param {Object} insertions Is an object with one of the following attributes:
     *     <table class="options">
					<tbody><tr><th>Option</th><th>Description</th></tr>
					<tr>
						<td>after</td>
						<td>Inserts the given HTML after the given element.</td>
					</tr>
					<tr>
						<td>before</td>
						<td>Inserts the given HTML before the given element.</td>
					</tr>
					<tr>
						<td>bottom</td>
						<td>Inserts the given HTML at the bottom of the given element's children.</td>
					</tr>
					<tr>
						<td>top</td>
						<td>Inserts the given HTML at the top of the given element's children.</td>
					</tr>
				</tbody>
			</table>
     * 
     */
	insert: function(element, insertions) {
		element = MVC.$E(element);
		if(typeof insertions == 'string'){insertions = {bottom: insertions};};

		var content, insert, tagName, childNodes;
		for (position in insertions) {
		  if(! insertions.hasOwnProperty(position)) continue;
		  content  = insertions[position];
		  position = position.toLowerCase();
		  insert = MVC.$E._insertionTranslations[position];
		  if (content && content.nodeType == 1) {
		    insert(element, content);
		    continue;
		  }
		  tagName = ((position == 'before' || position == 'after') ? element.parentNode : element).tagName.toUpperCase();
		  childNodes = MVC.$E._getContentFromAnonymousElement(tagName, content);
		  if (position == 'top' || position == 'after') childNodes.reverse();
		  for(var c = 0; c < childNodes.length; c++){
		  	insert(element, childNodes[c]);
		  }
		}
		return element;
	},
	_insertionTranslations: {
	  before: function(element, node) { element.parentNode.insertBefore(node, element);},
	  top: function(element, node) { element.insertBefore(node, element.firstChild);},
	  bottom: function(element, node) { element.appendChild(node);},
	  after: function(element, node) { element.parentNode.insertBefore(node, element.nextSibling);},
	  tags: {
	    TABLE:  ['<table>',                '</table>',                   1],
	    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
	    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
	    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
	    SELECT: ['<select>',               '</select>',                  1]
	  }
	},
    replace: function(element, content) {
        var element = MVC.$E(element);
        if (content.nodeType == 1) {
              element.parentNode.replaceChild(content, element);
              return element;
        }
        if(element.outerHTML){
            var parent = element.parentNode, tagName = parent.tagName.toUpperCase();
        
            if (MVC.Element._insertionTranslations.tags[tagName]) {
              var nextSibling = element.next();
              var fragments = MVC.Element._getContentFromAnonymousElement(tagName, content);
              parent.removeChild(element);
              if (nextSibling){
                  for(var i = 0 ; i < fragments.length; i++){
                      parent.insertBefore(fragments[i], nextSibling)
                  }
              }
              else{
                  for(var i = 0 ; i < fragments.length; i++){
                      parent.appendChild(fragments[i])
                  }
              }
            }
            else element.outerHTML = content
            return element;
            
        }else{
            if (content.nodeType != 1  ) {
              var range = element.ownerDocument.createRange();
              range.selectNode(element);
              content = range.createContextualFragment(content);
            }
            element.parentNode.replaceChild(content, element);
            return element;
        }
        
    },    
	_getContentFromAnonymousElement: function(tagName, html) {
	  var div = document.createElement('div'), t = MVC.$E._insertionTranslations.tags[tagName];
	  if (t) {
	    div.innerHTML = t[0] + html + t[1];
		for(var i=0; i < t[2]; i++){
			div = div.firstChild;
		}
	  }else div.innerHTML = html;
	  return MVC.Array.from(div.childNodes);
	},
    /*
     * Returns children with nodeType = 1
     * @return {HTMLElement}
     */
    get_children : function(element){
        var els = [];
        var el = element.first();
        while(el){ els.push(el);el = el.next(); }
        return els;
    },
    /**
     * Returns the first child with nodeType = 1
     * @param {HTMLElement} element
     * @param {Function} check if provided should return true or false for the element you want returned
     */
    first : function(element, check){
        check = check || function(){return true;}
        var next = element.firstChild;
		while(next && next.nodeType != 1 || (next && !check(next)) )
			next = next.nextSibling;
        return MVC.$E(next);
    },
    /*
     * returns the last child element with nodeType = 1
     * @return {HTMLElement}
     */
    last : function(element, check){
        check = check || function(){return true;}
        var previous = element.lastChild;
		while(previous && previous.nodeType != 1  || (previous && ! check(previous))  )
			previous = previous.previousSibling;
        return MVC.$E(previous);
    },
    /*
     * Returns the next sibling with nodeType = 1
     * @return {HTMLElement}
     */
	next : function(element, wrap, check){
		check = check || function(){return true;}
        var next = element.nextSibling;
		while(next && next.nodeType != 1 || (next && ! check(next)  ) )
			next = next.nextSibling;
        if(!next && wrap) return MVC.$E( element.parentNode ).first(check);
		return MVC.$E(next);
	},
    /*
     * Returns the previous sibling with nodeType = 1
     */
    previous : function(element, wrap, check){
		check = check || function(){return true;}
        var previous = element.previousSibling;
		while(previous && previous.nodeType != 1 || (previous && ! check(previous))  )
			previous = previous.previousSibling;
        if(!previous && wrap) return MVC.$E( element.parentNode ).last(check);
        return MVC.$E(previous);
	},
    /*
     * Toggles the style display.  It is assumed that no css is already being used to 
     * hide the element.  If you want to have the element hidden to start, write
     * style="display:none" in your html.
     * @return {String} the resulting display name.  '' if visible, 'none' if hidden.
     */
	toggle : function(element){
		return element.style.display == 'none' ? element.style.display = '' : element.style.display = 'none';
	},
    /*
     * Makes an element position ('relative', 'absolute', or 'static')
     * @return {HTMLElement} element
     */
    make_positioned: function(element) {
        element = MVC.$E(element);
        var pos = MVC.Element.get_style(element, 'position');
        if (pos == 'static' || !pos) {
          element._madePositioned = true;
          element.style.position = 'relative';
          // Opera returns the offset relative to the positioning context, when an
          // element is position relative but top and left have not been defined
          if (window.opera) {
            element.style.top = 0;
            element.style.left = 0;
          }
        }
        return element;
    },
    /*
     * Returns the style for a given element.
     */
    get_style:  function(element, style) {
        element = MVC.$E(element);
        style = style == 'float' ? 'cssFloat' : MVC.String.camelize(style);
        var value;
        if(element.currentStyle){
            var value = element.currentStyle[style];
        }else{
             var css = document.defaultView.getComputedStyle(element, null);
             value = css ? css[style] : null;
        }
        if (style == 'opacity') return value ? parseFloat(value) : 1.0;
        return value == 'auto' ? null : value;
    },
    /**
     * Returns the the position of the element by taking all of it and its parents'
     * offsetTop and offsetLeft values.
     * @code_start
     * MVC.$E('user').offset()
     * MVC.Element.offset(myelement);
     * @code_end
     * @param {String/HTMLElement} element the element you want the offset of.
     * @return {MVC.Vector} a vector with the top and bottom values.
     */
    /*offset: function(element) {
        var valueT = 0, valueL = 0;
        do {
          valueT += element.offsetTop  || 0;
          valueL += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);
        return new MVC.Vector( valueL, valueT );
    },*/
    /**
     * Returns true or false if one element is inside another element.
     * Typically this is called with an element's related target to prevent mouseout from being called
     * on nested HTML.  For example:
     * @code_start
     * MVC.$(event.target).has(event.relatedTarget);
     * @code_end
     * 
     * If you need to know more about elements position in the dom, try [MVC.Position.static.compare].
     * 
     * @param {HTMLElement} element outer element, or element in MVC.$E()
     * @param {HTMLElement} b inner element 
     * @return {Boolean} Returns true if b is in element, false if otherwise.
     */
    has: function(element, b){
      if(!b) return false; // if there is no relatedTarget
      if(typeof b == 'string') b = MVC.$E(b);
      return element.contains ?
        element != b && element.contains(b) :
        !!(element.compareDocumentPosition(b) & 16);
    },
    /**
     * Updates an element with content.  This is a cross browser substitute for innerHTML.  
     * It very valuable when inserting new table elements.
     * @param {HTMLElement} element the element you want updated
     * @param {String} content html content
     * @return {HTMLElement} element.
     */
    update: function(element, content){
        element = MVC.$E(element);
        var tagName = element.tagName.toUpperCase();
        if ( ( !MVC.Browser.IE && !MVC.Browser.Opera  )|| !( tagName in MVC.$E._insertionTranslations.tags) ){
            element.innerHTML = content;
        }else{
          //remove children
          var node;
          while( (node =  element.childNodes[0]) ){ element.removeChild(node) }
          
          var children = MVC.$E._getContentFromAnonymousElement(tagName, content);
          for(var c=0; c < children.length; c++){
              element.appendChild(children[c]);
          }
        }
        return element;
   },
   /*
    * Removes an element
    */
   /**
    * Removes the element from the dom.
    * @param {Object} element element to be removed
    * @return {HTMLElement} element
    */
   remove: function(element){
   		return element.parentNode.removeChild(element);
   },
   /**
    * Returns a vector with the element's dimensions.
    * @param {HTMLElement} element
    * @return {MVC.Vector} vector element.
    */
   dimensions: function(element){
        if(element === window) 
            return new MVC.Vector(window.innerWidth ? window.innerWidth :document.documentElement.clientWidth,
                                  window.innerHeight ? window.innerHeight : document.documentElement.clientHeight);
       
		if(!MVC.Element.has(document.body, element))
		   return new MVC.Vector(parseInt(element.get_style("width")),
			parseInt(element.get_style("height")));
        var display = element.style.display;
        if (display != 'none' && display != null) // Safari bug
          return new MVC.Vector( element.offsetWidth, element.offsetHeight );
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
        return new MVC.Vector( originalWidth, originalHeight);
    },
    /**
     * Adds a class to the html element.
     * @param {HTMLElement} element element that will have a class added to its className
     * @param {String} className
     * @return {HTMLElement} element
     */
    add_class : function(element, className){
        var cns = this.class_names(element);
        if(MVC.Array.include(cns, className)) return;
        cns.push(className);
        element.className = cns.join(" ");
        return element;
    },
     /**
     * Removes a class to the html element.
     * @param {HTMLElement} element element that will have a class removed from its className
     * @param {String} className
     * @return {HTMLElement} element
     */
    remove_class : function(element, className){
        var cns = this.class_names(element);
        var newcns = [];
        for(var i =0; i < cns.length; i++){
            if(cns[i] != className) newcns.push(cns[i]);
        }
        element.className = newcns.join(" ");
        return element;
    },
    /**
     * Returns a list of classNames
     * @param {Array} element
     */
    class_names : function(element){
        return element.className.split(MVC.Element._class_name_split);
    },
    _class_name_split : /\s+/,
    /**
     * Returns an array of matches if the element has a className, null if otherwise.
     * @code_start
     * MVC.$E("element_id").has_class(/\w+_(\d+)/) -> ['thing_5','5']
     * @code_end
     * @param {HTMLElement} element
     * @param {RegExp} regexp
     * @return {Array} 
     */
    has_class : function(element , regexp){
        var cns = this.class_names(element);
        var matches;
        for(var i =0; i < cns.length; i++){
            if((matches = cns[i].match(regexp))) return matches;
        }
    }
});

MVC.Element.extend = function(el){
	for(var f in MVC.Element){
		if(!MVC.Element.hasOwnProperty(f)) continue;
		var func = MVC.Element[f];
		if(typeof func == 'function'){
			if( f[0] != "_" ) MVC.Element._extend(func, f, el);
		}
	}
	el._mvcextend = true;
	return el;
};
MVC.Element._extend = function(f,name,el){
	el[name] = function(){
		var arg = MVC.Array.from(arguments);
		arg.unshift(el);
		return f.apply(el, arg); 
	};
};
MVC.$E = MVC.Element;
if(!MVC._no_conflict){
	$E = MVC.$E;
}
