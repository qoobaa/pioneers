
MVC.Tests = {};


/**
 * The Test class is the super class of other test classes including: 
 * Test.Unit, Test.Functional, and Test.Controller. 
 * Typically Test is not used directly but its functions are available in inheriting classes.
 */
MVC.Test = MVC.Class.extend(
/* @Prototype*/
{
    /**
     * Creates a new test case. A test case is a collection of test functions and helpers.
     * 
     * @code_start new MVC.Test('TestCaseName',{
  test_some_asserts : function(){
    var value = this.my_helper('hello world')
    this.assert(value)      //passes
  },
  my_helper : function(value){
    return value == 'hello world'
  }
}, 'unit')
@code_end
     * @param {Object} name the unique name of the test. Make sure no two tests have the same name.
     * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. Functions that don't begin with test are converted to helper functions. Do not name helper functions the same name as the test provided helpers and assertions such as assert or assertEqual as your functions will override these functions.
     * @param {Object} type The type of test ('unit', 'functional').
     */
	init: function( name, tests, type  ){
		this.type = type || 'unit';
		this.tests = tests;
		this.test_names = [];
		this.test_array = [];
		for(var t in this.tests) {
			if(! this.tests.hasOwnProperty(t) ) continue;
			if(t.indexOf('test') == 0) this.test_names.push(t);
			this.test_array.push(t);
		}
		this.name = name;
		this.Assertions = MVC.Test.Assertions.extend(this.helpers()); //overwrite helpers
		this.passes = 0;
		this.failures = 0;
		
		MVC.Tests[this.name] = this;
		OpenAjax.hub.publish("jmvc.test.created", this);
	},
    /**
     * Adds to the test case's failure count.
     */
	fail : function(){
		this.failures++;
	},
    /**
     * Returns an object of helper functions that will be used to generate a 
     * new Assertion class for the TestCase. The base implementation returns all functions provided to tests in the constructor that do not start with test. 
     * Functional and Controller tests overwrite this function.
     */
	helpers : function(){
		var helpers = {}; 
		for(var t in this.tests) if(this.tests.hasOwnProperty(t) && t.indexOf('test') != 0) helpers[t] = this.tests[t];
		return helpers;
	},
    /**
     * Adds to the test case's pass count.
     */
	pass : function(){
		this.passes++;
	},
    /**
     * Runs all the testcase's tests and when complete calls an optional callback if provided.
     * @param {optional:Function} callback optional callback for when the test is complete
     */
	run: function(callback){
        this.working_test = 0;
		this.callback = callback;
		this.passes = 0;
		this.failures = 0;
        OpenAjax.hub.publish("jmvc.test.test.start", this);
		this.run_next();
	},
    /**
     * Runs a helper function.
     * @param {String} helper_name
     */
	run_helper: function(helper_name){
		var a = new this.Assertions(this);
		a[helper_name](0);
	},
    /**
     * Runs the next function
     */
	run_next: function(){
		if(this.working_test != null && this.working_test < this.test_names.length){
			this.working_test++;
			this.run_test(this.test_names[this.working_test-1]);
		}else if(this.working_test != null){
			OpenAjax.hub.publish("jmvc.test.test.complete", this);

			this.working_test = null;
			if(this.callback){
				this.callback();
				this.callback = null;
			}
		}
	},
	run_test: function(test_id){
        var saved_this = this;
		// setTimeout with delay of 0 is necessary for Opera and Safari to trick them into thinking
		// the calling window was the application and not the console
		setTimeout(function(){ this.assertions = new saved_this.Assertions(saved_this, test_id); },0);
	}
});







Function.prototype.curry = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
	  return fn.apply(this, args.concat(
	    Array.prototype.slice.call(arguments)));
	};
};







if(MVC.Console && MVC.Console.window) MVC.Console.window.get_tests = function(){return MVC.Tests; } 

//This function returns what something looks like
MVC.Test.inspect =  function(object) {
	try {
		if (object === undefined) return 'undefined';
		if (object === null) return 'null';
		if(object.length !=  null && typeof object != 'string'){
			return "[ ... ]";
		}
		return object.inspect ? object.inspect() : object.toString();
	} catch (e) {
		if (e instanceof RangeError) return '...';
		throw e;
	}
};
MVC.Test.loaded_files = {};

include.unit_tests = function(){
	for(var i=0; i< arguments.length; i++){
        MVC.Console.log('Trying to load: test/unit/'+arguments[i]+'_test.js');
    }
		
	include.app(function(i){ return '../../test/unit/'+i+'_test'}).apply(null, arguments);
}
include.functional_tests = function(){
	for(var i=0; i< arguments.length; i++){
        MVC.Console.log('Trying to load: test/functional/'+arguments[i]+'_test.js');
    }
	include.app(function(i){ return '../../test/functional/'+i+'_test'}).apply(null, arguments);
}

if(!MVC._no_conflict) Test = MVC.Test;





