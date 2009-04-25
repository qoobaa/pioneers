/**
 * Query describes 2 functions
 * 	$$
 * 	$$.descendant
 */
if(typeof Prototype != 'undefined') {
	MVC.Query = $$;
	MVC.Query.descendant = function(element, selector) {
		return element.getElementsBySelector(selector);
	};
}else if(typeof jQuery != 'undefined'){
    MVC.Query = $
    MVC.Query.descendant = function(element, selector) {
		return $(element).find(selector);
	}
}
else
 	include("standard");