//some of this code comes from jQuery
/**
 * @constructor
 * Provides simple timing functionality.
 * @code_start
 * var t = new MVC.Timer({
 *   time: 1000,
 *   from:  1,
 *   to: -1,
 *   interval: 5,
 *   onUpdate : function(value){ ... }
 *   onComplete : function(value){ ... }
 *   easing: "linear"
 * })
 * t.start();
 * @code_end
 * @init
 * @param {Object} options
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>time</td>
						<td>500</td>
						<td>Time the timer runs in ms.
						</td>
					</tr>
					<tr>
						<td>from</td>
						<td>0</td>
						<td>The starting value of the timer
						</td>
					</tr>
					<tr>
						<td>to</td>
						<td>1</td>
						<td>The end value of the timer.
						</td>
					</tr>
					<tr>
						<td>interval</td>
						<td>1</td>
						<td>Millisecond time between calls.  
						</td>
					</tr>
					<tr>
						<td>onUpdate</td>
						<td></td>
						<td>Called each time a new value is ready.
						</td>
					</tr>
					<tr>
						<td>onComplete</td>
						<td> </td>
						<td>Called when the timer is complete.
						</td>
					</tr>
					<tr>
						<td>easing</td>
						<td>"swing"</td>
						<td>The name of an easing or easing function.
						</td>
					</tr>
				</tbody></table>
 */
MVC.Timer = function(options){
    options = options || {};
    this.time = options.time || 500;
    this.from = options.from || 0;
    this.to = options.to || 1;
    this.interval = options.interval||1;
    this.update_callback = options.onUpdate || function(){};
    this.complete_callback = options.onComplete || function(){};
    this.distance = this.to - this.from;
    if(options.easing){
        this.easing = typeof options.easing == 'string' ? MVC.Timer.Easings[options.easing] : options.easing;
    }else{
        this.easing = MVC.Timer.Easings.swing
    }
}

MVC.Timer.prototype = {
    /**
     * Starts the timer.
     */
    start: function(){
        this.start_time = new Date();

        this.timer = setInterval(  MVC.Function.bind(this.next_step, this)  ,this.interval);
    },
    /**
     * Kills the timer.
     */
    kill: function(){
        clearInterval(this.timer);
    },
    next_step : function(){
        var now = new Date();
        var time_passed = now - this.start_time ;
        var current;
        if(time_passed >= this.time){
            current = this.to;
            this.update_callback(current);
            this.complete_callback(current);
            this.kill();
        }else{
            var percentage = time_passed / this.time;
            current = this.easing(percentage, time_passed, this.from, this.distance  );
            //current = this.from + (how_far * this.distance);
            this.update_callback(current);
        }
        
    }
}
/**
 * @class MVC.Timer.Easings
 * Provides different easings that can be used to control how animations and timers change their values.
 */
MVC.Timer.Easings = {
    /**
     * Linear easing
     */
	linear: function( p, n, firstNum, diff ) {
		return firstNum + diff * p;
	},
    /**
     * Sinusoidal easing
     */
	swing: function( p, n, firstNum, diff ) {
		return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
	}
}