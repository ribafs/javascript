function ajax( method, url, parameters, funct ){
	/*
		Hace un request a un php (  url ) pasandole parametros (  parameters ) por un metodo ( method ) ( get o post ) y cuando termina corre una funcion ( funct )
	*/
  var http_request = false;
	if ( window.XMLHttpRequest ){ // Request para firefox, safari, etc
		 http_request = new XMLHttpRequest();
		 
		 if( http_request.overrideMimeType ){
			http_request.overrideMimeType("text/html");
		}
		
	}
	
	else if(window.ActiveXObject){ // Request para Internet Explorer
		try{
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e){
			try{
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e){}
		}
	}
	
	if( !http_request ){
		alert("A problem ocurred while requesting, please try again.");
		return false;
	}
	
	http_request.onreadystatechange = function(){
		/*
			Se corre cuando se termina el request
		*/
		if( http_request.readyState == 4 ){
			if ( http_request.status == 200 ){
				funct( http_request.responseText );        
			}
			else{
				alert("A problem ocurred while requesting, please try again.");
			}
		}
	};
	
	if( method == "post" ){
		http_request.open('POST', url, true);
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http_request.setRequestHeader("Content-length", parameters.length);
		http_request.setRequestHeader("Connection", "close");
		http_request.send(parameters);
	}
	else if( method == "get" ){
		http_request.open('GET', url + "?" + parameters, true);
		http_request.send(null);
	}
	
}

function postComment(){
    var name = get("postComForm").name.value;
    var comment = get("postComForm").comment.value;
    var email = get("postComForm").email.value;
    
    ajax("post", "commentsController.php", "action=postComment&name=" + name + "&comment=" + comment + "&email=" + email, function(res){
		
        if( res ){
			switch( res ){
				case "error 1":
					alert("You have to wait one minute to post again");
					get("postComForm").name.value = name;
					get("postComForm").comment.value = comment;
				break;
				case "error 2":
					alert("Complete all fields");
					get("postComForm").name.value = name;
					get("postComForm").comment.value = comment;
				break;
				case "error 3":
					alert("lol");
					get("postComForm").name.value = name;
					get("postComForm").comment.value = comment;
				break;
				default:
					get("_comentarios").innerHTML += res;
				break;
			}
        }
        else{
            alert("comentario invalido");
            get("postComForm").name.value = name;
            get("postComForm").comment.value = comment;
        }
    });
    
    get("postComForm").name.value = "";
    get("postComForm").comment.value = "";
}

function scrollPos(){
	
	if( typeof( window.pageYOffset ) == 'number' ){
		return { x: window.pageXOffset, y: window.pageYOffset };
	}
	else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ){
		return { x: document.body.scrollLeft, y: document.body.scrollTop };
	}
	else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ){
		return { x: document.documentElement.scrollLeft, y: document.documentElement.scrollLeft };
	}
	
	return {x: 0, y: 0};
	
}