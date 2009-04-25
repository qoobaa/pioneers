



/**
 * Functional tests are used to mimic user events.
 */
MVC.Test.Functional = MVC.Test.extend(
/* @Prototype*/
{
	/**
	 * Creates a new functional test case. A test case is a collection of test functions and helpers.
@code_start
new MVC.Test.Functional('TestCaseName',{
  test_some_clicks : function(){
    this.Click('#button')
  }
})
@code_end
	 * @param {String} name The unique name of the test. Make sure no two tests have the same name.
	 * @param {Object} tests An object with test functions. Functions that begin with test_ will be run as tests. Functions that don't begin with test are converted to helper functions. Do not name helper functions the same name as the test provided helpers and assertions such as assert or assertEqual as your functions will override these functions.
	 */
    init: function(name , tests ){
		this._super(  name, tests, 'functional');
		MVC.Test.Functional.tests.push(this)
	},
	helpers : function(){
		var helpers = this._super();
		/**
		 * @function Action
		 * Creates a syntetic event on a HTMLElement.
		 * @code_start
		 * this.Action('click','.todo',3) //calls a click on the third element with class '.todo'
		 * @code_end
		 * @param {String} event_type A lowercase event type. One of ['change', 'click', 'contextmenu', 'dblclick', 'keyup', 'keydown', 'keypress','mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'submit', 'focus', 'blur','drag', 'write'].
		 * @param {String/HTMLElement} selector An HTMLElement or a CSS selector.
		 * @param {Number/Object} options If a number is provided, it uses it to select that number from the array of elements returned by doing a CSSQuery with selector. If an object is provided, it passes those options to the SyntheticEvent for creation. If nothing is provided, the number defaults to 0.
		 */
        helpers.Action =   function(event_type, selector, options){
			options = options || {};
			options.type = event_type;
			var number = 0;

			if(typeof options == 'number') 		 number = options || 0;
			else if (typeof options == 'object') number = options.number || 0;
			
			var element = typeof selector == 'string' ? MVC.Query(selector)[number] : selector; //if not a selector assume element
			
			if((event_type == 'focus' || event_type == 'write' || event_type == 'click') && !this._do_blur_back){
				MVC.Browser.Gecko ? MVC.Console.window.blur() : window.focus();
				this._do_blur_back =true;
			}
			

			var event = new MVC.SyntheticEvent(event_type, options).send(element);
			return {event: event, element: element, options: options};
		}
		for(var e = 0; e < MVC.Test.Functional.events.length; e++){
			var event_name = MVC.Test.Functional.events[e];
			helpers[MVC.String.capitalize(event_name)] = helpers.Action.curry(event_name)
		}
		return helpers;
	}
});
MVC.Test.Functional.events = [
/* @function Blur
 * Calls Action using 'blur' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'blur',
/*
 * @function Change
 * Calls Action using 'change' as the first parameter.
 */
'change',
/**
 * @function Click
 * Calls Action using 'click' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'click',
/**
 * @function Contextmenu
 * Calls Action using 'contextmenu' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'contextmenu',
/**
 * @function Dblclick
 * Calls Action using 'dblclick' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'dblclick',
/**
 * @function Keyup
 * Calls Action using 'keyup' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'keyup',
/**
 * @function Keydown
 * Calls Action using 'keydown' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'keydown',
/**
 * @function Keypress
 * Calls Action using 'keypress' as the first parameter. In browsers other that Firefox, keypress support built into the browser doesn't actually write text into the input element. To make up for this shortcoming, this method manually inserts text into the input element's value attribute.
 * @param {String/HTMLElement} selector_or_element
 * @param {String} The character to be written to the passed element, '\b' causes a character to be deleted, '\n' simulates pressing enter
 * @param {Object} options a hash with the following properties:
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>character</td>
						<td>false</td>
						<td>
							True to simulate pressing the alt key.
						</td>
					</tr>
					<tr>
						<td>ctrlKey</td>
						<td>false</td>
						<td>
							True to simulate pressing the control key.
						</td>
					</tr>
					<tr>
						<td>altKey</td>
						<td>false</td>
						<td>True to simulate pressing the alt key.</td>
					</tr>
					<tr>
						<td>shiftKey</td>
						<td>false</td>
						<td>True to simulate pressing the shift key.</td>
					</tr>
					<tr>
						<td>metaKey</td>
						<td>false</td>
						<td>True to simulate pressing the meta key.</td>
					</tr>
					<tr>
						<td>keyCode</td>
						<td>0</td>
						<td>Used to simulate pressing other keys, this <a href="http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx">reference</a> shows a list of keyCodes you can use.</td>
					</tr>
				</tbody></table>
 */
'keypress',
/**
 * @function Mousedown
 * Calls Action using 'mousedown' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mousedown',
/**
 * @function Mousemove
 * Calls Action using 'mousemove' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mousemove',
/**
 * @function Mouseout
 * Calls Action using 'mouseout' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mouseout',
/**
 * @function Mouseover
 * Calls Action using 'mouseover' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mouseover',
/**
 * @function Mouseup
 * Calls Action using 'mouseup' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'mouseup',
/**
 * @function Reset
 * Calls Action using 'reset' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'reset',
/**
 * @function Resize
 * Calls Action using 'resize' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'resize',
/**
 * @function Scroll
 * Calls Action using 'scroll' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'scroll',
/**
 * @function Select
 * Calls Action using 'select' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'select',
/**
 * @function Submit
 * Calls Action using 'submit' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'submit',
/**
 * @function Dblclick
 * Calls Action using 'dblclick' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'dblclick',
/**
 * @function Focus
 * Calls Action using 'focus' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'focus',
/**
 * @function Load
 * Calls Action using 'load' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'load',
/**
 * @function Unload
 * Calls Action using 'unload' as the first parameter.
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/Number} options_or_number
 */
'unload',
/**
 * @function Drag
 * Creates events that simulate a drag motion across the browser. The drag events are comprised of a mousedown from the from location, equal spaced mousemoves to the to location, and a mouseup at the to location. Drag is by default syncronous, but can be made asyncronous by providing a duration option.
@code_start
test_drag_to_trash : function(){
  this.Drag('#/drag_handle', 
    {
      from: '/drag_handle',
      to: '/trash', 
      duration: 2, 
      callback: this.next_callback()
    })
},
make_sure_drag_worked : function(){
  this.assertNull(document.getElementById('/drag_handle'));
}
@code_end
 * @param {String/HTMLElement} selector_or_element
 * @param {Object} options A hash with the following properties:
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>callback</td>
						<td>null</td>
						<td>
							A callback that gets called when the drag motion has completed.  This is only
							necessary with asyncronous drags.  Typically, the callback can be provided by
							next_callback();
						</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>null</td>
						<td>
							The length of time in seconds the drag takes place.  By setting this
							option, the events are dispatched in intervals, letting the browser update the 
							screen.  Typically, you want to provide a <i>callback</i> to test the results of the
							drag after completion.
						</td>
					</tr>
					
					<tr>
						<td>from</td>
						<td>null</td>
						<td>
							The starting coordinates of the drag.  This can be specified in three ways: first, as an
							object like {x: 123, y: 321}; second, as a HTMLElement; third, as the string ID of 
							a HTMLElement.  Providing an element or the id of an element, Drag will use the 
							center of the element as is starting position.
						</td>
					</tr>
					<tr>
						<td>steps</td>
						<td>100</td>
						<td>
							The number of mousemoves called to represent the drag.  This parameter is void if
							duration is provided.
						</td>
					</tr>
					<tr>
						<td>to</td>
						<td>null</td>
						<td>
							The ending coordinates of the drag.  Use the <i>to</i> option the same
							way as the <i>from</i> option.
						</td>
					</tr>
				</tbody></table>
 */
'drag',
/**
 * @function Write
 * Creates events that simulate writing into an input element. If a callback option is used in the second parameter, the event is asynchronous. Otherwise, it is synchronous.
@code_start
// syntax 1: synchronous version</span>
this.Write(input_params.element, 'Brian');
// syntax 2: asynchronous version
this.Write(input_params.element, {text: 'Brian', callback: this.next_callback()});
@code_end
 * @param {String/HTMLElement} selector_or_element
 * @param {Object/String} options_or_string If a string is passed, it is the text written in the passed input element. If a hash is passed it, it expects the following parameters:
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>callback</td>
						<td>null</td>
						<td>
							A callback that gets called when the write has completed.  This is only
							necessary with asyncronous writes.  Typically, the callback can be provided by
							next_callback();
						</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>null</td>
						<td>
							The length of time in seconds the write takes place.  By setting this
							option, the events are dispatched in intervals, letting the browser update the 
							screen.  Typically, you want to provide a <i>callback</i> to test the results of the
							drag after completion.
						</td>
					</tr>
					<tr>
						<td>text</td>
						<td>null</td>
						<td>
							The text to be written into the given input element.
                            <br/>'\b' - the backspace character is used to delete one character of text
                            <br/>'\n' - the newline character is used to simulate pressing enter
						</td>
					</tr>
					

					
				</tbody></table>
 */
'write'
];
MVC.Test.Functional.tests = [];


MVC.Test.Runner(MVC.Test.Functional, "tests", {
	start : function(){
		this.passes = 0;
	},
	after : function(number ){
		if(this.tests[number].failures == 0 ) this.passes++;
	},
	done: function(){
		MVC.Console.window.document.getElementById('functional_result').innerHTML = 
			'('+this.passes+'/'+this.tests.length+')' + (this.passes == this.tests.length ? ' Wow!' : '')
	}
})