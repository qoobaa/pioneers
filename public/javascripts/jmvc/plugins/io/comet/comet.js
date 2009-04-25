// new Comet("http://127.0.0.1/GetEvents", {onSuccess: myfunc, headers: {"Cookie": User.sessionID}})

/**
 * @constructor MVC.IO.Comet
 * @alias MVC.Comet
 * The Comet class opens a connection with a given transport.  It assumes the connection will 
 * be long held. After the connection comes back, it will immediately reconnect.
 * @init 
 * Initiates a new Comet connection.
 * @param {Object} url the url of the request.
 * @param {optional:Object} options a hash of options hash that will be passed to 
 * the transport Comet will be using along with with the following attributes:
 * <table class="options">
	<tbody>
	<tr><th>Option</th><th>Default</th><th>Description</th></tr>
	<tr>
		<td>wait_time</td>
		<td>0</td>
		<td>The amount of time to wait between requests.
		</td>
	</tr>
	<tr>
		<td>onSuccess</td>
		<td>&nbsp;</td>
		<td>This function is called when the request returns with non empty data.</td>
	</tr>
	<tr>
		<td>onComplete</td>
		<td>&nbsp;</td>
		<td>This function is called everytime the request returns.</td>
	</tr>
	<tr>
		<td>onFailure</td>
		<td>&nbsp;</td>
		<td>This function is called if the transport's onFailure is called</td>
	</tr>
	<tr>
		<td>transport</td>
		<td>MVC.Ajax</td>
		<td>The transport that will be used for the request
		</td>
	</tr>
	<tr>
		<td>cache</td>
		<td>true </td>
		<td>true to cache template.
		</td>
	</tr>
	
</tbody></table>
 * 
 * 
 */
MVC.Comet = function(url, options) 
/* @Prototype*/
{
	this.url = url;
	this.options = options || {};
	this.options.wait_time = this.options.wait_time || 0
    this.onSuccess = options.onSuccess;
    this.onComplete = options.onComplete;
    this.onFailure = options.onFailure;
    
    delete this.options.onSuccess;
    delete this.options.onComplete;
    //delete this.options.onFailure;
    
    this.options.onComplete = MVC.Function.bind(this.callback, this); // going to call this every time.
    
    //check in options for stop function, if there, use it, otherwise replace it
    
    
    //if(!this.options.is_killed){  //if we don't have an is killed, it doesn't exist yet
    
    var killed = false;
    var polling = true;  // we start at the end of this function
    
    /**
     * @function kill
     * Kills future requests.
     */
    this.kill = function(){killed = true;}
    
    /**
     * @function poll_now
     * If you are using a timeout to space reconnections, poll_now can
     * be used to reconnect immediately.
     */
    this.poll_now = MVC.Function.bind(function(){
        // if we aren't waiting, kill the timer that says wait and go right now
        if(this.is_polling()) return;
        
        //console.log('not waiting so kill!')
        clearTimeout(this.timeout);
        //var options = this.options;
        //options.waiting_to_poll();
        
       // var transport = this.transport;
        //this.timeout = setTimeout(function(){ 
        this.options.polling();
        MVC.Comet.connection = new this.transport(this.url, this.options);
        
        //},0);
    },this)
   
    this.options.is_killed = function(){return killed};
    this.options.waiting_to_poll = function(){  polling = false; };
    this.options.polling = function(){  polling = true; };
     /**
     * @function is_polling
     * Returns if the comet connection is currently polling
     * @return {Boolean} true if the connection is polling, false if waiting.
     */
    this.is_polling = function(){ return polling; };

    this.transport = this.options.transport || MVC.Comet.transport;
    

    MVC.Comet.connection = new this.transport(url, this.options)
}
//Change this to other transports (MVC.WindowName)
MVC.Comet.transport = MVC.Ajax;

MVC.Comet.prototype = {
	/**
	 * The actual callback of a Comet connection.  When called, this function determines if 
	 * it should call onSuccess and then sets up another request to be called.
	 * @param {Object} transport assumes transport.responseText is available.  
	 */
    callback : function(transport) {
        this.options.waiting_to_poll(); //start waiting to resume polling
        
        if(this.options.is_killed()) return; //ignore new data if killed
        
        if (this.onSuccess && transport.responseText != "" && this.onSuccess(transport) == false) return false;

        //we should check if there is a failure
        if(this.onComplete) if(this.onComplete(transport) == false) return false; //if onComplete returns false, teminates cycle.
        
        
        var url = this.url;
        var options = this.options;
        //options.onComplete = this.onComplete;
        //options.onSuccess = this.onSuccess;
        var transport=  this.transport;
        
        var wait_time = typeof options.wait_time == 'function' ? options.wait_time() : options.wait_time
        
        this.timeout = setTimeout( MVC.Function.bind( function(){ 
            options.polling();
            MVC.Comet.connection = new transport(url, options);
        
        },this),wait_time);
        
	}
}


//Setup onunload to kill future requests
MVC.Event.observe(window, 'unload', function(){
    MVC.Comet.send = false;
	if(MVC.Comet.connection && MVC.Comet.connection.transport 
		&& MVC.Comet.transport.className && MVC.Comet.transport.className == 'Ajax') 
		MVC.Comet.connection.transport.abort();
});

MVC.IO.Comet = MVC.Comet
if(!MVC._no_conflict && typeof Comet == 'undefined'){
	Comet = MVC.Comet;
}