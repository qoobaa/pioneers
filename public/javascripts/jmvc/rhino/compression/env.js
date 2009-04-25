/*
 * Simulated browser environment for Rhino
 *   By John Resig <http://ejohn.org/>
 * Copyright 2007 John Resig, under the MIT License
 */

if(typeof window != 'undefined') delete window;
if(typeof document != 'undefined') delete document;
if(typeof include != 'undefined') delete include;

// The window Object
var window = this;
var self = window;
(function(){

	// Browser Navigator

	window.navigator = {
		get userAgent(){
			return "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3";
		},
        get language(){
            return "en-US";
        },
        javaEnabled : function(){
            return true;
        },
        get platform(){
            return "Win32"
        }
	};
    window.screen = {
        get width(){
            return java.awt.Toolkit.getDefaultToolkit().getScreenSize().width;
        },
        get height(){
            return java.awt.Toolkit.getDefaultToolkit().getScreenSize().height;
        }
    }
	window._rhino = true;
	var curLocation = (new java.io.File("./")).toURL();
	var cookies = {};
	window.__defineSetter__("location", function(url){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onreadystatechange = function(){
			curLocation = new java.net.URL( curLocation, url );
			
            window.document =  new DOMDocument();
            window.document.location = window.location;
            window.document.domain = window.location.domain;
            window.document.__defineGetter__("cookie", function(){
                var ret = [];
                for(var cookie in cookies){
                    if(cookies.hasOwnProperty(cookie)) ret.push( cookies[cookie] )
                }
                return ret.join(';')
            });
            window.document.__defineSetter__("cookie", function(newCookie){
                var name = newCookie.match(/[^=]*/)[0];
                cookies[name] = newCookie;
            });
            HTMLtoDOM(xhr.responseText, window.document);

            if(typeof MVCOptions != 'undefined' && MVCOptions.onload != false){
                var event = document.createEvent();
    			event.initEvent("load");
    			window.dispatchEvent( event );
            }
			
		};
		xhr.send();
	});
	
	window.__defineGetter__("location", function(url){
		return {
			get protocol(){
				return curLocation.getProtocol() + ":";
			},
			get href(){
				return curLocation.toString();
			},
            get domain(){
                return curLocation.getHost();
            },
			toString: function(){
				return this.href;
			},
            get pathname(){
                return window.location.href.substr(window.location.protocol.length);
            },
            get search(){
                return curLocation.getQuery() ? "?"+curLocation.getQuery() : "";
            },
            get hash(){
                return this.href.match(/#.*/) || ""
            }
		};
	});
	window.Image = function(width,height){
        this.src = '';
        this.name = ''
        this.width = width;
        this.height = height;    
    };
    window.prototype = {
        set src(newSrc){
            return this.src = newSrc;
        },
        get src(){
            return this.src;
        },
        set name(newName){
            return this.name = newName;
        },
        get name(){
            return this.name;
        },
        set onload(f){
            this.onload_handler = onload;
        }
    }
	// Timers

	var timers = [];
	
	window.setTimeout = function(fn, time){
		var num;
		return num = setInterval(function(){
			fn();
			clearInterval(num);
		}, time);
	};
	
	window.setInterval = function(fn, time){
		var num = timers.length;
		
		timers[num] = new java.lang.Thread(new java.lang.Runnable({
			run: function(){
				while (true){
					java.lang.Thread.currentThread().sleep(time);
					fn();
				}
			}
		}));
		
		timers[num].start();
	
		return num;
	};
	
	window.clearInterval = function(num){
		if ( timers[num] ) {
			timers[num].stop();
			delete timers[num];
		}
	};
	
	// Window Events
	
	var events = [{}];

	window.addEventListener = function(type, fn){
        if ( !this.uuid || this == window ) {
			this.uuid = events.length;
			events[this.uuid] = {};
		}
	    
		if ( !events[this.uuid][type] )
			events[this.uuid][type] = [];
		
		if ( events[this.uuid][type].indexOf( fn ) < 0 )
			events[this.uuid][type].push( fn );
	};
	
	window.removeEventListener = function(type, fn){
	   if ( !this.uuid || this == window ) {
	       this.uuid = events.length;
	       events[this.uuid] = {};
	   }
	   
	   if ( !events[this.uuid][type] )
			events[this.uuid][type] = [];
			
		events[this.uuid][type] =
			events[this.uuid][type].filter(function(f){
				return f != fn;
			});
	};

	window.dispatchEvent = function(event){
        if(!event.target)
            event.target = this;
        if ( event.type ) {
			if ( this.uuid && events[this.uuid][event.type] ) {
				var self = this;
				events[this.uuid][event.type].forEach(function(fn){
                    fn.call( self, event );
				});
			}
			
			if ( this["on" + event.type] )
				this["on" + event.type].call( self, event );
		}
        if(this.parentNode){
            this.parentNode.dispatchEvent.call(this.parentNode, event);
        }
	};
	
    
    
	// DOM Document
	
	window.DOMDocument = function(file){
        this._file = file;
		var DB = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance().newDocumentBuilder();
        if(file){
            var dh = new Packages.org.xml.sax.helpers.DefaultHandler();
            DB.setErrorHandler(dh);            
            this._dom = DB.parse(file);
        }else{
            
            //var doctyp=DB.getDOMImplementation().createDocumentType("NETMESSAGE","","");
            //System.out.println(doctyp);
            //org.w3c.dom.Document
            //Document doc=db.getDOMImplementation().createDocument("ns", "", doctyp);
            this._dom = DB.newDocument();
        }
        
        
        
		
        //can get position of element, and document.write add after and evaluates
        
        
		if ( !obj_nodes.containsKey( this._dom ) )
			obj_nodes.put( this._dom, this );
	};
	
	DOMDocument.prototype = {
		appendChild : function(child){
            return this._dom.appendChild(child._dom );
        },
        createTextNode: function(text){
			return makeNode( this._dom.createTextNode(
				text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")) );
		},
		createElement: function(name){
			return makeNode( this._dom.createElement(name.toLowerCase()) );
		},
        createComment : function(text){
            return makeNode( this._dom.createComment(text) );
        },
		getElementsByTagName: function(name){
			return new DOMNodeList( this._dom.getElementsByTagName(
				name.toLowerCase()) );
		},
		getElementById: function(id){
			var elems = this._dom.getElementsByTagName("*");
			
			for ( var i = 0; i < elems.length; i++ ) {
				var elem = elems.item(i);
				if ( elem.getAttribute("id") == id )
					return makeNode(elem);
			}
			
			return null;
		},
		get body(){
			return this.getElementsByTagName("body")[0];
		},
		get documentElement(){
			return makeNode( this._dom.getDocumentElement() );
		},
		get ownerDocument(){
			return null;
		},
		addEventListener: window.addEventListener,
		removeEventListener: window.removeEventListener,
		dispatchEvent: window.dispatchEvent,
		get nodeName() {
			return "#document";
		},
		importNode: function(node, deep){
			return makeNode( this._dom.importNode(node._dom, deep) );
		},
		toString: function(){
			return "Document" + (typeof this._file == "string" ?
				": " + this._file : "");
		},
		get innerHTML(){
			return this.documentElement.outerHTML;
		},
		
		get defaultView(){
			return {
				getComputedStyle: function(elem){
					return {
						getPropertyValue: function(prop){
							prop = prop.replace(/\-(\w)/g,function(m,c){
								return c.toUpperCase();
							});
							var val = elem.style[prop];
							
							if ( prop == "opacity" && val == "" )
								val = "1";
								
							return val;
						}
					};
				}
			};
		},
		
		createEvent: function(){
			return new Event();
		}
	};
	var Event = function(){
        this.type = "";
    }
    Event.prototype = {
        initEvent: function(type){
			this.type = type;
		},
        initMouseEvent: function(type){
            this.type = type;
		}
    }
    
	function getDocument(node){
		return obj_nodes.get(node);
	}
	
	// DOM NodeList
	
	window.DOMNodeList = function(list){
		this._dom = list;
		this.length = list.getLength();
		
		for ( var i = 0; i < this.length; i++ ) {
			var node = list.item(i);
			this[i] = makeNode( node );
		}
	};
	
	DOMNodeList.prototype = {
		toString: function(){
			return "[ " +
				Array.prototype.join.call( this, ", " ) + " ]";
		},
		get outerHTML(){
		    var outers = [];
            for(var i =0 ; i < this.length; i++){
                outers.push( this[i].outerHTML );
            }
            return outers.join('');
		}
	};
	
	// DOM Node
	
	window.DOMNode = function(node){
		this._dom = node;
	};
	
	DOMNode.prototype = {
		get nodeType(){
			return this._dom.getNodeType();
		},
		get nodeValue(){
			return this._dom.getNodeValue();
		},
		get nodeName() {
			return this._dom.getNodeName();
		},
		cloneNode: function(deep){
			return makeNode( this._dom.cloneNode(deep) );
		},
		get ownerDocument(){
			return getDocument( this._dom.ownerDocument );
		},
		get documentElement(){
			return makeNode( this._dom.documentElement );
		},
		get parentNode() {
			return makeNode( this._dom.getParentNode() );
		},
		get nextSibling() {
			return makeNode( this._dom.getNextSibling() );
		},
		get previousSibling() {
			return makeNode( this._dom.getPreviousSibling() );
		},
		toString: function(){
			return '"' + this.nodeValue + '"';
		},
		get outerHTML(){
			return this.nodeValue;
		},
        //I am sure there is a faster way
        contains : function(node){
            while(node && node != this ){
                node = node.parentNode;
            }
            return !!node;
        },
        compareDocumentPosition : function(b){
            var a = this;
            var number = (a != b && a.contains(b) && 16) + (a != b && b.contains(a) && 8);
            //find position of both
            var all = document.getElementsByTagName("*");
            var my_location = 0, node_location = 0;
            for(var i=0; i < all.length; i++){
                if(all[i] == a) my_location = i;
                if(all[i] == b) node_location = i;
                if(my_location && node_location) break;
            }
            number += (my_location < node_location && 4)
            number += (my_location > node_location && 2)
            return number;
        }
        
	};

	// DOM Element

	window.DOMElement = function(elem){
		this._dom = elem;
		this.style = {
			get opacity(){ return this._opacity; },
			set opacity(val){ this._opacity = val + ""; }
		};
		
		// Load CSS info
		var styles = (this.getAttribute("style") || "").split(/\s*;\s*/);
		
		for ( var i = 0; i < styles.length; i++ ) {
			var style = styles[i].split(/\s*:\s*/);
			if ( style.length == 2 )
				this.style[ style[0] ] = style[1];
		}
	};
	
	DOMElement.prototype = extend( new DOMNode(), {
		get nodeName(){
			return this.tagName.toUpperCase();
		},
		get tagName(){
			return this._dom.getTagName();
		},
		toString: function(){
			return "<" + this.tagName + (this.id ? "#" + this.id : "" ) + ">";
		},
		get outerHTML(){
			var ret = "<" + this.tagName, attr = this.attributes;
			
			for ( var i in attr )
                if(attr.hasOwnProperty(i))
				    ret += " " + i + "='" + attr[i] + "'";
				
			if ( this.childNodes.length || this.nodeName == "SCRIPT" )
				ret += ">" + this.childNodes.outerHTML + 
					"</" + this.tagName + ">";
			else
				ret += "/>";
			
			return ret;
		},
		
		get attributes(){
			var attr = {}, attrs = this._dom.getAttributes();
			
			for ( var i = 0; i < attrs.getLength(); i++ )
				attr[ attrs.item(i).nodeName ] = attrs.item(i).nodeValue;
				
			return attr;
		},
		
		get innerHTML(){
			return this.childNodes.outerHTML;	
		},
		set innerHTML(html){
			html = html.replace(/<\/?([A-Z]+)/g, function(m){
				return m.toLowerCase();
			});
			html = HTMLtoXML(html);
			var nodes = this.ownerDocument.importNode(
				new DOMDocument( new java.io.ByteArrayInputStream(
					(new java.lang.String("<wrap>" + html + "</wrap>"))
						.getBytes("UTF8"))).documentElement, true).childNodes;
				
			while (this.firstChild)
				this.removeChild( this.firstChild );
			
			for ( var i = 0; i < nodes.length; i++ )
				this.appendChild( nodes[i] );
		},
		
		get textContent(){
			return nav(this.childNodes);
			
			function nav(nodes){
				var str = "";
				for ( var i = 0; i < nodes.length; i++ )
					if ( nodes[i].nodeType == 3 )
						str += nodes[i].nodeValue;
					else if ( nodes[i].nodeType == 1 )
						str += nav(nodes[i].childNodes);
				return str;
			}
		},
		set textContent(text){
			while (this.firstChild)
				this.removeChild( this.firstChild );
			this.appendChild( this.ownerDocument.createTextNode(text));
		},
		
		style: {},
		clientHeight: 0,
		clientWidth: 0,
		offsetHeight: 0,
		offsetWidth: 0,
		
		get disabled() {
			var val = this.getAttribute("disabled");
			return val != "false" && !!val;
		},
		set disabled(val) { return this.setAttribute("disabled",val); },
		
		get checked() {
			var val = this.getAttribute("checked");
			return val != "false" && !!val;
		},
		set checked(val) { return this.setAttribute("checked",val); },
		
		get selected() {
			if ( !this._selectDone ) {
				this._selectDone = true;
				
				if ( this.nodeName == "OPTION" && !this.parentNode.getAttribute("multiple") ) {
					var opt = this.parentNode.getElementsByTagName("option");
					
					if ( this == opt[0] ) {
						var select = true;
						
						for ( var i = 1; i < opt.length; i++ )
							if ( opt[i].selected ) {
								select = false;
								break;
							}
							
						if ( select )
							this.selected = true;
					}
				}
			}
			
			var val = this.getAttribute("selected");
			return val != "false" && !!val;
		},
		set selected(val) { return this.setAttribute("selected",val); },

		get className() { return this.getAttribute("class") || ""; },
		set className(val) {
			return this.setAttribute("class",
				val.replace(/(^\s*|\s*$)/g,""));
		},
		
		get type() { return this.getAttribute("type") || ""; },
		set type(val) { return this.setAttribute("type",val); },
		
		get value() { return this.getAttribute("value") || ""; },
		set value(val) { return this.setAttribute("value",val); },
		
		get src() { return this.getAttribute("src") || ""; },
		set src(val) { return this.setAttribute("src",val); },
		
		get id() { return this.getAttribute("id") || ""; },
		set id(val) { return this.setAttribute("id",val); },
		
		getAttribute: function(name){
			return this._dom.hasAttribute(name) ?
				new String( this._dom.getAttribute(name) ) :
				null;
		},
		setAttribute: function(name,value){
			this._dom.setAttribute(name,value);
		},
		removeAttribute: function(name){
			this._dom.removeAttribute(name);
		},
		
		get childNodes(){
			return new DOMNodeList( this._dom.getChildNodes() );
		},
		get firstChild(){
			return makeNode( this._dom.getFirstChild() );
		},
		get lastChild(){
			return makeNode( this._dom.getLastChild() );
		},
		appendChild: function(node){
			this._dom.appendChild( node._dom );
		},
		insertBefore: function(node,before){
			this._dom.insertBefore( node._dom, before ? before._dom : before );
		},
		removeChild: function(node){
			this._dom.removeChild( node._dom );
		},

		getElementsByTagName: DOMDocument.prototype.getElementsByTagName,
		
		addEventListener: window.addEventListener,
		removeEventListener: window.removeEventListener,
		dispatchEvent: window.dispatchEvent,
		
		click: function(){
			var event = document.createEvent();
			event.initEvent("click");
			this.dispatchEvent(event);
		},
		submit: function(){
			var event = document.createEvent();
			event.initEvent("submit");
			this.dispatchEvent(event);
		},
		focus: function(){
			var event = document.createEvent();
			event.initEvent("focus");
			this.dispatchEvent(event);
		},
		blur: function(){
			var event = document.createEvent();
			event.initEvent("blur");
			this.dispatchEvent(event);
		},
		get elements(){
			return this.getElementsByTagName("*");
		},
		get contentWindow(){
			return this.nodeName == "IFRAME" ? {
				document: this.contentDocument
			} : null;
		},
		get contentDocument(){
			if ( this.nodeName == "IFRAME" ) {
				if ( !this._doc )
					this._doc = new DOMDocument(
						new java.io.ByteArrayInputStream((new java.lang.String(
						"<html><head><title></title></head><body></body></html>"))
						.getBytes("UTF8")));
				return this._doc;
			} else
				return null;
		}
	});
	
	// Helper method for extending one object with another
	
	function extend(a,b) {
		for ( var i in b ) {
			var g = b.__lookupGetter__(i), s = b.__lookupSetter__(i);
			
			if ( g || s ) {
				if ( g )
					a.__defineGetter__(i, g);
				if ( s )
					a.__defineSetter__(i, s);
			} else
				a[i] = b[i];
		}
		return a;
	}
	
	// Helper method for generating the right
	// DOM objects based upon the type
	
	var obj_nodes = new java.util.HashMap();
	
	function makeNode(node){
		if ( node ) {
			if ( !obj_nodes.containsKey( node ) )
				obj_nodes.put( node, node.getNodeType() == 
					Packages.org.w3c.dom.Node.ELEMENT_NODE ?
						new DOMElement( node ) : new DOMNode( node ) );
			
			return obj_nodes.get(node);
		} else
			return null;
	}
	
	// XMLHttpRequest
	// Originally implemented by Yehuda Katz

	window.XMLHttpRequest = function(){
		this.headers = {};
		this.responseHeaders = {};
	};
	
	XMLHttpRequest.prototype = {
		open: function(method, url, async, user, password){ 
            this.readyState = 1;
            if (async == false)
				this.async = false;
			this.method = (method || "GET").toUpperCase();
			this.url = url;
			this.onreadystatechange();
		},
		setRequestHeader: function(header, value){
			this.headers[header] = value;
		},
		getResponseHeader: function(header){ },
		send: function(data){
			var self = this;
			
			function makeRequest(){
                var url = new java.net.URL(curLocation, self.url);
				
				if ( url.getProtocol() == "file" ) {
					if ( self.method == "PUT" ) {
						var out = new java.io.FileWriter( 
								new java.io.File( new java.net.URI( url.toString() ) ) ),
							text = new java.lang.String( data || "" );
						
						out.write( text, 0, text.length() );
						out.flush();
						out.close();
					} else if ( self.method == "DELETE" ) {
						var file = new java.io.File( new java.net.URI( url.toString() ) );
						file["delete"]();
					} else {
						var connection = url.openConnection();
						connection.connect();
						handleResponse();
					}
				} else { 
					var connection = url.openConnection();
					
					connection.setRequestMethod( self.method );
					
					// Add headers to Java connection
					for (var header in self.headers)
                        if(self.headers.hasOwnProperty(header))
						    connection.addRequestProperty(header, self.headers[header]);
				
					connection.connect();
					
					// Stick the response headers into responseHeaders
					for (var i = 0; ; i++) { 
						var headerName = connection.getHeaderFieldKey(i); 
						var headerValue = connection.getHeaderField(i); 
						if (!headerName && !headerValue) break; 
						if (headerName)
							self.responseHeaders[headerName] = headerValue;
					}
					
					handleResponse();
				}
				
				function handleResponse(){
					self.readyState = 4;
					self.status = parseInt(connection.responseCode) || undefined;
					self.statusText = connection.responseMessage || "";
					
					var stream = new java.io.InputStreamReader(connection.getInputStream()),
						buffer = new java.io.BufferedReader(stream), line, lines = [];
					
					while ((line = buffer.readLine()) != null)
						lines.push(line);
					self.responseText = lines.join('\n')
					self.responseXML = null;
					
					if ( self.responseText.match(/^\s*</) ) {
						try {
							self.responseXML = new DOMDocument(
								new java.io.ByteArrayInputStream(
									(new java.lang.String(
										self.responseText)).getBytes("UTF8")));
						} catch(e) {}
					}
				}
				
				self.onreadystatechange();
			}
			if (this.async){
                (new java.lang.Thread(new java.lang.Runnable({
					run: makeRequest
				}))).start();
            }
			else{
                makeRequest();
            }
				
		},
		abort: function(){},
		onreadystatechange: function(){},
		getResponseHeader: function(header){
			if (this.readyState < 3)
				throw new Error("INVALID_STATE_ERR");
			else {
				var returnedHeaders = [];
				for (var rHeader in this.responseHeaders) {
					if (this.responseHeaders.hasOwnProperty(rHeader) && rHeader.match(new Regexp(header, "i")))
						returnedHeaders.push(this.responseHeaders[rHeader]);
				}
			
				if (returnedHeaders.length)
					return returnedHeaders.join(", ");
			}
			
			return null;
		},
		getAllResponseHeaders: function(header){
			if (this.readyState < 3)
				throw new Error("INVALID_STATE_ERR");
			else {
				var returnedHeaders = [];
				
				for (var header in this.responseHeaders)
                    if(this.responseHeaders.hasOwnProperty(header))
					    returnedHeaders.push( header + ": " + this.responseHeaders[header] );
				
				return returnedHeaders.join("\r\n");
			}
		},
		async: true,
		readyState: 0,
		responseText: "",
		status: 0
	};

})();