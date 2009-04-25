/**
 * @hide
 * Documents javascript constructor classes typically created like:
 * new MyContructor(args).
 * 
 * A constructor can be described by putting @constructor as the first declaritive.
 * To describe the construction function, write that after init.  Example:
 * 
 * @code_start
 * /* @constructor
 *  * Person represents a human with a name 
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
 * 
 */
MVC.Doc.Constructor = MVC.Doc.Pair.extend('constructor',
/* @Static */
{
    code_match: MVC.Doc.Function.code_match,
    starts_scope: true,
    listing: [],
    create_index : function(){
        var res = '<html><head><link rel="stylesheet" href="../style.css" type="text/css" />'+
            '<title>Constructors</title></head><body>'
        res += '<h1>Constructors <label>LIST</label></h1>'
        for(var i = 0; i < this.listing.length; i++){
            var name = this.listing[i].name;
            res += "<a href='"+name+".html'>"+name+"</a> "
        }
        res +="</body></html>"
        MVCOptions.save('docs/constructors/index2.html', res)
    },
    init : function(){
        this.add(
                MVC.Doc.Directive.Init, 
                MVC.Doc.Directive.Param, 
                MVC.Doc.Directive.Inherits,
                MVC.Doc.Directive.Author,
                MVC.Doc.Directive.Return,
                MVC.Doc.Directive.Hide, MVC.Doc.Directive.CodeStart, MVC.Doc.Directive.CodeEnd, MVC.Doc.Directive.Alias,
                MVC.Doc.Directive.Plugin);
        this._super();
        this._file_view = MVC.Doc.get_template("file")
    }
},
/* @Prototype */
{
    /**
     * 
     * @param {Object} comment
     * @param {Object} code
     * @param {Object} scope
     */
    init: function(comment, code, scope ){
        this._super(comment, code, scope);
        this.Class.listing.push(this);
    },
    add_parent : function(scope){
        while(scope.Class.className != 'file') scope = scope.parent;
        this.parent = scope;
        this.parent.add(this);
    },
    code_setup: MVC.Doc.Function.prototype.code_setup,
    toFile : function(summary){
        this.summary = summary
        //try{
            var res = this.Class._file_view.render(this)
            MVCOptions.save('docs/classes/'+this.name+".html", res)
        //}catch(e ){
        //    throw
        //}
    },
    get_quicklinks : function(){
        var inside = this.linker().sort(MVC.Doc.Pair.sort_by_full_name);
        var result = [];
        for(var i = 0; i < inside.length; i++){
            var link = inside[i];
            result.push( "<a href='#"+link.full_name+"'>"+link.name+"</a>"  )
        }
        return result.join(", ")
        
    },
    /**
     * Returns the HTML signiture of the constructor function.
     */
    signiture : function(){
            var res = [];
            var ordered = this.ordered_params();
            for(var n = 0; n < ordered.length; n++){
                res.push(ordered[n].name)
            }
            var n = this.alias ? this.alias : this.name;
            //if(this.parent.Class.className == 'static')
            //    n = this.parent.parent.name+"."+this.name;
            //else if(this.parent.Class.className == 'prototype')
            //    n = this.parent.parent.name.toLowerCase()+"."+this.name;
            if(this.ret.type =='undefined'){
                n = "new "+n;
                this.ret.type = this.alias ? this.alias.toLowerCase() : this.name.toLowerCase();
            }
            return n+"("+res.join(", ")+") -> "+this.ret.type;
    },
    cleaned_comment : function(){
        return MVC.Doc.link_content(this.real_comment).replace(/\n\s*\n/g,"<br/><br/>");
    },
    url : function(){
        return this.name+".html";
    },
    comment_setup_complete : function(){
        if(!this.name){
            print("Error! No name defined for \n-----------------------")
            print(this.comment)
            print('-----------------------')
        } else if(!this.init_description){
            print("Error! No init_description defined for "+this.name+"\n-----------------------")
            print(this.comment)
            print('-----------------------')
        }
    },
    constructor_add: function(line){
        var m = line.match(/^@\w+ ([\w\.]+)/)
        if(m){
            this.name = m[1];
        }
    }
});