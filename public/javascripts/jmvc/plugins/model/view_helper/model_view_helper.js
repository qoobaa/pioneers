MVC.ModelViewHelper = MVC.Class.extend(
{
    init: function(){
        if(!this.className) return;
        //add yourself to your model
        var modelClass;
        if(!this.className) return;
        
        if(!(modelClass = this.modelClass = window[MVC.String.classize(this.className)]) ) 
            throw "ModelViewHelpers can't find class "+this.className;
        var viewClass = this;
        this.modelClass.View = function(){ 
            return viewClass;
        };
        
        
        this.modelClass.prototype.View = function(){
            return new viewClass(this);
        };
        if(this.modelClass.attributes){
            this._view = new MVC.View.Helpers({});
            var type;
            for(var attr in this.modelClass.attributes){
                if(! this.modelClass.attributes.hasOwnProperty(attr) || typeof this.modelClass.attributes[attr] != 'string') continue;
                this.add_helper(attr);
            }
        }
    },
    form_helper: function(attr){
        if(! this.helpers[attr]+"_field" ){
            this.add_helper(attr);
        }
        var f = this.helpers[attr+"_field"];
        var args = MVC.Array.from(arguments);
        args.shift();
        return f.apply(this._view, args);
    },
    add_helper : function(attr){
        var h = this._helper(attr);
        this.helpers[attr+"_field"] = h;
    },
    helpers : {},
    _helper: function(attr){
        var helper = this._view_helper(attr);
        var modelh = this;
        var name = this.modelClass.className+'['+attr+']';
        var id = this.modelClass.className+'_'+attr;
        return function(){
            var args = MVC.Array.from(arguments);
            args.unshift(name);
            args[2] = args[2] || {};
            args[2].id = id;
            return helper.apply(modelh._view, args);
        }
    },
    _view_helper: function(attr){
         switch(this.modelClass.attributes[attr].toLowerCase()) {
				case 'boolean': 
                    return this._view.check_box_tag;
                case 'text':
                    return this._view.text_area_tag;
				default:
					return this._view.text_field_tag;
	    }
    },
    clear: function(){
        var mname = this.modelClass.className, el;
        for(var attr in this.modelClass.attributes){
            if( (el = MVC.$E(mname+"_"+attr)) ){
                el.value = '';
            }
        }
    },
    from_html: function(element_or_id){
        var el =MVC.$E(element_or_id);
        
        var el_class = this.modelClass ? this.modelClass : window[ MVC.String.classize(el.getAttribute('type')) ];
        
        if(! el_class) return null;
        //get data here
        var attributes = {};
        attributes[el_class.id] = this.element_id_to_id(el.id);
        //for(var attr in modelClass.attributes){
        //    if(MVC.$E(  ) )
        //}
        
        return el_class.create_as_existing(attributes);
    },
    element_id_to_id: function(element_id){
        var re = new RegExp(this.className+'_', "");
        return element_id.replace(re, '');
    }
},
{
    init: function(model_instance){
        this._inst = model_instance;
        this._className = this._inst.Class.className;
        this._Class = this._inst.Class;
    },
    id : function(){
        return this._inst[this._inst.Class.id];
    },
    element : function(){
        if(this._element) return this._element;
        this._element = MVC.$E(this.element_id());
        if(this._element) return this._element;
    },
	create_element: function(){
        this._element = document.createElement('div');
        this._element.id = this.element_id();
        this._element.className = this._className;
        this._element.setAttribute('type', this._className);
        return this._element;
	},
    element_id : function(){
        return this._className+'_'+this._inst[this._inst.Class.id];
    },
    show_errors : function(){
        var err = MVC.$E(this._className+"_error");
        var err = err || MVC.$E(this._className+"_error");
        var errs = [];
        for(var i=0; i< this._inst.errors.length; i++){
			var error = this._inst.errors[i];
			var el = MVC.$E(this._className+"_"+error[0]);
			if(el){
				el.className="error";
                var er_el = MVC.$E(this._className+"_"+error[0]+"_error" );
				if(er_el) er_el.innerHTML = error[1];
			}
			else
                errs.push(error[0]+' is '+error[1]);
            
		}
        if(errs.length > 0){
             if(err) err.innerHTML = errs.join(", "); 
             else alert(errs.join(", "));
        }
    },
    clear_errors: function(){
        var p;
        var cn = this._className;
        for(var attribute in this._Class.attributes){
            if(this._Class.attributes.hasOwnProperty(attribute)){
                var el = MVC.$E(cn+"_"+p);
                if(el) el.className = el.className.replace(/(^|\\s+)error(\\s+|$)/, ' '); //from prototype
                var er_el = MVC.$E(cn+"_"+attribute+"_error" );
    		    if(er_el) er_el.innerHTML = '&nbsp;';
            }
        }
        
        var bigel = MVC.$E(cn+"_error");
        if(bigel) bigel.innerHTML = '';
    },
    edit: function(attr){
        //get the helper function, add args, return
         var args = MVC.Array.from(arguments);
         var name = this._className+'['+attr+']'
         args.shift();
         args.unshift( {id: this.edit_id(attr)} ); //change to ID
         args.unshift(this._inst[attr]); //value
         args.unshift(name); //name
         var helper =this.Class._view_helper(attr)
         return helper.apply(this.Class._view, args);
    },
    edit_values: function(){
        var values = {};
        var cn = this._className, p, el;
        for(var attr in this._Class.attributes){
            if(this._Class.attributes.hasOwnProperty( attr ) )
            el = MVC.$E(this.edit_id(attr));
            if(el) values[attr] = el.value;
            
        }
        return values;
    },
    edit_id: function(attr){
        return this._className+'_'+this._inst.id+'_'+attr+'_edit';
    },
    destroy: function(){
        var el = this.element();
        el.parentNode.removeChild(el);
    }
}
);
