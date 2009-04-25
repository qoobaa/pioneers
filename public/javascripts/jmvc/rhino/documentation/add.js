/**
 * @hide
 * Used to set scope to add to classes or methods in another file.
 * Examples:
 * @code_start no-highlight
 * /* @add MVC.String Static *|         adds to MVC.String's static methods
 * /* @add MVC.Controller Prototype *|  adds to MVC.Controller's prototype methods
 * @code_end
 * It's important to note that add must be in its own comment block.
 */
MVC.Doc.Add = MVC.Doc.Pair.extend('add',
{
    comment_setup: MVC.Doc.Function.prototype.comment_setup,
    /**
     * Looks for a line like @add (scope) (Static|Prototype)
     * @param {String} line the line that had @add
     */
    add_add : function(line){

        var m = line.match(/^@add\s+([\w\.]+)\s+([\w\.]+)?/i)
        if(m){
            this.sub_scope = m.pop().toLowerCase()
            this.scope_name = m.pop()
        }
    },
    /**
     * Searches for the new scope.
     * @return {MVC.Doc.Pair} The new scope where additional comments will be added
     */
    scope : function(){
 
        var Class = MVC.Doc.Class
        
        //find
        var inst;
        for(var l =0 ; l < Class.listing.length; l++){
            if(Class.listing[l].name == this.scope_name) {
                inst = Class.listing[l];break;
            }
        }
        if(!inst){
            var Class =  MVC.Doc.Constructor
            for(var l =0 ; l < Class.listing.length; l++){
                if(Class.listing[l].name == this.scope_name) {
                    inst = Class.listing[l];break;
                }
            }
        }
        if(!inst) return this;

        if(this.sub_scope){
            var children = inst.children;
            var child;
            for(var i=0; i< children.length; i++){
                if(children[i].Class.className.toLowerCase() == this.sub_scope.toLowerCase()) {
                    child = children[i];break;
                }
            }
            if(child) return child;
        }
        return inst;
        
    },
    toHTML: function(){return ""},
    linker: function(){}
});




