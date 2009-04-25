/**
 * Assertions run test functions, provide helpers, and record the results of the tests.
 * <h3>Example</h3>
@code_start
this.assert_equal("Tiger", this.name, "Tiger was expected");
this.assert_not_null(this.title, "Title was null");
this.assert_null(this.obj, "Expected to be null");
this.assert(x_value > 200);
@code_end
 */
MVC.Test.Assertions =  MVC.Class.extend(
/* @Prototype*/
{
	/**
	 * Creates a new Assertion with the given test for the test that matches test_name.
	 * @param {MVC.Test} test An instance of a MVC.Test class.
	 * @param {Function} test_name A function name.
	 */
    init: function( test, test_name){
		this.assertions = 0;
		this.failures = 0;
		this.errors= 0;
		this.messages = [];
		this._test = test;
		
		if(!test_name) return;
		this._delays = 0;
		this._test_name = test_name;
		this._last_called = test_name;
		
        OpenAjax.hub.publish("jmvc.test.running", this);
        
		if(this.setup) 
			this._setup();
		else{
			this._start();
		}
	},
	_start : function(){
		try{
			this._test.tests[this._test_name].call(this);
		}catch(e){ this.error(e); this._delays = 0;}
		this._update();
	},
	_setup : function(){
		var next = this.next;
		var time;
		this.next = function(t){ time = t ? t*1000 : 500;}
		this.setup();
		this.next = next;
		if(time){
			var t = this;
			var _start = this._start;
			setTimeout( function(){ _start.call(t); }, time);
		}else{
			this._start();
		}
	},
    /**
     * Asserts the expression exists in the same way that if(expression) does. If the expression doesn't exist reports the error.
@code_start
new MVC.Test.Unit('TestCase Name',{
  test_some_asserts : function(){
    this.assert(true)      //passes
    this.assert({})        //passes
    this.assert([])        //passes
    this.assert(7)         //passes
    this.assert(0)         //fails
    this.assert(false)     //fails
    this.assert('')        //fails
    this.assert(null)      //fails
    this.assert(undefined, 
         "Something was expected.") //fails
  }
)
@code_end
     * @param {Object} expression expression to be evaluated
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert: function(expression, message) {
		var message = message || 'assert: got "' + MVC.Test.inspect(expression) + '"';
		try { expression ? this.pass() : 
			this.fail(message); }
		catch(e) { this.error(e); }
	},
    /**
     * Uses the double equals (==) to determine if two values are equal. This means that type coercion may occur. For example 5 == '5'.
@code_start
new MVC.Test.Unit('TestCase Name',{
  test_some_asserts : function(){
    this.assert_equal(7,7)      //passes
	this.assert_equal(7,'7')    //passes
    this.assert_equal('s','s')  //passes
    this.assert_equal(0,false)  //passes
    this.assert_equal("Tiger", this.name, "Tiger was expected");
    this.assert_equal(6,7)      //fails
  }
)
@code_end
     * @param {Object} expected the expected value
     * @param {Object} actual The variable to check for or the value being checked
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
  	assert_equal: function(expected, actual, message) {
		var message = message || "assertEqual";
		try { (expected == actual) ? this.pass() :
			this.fail(message + ': expected "' + MVC.Test.inspect(expected) + 
			'", actual "' + MVC.Test.inspect(actual) + '"'); }
		catch(e) { this.error(e); }
  	},
    /**
     * Passes if the given object == null. Fails otherwise.
     * @code_start
     * this.assert_null(this.obj, "Expected to be null");
     * @code_end
     * @param {Object} obj The object to check for null
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_null: function(obj, message) {
	    var message = message || 'assertNull'
	    try { (obj==null) ? this.pass() : 
	      this.fail(message + ': got "' + MVC.Test.inspect(obj) + '"'); }
	    catch(e) { this.error(e); }
	},
    /**
     * Passes if the expression is false, fails if it is true
     * @code_start
     * this.assert_not(x_value == 200);
     * @code_end
     * @param {Object} expression An expression
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_not: function(expression,message) {
	   var message = arguments[1] || 'assert: got "' + MVC.Test.inspect(expression) + '"';
		try {! expression ? this.pass() : 
			this.fail(message); }
		catch(e) { this.error(e); }
	},
    /**
     * Passes if object is != null, fails otherwise
     * @code_start
     * this.assert_not_null(obj);
     * @code_end
     * @param {Object} object The object to check for null
     * param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_not_null: function(object,message) {
	    var message = message || 'assertNotNull';
	    this.assert(object != null, message);
	},
    /**
     * Asserts each value in the actual array equals the same value in the expected array
     * @param {Object} expected
     * @param {Object} actual
     * @param {optional:String} message An optional message. A default is provided if the message isn't present.
     */
	assert_each: function(expected, actual, message) {
	    var message = message || "assert_each";
	    try { 
			var e = MVC.Array.from(expected);
			var a = MVC.Array.from(actual);
			if(e.length != a.length){
				return this.fail(message + ': expected ' + MVC.Test.inspect(expected)+', actual ' + MVC.Test.inspect(actual));
				
			}else{
				for(var i =0; i< e.length; i++){
					if(e[i] != a[i]){
						return this.fail(message + ': expected '+MVC.Test.inspect(expected)+', actual ' + MVC.Test.inspect(actual));
					}
				}
			}
			this.pass();
	    }catch(e) { this.error(e); }
  	},
    /**
     * Adds to the assertions pass count.
     */
	pass: function() {
    	this.assertions++;
	},
    /**
     * Adds to the assertions failure count with a message.
     * @param {String} message error message
     */
	fail: function(message) {
		this.failures++;
		this.messages.push("Failure: " + message);
	},
    /**
     * Adds to the error count and adds the message to the assertions messages array.
     * @param {Object} error Error message object that includes a name and message.
     */
	error: function(error) {
	    this.errors++;
	    this.messages.push(error.name + ": "+ error.message + "(" + MVC.Test.inspect(error) +")");
	 },
	_get_next_name :function(){
		for(var i = 0; i < this._test.test_array.length; i++){
			if(this._test.test_array[i] == this._last_called){
				if(i+1 >= this._test.test_array.length){
					alert("There is no function following '"+this._last_called+ "'.  Please make sure you have no duplicate function names in your tests.")
				}
				return this._test.test_array[i+1];
			}
		}
	},
	_call_next_callback : function(fname, params){
		if(!fname) fname = this._get_next_name();
		var assert = this;
		var  func = this._test.tests[fname];
		return function(){
			assert._last_called = fname;
			var args = MVC.Array.from(arguments);
			if(params) args.unshift(params)
			try{
				func.apply(assert, args);
			}catch(e){ assert.error(e); }
			assert._delays--;
			assert._update();
		};
	},
    /**
     * Calls the next function in the array after a certain delay. Used at the end 
     * of a test function after an asynchronous 
     * event has been initiated, such as an Ajax call or an animation.
@code_start
test_open_directory: function(){
   // call the next function after a delay of 2 seconds
   this.next(this.DirectoryDblclick(2), 2, 'verify_open');
},
verify_open: function(){
   this.assert_equal(5, params.element.childNodes.length);
}
@code_start
     * @param {optional:Object} params Optional parameters. If provided, this is passed into the function specified by fname as its parameter.
     * @param {optional:Number} delay An optional delay, after which the specified function is called. The default is 0.5 seconds.
     * @param {optional:String} fname An optional function name. If none is give, defaults to the name of the function sequentially next in the array of test functions.
     */
	next: function(params,delay, fname){
		this._delays ++;
		delay = delay ? delay*1000 : 500;
		setTimeout(this._call_next_callback(fname, params), delay)
	},
    /**
     * Calls the next function in the array after a certain delay. Used in conjunction with asynchronous functions that use callback functions, 
     * such as an Ajax call or the Drag event.
@code_start
test_drag: function(){
    this.Drag($E('draggable'),{from: 'pointA', to: 'pointB', 
        duration: 2, callback: this.next_callback('done_dragging', 3)})
}, 
done_dragging : function(){
    this.assert_equal(1, $E('pointB').next().childNodes.length);
}
@code_end
     * @param {Object} fname An optional function name. If none is give, defaults to the name of the function sequentially next in the array of test functions.
     * @param {Object} delay An optional delay, after which the specified function is called. The default is 0.5 seconds.
     * @return {Function} the function used for callbacks
     */
	next_callback: function(fname,delay){
		this._delays++;
		var f = this._call_next_callback(fname)
		if(!delay) return f;
		return function(){
			setTimeout(f, delay*1000)
		};
	},
	_update : function(){
		if(this._delays == 0){
			if(this.teardown) this.teardown()
			if(this._do_blur_back)
				this._blur_back();
			
            OpenAjax.hub.publish("jmvc.test.assertions.update", this);
            
			this.failures == 0 && this.errors == 0?  this._test.pass(): this._test.fail();
			this._test.run_next();
		}
	},
	_blur_back: function(){
		MVC.Browser.Gecko ? window.blur() : MVC.Console.window.focus();
	}
});