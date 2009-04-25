
if(typeof load != 'undefined' && ! MVC.load_doc){
    load('jmvc/plugins/lang/standard_helpers.js');
    load('jmvc/plugins/view/view.js');
    load('jmvc/plugins/lang/class/setup.js');
        
    
    load('jmvc/rhino/documentation/application.js');
    load('jmvc/rhino/documentation/pair.js');
    load('jmvc/rhino/documentation/directives.js');
    load('jmvc/rhino/documentation/function.js');
    load('jmvc/rhino/documentation/class.js');
    load('jmvc/rhino/documentation/constructor.js');
    load('jmvc/rhino/documentation/file.js');
    
    load('jmvc/rhino/documentation/add.js');
    load('jmvc/rhino/documentation/static.js');
    load('jmvc/rhino/documentation/prototype.js');
    load('jmvc/rhino/documentation/attribute.js');
}else{
    include.plugins('view','lang/class');
    include(
        'application',
        'pair',
        'directives',
        'function',
        'class',
        'constructor',
        'file',
        'add',
        'static',
        'prototype',
        'attribute'
    )
}