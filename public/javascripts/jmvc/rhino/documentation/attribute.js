/**
 * @hide
 * Documents an attribute.  Example:
 * @code_start
 * MVC.Object.extend(Person, {
 *    /* Number of People *|
 *    count: 0
 * })
 * @code_end
 */
MVC.Doc.Attribute = MVC.Doc.Pair.extend('attribute',
 /* @prototype */
 {
     /**
      * Matches an attribute with code
      * @param {Object} code
      */
     code_match: function(code){
         return code.match(/(\w+)\s*[:=]\s*/) && !code.match(/(\w+)\s*[:=]\s*function\(([^\)]*)/)  
     }
 },{
     /**
      * Saves the name of the attribute
      */
     code_setup: function(){
        var parts = this.code.match(/(\w+)\s*[:=]\s*/);
        this.name = parts[1];
     },
     attribute_add: function(line){
        var m = line.match(/^@\w+ ([\w\.]+)/)
        if(m){
            this.name = m[1];
        }
     }
 })