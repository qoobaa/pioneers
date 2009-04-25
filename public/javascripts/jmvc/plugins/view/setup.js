include.plugins('lang');
include('view');
if(include.get_env() == 'development')	include('fulljslint');

if(MVC.Controller) include.plugins('controller/view');