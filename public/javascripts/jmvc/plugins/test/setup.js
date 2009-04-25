// we don't include the plugin file because thats done after the app file (in case jquery is loaded)
include(
    '../lang/standard_helpers',
    '../dom/query/standard')

include.plugins('lang/class','lang/openajax')

if(!window._rhino){
    include.plugins('debug')
}else{
    MVC.Console = {log: function(txt){
        print(txt);
    }}
}


include(
    'test',
    'runner',
    'assertions',
    'unit',
    'functional',
    'controller',
    'synthetic_events')