MVC.Console = {};
MVC.Console.log = function(message){};
if(include.get_env() == 'development' || include.get_env() == 'test'){
	include('console');
}


