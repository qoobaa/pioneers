/**
 * Unit tests are Used for testing lower level functionality, like a method or class.
 * 
 */
MVC.Test.Unit = MVC.Test.extend(
/* @Prototype*/
{
    /**
     * Called when a new unit test case is created. A test case is a collection of test functions and helpers.
     * 
     * @param {String} name The className of your test.
     * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. 
     * Functions that don't begin with test are converted to helper functions. Do not name helper 
     * functions the same name as the test provided helpers and assertions 
     * such as assert or assertEqual as your functions will override these functions.
     */
	init: function(name , tests ){
		this._super(  name, tests, 'unit');
		MVC.Test.Unit.tests.push(this)
	}
});


MVC.Test.Unit.tests = [];


MVC.Test.Runner(MVC.Test.Unit, "tests", {
	start : function(){
		this.passes = 0;
	},
	after : function(number ){
		if(this.tests[number].failures == 0 ) this.passes++;
	},
	done: function(){
		OpenAjax.hub.publish("jmvc.test.unit.complete", this);
	}
})