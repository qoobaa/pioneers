include.plugins('lang');
if(typeof jQuery != 'undefined'){
	include('jquery_ajax')	
}else if( typeof Prototype != 'undefined' ){
	include('prototype_ajax')	
	
}else{
	include('ajax')
}

if(include.get_env() == "test" && MVC.Browser.Rhino)
	include('fixtures/setup')