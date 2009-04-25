/**
 * @constructor
 * Adds run and run next functions to a Test Class
 * @init Adds
 * @param {Object} object
 * @param {Function} iterator_name - "Tests"
 * @param {Object} params
 */
MVC.Test.Runner = function(object, iterator_name,params){
	var iterator_num;
	object.run = function(callback){
		object._callback = callback;
		iterator_num = 0;
		params.start.call(object);
		object.run_next();
	}
	object.run_next = function(){
		if(iterator_num != null && iterator_num < object[iterator_name].length){
			if(iterator_num > 0) params.after.call(object, iterator_num-1);
			iterator_num++;
			object[iterator_name][iterator_num-1].run(object.run_next)
		}else if(iterator_num != null){
			if(iterator_num > 0) params.after.call(object, iterator_num-1);
			params.done.call(object);
			if(object._callback){
				object._callback();
				object._callback = null;
			}else{
				//if(MVC.Browser.Gecko) window.blur();
				//else MVC.Console.window.focus();
			}
		}
	}
};