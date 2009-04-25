//MVC.Class 
// This is a modified version of John Resig's class
// It provides class level inheritence and callbacks.

(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  
  /**
   * @constructor MVC.Class
   * Class provides simple simulated inheritance in JavaScript. 
   * It is based off John Resig's [http://ejohn.org/blog/simple-javascript-inheritance/|Simple Class] 
   * Inheritance library.  Besides prototypal inheritance, it adds a few important features:
   * <ul>
   *     <li>Static inheritance</li>
   *     <li>Class initialization callbacks</li>
   *     <li>Introspection</li>
   * </ul>
   * <h2>Examples</h2>
   * <h3>Basic example</h3>
   * Creates a class with a className (used for introspection), static, and prototype members:
   * @code_start
   * Monster = MVC.Class.extend('monster',
   * /* @static *|
   * {
   *   count: 0
   * },
   * /* @prototype *|
   * {
   *   init : function(name){
   *     this.name = name;
   *     this.Class.count++
   *   }
   * })
   * hydra = new Monster('hydra')
   * dragon = new Monster('dragon')
   * hydra.name        // -> hydra
   * Monster.count     // -> 2
   * Monster.className // -> 'monster'
   * @code_end
   * Notice that the prototype init function is called when a new instance of Monster is created.
   * <h3>Static property inheritance</h3>
   * Demonstrates inheriting a class poperty.
   * @code_start
   * First = MVC.Class.extend(
   * {
   *     static_method : function(){ return 1;}
   * },{})
   * Second = First.extend({
   *     static_method : function(){ return this._super()+1;}
   * },{})
   * Second.static_method() // -> 2
   * @code_end
   * <h3 id='introspection'>Introspection</h3>
   * Often, it's nice to create classes whose name helps determine functionality.  Ruby on
   * Rails's [http://api.rubyonrails.org/classes/ActiveRecord/Base.html|ActiveRecord] ORM class 
   * is a great example of this.  Unfortunately, JavaScript doesn't have a way of determining
   * an object's name, so the developer must provide a name.
   * 
   * For example, Documentation's [MVC.Doc.Directive|directives] use their className to be added to
   * different [MVC.Doc.Pair|comment-code pairs] in the appropriate way.  Just by defining:
   * @code_start
   * MVC.Doc.Directive.Author = MVC.Class.extend('author');
   * @code_end
   * you tell the documentation engine to look for @author and whatever comes after it as this.author.
   * className is saved as a static property.  You can access it from instance methods like:
   * @code_start
   * this.Class.className
   * @code_end
   * <h3>Construtors</h3>
   * Class uses static and class initialization constructor functions.  
   * @code_start
   * MyClass = MVC.Class.extend(
   * {
   *   init: function(){} //static constructor
   * },
   * {
   *   init: function(){} //prototype constructor
   * })
   * @code_end
   * The static init constructor is called after
   * a class has been created, but before [MVC.Class.static.extended|extended] is called on its base class.  
   * This is a good place to add introspection and similar class setup code.
   * 
   * The prototype callback is called whenever a new instance of the class is created.
   * 
   * 
   * @init Creating a new instance of an object that has extended MVC.Class 
        calls the init prototype function and returns a new instance of the class.
   * 
   */
  
  MVC.Class = function(){};
  // Create a new Class that inherits from the current class.
  /* @Static*/
  MVC.Class.
    /**
     * Extends a class with new static and prototype functions.  There are a variety of ways
     * to use extend:
     * @code_start
     * //with className, static and prototype functions
     * MVC.class.extend('task',{ STATIC },{ PROTOTYPE })
     * //with just static and prototype functions
     * MVC.class.extend({ STATIC },{ PROTOTYPE })
     * //with just classname and prototype functions
     * MVC.class.extend('task',{ PROTOTYPE })
     * //with just prototype functions
     * MVC.class.extend({ PROTOTYPE })
     * //With just a className
     * MVC.class.extend('task')
     * @code_end
     * @param {optional:String} className the classes name (used for classes w/ introspection)
     * @param {optional:Object} klass the new classes static/class functions
     * @param {optional:Object} proto the new classes prototype functions
     * @return {MVC.Class} returns the new class
     */
    extend = function(className, klass, proto) {
    if(typeof className != 'string'){
        proto = klass;
        klass = className;
        className = null;
    }
    if(!proto){
        proto = klass;
        klass = null;
    }
    proto = proto || {};
    var _super_class = this;
    var _super = this.prototype;
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    // Copy the properties over onto the new prototype
    for (var name in proto) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof proto[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(proto[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, proto[name]) :
        proto[name];
    }
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    Class.prototype.Class = Class;
    // Enforce the constructor to be what we expect
    Class.constructor = Class;
    // And make this class extendable
    
    for(var name in this){
        if(this.hasOwnProperty(name) && name != 'prototype'){
            Class[name] = this[name];
        }
    }
    
    for (var name in klass) {
      Class[name] = typeof klass[name] == "function" &&
        typeof Class[name] == "function" && fnTest.test(klass[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = _super_class[name];
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
            return ret;
          };
        })(name, klass[name]) :
        klass[name];
	};
    Class.extend = arguments.callee;
    /**
     * @attribute className 
     * The name of the class provided for [#introspection|introspection] purposes.
     */
    if(className) Class.className = className;
    /*
     * @function init
     * Called when a new Class is created
     * @param {MVC.Class} class the new class
     */
    if(Class.init) Class.init(Class);
    /*
     * @function extended
     * Called with whatever classes extend your class
     * @param {MVC.Class} Class the extending class.
     */
    if(_super_class.extended) _super_class.extended(Class);
    /* @Prototype*/
    return Class;
    /* @function init
     * Called with the same arguments as new Class(arguments ...) when a new instance is created.
     */
    //Breaks up code
    /**
     * @attribute Class
     * Access to the static properties of the instance's class.
     */
  };
})();

if(!MVC._no_conflict && typeof Class == 'undefined'){
	Class = MVC.Class;
}