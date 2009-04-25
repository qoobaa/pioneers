
/**
 * Creates helpers from your controller actions.  For example, if your todos controller has an action
 * named click, a TodosClick helper wil be created.
 */
MVC.Test.Controller = MVC.Test.Functional.extend({
	init: function(name , tests ){
		var part = MVC.String.classize(name);
		var controller_name = part+'Controller';
		this.controller = window[controller_name];
		if(!this.controller) alert('There is no controller named '+controller_name);
		this.unit = name;
		this._super(part+'TestController', tests);
	},
	helpers : function(){
		var helpers = this._super();
		var actions = MVC.Object.extend({}, this.controller.actions) ;
		this.added_helpers = {};
		for(var action_name in actions){
			if(!actions.hasOwnProperty(action_name) || 
				!actions[action_name].event_type || 
				!actions[action_name].css_selector) 
					continue;
			var event_type = actions[action_name].event_type;
			var cleaned_name = actions[action_name].css_selector.replace(/\.|#/g, '')+' '+event_type;
			var helper_name = cleaned_name.replace(/(\w*)/g, function(m,part){ return MVC.String.capitalize(part)}).replace(/ /g, '');
			if(helpers[MVC.String.capitalize(event_type)])
				helpers[helper_name] = helpers[MVC.String.capitalize(event_type)].curry(actions[action_name].css_selector);
			this.added_helpers[helper_name] = helpers[helper_name];
		}
		return helpers;
	}
});
