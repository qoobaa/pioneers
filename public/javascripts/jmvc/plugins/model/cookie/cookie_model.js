/**
 * A model for Cookies
 */
MVC.Model.Cookie = MVC.Model.extend(
/* @Static*/
{
    init : function(){
          this._working = null;  
          this._super();
    },
    days: null,
    /**
     * Finds a single instance if it is in the cookie.
     * @param {Object} params
     */
    find_one : function(params){
        var insts = this.find_class_data().instances;
        if(!params){  for(var id in insts){ return insts[id]} return null;  }
        if(params[this.id]){
            return insts[params[this.id]];
        }
        for(var id in insts){
            var inst = insts[id];
            for(var attr in params){
                if(params[attr] == inst[attr]) return inst;
            }
        }
        return null;
    },
    /**
     * Finds all instances of the model saved in the cookies.
     */
    find_all : function(){
        var insts =  this.find_class_data().instances;
        var ret = [];
        for(var i in insts)
            ret.push(insts[i]);
        return ret;
    },
    find_class_data: function(){
        if(this._working) return this._working;
    	var cd = this.find_cookie(this.className);
        if(!cd){
            this._working  ={instances: {}};
        }else{
            eval( 'this._working = ' + cd);
        }
        this._count = 0;
        for(var i in this._working.instances)
            this._count++;
        
        return this._working;
    },
    create_cookie : function(name,value,days){
    	if (days) {
    		var date = new Date();
    		date.setTime(date.getTime()+(days*24*60*60*1000));
    		var expires = "; expires="+date.toGMTString();
    	}
    	else var expires = "";
    	document.cookie = name+"="+encodeURIComponent(value)+expires+"; path=/";
    },
    find_cookie : function(name){
        var nameEQ = name + "=";
    	var ca = document.cookie.split(';');
    	for(var i=0;i < ca.length;i++) {
    		var c = ca[i];
    		while (c.charAt(0)==' ') c = c.substring(1,c.length);
    		if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
    	}
    	return null;
    },
    destroy_cookie : function(name){
        this.create_cookie(name,"",-1);
    },
    create : function(attributes, callbacks){
        var cd = this.find_class_data();
        var instances = cd.instances;
        instances[attributes[this.id]] = attributes;
        this.create_cookie(this.className, MVC.Object.to_json(cd), this.days );
    },
    update : function(id, attributes){
        var cd = this.find_class_data();
        var instances = cd.instances;
        instances[id] = attributes;
        this.create_cookie(this.className, MVC.Object.to_json(cd), this.days );
    },
    /**
     * Destroys an instance represented by this cookie.
     * @param {Object} id
     */
    destroy : function(id){
        var cd = this.find_class_data();
        var instances = cd.instances;
        var attrs = instances[id];
        delete instances[id];
        this.create_cookie(this.className, MVC.Object.to_json(cd), this.days );
        return attrs;
    },
    /**
     * Destroys a named cookie
     * @param {Object} cookie
     */
    destroy_cookie : function(cookie){
        this.create_cookie(cookie,"",-1);
    },
    /**
     * Destroys all instances in this cookie
     */
    destroy_all : function(){
        this.destroy_cookie(this.className)
        return true;
    }
},
// Prototype functions
{

});