MVC.ApplicationError = MVC.JsonPModel.extend('application_error',
{
    controller_name: "error",
    domain: 'https://damnit.jupiterit.com', name: 'error',
	textarea_text: "type description here",
	textarea_title: "Damn It!",
	close_time: 10,
	prompt_text: "Something just went wrong.  Please describe your most recent actions and let us know what happened. We'll fix the problem.",
	prompt_user: true,
	generate_content: function(params){
		var content = [];
		// intentionally put HTML Content at the end
		for(var attr in params){
			if(params.hasOwnProperty(attr) && attr != 'toString' && attr != 'HTML Content') content.push(attr+':\n     '+params[attr]);
		}
		if(params['HTML Content'])
			content.push('HTML Content'+':\n     '+params['HTML Content']);
		return content.join('\n');
	},
	create_containing_div: function(){
		var div = document.createElement('div');
		div.id = '_application_error';
		div.style.position = MVC.Browser.Gecko ? 'fixed' : 'absolute';
		div.style.bottom = '0px';
		div.style.left = '0px';
		div.style.margin = '0px';
		return div;
	},
	create_title: function(){
		var title = document.createElement('div');
		title.style.backgroundImage = 'url('+MVC.mvc_root+'/plugins/error/background.png)';
		title.style.backgroundAttachment = 'scroll';
		title.style.backgroundRepeat = 'repeat-x';
		title.style.backgroundPosition = 'center top';
		title.style.font = 'bold 12pt verdana';
		title.style.color ='white';
		title.style.padding='0px 5px 0px 10px';
		title.innerHTML+= "<a style='float:right; width: 50px;text-decoration:underline; color: Red; padding-left: 25px; font-size: 10pt; cursor: pointer' onclick='MVC.ApplicationError.send()'>Close</a> "+
		"<span id='_error_seconds' style='float:right; font-size:10pt;'></span>"+this.textarea_title;
		return title;
	},
	create_form: function(callback){
		var form = document.createElement('form');
		var leftmargin = MVC.Browser.IE ? 5 : 10;
		form.id = '_error_form';
		form.onsubmit = callback;
		form.innerHTML ="<div style='float: left; width: 300px;margin-left:"+leftmargin+"px;'>"+this.prompt_text+"</div>"+
		    "<input type='submit' value='Send' style='font-size: 12pt; float:right; margin: 17px 5px 0px 0px; width:60px;padding:5px;'/>"+
			"<textarea style='width: 335px; color: gray;' rows='"+(MVC.Browser.Gecko ? 2 : 3)+"' name='description' id='_error_text' "+
			"onfocus='MVC.ApplicationError.text_area_focus();' "+
			"onblur='MVC.ApplicationError.text_area_blur();' >"+this.textarea_text+"</textarea>";
		form.style.padding = '0px';
		form.style.font = 'normal 10pt verdana';
		form.style.margin = '0px';
		form.style.backgroundColor = '#FAE8CD';
		return form;
	},
	create_send_function: function(error){
		this.send = MVC.Function.bind(function(event){
			var params = {error: {}}, description;
			params.error.subject = error.subject;
			if((description = MVC.$E('_error_text'))){error['User Description'] = description.value;}
			if(this.prompt_user) {
				this.pause_count_down();
				document.body.removeChild(MVC.$E('_application_error'));
			}
			params.error.content = this.generate_content(error);
			this.kill_event(event);
            params.user_crypted_key = APPLICATION_KEY;
			this.create(params, function(){});
		}, this);
	},
	create_dom: function(error){
		if(MVC.$E('_application_error')) return; 
		var div = this.create_containing_div();
		document.body.appendChild(div);
		div.appendChild(this.create_title());
		div.appendChild(this.create_form(this.send));
		this.set_width();
		
		var seconds_remaining;
		var timer;
		
		this.count_down = function(){
			seconds_remaining --;
			document.getElementById('_error_seconds').innerHTML = 'This will close in '+seconds_remaining+' seconds.';
			if(seconds_remaining == 0){
				MVC.ApplicationError.pause_count_down();
				MVC.ApplicationError.send();
			}
		};
		this.start_count_down = MVC.Function.bind(function(){
			seconds_remaining = this.close_time;
			MVC.$E('_error_seconds').innerHTML = 'This will close in '+seconds_remaining+' seconds.';
			timer = setInterval(MVC.ApplicationError.count_down, 1000);
		}, this);
		this.pause_count_down = function(){
			clearInterval(timer);
			timer = null;
			
			MVC.$E('_error_seconds').innerHTML = '';
		};
		this.start_count_down();
	},
	prompt_and_send: function(error){
		this.create_send_function(error);
		if(this.prompt_user == true)
			this.create_dom(error);
		else
			this.send();
	},
	notify: function(e){
		e = this.transform_error(e);
		MVC.Object.extend(e,{
			'Browser' : navigator.userAgent,
			'Page' : location.href,
			'HTML Content' : document.documentElement.innerHTML.replace(/\n/g,"\n     ").replace(/\t/g,"     ")
		});
		if(Error && new Error().stack) e.Stack = new Error().stack;
		if(!e.subject) e.subject = 'ApplicationError on: '+window.location.href;
		this.prompt_and_send(e);
		return false;
	},
	text_area_focus: function(){
		var area = document.getElementById('_error_text');
		if(area.value == this.textarea_text) area.value = '';
		area.style.color = 'black';
		MVC.ApplicationError.pause_count_down();
	},
	text_area_blur: function(){
		var area = MVC.$E('_error_text');
		if(area.value == this.textarea_text || area.value == '') area.value = this.textarea_text;
		area.style.color = 'gray';
		MVC.ApplicationError.start_count_down();
	},
	set_width: function(){
		var cont, width;
		if(!(cont = MVC.$E('_application_error') )) return;
		width = document.body.clientWidth;
		cont.style.width = width+'px';
		MVC.$E('_error_text').style.width = (width-400)+'px';
	},
	transform_error: function(error){
		if(typeof error == 'string'){
			var old = error;
			error = { toString: function(){return old;}};
			error.message = old;
		}
		if(MVC.Browser.Opera && error.message) {
			var error_arr = error.message.match('Backtrace');
			if(error_arr) {
				var message = error.message;
				error.message = message.substring(0,error_arr.index);
				error.backtrace = message.substring(error_arr.index+11,message.length);
			}
		}
		return error;
	},
	kill_event: function(event) {
	    if(! event) return;
	    event.cancelBubble = true;
	    if (event.stopPropagation)  event.stopPropagation(); 
	    if (event.preventDefault)  event.preventDefault();
	}
},
{}
)

MVC.error_handler = function(msg, url, l){
	var e = {
		message: msg,
		fileName: url,
		lineNumber: l
	};
	MVC.ApplicationError.notify(e);
	return false;
};
if(MVC.Controller){
	MVC.Controller._dispatch_action = function(instance, action_name, params){
		try{
			return instance[action_name](params);
		}catch(e){
			MVC.ApplicationError.kill_event(params.event);
			e = MVC.ApplicationError.transform_error(e);
			
			MVC.Object.extend(e,{
				'Controller': instance.klass.className,
				'Action': action_name,
				subject: 'Dispatch Error: '+((e.message && typeof(e.message) == 'string') ? e.message : e.toString())
			});
			MVC.ApplicationError.notify(e);
			return false;
		}
	};
}

if(window.attachEvent) {
	window.attachEvent("onresize", MVC.ApplicationError.set_width);
}else{
	window.addEventListener('resize', MVC.ApplicationError.set_width, false);
}
window.onerror = MVC.error_handler;