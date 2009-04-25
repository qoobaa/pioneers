Engine =  function(uri, name){
    if(! uri.match(/^http/)){
        this.name = uri;
        return this.check_engine_list();
    }
    this.uri =  uri;
    if(name){
        this.name = name;
    }else
        this.guess_name(uri);
}
Engine.prototype = {
    install_using_http: function(options){
        this.install_dependancies();
        
        
        options = options || {};
        new File("engines/"+this.name).mkdir();
        var fetcher = new RecursiveHTTPFetcher(this.uri, -1, "engines/"+this.name)
        fetcher.quiet = options.quiet || true
        fetcher.fetch();
        print("\n  "+this.name+" engine downloaded.")
    },
    guess_name: function(url){
      this.name = new MVC.File(url).basename();
      if(this.name == 'trunk' || ! this.name){
          this.name = new MVC.File( new MVC.File(url).dir() ).basename();
      }
    },
	check_engine_list : function(){
        print("  Looking for engine ...")
        
        var plugin_list_source = readUrl("http://javascriptmvc.googlecode.com/svn/branches/1_5/jmvc/rhino/command/engine_list.json");
        var plugin_list;
        eval("plugin_list = "+plugin_list_source);
        this.uri = plugin_list[this.name]
        if(!this.uri){
            print("  no plugin named '"+this.name+"' was found.  Maybe try supplying a url.");
            quit();
        }
        print("  Engine found.")
        
    },
    install_dependancies : function(){
        print("  Checking dependencies ...")
        var depend_url = this.uri + (this.uri.lastIndexOf("/") == this.uri.length - 1 ? "" : "/" )+"dependencies.json"
        var depend_text;
        try{
           depend_text = readUrl(depend_url);
        }catch(e){};
        if(!depend_text ) {
            print("  No dependancies")
            return;
        }
        print("  Found dependancies ...")
        var dependancies = JSONparse( depend_text )
        if(dependancies.plugins){
            for(var plug_name in dependancies.plugins){
                if(prompt.yesno("Install dependancy "+plug_name+"? (yN):")){
                    print("Installing "+plug_name+"...")
                    var plugin = new Plugin(dependancies.plugins[plug_name] , plug_name);
                    plugin.install_using_http();
                }
            }
        }
        
        if(dependancies.engines){
            for(var plug_name in dependancies.engines){
                if(prompt.yesno("Install dependancy "+plug_name+"? (yN):")){
                    print("Installing "+plug_name+"...")
                    var engine = new Engine(dependancies.engines[plug_name] , plug_name);
                    engine.install_using_http();
                }
            }
        }
        print("  Installed all dependencies for "+this.name)
    }
}

