/**
 * This class is used to 
 *    handle starting a comet response
 *    and
 *    dispatching the response to other controllers for handling.
 *    </br>
By default, comet controller queries the url of its className.  For example:
@code_start
JabbifyController = Controller.Comet.extend('jabbify',{},{})
@code_end
connects to /jabbify
<br/>
Comet controller expects data of the format:
@code_start javascript
{ClassName1: 
    {action1: [data1, data2 ...], 
     action2: [ ....], 
     ...
    }
 ClassName2: { .... }
}
@code_end
  If possible, Controller.Comet tries to create new instances of data, and dispatch to a matching 
  controller action.  For example:
@code_start
{Todo: {create: [{name: 'wash dishes'}]}}
@code_end
Will create a new Todo instance and call TodosController::create with that instance.
</pre>
*/
MVC.Controller.Comet = MVC.Controller.extend(
/* @Static*/
{
    init : function(){
         //cancels matching controller actions  
    },
    /**
     * Starts the coment connection.
     */
    run: function(params){
        var instance = new this();
        instance.run(params);
    },
    /**
     * Kills the comet connection.
     */
    kill: function(){
        var instance = new this();
        instance.kill();
    },
    convert : function(response){
        return response;
    },
    set_wait_time : function(val){
        this._wait_time = val*1000;
        if(this._comet)
            this._comet.poll_now();
    },
    _wait_time : 0,
    wait_time : function(){
        return this._wait_time;
    },
    /**
     * Dispatches to a controller and tries to send it instances if possible.
     * @param {Object} response
     */
    dispatch : function(response){
        var responseJSON = this.convert(response);
        for(var className in response){
            //first check if something matches
            if(className == 'responseText') continue;
            var classHappenings = response[className]
            
            for(var action in classHappenings){
                var objects = classHappenings[action];
                if(this.models_map && this.models_map[className] != null){
                    if(this.models_map[className] != false)
                        objects = this.models_map[className].create_many_as_existing(objects);
                }else if(MVC.Model && MVC.Model.models[className.toLowerCase()]){
                    objects = MVC.Model.models[className.toLowerCase()].create_many_as_existing(objects);
                }
                //now pass to controller
                //var controller = window[MVC.String.pluralize(className)+'controller']
                var controller_name = this.controller_map[className] ? this.controller_map[className] : MVC.String.pluralize(className).toLowerCase();
                MVC.Controller.publish(controller_name+"."+action, {
					data: objects
				});
            }
        } 
    },
    controller_map :{},
    error_mode: false
},
/* @Prototype*/
{
    run : function(){
        this.start_polling();
    },
    start_polling : function(){
        
        this.Class._comet = new MVC.Comet(( this.Class.domain ? this.Class.domain : ""  )+"/"+this.Class.className, 
                {method: 'get', 
                onComplete: this.continue_to('complete'),
                onSuccess: this.continue_to('success'),
                onFailure: this.continue_to('failure'),
                parameters: this.Class.parameters || null,
                session: this.Class.session || null,
                transport: this.Class.transport,
                wait_time: MVC.Function.bind(this.Class.wait_time, this.Class) }
            )
    },
    failure : function(){
        this.error_mode = true;
        this.run(); //start over
    },
    /**
     * Called when the comet request successfully returns.
     * @param {Object} response
     */
    success : function(response){
        this.Class.dispatch(response);
    },
    complete : function(){
        if(this.error_mode && this.restore_from_failure){
            this.restore_from_failure();
        }
        this.error_mode = false;
    },
    kill : function(){
        if(this.Class._comet) this.Class._comet.kill();  
    }
})
