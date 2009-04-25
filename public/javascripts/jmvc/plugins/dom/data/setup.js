//from jQuery


MVC.Dom ={
    data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;
        var cache = elem.__mvc;


		if ( !cache )
			elem.__mvc = {};

		if ( data !== undefined )
			elem.__mvc[ name ] = data;

		// Return the named cache data, or the ID for the element
		return name ?
			elem.__mvc[ name ] :
			elem.__mvc;
	},
	remove_data: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var cache = elem.__mvc;

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( cache ) {
				// Remove the section of cache data
				delete cache[ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in cache )
					break;

				if ( !name )
					MVC.Dom.remove_data( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem.__mvc;
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( "__jmvc" );
			}
		}
	}
}