include.plugins('lang','lang/inflector','dom/event','lang/class','lang/openajax','dom/data');
include('delegator','controller');
if(MVC.View) include.plugins('controller/view');
//if(include.get_env() == 'test') include('test')