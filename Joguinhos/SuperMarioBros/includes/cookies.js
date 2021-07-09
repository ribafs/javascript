function setCookie(nombre, valor, expira, path, dominio, seguridad) {
	var valor = "=" + escape(valor);
	var expira = expira ? "; expires=" + expira.toGMTString() : "";
	var path = path ? ": path=" + path : "";
	var dominio = dominio ? "; domain=" + dominio : "";
	var seguridad = seguridad ? "; secure" : "";
	
	var nCookie = nombre + valor + expira + path + dominio + seguridad;
	document.cookie = nCookie;
}
function getCookie(nombre) {
	var prefijo = nombre + "=";
	var inicio = document.cookie.indexOf(prefijo);
	
	if(inicio == -1){
		return null;
	}
	else{
		var fin = document.cookie.indexOf(";", inicio + prefijo.length);
		if(fin == -1){
			fin = document.cookie .length;
		}
		return unescape(document.cookie.substring(inicio + prefijo.length, fin));
	}
}

function deleteCookie(nombre, path, dominio){
	if( getCookie(nombre) ){
		var nombre = nombre + "=";
		var path = path ? "; path=" + path : "";
		var dominio = dominio ? "; domain=" + dominio : "";
		expira = "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		
		document.cookie = nombre + path + dominio + expira;
	}
}
function fixDate(){
	var now = new Date();
	var base = new Date(0);
	var skew = base.getTime();
	
	if(skew > 0){
		now.setTime(date.getTime() - skew);
	}
	now.setTime(now.getTime() + 93 * 24 * 60 * 60 * 1000);
	
	return now;
}