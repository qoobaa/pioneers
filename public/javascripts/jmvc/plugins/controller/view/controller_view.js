/**
 * @add MVC.Controller Prototype
 */

MVC.Controller.prototype.
/**
 * Renders a View template with the controller instance. If action or partial 
 * are not supplied in the options, 
 * it looks for a view in app/views/controller_name/action_name.ejs
 * 
 * @code_start
 * TasksController = MVC.Controller.extend('tasks',{
 *   click : function(params){
 *     this.data = "Hello_world"                             // can display with &lt;%= data %>
 *     this.render({after: params.element, action: "under"}) // renders with views/tasks/under.ejs
 *     this.render({to: "element_id"})                       // renders with views/tasks/click.ejs
 *     this.render({top: "another_e", partial: "bee/sugar")) // renders with views/bee/_sugar.ejs
 *   }
 * })
 * @code_end
 * @plugin controller/view
 * @return {String} the result of the render.
 * @param {Object} options A hash with the following properties
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>action</td>
						<td>null</td>
						<td>If present, looks for a template in app/views/<i>controller_name</i>/<i>action</i>.ejs
						</td>
					</tr>
					<tr>
						<td>partial</td>
						<td>null</td>
						<td>A string value that looks like: 'folder/template' or 'template'.  If a folder is present,
						    it looks for a template in app/views/<i>folder</i>/_<i>template</i>.ejs; otherwise,
							it looks for a template in app/views/<i>controller_name</i>/_<i>template</i>.ejs.
						</td>
					</tr>
					<tr>
						<td>to</td>
						<td>null</td>
						<td>If present, a HTMLElement or element ID whose text will be replaced by the render.
						</td>
					</tr>
					<tr>
						<td>before, after, top, bottom</td>
						<td>null</td>
						<td>If present, the content will be placed relative to 
						the HTMLElement or element ID.  The dom/element plugin is required for this functionality.
						</td>
					</tr>
					<tr>
						<td>text</td>
						<td>null</td>
						<td>Instead of using a view to generate text, it uses the text as the rendered text.
						</td>
					</tr>
					<tr>
						<td>using</td>
						<td>null</td>
						<td>If present, renders with the data in using instead of the controller instance.  This is important for
						stateful controllers.
						</td>
					</tr>
				</tbody></table>
	 
 */
render = function(options) {
		var result, render_to_id = MVC.RENDER_TO, plugin_url;
		var controller_name = this.Class.className;
		var action_name = this.action_name;
        if(!options) options = {};
        
        var helpers = {};
        if(options.helpers){
            for(var h =0; h < options.helpers.length; h++){
                var n = MVC.String.classize( options.helpers[h] );
                MVC.Object.extend(helpers, window[n] ? window[n].View().helpers : {} );
            }
        }
        
		if(typeof options == 'string'){
			result = new MVC.View({url:  options  }).render(this, helpers);
		}
		else if(options.text) {
            result = options.text;
        }
        else {
            var convert = function(url){
				var url =  MVC.String.include(url,'/') ? url.split('/').join('/_') : controller_name+'/'+url;
				var url = url + MVC.View.ext;
				return url;
			};
			if(options.plugin){
                plugin_url = '../jmvc/plugins/'+options.plugin;
            }
            
			if(options.action) {
				var url = '../views/'+convert(options.action);
            }
			else if(options.partial) {
                var url = '../views/'+convert(options.partial);
			}else
            {
                var url = '../views/'+controller_name+'/'+action_name.replace(/\.|#/g, '').replace(/ /g,'_')+MVC.View.ext;
            }
			var data_to_render = options.using || this;
			if(options.locals) {
				for(var local_var in options.locals) {
					data_to_render[local_var] = options.locals[local_var];
				}
			}
            var view;
            if(!plugin_url){
                view = new MVC.View({url:  new MVC.File(url).join_from(this.Class._path)  }); //what about controllers in other folders?
            }else{
                //load plugin if it has been included
                try{
                    var view = new MVC.View({url:  MVC.View.get(plugin_url) ? plugin_url :  url  });
                }catch(e){
                    if(e.type !='JMVC') throw e;
                    var view = new MVC.View({url:  plugin_url  });
                }
            }
            result = view.render(data_to_render, helpers);
		}
		//return result;
		var locations = ['to', 'before', 'after', 'top', 'bottom','replace'];
		var element = null;
		for(var l =0; l < locations.length; l++){
			if(typeof  options[locations[l]] == 'string'){
				var id = options[locations[l]];
				options[locations[l]] = MVC.$E(id);
				if(!options[locations[l]]) 
					throw {message: "Can't find element with id: "+id, name: 'ControllerView: Missing Element'};
			}
			
			if(options[locations[l]]){
				element = options[locations[l]];
				if(locations[l] == 'to'){
                    if(MVC.$E.update)
                        MVC.$E.update(options.to , result);
                    else
					    options.to.innerHTML = result;
				}else if(locations[l] == 'replace'){
                    MVC.$E.replace(options.replace , result);
                }
                else{
					if(!MVC.$E.insert ) throw {message: "Include can't insert "+locations[l]+" without the element plugin.", name: 'ControllerView: Missing Plugin'};
					var opt = {};
					opt[locations[l]] = result;
					MVC.$E.insert(element, opt );
				}
			} 
		}
		return result;

};
//MVC.Controller.Stateful.prototype.render = MVC.Controller.prototype.render; // this needs to go
