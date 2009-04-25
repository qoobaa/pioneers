MVC.render_to = function(file, ejs, data){
    var v = new View({text: readFile(ejs), name: ejs });
    
    MVCOptions.save(file,  v.render(data)  );
    
    //print( (first ? "Generating ...":"              ") + " "+file);
    
    //first = false;
};

/**
 * @class MVC.Doc
 * JavaScriptMVC comes with powerful and easy to extend documentation functionality - MVC Doc.
 * MVC Doc is designed specifically for documenting JavaScript.  It understands a little about
 * JavaScript syntax to guess at things like function names and parameters.  But, you can also
 * document complex functionality across multiple files. <br/>
 * 
 * <p>MVC Doc is pure JavaScript so it is easy to modify and make improvements.  First, lets show what
 * MVC Doc can document: </p>
 * <ul>
 *     <li>[MVC.Doc.Attribute | @attribute] -  values on an object.</li>
 *     <li>[MVC.Doc.Function | @function] - functions on an object.</li>
 *     <li>[MVC.Doc.Constructor | @constructor] - functions you call like: new Thing()</li>
 *     <li>[MVC.Doc.Class| @class] - normal JS Objects and source that uses [MVC.Class]</li>
 * </ul>
 * <p>You can also specifify the scope of where your functions and attributes are being added with: </p>
 * <ul>
 *     <li>[MVC.Doc.Prototype | @prototype] - add to the previous class or constructor's prototype functions</li>
 *     <li>[MVC.Doc.Static | @static] - add to the previous class or constructor's static functions</li>
 *     <li>[MVC.Doc.Add |@add] - add docs to a class or construtor described in another file</li>
 * </ul>    
 * <p>Finally, you have [MVC.Doc.Directive|directives] that provide addtional info about the comment:</p>
 * <ul>
 *     <li>[MVC.Doc.Directive.Alias|@alias]</li>
 *     <li>[MVC.Doc.Directive.Author|@author]</li>
 *     <li>[MVC.Doc.Directive.CodeStart|@code_start] - [MVC.Doc.Directive.CodeEnd|@code_end]</li>
 *     <li>[MVC.Doc.Directive.Hide|@hide]</li>
 *     <li>[MVC.Doc.Directive.Inherits|@inherits]</li>
 *     <li>[MVC.Doc.Directive.Init|@init]</li>
 *     <li>[MVC.Doc.Directive.Param|@param]</li>
 *     <li>[MVC.Doc.Directive.Plugin|@plugin]</li>
 *     <li>[MVC.Doc.Directive.Return|@return]</li>
 * </ul>
 * <h3>Example</h3>
 * The following documents a Person constructor.
 * @code_start
 * /* @constructor
 *  * Person represents a human with a name.  Read about the 
 *  * animal class [Animal | here].
 *  * @init 
 *  * You must pass in a name.
 *  * @params {String} name A person's name
 *  *|
 * Person = function(name){
 *    this.name = name
 *    Person.count ++;
 * }
 * /* @Static *|
 * MVC.Object.extend(Person, {
 *    /* Number of People *|
 *    count: 0
 * })
 * /* @Prototype *|
 * Person.prototype = {
 *   /* Returns a formal name 
 *    * @return {String} the name with "Mrs." added
 *    *|
 *   fancy_name : function(){
 *      return "Mrs. "+this.name;
 *   }
 * }
 * @code_end
 * There are a few things to notice:
 * <ul>
 *     <li>The example closes comments with <i>*|</i>.  You should close them with / instead of |.</li>
 *     <li>We create a link to another class with <i>[Animal | here]</i>.</li>
 * </ul>
 * 
 * <h3>Using with a JavaScritpMVC application</h3>
 * By default, compression will automatically document your code.  Simply compress your application with:
 * <pre>js apps/app_name/compress.js</pre>
 * The docs will be put in your docs folder.
 * <h3>Using without JavaScriptMVC</h3>
 * This process will be made easier in the future.  But you have to create a js file using
 * [MVC.Doc.Application|application] that
 * looks like this:
 * @code_start
 * //loads doc source
 * load('jmvc/rhino/documentation/setup.js'); 
 * //pass file locations, and a name to a new Doc.Application
 * new MVC.Doc.Application(['file1.js','folder/file2.js'], "MyApp");
 * @code_end
 */
MVC.Doc = 
/* @Static */
{    
    render_to: function(file, ejs, data){
        MVCOptions.save(file,  this.render(ejs, data) );
    },
    render : function(ejs, data){
         var v = new View({text: readFile(ejs), name: ejs });
        return v.render(data)
    },
    /**
     * Replaces content in brackets [] with a link to source.
     * @param {String} content Any text, usually a commment.
     */
    link_content : function(content){
        return content.replace(/\[\s*([^\|\]\s]*)\s*\|?\s*([^\]]*)\s*\]/g, function(match, first, n){
            //need to get last
            //need to remove trailing whitespace
            var url = MVC.Doc.objects[first];
            if(url){
                if(!n){
                    n = first.replace(/\.prototype|\.static/,"")
                }
                return "<a href='"+url+"'>"+n+"</a>"
            }else if(typeof first == 'string' && first.match(/^https?|www\.|#/)){
                return "<a href='"+first+"'>"+(n || first)+"</a>"
            }
            return  match;
        })
    },
    /**
     * Will replace with a link to a class or function if appropriate.
     * @param {Object} content
     */
    link : function(content){
        var url = MVC.Doc.objects[content];
        return url ? "<a href='"+url+"'>"+content+"</a>" : content;
    },
    /**
     * A map of the full name of all the objects the application creates and the url to 
     * the documentation for them.
     */
    objects : {},
    get_template : function(template_name){
        var temp = readFile("docs/templates/"+template_name+".ejs");
        if(!temp)
            temp = readFile("jmvc/rhino/documentation/templates/"+template_name+".ejs");
        
        var v = new View({text: temp, name: template_name });
        return v;
    }
};

/**
 * @constructor
 * @hide
 * Creates documentation for an application
 * @init
 * Generates documentation from the passed in files.
 * @param {Array} total An array of path names or objects with a path and text.
 * @param {Object} app_name The application name.
 */
MVC.Doc.Application = function(total, app_name){
    
    this.name = app_name;
    this.total = total;
    this.files = [];
    
   
    for(var s=0; s < total.length; s++){
        script = total[s];
        if(typeof script == "string"){
            script = total[s] = {path: script, text: readFile(script)};
        }
        
        if(typeof script != 'function' && !script.process){
            this.files.push( new MVC.Doc.File(total[s]) ) 
        }
	}
}


MVC.Doc.Application.prototype = 
/* @prototype */
{
    /**
     * Creates the documentation files.
     */
    generate : function(){
         this.all_sorted = MVC.Doc.Class.listing.concat( MVC.Doc.Constructor.listing ).sort( MVC.Doc.Pair.sort_by_name )
        var summary = this.left_side();
        
        //make classes
        for(var i = 0; i < MVC.Doc.Class.listing.length; i++){
            MVC.Doc.Class.listing[i].toFile(summary);
        }
        //MVC.Doc.Class.create_index();
        
        //make constructors
        for(var i = 0; i < MVC.Doc.Constructor.listing.length; i++){
            MVC.Doc.Constructor.listing[i].toFile(summary);
        }
        
        this.summary_page(summary)
    },
    /**
     * @return {string} The left side bar.
     */
    left_side: function(){

        return readFile("docs/templates/left_side.ejs") ? 
            MVC.Doc.render("docs/templates/left_side.ejs", this) : 
            MVC.Doc.render("jmvc/rhino/documentation/templates/left_side.ejs" , this)
    },
    get_name : function(i){
        var me = this.all_sorted[i].name
        if(i == 0) return me;
        
        //break previous and self
        var previous = this.all_sorted[i-1].name;
        var t = me.split(/\./)
        var p = previous.split(/\./);
        var left_res = [], right_res = []
        for(var j = 0; j < t.length; j++){
            if(p[j] && p[j] ==  t[j])
                left_res.push(t[j])
            else
                right_res.push(t[j])
        }
        return (left_res.length > 0 ? 
        "<span class='matches_previous'>"+left_res.join(".")+".</span>" : "")+right_res.join(".")
    },
    /**
     * Creates a page for all classes and constructors
     * @param {String} summary the left hand side.
     */
    summary_page : function(summary){
        MVC.Doc.render_to('docs/'+this.name+".html","jmvc/rhino/documentation/templates/summary.ejs" , this)

    },
    
    /**
     * Only shows five folders in a path.
     * @param {String} path a file path to convert
     * @return {String}
     */
    clean_path : function(path){
        return path;
        var parts = path.split("/")
         if(parts.length > 5) parts = parts.slice(parts.length - 5);
         return parts.join("/");
    }
}