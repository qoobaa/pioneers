(function(){
    var URLClassLoader = Packages.java.net.URLClassLoader
    var URL = java.net.URL
    var File = java.io.File
    
    var ss  = new File("jmvc/rhino/shrinksafe.jar")
    var ssurl = ss.toURL()
    //print(ssurl);
    //quit();
    var urls = java.lang.reflect.Array.newInstance(URL,1)
    urls[0] = new URL(ssurl);
    var clazzLoader = new URLClassLoader(urls);
    //importPackage(Packages.org.dojotoolkit.shrinksafe);
    //importClass(Packages.org.dojotoolkit.shrinksafe.Compressor)
    var Compressor = clazzLoader.loadClass("org.dojotoolkit.shrinksafe.Compressor")
    
    var mthds = Compressor.getDeclaredMethods()
    CompressorMethod = null;
    for(var i = 0; i < mthds.length; i++){
  		var meth = mthds[i];
        if(meth.toString().match(/compressScript\(java.lang.String,int,int,boolean\)/))
        CompressorMethod = meth;
  	}
})();


MVCOptions.save = function(path, src){
    var out = new java.io.FileWriter( new java.io.File( path )),
            text = new java.lang.String( src || "" );
		out.write( text, 0, text.length() );
		out.flush();
		out.close();
};
MVCOptions.create_folder = function(path){
    var out = new java.io.File( path )
    out.mkdir();
};

MVCOptions.compress = function(src){
    var zero = new java.lang.Integer(0);
    var one = new java.lang.Integer(1);
    var tru = new java.lang.Boolean(true);
    var script = new java.lang.String(src);
    return CompressorMethod.invoke(null,script, zero, one, tru );
    //return Compressor.compressScript(script, zero, one, tru); 
};
MVCOptions.collect = function(total){
    var collection = '', txt;
	for(var s=0; s < total.length; s++){
		var includer = total[s];
        
        if(typeof includer == 'function'){
            collection += "include.next_function();\n"
        }else{
            txt = includer.process ? includer.process(includer) : includer.text
		    collection += "include.set_path('"+includer.start+"')"+";\n"+txt + ";\n";
        }
        
        
	}
	collection += "include.end_of_production();";
    return collection;
};


MVCOptions.collect_and_compress = function(total){
    var collection = '', script, txt, compressed;
	for(var s=0; s < total.length; s++){
		script = total[s];
        if(typeof script == 'function'){
            collection += "include.next_function();\n"
        }else{
            txt = script.process ? script.process(total[s]) : script.text;
    		compressed = script.compress == false ? txt : MVCOptions.compress(txt, script.path);
            collection += "include.set_path('"+script.start+"')"+";\n"+compressed + ";\n";
            
            
        }
	}
	collection += "include.end_of_production();";
    return collection;
}

