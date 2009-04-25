
include.translation = function(name, encoding){
    if(!name) return;
    encoding = encoding || "iso-8859-1";
    
    include.write(MVC.root.join("views/translations/"+name+".js") , encoding  );
}

MVC.translate = function(phrase){
    return phrase;
}




MVC.Translation = function(translations){

    MVC.translate = function(phrase){
        var t = translations[phrase]
        return t ? t : phrase;
    }
    if(!MVC._no_conflict){
    	$T = MVC.translate;
    }
    MVC.$T = MVC.translate
    for(var i =0; i < MVC.Translation._cbs.length; i++){
        MVC.Translation._cbs[i](translations);
    }
};
MVC.Translation._cbs = [];
MVC.Translation.onload = function(f){
    MVC.Translation._cbs.push(f)
}
MVC.$T = MVC.translate
if(!MVC._no_conflict){
	$T = MVC.translate;
    Translation = MVC.Translation;
}

