//Almost all code and technique comes from Kris Zyp's/Dojo's window.name Transport
//http://www.sitepen.com/blog/2008/07/22/windowname-transport/
/**
 * 
 * @constructor MVC.IO.WindowName
 * @alias MVC.WindowName
 * Provides window name as a transport similar to [MVC.IO.Ajax MVC.Ajax]
 * 
 * @init a
 */
MVC.WindowName = function(url, params){
    this.url = url;
    this.params = params || {};
    this.params.method = this.params.method || 'post';
    this.frameNum = MVC.WindowName.frameNum++;
    this.send();
}
MVC.WindowName.frameNum = 0;
MVC.WindowName.prototype = {
    cleanup : function(){
        try{
			var innerDoc = this.frame.contentWindow.document;
			innerDoc.write(" ");
			innerDoc.close();
		}catch(e){}
		document.body.removeChild(this.outerFrame); // clean up
    },
    get_data : function(){
        var data = this.frame.contentWindow.name;
		if(typeof data == 'string'){
			if(data != this.frameName){
				this.state = 2; // we are done now
                //dfd.ioArgs.hash = frame.contentWindow.location.hash;
				
                this.cleanup();
                if(data == 'null\n') data = '';
                
                this.params.onComplete(data);
			}
		}
    },
    onload: function(){
        try{
			if(!MVC.Browser.Gecko && this.frame.contentWindow.location =='about:blank'){
				// opera and safari will do an onload for about:blank first, we can ignore this first onload
				return;
			}
		}catch(e){
			// if we are in the target domain, frame.contentWindow.location will throw an ignorable error 
		}
		if(!this.state){
			// we have loaded the target resource, now time to navigate back to our domain so we can read the frame name
			this.state=1;
			this.frame.contentWindow.location = this.domain_page;
		}
		// back to our domain, we should be able to access the frame name now
		if(this.state<2) this.get_data();
    },
    send : function(){
        this.domain = window.location.protocol+"//"+window.location.hostname;
        this.domain_page = this.domain+"/blank.html"+"#" +this.frameNum;
        this.frameName = this.domain_page;
        this.frame_container = document.body;
        this.doc = document;
        if(MVC.Browser.Gecko && ![].reduce)
            this.protectFF2()
        var frame = this.frame = document.createElement(MVC.Browser.IE ? 
            '<iframe name="' + this.frameName + '" onload="MVC.WindowName['+this.frameNum+']()">' :
            'iframe'
        )
		MVC.WindowName.styleFrame(this.frame);
		this.outerFrame = this.outerFrame || this.frame;

		this.outerFrame.style.display='none';

		this.state = 0;
		
        var self = this;
		MVC.WindowName[this.frameNum] = this.frame.onload = MVC.Function.bind(this.onload, this);
		
        frame.name = this.frameName;
		if(this.params.method.match(/GET/i)){
			// if it is a GET we can just the iframe our src url
            this.url += (MVC.String.include(this.url,'?') ? '&' : '?') + MVC.Object.to_query_string(this.params.parameters);
			frame.src = this.url;
			this.frame_container.appendChild(frame);
			if(frame.contentWindow){
				frame.contentWindow.location.replace(this.url);
			}
		}else if(this.params.method.match(/POST|PUT|DELETE/i)){
            // if it is a POST we will build a form to post it
            this.frame_container.appendChild(frame);
            var form = document.createElement("form");
            document.body.appendChild(form);
            
            if(this.params.method.match(/PUT|DELETE/i)) this.params.parameters._method = this.params.method;
            
            
            for(var attr in this.params.parameters){
                var values = this.params.parameters[attr];
                values = values instanceof Array ? values : [values];
                for(j = 0; j < values.length; j++){
                    // create hidden inputs for all the parameters
                    var input = this.doc.createElement("input");
                    input.type = 'hidden';
                    input.name = attr;
                    input.value = values[j];				
                    form.appendChild(input);	
                }
            }
            form.method = 'POST';
            form.action = this.url;
            form.target = this.frameName;// connect the form to the iframe
            
            form.submit();
            form.parentNode.removeChild(form);
		}else{
			throw new Error("Method " + this.params.method + " not supported with the WindowName transport");
		}
		if(frame.contentWindow){
			frame.contentWindow.name = this.frameName; // IE likes it afterwards
		}
        
        
    },
    protectFF2 : function(){
		// FF2 allows unsafe sibling frame modification,
		// the fix for this is to create nested frames with getters and setters to protect access
		this.outerFrame = document.createElement("iframe");
		MVC.WindowName.styleFrame(this.outerFrame);
	    this.outerFrame.style.display='none';

		this.frame_container.appendChild(this.outerFrame);
		
		var firstWindow = this.outerFrame.contentWindow;
		this.doc = firstWindow.document;
		this.doc.write("<html><body margin='0px'><iframe style='width:100%;height:100%;border:0px' name='protectedFrame'></iframe></body></html>");
		this.doc.close();
		var secondWindow = firstWindow[0]; 
		firstWindow.__defineGetter__(0,function(){});
		firstWindow.__defineGetter__("protectedFrame",function(){});
		this.doc = secondWindow.document;
		this.doc.write("<html><body margin='0px'></body></html>");
		this.doc.close();
		this.frame_container = this.doc.body;
    }
    
    
}
MVC.WindowName.styleFrame = function(frame){
	frame.style.width="100%";
	frame.style.height="100%";
	frame.style.border="0px";
}

if(!MVC._no_conflict && typeof WindowName == 'undefined'){
	WindowName = MVC.WindowName;
}
MVC.IO.WindowName = MVC.WindowName;