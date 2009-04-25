MVC.$E = function(element){
	if(typeof element == 'string')
		element = document.getElementById(element);
	return element._mvcextend ? element : MVC.$E.extend(element);
};



MVC.Object.extend(MVC.$E, {
	insert: function(element, insertions) {
		element = typeof element == 'string'? jQuery('#'+element) : jQuery(element) ;
		
		if(typeof insertions == 'string'){insertions = {bottom: insertions};};
		
		if(insertions.before) element.before(insertions.before)
		if(insertions.after) element.after(insertions.after)
		if(insertions.bottom) element.append(insertions.bottom)
		if(insertions.top) element.prepend(insertions.top)
		return element;
	}
});




MVC.$E.extend = function(el){
	for(var f in MVC.$E){
		if(!MVC.$E.hasOwnProperty(f)) continue;
		var func = MVC.$E[f];
		if(typeof func == 'function'){
			//var names = MVC.Function.params(func);
			//if( names.length == 0) continue;
			//var first_arg = names[0];
			if( f[0] != "_" ) MVC.$E._extend(func, f, el);
		}
	}
	el._mvcextend = true;
	return el;
};
MVC.$E._extend = function(f,name,el){
	el[name] = function(){
		var arg = MVC.Array.from(arguments);
		arg.unshift(el);
		return f.apply(el, arg); 
	}
}

if(!MVC._no_conflict){
	$E = MVC.$E;
}
