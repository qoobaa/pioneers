
find_and_run = function(t,s){
	//opener.focus();	
	var t = opener.MVC.Tests[t]
	if(s) t.run_test(s);
	else t.run();
};
run_helper = function(t, h){
	opener.focus();	
	var t = opener.MVC.Tests[t]
	t.run_helper(h);
}
clean_messages = function(messages){
	for(var m = 0; m < messages.length; m++){
		messages[m] = messages[m].replace(/</g,'&lt;').replace(/\n/g,'\\n');
	}
	return messages
}
document.getElementById('your_app_name_unit').innerHTML = opener.MVC.app_name;
document.getElementById('your_app_name_functional').innerHTML = opener.MVC.app_name;


opener.MVC.Console.log('You are running '+
		'"'+opener.MVC.app_name+'" ' +'in the '+opener.include.get_env()+' environment.')


opener.OpenAjax.hub.subscribe("jmvc.test.assertions.update", function(called, assertions){

    var controller = assertions._test;
    var test_name = assertions._test_name
    var step = document.getElementById('step_'+controller.name+'_'+test_name);
	var result = step.childNodes[1];
	
	if(assertions.failures == 0 && assertions.errors == 0){
		step.className = 'passed'
		result.innerHTML = 'Passed: '+assertions.assertions+' assertion'+add_s(assertions.assertions)+' <br/>'+
			clean_messages(assertions.messages).join("<br/>")
		
	}else{
		step.className = 'failure'
		result.innerHTML = 'Failed: '+assertions.assertions+' assertion'+add_s(assertions.assertions)+
		', '+assertions.failures+' failure'+add_s(assertions.failures)+
		', '+assertions.errors+' error'+add_s(assertions.errors)+' <br/>'+
			clean_messages(assertions.messages).join("<br/>")
	}
});

opener.OpenAjax.hub.subscribe("jmvc.test.running", function(called, assertions){
    var controller = assertions._test, test_name = assertions._test_name; 
    var step = document.getElementById('step_'+controller.name+'_'+test_name);
	step.className = '';
	var result = step.childNodes[1];
	result.innerHTML = 'Running ...'
});

opener.OpenAjax.hub.subscribe("jmvc.test.created", function(called, test){
    prepare_page = function(type) {
		document.getElementById(type+'_explanation').style.display = 'none';
		document.getElementById(type+'_test_runner').style.display = 'block';
	}
    
    if(test.type == 'unit')
			prepare_page('unit');
		else
			prepare_page('functional');
	var insert_into = document.getElementById(test.type+'_tests');
	var txt = "<h3><img alt='run' src='playwhite.png' onclick='find_and_run(\""+test.name+"\")'/>"+test.name+" <span id='"+test.name+"_results'></span></h3>";
	txt += "<div class='table_container'><table cellspacing='0px'><thead><tr><th>tests</th><th>result</th></tr></thead><tbody>";
	for(var t in test.tests ){
		if(! test.tests.hasOwnProperty(t) ) continue;
		if(t.indexOf('test') != 0 ) continue;
		var name = t.substring(5)
		txt+= '<tr class="step" id="step_'+test.name+'_'+t+'">'+
		"<td class='name'>"+
		"<a href='javascript: void(0);' onclick='find_and_run(\""+test.name+"\",\""+t+"\")'>"+name+'</a></td>'+
		'<td class="result">&nbsp;</td></tr>'
	}
	txt+= "</tbody></table></div>";
	if(this.added_helpers){
		txt+= "<div class='helpers'>Helpers: "
		var helpers = [];
		for(var h in test.added_helpers)
			if( test.added_helpers.hasOwnProperty(h) ) 
				helpers.push( "<a href='javascript: void(0)' onclick='run_helper(\""+test.name+"\",\""+h+"\")'>"+h+"</a>")
		txt+= helpers.join(', ')+"</div>";
	}
	var t = document.createElement('div');
	t.className = 'test'
	t.innerHTML  = txt;
	insert_into.appendChild(t);
});

opener.OpenAjax.hub.subscribe("jmvc.test.test.complete", function(called, test){
	var el = document.getElementById(test.name+"_results")
	el.innerHTML = '('+test.passes+'/'+test.test_names.length+ ')'
});

opener.OpenAjax.hub.subscribe("jmvc.test.unit.complete", function(called, runner){
    document.getElementById('unit_result').innerHTML = 
	'('+runner.passes+'/'+runner.tests.length+')' + (runner.passes == runner.tests.length ? ' Wow!' : '');
});



add_s = function(array){
	return array == 1 ? '' : 's'
};



show = function(type){
	var types = ['unit','functional','console'];
	var els = {}
	var buttons = {};
	for(var i = 0 ; i < types.length; i++){
		els[types[i]] =  document.getElementById(types[i]);
		buttons[types[i]] =  document.getElementById(types[i]+'_button');
		els[types[i]].style.display = 'none'
		buttons[types[i]].className = '';
	}
	els[type].style.display = 'block';
	buttons[type].className = 'selected';
	console_scroll();
};

if(window.innerHeight){
	getDimensions = function(){
		return {width: window.innerWidth, height: window.innerHeight};
	};
}else{
	getDimensions = function(){
		var el = document.documentElement;
		return {width: el.clientWidth, height: el.clientHeight - 2};
	};
}

window.onresize = window_resise =function(){
	var cl = document.getElementById('console_log');
	cl.style.height = ''+(getDimensions().height - 57)+'px';
	cl.style.width = ''+(getDimensions().width -1)+'px';
	var u = document.getElementById('unit')
	u.style.height = ''+(getDimensions().height - 57)+'px';
	
	var f = document.getElementById('functional')
	f.style.height = ''+(getDimensions().height - 57)+'px';
	if(opener.MVC.Browser.IE){
		var up = document.getElementById('unit_play').offsetWidth;
		var fp = document.getElementById('functional_play').offsetWidth;
		if(up){
			document.getElementById('unit_container').style.width = ''+(up+20)+'px'
		}else if(fp){
			document.getElementById('functional_container').style.width = ''+(fp+20)+'px'
		}
		
	}
	
}

console_scroll = function(){
	if(console_scrolled <= -10){
		if(opener.MVC.Browser.WebKit ){
			setTimeout(function(){
				var cl = document.getElementById('console_log');
				var newHeight = cl.clientHeight;
				cl.scrollTop = console_info.scrollTop;
			},1);
		}
	} else {
		setTimeout(function(){
		var cl = document.getElementById('console_log');
			cl.scrollTop = cl.scrollHeight;
		},1);
		
	}
	
};

console_log_scrolled = function(){
	var cl = document.getElementById('console_log');
	console_scrolled = cl.scrollTop - cl.scrollHeight+cl.clientHeight;
	console_info = {
		scrollTop : cl.scrollTop,
		clientHeight : cl.clientHeight,
		scrollHeight : cl.scrollHeight
	}
	
};

console_log_scrolled();
