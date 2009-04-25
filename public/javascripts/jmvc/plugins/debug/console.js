if(include.get_env() != 'test' && typeof console != 'undefined'){
	MVC.Console.log = function(message){
			console.log(message)
	};
}else{
	
	MVC.Console = {};
	MVC.Console.window = window.open(MVC.mvc_root+'/plugins/debug/console.html', 'test', "width=600,height=400,resizable=yes,scrollbars=yes");
	MVC.Console.log = function(message, html){
		var el = MVC.Console.window.document.createElement(html ? 'p' : 'pre' );
		if(! MVC.Browser.IE || html){
			el.innerHTML = html ? message : message.toString().replace(/</g,'&lt;');
		}else{
			var lines = message.toString().split('\n')
			for(var l = 0 ; l < lines.length; l++){
				var txt = MVC.Console.window.document.createTextNode(lines[l] ? lines[l] : ' ')
				el.appendChild(txt);
				if(l != lines.length - 1) el.appendChild( MVC.Console.window.document.createElement('br')  )
			}
		}
		var place = MVC.Console.window.document.getElementById('console_log')
		place.appendChild(el);
		
		if(MVC.Console.window.window_resise){
			MVC.Console.window.window_resise();
			MVC.Console.window.console_scroll();
		}
		
		if(typeof console != 'undefined'){
			console.log(message)
		}
	};
}






