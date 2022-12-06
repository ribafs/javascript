var editor = {
	altoXB : 1,
	largoXB : 1,
	editando : false,
	lugar : false,
	mapas : [],
	config : {},
	mapaN : false,
	scroll : [0, 0],
	sortDragDrop : {
		dragDroping : false,
		mouseX : 0,
		mouseY : 0,
		_mouseX : 0,
		_mouseY : 0,
		mapaN : 0,
		nuevaPosicion : 0,
		objetoClonado : false,
		divisorTop : 0
	},
	capa : "cubos",
	trace : "",
	scroll : {
		left : 0,
		largo : 0,
		_mouseX : 0,
		moviendo : false
	},
	herramienta : "mouse",
	dragDrop : {
		dragDroping : false,
		_mouseX : 0,
		_mouseY : 0,
		objetoClonado : false,
		objetoClonado2 : false,
		tipo : "cubos",
		objA : false,
		clonar : false
	},
	grillaX : false,
	grillaY : false,
	objetoInfo : "cubosP"
};
function cargarEditor(){
	get("sombra").style.display = "none";
	
	menuA = false;
	editor.editando = true;
	
	editor.altoXB = altoX;
	editor.largoXB = largoX;
	altoX = 1;
	largoX = 1;
	
	get( "contenedor" ).style.display = "none";
	get( "contenedorE" ).style.display = "inline";
	
	var p = "<a style='padding-right: 10px'></a>";
	
	editor.mapas = [];
	reconocerMapa();
	
	get( "editorTxt" ).innerHTML = "";
	var editorBackLink = " <a id='editorBackLink' onclick='salirEditor();'>back</a>";
	get( "editorTxt" ).innerHTML = escribir( "MAP EDITOR" ).innerHTML + "<br />(NOT FINISHED YET)" + editorBackLink;
	
	get( "mapasTxt" ).innerHTML = "";
	get( "mapasTxt" ).appendChild( escribir( "MAPS" ) );
	
	get( "configBoton" ).innerHTML = "";
	get( "configBoton" ).appendChild( escribir( "C" ) );
	
	get( "mapasAgregar" ).innerHTML = "";
	get( "mapasAgregar" ).appendChild( escribir( "+" ) );
	
	get( "configGeneralTxt" ).appendChild( escribir( "GENERAL SETTINGS" ) );
	get( "configGeneralEsc" ).appendChild( escribir( "X" ) );
	get( "configFormD1" ).appendChild( escribir( "SCORE" ) );
	get( "configFormD3" ).appendChild( escribir( "MONEY" ) );
	get( "configFormD5" ).appendChild( escribir( "LIVES" ) );
	get( "configFormDone" ).appendChild( escribir( "DONE" ) );
	
	escribirSort();
	
}

function salirEditor(){
	// Vuelve al menú principal
	
	get("sombra").style.display = "inline";
	
	editor.editando = false;
	
	altoX = editor.altoXB;
	largoX = editor.largoXB;
	
	get( "contenedor" ).style.display = "inline";
	get( "contenedorE" ).style.display = "none";

	
	cargarMenu();
}

function reconocerMapa(){
	// Se reconoce los mapas
	for( x = 0; x < mapas.length; x++ ){
		editor.mapas.push( {} );
		$ = editor.mapas[x];
		
		var config = mapas[x][0].split( "config:" )[1].split( "," );
		
		// Se reconoce la configuracion del mapa actual ( puede ser el mapa principal o un mapa secundario )
		if( x == 0 ){ // Si es mapa actual es el mapa principal
			$.tipo = Number( config[0] );
			
			editor.config.vidas = Number( config[1] );
			editor.config.puntos = Number( config[2] );
			editor.config.monedas = Number( config[3] );
			
			$.nombre = config[4];
			$.tiempo = Number( config[5] );
			$.largo = Number( config[6] );
			$.tuneles = [];
			$.posiciones = [];
			
			var posiciones = config.slice( 7, config.length );
			
			for( n = 0; n < posiciones.length; n += 2 ){
				$.posiciones.push( [ Number( posiciones[n] ), Number( posiciones[n + 1] ) ] );
			}
		}
		else{ // Si es mapa actual es un mapa secundario
			$.tipo = Number( config[0] );
			$.nombre = config[1];
			$.tiempo = Number( config[2] );
			$.largo = Number( config[3] );
			$.tuneles = [];
			$.posiciones = [];
			
			var posiciones = config.slice( 4, config.length );
			
			for( n = 0; n < posiciones.length; n += 2 ){
				$.posiciones.push( [ Number( posiciones[n] ), Number( posiciones[n + 1] ) ] );
			}
			
		}
		
		// El mapa tiene un array de cubos, un array de bichos y un array de figuras de fondo
		$.cubos = [];
		$.bichos = [];
		$.figuras = [];
		
		// Se reconoce cada objeto y se lo ubica en uno de los tres arrays
		for( e = 1; e < mapas[x].length; e++ ){
			var split = mapas[x][e].split( "," );
			if( !( split[0] == "9" && split[3] == "10" ) ){
				var $$ = {};
				
				/*
					Si el objeto es un cubo del piso, un signo de preguntas, un cubo rompible, una moneda, un tubo,
					la bandera final o un barra se lo coloca en el array de cubos
					
					Si el objeto es un bicho comun o una tortuga se lo coloca en el array de bichos
					
					Si el objeto es una figura de fondo se lo coloca en el array de figuras
				*/
				switch( split[0] ){
					case "1": case "2": case "3": case "4": case "5": case "8": case "10": case "11":
						$.cubos.push( $$ );
					break;
					case "6": case "7":
						$.bichos.push( $$ );
					break;
					case "9":
						$.figuras.push( $$ );
					break;
				}
				
				reconocerObjeto( $$, split );
				
			}
		}
	}
	
	// Se reconoce los tuneles
	for( x in tuneles ){
		var config = tuneles[x][0].split( "config:" )[1].split( "," );
		
		var $ = {};
		
		if( editor.mapas[config[2]].tipo == 2 && !!Number( config[1] ) ){
			$ = editor.mapas[config[2]];
		}
		else{
			editor.mapas[config[2]].tuneles.push( $ );
			$.nombre = x;
			$.camara = !!Number( config[1] );
		}
		$.largo = Number( config[0] );
		$.posiciones = [];
		
		var posiciones = config.slice( 3, config.length );
		for( n = 0; n < posiciones.length; n += 2 ){
			$.posiciones.push( [ Number( posiciones[n] ), Number( posiciones[n + 1] ) ] );
		}
		
		$.cubos = [];
		$.bichos = [];
		$.figuras = [];
		
		for( m in tuneles[x] ){
			var split = tuneles[x][m].split( "," );
			
			if( !( split[0] == "9" && split[3] == "10" ) ){
				var $$ = {};
				
				switch( split[0] ){
					case "1": case "2": case "3": case "4": case "5": case "8": case "10": case "11":
						$.cubos.push( $$ );
					break;
					case "6": case "7":
						$.bichos.push( $$ );
					break;
					case "9":
						$.figuras.push( $$ );
					break;
				}
				
				reconocerObjeto( $$, split );
			}
			
		}
	}
}

function reconocerObjeto( $$, split ){
	/*
		Pasa todos la informacion que contiene split a un objeto ( el que se coloco en un array anteriormente )
		El tipo de objeto puede ser:
			* cubosP: un cubo del piso
				* left
				* top
			* cuboP2: el segundo tipo de cubos de piso
				* left
				* top
			* signo: un signo de prgunta
				* left
				* top
				* drop
				* invisible
				* puntos
				* tiempo
			* rompible: un cubo rompible
				* left
				* top
				* drop
				* invisible
				* puntos
				* tiempo
			* moneda: una moneda
				* left
				* top
				* puntos
			* bicho: un bicho comun
				* left
				* top
				* puntos
			* tortuga: una tortuga
				* left
				* top
				* tipoT
				* puntos
			* tubo: un tubo
				* left
				* top
				* alto
				* tipoT
				* bicho
				* id
				* link
			* figura: una figura de fondo
				* left
				* top
				* tipoT
			* bandera: la bandera final
				* left
				* top
			* barra: una barra de las que suben o bajan
				* left
				* direccion
	*/
	switch( split[0] ){
		case "1":
			$$.tipo = "cubosP";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			
			$$.height = 32;
			$$.width = 32;
			$$.src = "imgs/cuadraditos/cubo_piso.gif";
			$$.src2 = "imgs/cuadraditosTunel/cubo_piso.gif";
		break;
		case "2":
			$$.tipo = "cubosP2";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			
			$$.height = 32;
			$$.width = 32;
			$$.src = "imgs/cuadraditos/cubo_escalera.gif";
			$$.src2 = "imgs/cuadraditosTunel/cubo_escalera.gif";
		break;
		case "3":
			$$.tipo = "signo";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			$$.drop = Number( split[3] );
			$$.invisible = Number( split[4] );
			$$.puntos = Number( split[5] );
			$$.tiempo = Number( split[6] ) ? Number( split[6] ) : 0;
			
			$$.height = 32;
			$$.width = 32;
			$$.src = "imgs/cuadraditos/signo.gif";
			$$.src2 = "imgs/cuadraditosTunel/signo.gif";
		break;
		case "4":
			$$.tipo = "rompible";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			$$.drop = Number( split[3] );
			$$.invisible = Number( split[4] );
			$$.puntos = Number( split[5] );
			$$.tiempo = Number( split[6] ) ? Number( split[6] ) : 0;
			
			$$.height = 32;
			$$.width = 32;
			$$.src = "imgs/cuadraditos/cubo_rompible.gif";
			$$.src2 = "imgs/cuadraditosTunel/cubo_rompible.gif";
		break;
		case "5":
			$$.tipo = "moneda";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			$$.puntos = Number( split[3] );
			
			$$.height = 32;
			$$.width = 32;
			$$.src = "imgs/cuadraditos/moneda.gif";
			$$.src2 = $$.src;
		break;
		case "6":
			$$.tipo = "bicho";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			$$.puntos = Number( split[3] );
			
			$$.height = 32;
			$$.width = 32;
			$$.src = "imgs/bichos/bicho.gif";
			$$.src2 = "imgs/bichosTunel/bicho.gif";
		break;
		case "7":
			$$.tipo = "tortuga";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			$$.tipoT = Number( split[3] );
			$$.puntos = Number( split[4] );
			
			$$.height = 48;
			$$.width = 32;
			$$.src = $$.tipoT == 1 ? "imgs/bichos/tortuga_normal_izquierda.gif" : "imgs/bichos/tortuga_2_normal_izquierda.gif";
			$$.src2 = $$.tipoT == 1 ? "imgs/bichosTunel/tortuga_normal_izquierda.gif" : "imgs/bichos/tortuga_2_normal_izquierda.gif";
		break;
		case "8":
			$$.tipo = "tubo";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			$$.tipoT = Number( split[3] );
			$$.alto = Number( split[4] );
			$$.bicho = !!Number( split[5] );
			$$.id = Number( split[6] );
			$$.link = Number( split[7] ) ? Number( split[6] ) : false;
			
			$$.height = $$.alto * 32;
			$$.width = 64;
			$$.src = false;
			$$.src2 = false;
		break;
		case "9":
			$$.tipo = "figura";
			$$.left = Number( split[1] );
			$$.top = Number( split[2] );
			$$.tipoT = Number( split[3] );
			
			$$.height = figurasSize[$$.tipoT - 1][1];
			$$.width = figurasSize[$$.tipoT - 1][0];
			$$.src = "imgs/figuras/figura" + $$.tipoT + ".gif";
			$$.src2 = $$.src;
		break;
		case "10":
			$$.tipo = "bandera";
			$$.left = Number( split[1] ) - .5;
			$$.top = Number( split[2] ) - .5;
			
			$$.height = 320;
			$$.width = 32;
			$$.src = "imgs/figuras/figura10.gif";
			$$.src2 = $$.src;
		break;
		case "11":
			$$.tipo = "barra";
			$$.left = Number( split[1] );
			$$.top = 1;
			$$.direccion = !!Number( split[2] );
			
			$$.height = 16;
			$$.width = 96;
			$$.src = "imgs/cuadraditos/barra.gif";
			$$.src2 = $$.src;
		break;
	}
}

function generarMapaSort( mapaN ){
	var $ = editor.mapas[mapaN];
	
	var p = "<a style='padding-right: 10px'></a>";
	
	var html = "<div id='mapaSortN" + mapaN + "' class='mapaSort' style='top: " + ( 32 + mapaN * 70  ) + "px;'>";
		
		html += "<div class='mapaSortLeft' onmousedown='editor.sortDragDrop.empezar(" + 
				mapaN + ", event);return false' onmouse='return false'></div>";
		html += "<div class='mapaNombre'>";
			html += escribir( $.nombre ).innerHTML;
		html += "</div>";
		html += "<div class='mapaEditar' onclick='editarMapa(" + mapaN + ")'" + 
			"onmouseover='bgcolor(this, \"#69A5FB\")' onmouseout='bgcolor(this, \"\")'>";
			html += escribir( "EDIT" ).innerHTML;
		html += "</div>";
		html += "<div class='mapaBorrar' onclick='borrarMapa(" + mapaN + ")'" + 
			"onmouseover='bgcolor(this, \"#69A5FB\")' onmouseout='bgcolor(this, \"\")'>";
			html += escribir( "DELETTE" ).innerHTML;
		html += "</div>";
		
	html += "</div>";
	
	return html;
}

function escribirSort(){
	editor.lugar = "mapasSort";
	
	var html = "";
	for( b = 0; b < editor.mapas.length; b++ ){
		html += generarMapaSort( b );
	}
	
	get( "mapasBox" ).innerHTML = html;
	
	var sortDivisor = elemento( "div", { id : "sortDivisor" }, get( "mapasBox" ) );
	
	if( editor.mapas.length > 4 ){
		get( "mapasBox" ).style.width = "447px";
	}
	else{
		get( "mapasBox" ).style.width = "430px";
	}
}

function borrarMapa( n ){
	if( confirm( "Are you sure that you want to delete " + editor.mapas[n].nombre + "?" ) ){
		editor.mapas.splice( n, 1 );
		escribirSort();
	}
}
function nuevoMapa(){
	editor.mapas.push({
		tipo : 1,
		nombre : "NEW MAP",
		tiempo : 400,
		largo : 16,
		tuneles : [],
		posiciones : [],
		cubos : [],
		bichos : [],
		figuras : []
	});
	
	escribirSort();
}
function bgcolor( obj, color ){
	obj.style.backgroundColor = color;
}
function borde( obj, color ){
	obj.parentNode.style.border = color.length ? ( "1px solid " + color ) : "none";
}
function padding( obj, n ){
	obj.parentNode.style.margin = n + "px 0px 0px " + n + "px";
}

editor.aPM = function( e ){
	if( document.layers ){
		editor.mouseX = e.x;
		editor.mouseY = e.y;
	}
	else if( document.all ){
		editor.mouseX = event.clientX;
		editor.mouseY = event.clientY;
	}
	else if( document.getElementById ){
		editor.mouseX = e.clientX;
		editor.mouseY = e.clientY;
	}
	editor.mouseX -= ( get( "contenedorE" ).offsetLeft - 255 );
	editor.mouseY -= ( get( "contenedorE" ).offsetTop - 225 );
}

editor.sortDragDrop.empezar = function( mapaN, e ){
	editor.aPM( e );
	
	var $ = editor.sortDragDrop;
	
	$._mouseY = editor.mouseY - ( 96 + mapaN * 70 );
	
	$.dragDroping = true;
	$.mapaN = mapaN;
	$.nuevaPosicion = mapaN;
	
	opacity( "mapaSortN" + mapaN, .7 );
	objetoClonado = get( "mapaSortN" + mapaN ).cloneNode( true );
	opacity( "mapaSortN" + mapaN, 1 );
	get( "mapasBox" ).appendChild( objetoClonado );
	$.objetoClonado = objetoClonado;
	
	document.body.style.cursor = "move";
	get( "sortDivisor" ).style.display = "inline";
	get( "sortDivisor" ).style.top = ( 22 + mapaN * 70 ) + "px";
}

editor.sortDragDrop.terminar = function(){
	var $ = editor.sortDragDrop;
	if( $.dragDroping ){
		$.dragDroping = false;
		if( $.objetoClonado && $.objetoClonado.parentNode ){
			get( "mapasBox" ).removeChild( $.objetoClonado );
		}
		document.body.style.cursor = "";
		get( "sortDivisor" ).style.display = "none";
		
		function cambiar( n1, n2 ){
			var nB = editor.mapas[n1];
			editor.mapas[n1] = editor.mapas[n2];
			editor.mapas[n2] = nB;
		}
		
		while( $.mapaN != $.nuevaPosicion ){
			if( $.mapaN < $.nuevaPosicion ){
				cambiar( $.mapaN, $.mapaN + 1 );
				$.mapaN++;
			}
			else{
				if( $.mapaN - $.nuevaPosicion != 1 || ( $.nuevaPosicion == 0 && $.divisorTop != 92 ) ){
					cambiar( $.mapaN, $.mapaN - 1 );
				}
				$.mapaN--;
			}
		}
		
		escribirSort();
	}
	
}
editor.sortDragDrop.actualizar = function( e ){
	editor.aPM( e );
	var $ = editor.sortDragDrop;
	
	var posy = editor.mouseY - $._mouseY - 65;
	$.objetoClonado.style.top = posy + "px";
	
	var divisorTop = 22;
	var divisorTops = [ 22 ];
	
	var top = 92;
	for( x = 0; x < editor.mapas.length; x++  ){
		divisorTops.push( top );
		top += 70;
	}
	
	for( x = 0; x < divisorTops.length; x++ ){
		if( posy + 60 > divisorTops[x] ){
			divisorTop = divisorTops[x];
			$.divisorTop = divisorTop;
			$.nuevaPosicion = x ? x - 1 : x;
		}
	}
		
	get( "sortDivisor" ).style.top = divisorTop + "px";
}
function cargarConfig(){
	editor.lugar = "configuracion";
	get( "mapasBox" ).style.display = "none";
	get( "mapasBoxTop" ).style.display = "none";
	get( "configGeneral" ).style.display = "inline";
	get( "configGeneralTop" ).style.display = "inline";
	
	get( "configFormD4Inp" ).value = editor.config.monedas;
	get( "configFormD2Inp" ).value = editor.config.puntos;
	get( "configFormD6Inp" ).value = editor.config.vidas;
}
function salirConfig(){
	editor.lugar = "mapasSort";
	get( "mapasBox" ).style.display = "inline";
	get( "mapasBoxTop" ).style.display = "inline";
	get( "configGeneral" ).style.display = "none";
	get( "configGeneralTop" ).style.display = "none";
}
function configDone(){
	editor.config.monedas = strToNum( get( "configFormD4Inp" ).value );
	editor.config.puntos = strToNum( get( "configFormD2Inp" ).value );
	editor.config.vidas = strToNum( get( "configFormD6Inp" ).value );
	salirConfig();
}
function editarMapa( mapaN ){
	editor.lugar = "mapaEditar";
	editor.mapaN = mapaN;
	
	get( "mapasBox" ).style.display = "none";
	get( "mapasBoxTop" ).style.display = "none";
	
	get( "mapaEdit" ).style.display = "inline";
	get( "mapaEditTop" ).style.display = "inline";
	
	get( "mapaEditTxt" ).innerHTML = "";
	get( "mapaEditTxt" ).appendChild( escribir( "MAP " + editor.mapas[mapaN].nombre ) );
	
	var array = [
				 ["editFormD1Inp", "EDIT SETTINGS"],
				 ["editFormD2Inp", "EDIT MAP"],
				 ["editFormD3Inp", "EDIT TUNNELS"],
				 ["editFormDone1", "DONE"],
				 ["editFormDone2", "DONE"],
				 ["editFormD5", "NAME"],
				 ["editFormD7", "TYPE"],
				 ["editFormD9", "TIME"],
				 ["ETcubos", "CUBES"],
				 ["ETbichos", "MONSTERS"],
				 ["ETfiguras", "BG IMAGES"],
				 ["ETscroll", "SCROLL"],
				 ["ETobjeto", "OBJECT"],
				 ["cubosPTxt", "CUBE"],
				 ["cubosPD1", "LEFT"],
				 ["cubosPD3", "TOP"],
				 ["cubosP2Txt", "CUBE"],
				 ["cubosP2D1", "LEFT"],
				 ["cubosP2D3", "TOP"],
				 ["signoTxt", "SIGN"],
				 ["signoD1", "LEFT"],
				 ["signoD3", "TOP"],
				 ["signoD5", "DROP"],
				 ["signoD7", "VISIBLE"],
				 ["signoD9", "SCORE"],
				 ["signoD11", "TIME"],
				 ["rompibleTxt", "CUBE"],
				 ["rompibleD1", "LEFT"],
				 ["rompibleD3", "TOP"],
				 ["rompibleD5", "DROP"],
				 ["rompibleD7", "VISIBLE"],
				 ["rompibleD9", "SCORE"],
				 ["rompibleD11", "TIME"],
				 ["monedaTxt", "MONEY"],
				 ["monedaD1", "LEFT"],
				 ["monedaD3", "TOP"],
				 ["monedaD5", "SCORE"],
				 ["bichoTxt", "MONSTER"],
				 ["bichoD1", "LEFT"],
				 ["bichoD3", "TOP"],
				 ["bichoD5", "SCORE"],
				 ["tortugaTxt", "TURTLE"],
				 ["tortugaD1", "LEFT"],
				 ["tortugaD3", "TOP"],
				 ["tortugaD5", "COLOR"],
				 ["tortugaD7", "SCORE"],
				 ["tuboTxt", "TUBE"],
				 ["tuboD1", "LEFT"],
				 ["tuboD3", "TOP"],
				 ["tuboD5", "HEIGHT"],
				 ["tuboD7", "TYPE"],
				 ["tuboD9", "MONSTER"],
				 ["figuraTxt", "BG IMAGE"],
				 ["figuraD1", "LEFT"],
				 ["figuraD3", "TOP"],
				 ["figuraD5", "TYPE"],
				 ["banderaTxt", "FLAG"],
				 ["banderaD1", "LEFT"],
				 ["banderaD3", "TOP"],
				 ["barraTxt", "BARS"],
				 ["barraD1", "LEFT"],
				 ["barraD3", "DIR"]
	]
	for( s = 0; s < array.length; s++ ){
		get( array[s][0] ).innerHTML = "";
		get( array[s][0] ).appendChild( escribir( array[s][1] ) );
	}
}
function editarMapaDone(){
	editor.lugar = "mapasSort";
	get( "mapasBox" ).style.display = "inline";
	get( "mapasBoxTop" ).style.display = "inline";
	
	get( "mapaEdit" ).style.display = "none";
	get( "mapaEditTop" ).style.display = "none";
	
	escribirSort();
}
function cargarConfigM(){
	editor.lugar = "configuracionMapa";
	get( "editForm1" ).style.display = "none";
	get( "editForm2" ).style.display = "inline";
	
	get( "editFormD6Inp" ).value = editor.mapas[editor.mapaN].nombre;
	get( "editFormD8Sel" ).value = editor.mapas[editor.mapaN].tipo;
	get( "editFormD10Inp" ).value = editor.mapas[editor.mapaN].tiempo;
	
}
function salirConfigM(){
	editor.lugar = "mapaEditar";
	var accept = true;
	var split = get( "editFormD6Inp" ).value.split( "" );
	
	if( get( "editFormD6Inp" ).value.replace( / /g, "" ) == "" ){
		accept = false;
		alert( "Please enter a name." );
	}
	else{
		for( j = 0; j < split.length; j++ ){
			if( /([A-Z]|[a-x]|[0-9]|\-| )/.test( split[j] ) == false ){
				accept = false;
				alert( "Name only can contain letters, numbers, - or space." );
				break;
			}
		}
	}
	
	if( accept ){
		editor.mapas[editor.mapaN].nombre = get( "editFormD6Inp" ).value.toUpperCase();
		editor.mapas[editor.mapaN].tipo = Number( get( "editFormD8Sel" ).value );
		editor.mapas[editor.mapaN].tiempo = strToNum( get( "editFormD10Inp" ).value );
		
		get( "editForm1" ).style.display = "inline";
		get( "editForm2" ).style.display = "none";
	}
}
function strToNum( txt ){
	
	if( !txt.length ){
		return 0;
	}
	
	var split = txt.split( "" );
	
	for( j = 0; j < split.length; j++ ){
		if( /([0-9])/.test( split[j] ) == false ){
			return 0;
		}
	}
	
	return parseInt( txt );
}



function modificarMapa(){
	editor.lugar = "mapaModificar";
	var mapa = editor.mapas[editor.mapaN];
	
	get( "mapaEdit" ).style.display = "none";
	get( "mapaEditTop" ).style.display = "none";
	
	get( "modificarMapaMenu" ).style.display = "inline";
	get( "inicioE" ).style.left = "-385px";
	
	get( "mapaMenuTxt" ).innerHTML = "";
	get( "mapaMenuTxt" ).appendChild( escribir( "ADD OBJECT" ) );
	
	contruirMapa( mapa, mapa.cubos, mapa.bichos, mapa.figuras );
	
	get( "inicioE" ).style.backgroundColor = mapa.tipo == 1 ? "#5C94FC" : "#222";
	
	get( "modificarMapaObjetos" ).style.width = ( mapa.largo * 32 ) + "px";
	
	get( "modificarMapa" ).style.display = "inline";
	get( "modificarMapa" ).scrollLeft = 0;
	
	 editor.scroll.cargar( mapa );
	 cargarGrillas();
	
}

function contruirMapa( mapa, cubos, bichos, figuras, clonado ){
	for( v = 0; v < cubos.length; v++ ){
		var $ = cubos[v];
		var html = "<div class='objEventos'";
			html += " onmouseover='if( !editor.dragDrop.dragDroping ){ padding( this, 1 ); editorTrace( \"ETobjeto\" ); }'";
			html += " onmouseout='padding( this, 0 ); editorTrace( \"\" );'";
			html += " onmousedown='editor.dragDrop.objDown( \"cubos\", " + ( !clonado ? v : mapa.cubos.length - 1 ) + " );'";
		html += "></div>";
					
		$.objeto = elemento( "div", {
			style : {
				position : "absolute",
				height : $.height + "px",
				width : $.width + "px",
				top : ( $.top * 32 - 16 ) + "px",
				left : ( $.left * 32 ) + "px",
				background : "url(" + ( mapa.tipo == 1 ? $.src : $.src2 ) + ")",
				overflow : "hidden",
				opacity : $.invisible ? "0.5" : "1",
				filter : $.invisible ? "alpha( opacity = 50 )" : "",
				zIndex : "3"
			}
		}, get( "modificarMapaObjetos" ) );
		
		$.objeto.innerHTML = html;
		
		if( $.tipo == "tubo" ){
			$.objeto.style.background = "";
			
			var srcB = ( mapa.tipo == 1 ? "imgs/cuadraditos/tubo" : "imgs/cuadraditosTunel/tubo" ) + $.tipoT + "/";
			
			$.objeto2 = elemento( "div", {
				style : {
					position : "absolute",
					left : "0px",
					top : "0px",
					width : "32px",
					height : "32px",
					background: "url(" + srcB + "tuboTL.gif)",
					zIndex : "2"
				}
			}, $.objeto );
			
			$.objeto3 = elemento( "div", {
				style : {
					position : "absolute",
					left : "32px",
					top : "0px",
					width : "32px",
					height : "32px",
					background: "url(" + srcB + "tuboTR.gif)",
					zIndex : "2"
				}
			}, $.objeto );
			
			$.objeto4 = elemento( "div", {
				style : {
					position : "absolute",
					left : "0px",
					top : "32px",
					width : "32px",
					height : "100%",
					background: "url(" + srcB + "tuboBL.gif)",
					zIndex : "1"
				}
			}, $.objeto );
			
			
			$.objeto5 = elemento( "div", {
				style : {
					position : "absolute",
					left : "32px",
					top : "32px",
					width : "32px",
					height : "100%",
					background: "url(" + srcB + "tuboBR.gif)",
					zIndex : "1"
				}
			}, $.objeto );
			
		}
	}
	
	for( v = 0; v < bichos.length; v++ ){
		var $ = bichos[v];
		var html = "<div class='objEventos'";
			html += " onmouseover='padding( this, 1 ); editorTrace( \"ETobjeto\" );'";
			html += " onmouseout='padding( this, 0 ); editorTrace( \"\" );'";
			html += " onmousedown='editor.dragDrop.objDown( \"bichos\", " + ( !clonado ? v : mapa.bichos.length - 1 ) + " );'";
		html += "></div>";
			
		$.objeto = elemento( "div", {
			style : {
				position : "absolute",
				height : $.height + "px",
				width : $.width + "px",
				top : ( $.top * 32 - ( $.tipo == "tortuga" ? 32 : 16 ) ) + "px",
				left : ( $.left * 32 ) + "px",
				background : "url(" + ( mapa.tipo == 1 ? $.src : $.src2 ) + ")",
				overflow : "hidden",
				zIndex : "2"
			}
		}, get( "modificarMapaObjetos" ) );
		
		$.objeto.innerHTML = html;
		
	}
	
	for( v = 0; v < figuras.length; v++ ){
		var $ = figuras[v];
		
		var html = "<div class='objEventos'";
			html += " onmouseover='padding( this, 2 ); editorTrace( \"ETobjeto\" );'";
			html += " onmouseout='padding( this, 0 ); editorTrace( \"\" );'";
			html += " onmousedown='editor.dragDrop.objDown( \"figuras\", " + ( !clonado ? v : mapa.figuras.length - 1 ) + " );'";
		html += "></div>";
			
		$.objeto = elemento( "div", {
			style : {
				position : "absolute",
				height : $.height + "px",
				width : $.width + "px",
				top : ( $.top * 32 + 16 ) + "px",
				left : ( $.left * 32 ) + "px",
				background : "url(" + $.src + ")",
				overflow : "hidden",
				zIndex : "1"
			}
		}, get( "modificarMapaObjetos" ) );
		
		$.objeto.innerHTML = html;
		
	}
}
function herramientaBG( capa, n ){
	if( editor.capa == capa ){
		return "#216DF3";
	}
	else{
		return n ? "#69A5FB" : "";
	}
}
function cambiarCapas( capa ){
	get( editor.capa + "Herramienta" ).style.backgroundColor = "";
	editor.capa = capa;
	get( editor.capa + "Herramienta" ).style.backgroundColor = "#216DF3";
	
	/*var cubos = get( "modificarMapaCubos" );
	var bichos = get( "modificarMapaBichos" );
	var figuras = get( "modificarMapaFiguras" );
	
	switch( capa ){
		case "bichos":
			bichos.style.zIndex = editor.index;
		break;
		case "cubos":
			cubos.style.zIndex = editor.index;
		break;
		case "figuras":
			figuras.style.zIndex = editor.index;
		break;
	}*/
}

function editorTrace( id ){
	if( editor.trace.length ){
		get( editor.trace ).style.display = "none";
	}
	
	editor.trace = id;
	
	if( editor.trace.length ){
		get( editor.trace ).style.display = "block";
	}
}

editor.scroll.cargar = function( mapa ){
	var $ = editor.scroll;
	$.left = 0;
	$.largo = 510 / ( ( mapa.largo * 32 ) / 510 );
	
	get( "editorScrollContenedor" ).style.display = "inline";
	get( "editorScroll" ).style.width = $.largo + "px";
	get( "editorScroll" ).style.left = $.left + "px";
}

editor.scroll.empezar = function(){
	var $ = editor.scroll;
	$.moviendo = true;
	$._mouseX = editor.mouseX + 130 - $.left;
}

editor.scroll.actualizar = function( nLeft ){
	var $ = editor.scroll;
	$.left = editor.mouseX + 130 - $._mouseX;
	
	if( nLeft ){
		$.left = nLeft;
	}
	
	if( $.left < 0 ){
		$.left = 0;
	}
	if( $.left + $.largo > 510 ){
		$.left = 510 - $.largo;
	}
	
	get( "editorScroll" ).style.left = $.left + "px";
	get( "modificarMapa" ).scrollLeft = ( $.left / 510 ) * ( ( editor.mapas[editor.mapaN].largo + 1 ) * 32 );
	get( "grillaXT" ).scrollLeft = ( $.left / 510 ) * ( ( editor.mapas[editor.mapaN].largo + 1 ) * 32 );
}
editor.scroll.terminar = function(){
	var $ = editor.scroll;
	$.moviendo = false;
}


editor.dragDrop.objDown = function( tipo, n ){
	if( editor.dragDrop.objA ){
		editor.dragDrop.objA.objeto.style.border = "none";
	}
	
	document.body.style.cursor = "move";
	
	var mapa = editor.mapas[editor.mapaN];
	
	var $ = editor.dragDrop;
	$.objA = tipo == "cubos" ? mapa.cubos[n] : ( tipo == "bichos" ? mapa.bichos[n] : mapa.figuras[n] );
	var $$ = $.objA;
	
	$.dragDroping = true;
	
	var mouseX = editor.mouseX + 130 + get( "modificarMapa" ).scrollLeft;
	var mouseY = editor.mouseY;
	
	$.tipo = tipo;
		
	var n = $$.tipo == "tortuga" ? 32 : ( $$.tipo == "figura" ? -16 : 16 );
	
	$._mouseX = mouseX - ( $$.left * 32 );
	$._mouseY = mouseY - ( $$.top * 32 - n );
	
	$$.objeto.style.border = "none";
	
	$.objetoClonado = $$.objeto.cloneNode( true );
	$.objetoClonado.style.opacity = ".7";
	$.objetoClonado.style.filter = "alpha( opacity = 70 )";
	$.objetoClonado.style.zIndex = "15";
	
	$.objetoClonado.removeChild( $.objetoClonado.firstChild );
	
	$.objetoClonado2 = elemento( "div", {
		style : {
			position : "absolute",
			height : $$.height + "px",
			width : $$.width + "px",
			left : ( $$.left * 32 ) + "px",
			top : ( $$.top * 32 - ( $$.tipo == "figura" ? -16 : 16 ) ) + "px",
			backgroundColor : editor.mapas[editor.mapaN].tipo == 1 ? "#222" : "#79B8FD",
			zIndex : "14",
			//opacity : editor.mapas[editor.mapaN].tipo == 1 ? ".08" : ".25",
			//filter : editor.mapas[editor.mapaN].tipo == 1 ? "alpha( opacity = 8 )" : "alpha( opacity = 25 )",
			opacity : "0",
			filter : "alpha( opacity = 0 )",
			border : editor.mapas[editor.mapaN].tipo == 1 ? "1px solid #79B8FD" : "1px solid #5C94FC"
		}
	}, get( "modificarMapa" ) );
	
	get( "modificarMapa" ).appendChild( $.objetoClonado );
	
}

editor.dragDrop.actualizar = function( e ){
	editor.aPM( e );
	
	if( editor.mouseX + 130 > 478 ){
		editor.scroll.left += ( editor.mouseX + 130 - 478 ) / 10;
		editor.scroll.actualizar( editor.scroll.left );
	}
	if( editor.mouseX + 130 < 32 ){
		editor.scroll.left -= ( ( editor.mouseX + 130 - 32 ) * -1 ) / 10;
		editor.scroll.actualizar( editor.scroll.left );
	}
	
	var $ = editor.dragDrop;
	var $$ = $.objA;
	
	var posY = editor.mouseY - $._mouseY;
	var posX = editor.mouseX - $._mouseX + 130 + get( "modificarMapa" ).scrollLeft;
	var n = $$.tipo == "tortuga" ? 32 : ( $$.tipo == "figura" ? -16 : 16 );
	
	$.objetoClonado.style.left = posX + "px";
	$.objetoClonado.style.top = posY + "px";
	
	$.objetoClonado2.style.left = ( Math.round( posX / 32 ) * 32 ) + "px";
	$.objetoClonado2.style.top = ( Math.round( ( posY + n ) / 32 ) * 32 - n ) + "px";
	
}

editor.dragDrop.terminar = function( e ){
	
	document.body.style.cursor = "";
	
	var mapa = editor.mapas[editor.mapaN];
	
	var $ = editor.dragDrop;
	var $$ = $.objA;
	
	$.dragDroping = false;
	
	var left = parseInt( $.objetoClonado2.style.left );
	var top = parseInt( $.objetoClonado2.style.top );
	
	if( ctr || $.clonar ){
		$.clonar = false;
		var nuevoObjeto = {};
		for( var p in $$ ){
			if( p.indexOf( "objeto" ) == -1 ){
				nuevoObjeto[p] = $$[p];
			}
		}
		switch( $$.tipo ){
			default:
				mapa.cubos.push( nuevoObjeto );
				contruirMapa( mapa, [nuevoObjeto], [], [], true );
			break;
			case "bicho": case "tortuga":
				mapa.bichos.push( nuevoObjeto );
				contruirMapa( mapa, [], [nuevoObjeto], [], true );
			break;
			case "figura":
				mapa.figuras.push( nuevoObjeto );
				contruirMapa( mapa, [], [], [nuevoObjeto], true );
			break;
		}
		$$ = nuevoObjeto;
		$.objA = $$;
	}
	$$.objeto.style.left = left + "px";
	$$.objeto.style.top = top + "px";
	
	$$.left = left / 32;
	$$.top = ( top + ( $$.tipo == "figura" ? -16 : 16 ) ) / 32;
	
	$.objetoClonado.style.display = "inline";
	$.objetoClonado2.style.display = "inline";
	get( "modificarMapa" ).removeChild( $.objetoClonado );
	get( "modificarMapa" ).removeChild( $.objetoClonado2 );
	
	get( "objetoInfo" + editor.objetoInfo ).style.display = "none";
	editor.objetoInfo = $$.tipo;
	get( "objetoInfo" + editor.objetoInfo ).style.display = "block";
	
	switch( $$.tipo ){
		case "cubosP":
			get( "cubosPD2Inp" ).value = $$.left;
			get( "cubosPD4Inp" ).value = $$.top;
		break;
		case "cubosP2":
			get( "cubosP2D2Inp" ).value = $$.left;
			get( "cubosP2D4Inp" ).value = $$.top;
		break;
		case "signo":
			get( "signoD2Inp" ).value = $$.left;
			get( "signoD4Inp" ).value = $$.top;
			get( "signoD6Sel" ).value = $$.drop;
			get( "signoD8Sel" ).value = $$.invisible;
			get( "signoD10Inp" ).value = $$.puntos;
			get( "signoD12Inp" ).value = $$.tiempo;
		break;
		case "rompible":
			get( "rompibleD2Inp" ).value = $$.left;
			get( "rompibleD4Inp" ).value = $$.top;
			get( "rompibleD6Sel" ).value = $$.drop;
			get( "rompibleD8Sel" ).value = $$.invisible;
			get( "rompibleD10Inp" ).value = $$.puntos;
			get( "rompibleD12Inp" ).value = $$.tiempo;
		break;
		case "moneda":
			get( "monedaD2Inp" ).value = $$.left;
			get( "monedaD4Inp" ).value = $$.top;
			get( "monedaD6Inp" ).value = $$.puntos;
		break;
		case "bicho":
			get( "bichoD2Inp" ).value = $$.left;
			get( "bichoD4Inp" ).value = $$.top;
			get( "bichoD6Inp" ).value = $$.puntos;
		break;
		case "tortuga":
			get( "tortugaD2Inp" ).value = $$.left;
			get( "tortugaD4Inp" ).value = $$.top + 0.5;
			get( "tortugaD6Sel" ).value = $$.tipoT;
			get( "tortugaD8Inp" ).value = $$.puntos;
		break;
		case "tubo":
			get( "tuboD2Inp" ).value = $$.left;
			get( "tuboD4Inp" ).value = $$.top;
			get( "tuboD6Inp" ).value = $$.alto;
			get( "tuboD8Sel" ).value = $$.tipoT;
			get( "tuboD10Sel" ).value = $$.bicho ? 1 : 0;
		break;
		case "figura":
			get( "figuraD2Inp" ).value = $$.left;
			get( "figuraD4Inp" ).value = $$.top;
			get( "figuraD6Sel" ).value = $$.tipoT;
		break;
		case "bandera":
			get( "banderaD2Inp" ).value = $$.left;
			get( "banderaD4Inp" ).value = $$.top;
		break;
		case "barra":
			get( "barraD2Inp" ).value = $$.left;
			get( "barraD4Sel" ).value = $$.direccion ? 1 : 0;
		break;
	}
	
	$$.objeto.style.border = "1px solid #CCC";
}

function cargarGrillas(){
	var mapa = editor.mapas[editor.mapaN];
	
	var html = "";
	for( g = 0; g < 15; g++ ){
		html += "<label>" + g + "</label><br />";
	}
	get( "grillaYT" ).innerHTML = html;
	get( "grillaYT" ).style.display = "block";
	get( "grillaYT" ).scrollTop = 16;
	opacity( "grillaYT", .5 );
	
	html = "";
	for( g = 0; g <= 14; g++ ){
		html += "<div style='top: " + ( g * 32 - 16 ) + "px;background: #" + ( mapa.tipo == 1 ? "79B8FD" : "CCC" ) + ";'></div>";
	}
	get( "grillaY" ).innerHTML = html;
	
	// ---------------------------------
	
	html = "";
	for( g = 0; g <= mapa.largo + 3; g++ ){
		html += "<label>" + g + "</label>";
	}
	get( "grillaXL" ).style.width = ( mapa.largo * 32 + 32 ) + "px";
	get( "grillaXL" ).innerHTML = html;
	get( "grillaXT" ).style.display = "block";
	get( "grillaXL" ).scrollTop = 3;
	opacity( "grillaXT", .5 );
	
	html = "";
	for( g = 0; g <= mapa.largo + 3; g++ ){
		html += "<div style='left: " + ( g * 32 ) + "px;background: #" + ( mapa.tipo == 1 ? "79B8FD" : "CCC" ) + ";'></div>";
	}
	get( "grillaX" ).innerHTML = html;
}
function grillaY(){
	if( editor.grillaY ){
		get( "grillaY" ).style.display = "none";
	}
	else{
		get( "grillaY" ).style.display = "inline";
	}
	
	editor.grillaY = !editor.grillaY;
}
function grillaX(){
	if( editor.grillaX ){
		get( "grillaX" ).style.display = "none";
	}
	else{
		get( "grillaX" ).style.display = "inline";
	}
	
	editor.grillaX = !editor.grillaX;
}

function cambiarPropiedad( input, propiedad ){
	input.value = input.value.replace( /\W|[A-Z]/gi, "" );
	var $ = editor.dragDrop.objA;
	var mapa = editor.mapas[editor.mapaN];
	
	$[propiedad] = Number( "0" + input.value );
	
	/*
		left
		top
		invisible
		tipoT
	*/
	
	switch( propiedad ){
		case "left":
			$.objeto.style.left = ( $.left * 32 ) + "px";
		break;
		case "top":
		
			switch( $.tipo ){
				case "tortuga":
					$.objeto.style.top = ( $.top * 32 - 32 ) + "px";
				break;
				case "figura":
					$.objeto.style.top = ( $.top * 32 + 16 ) + "px";
				break;
				default:
					$.objeto.style.top = ( $.top * 32 - 16 ) + "px";
				break;
			}
			
		break;
		case "invisible":
			$.objeto.style.opacity = $.invisible ? ".5" : "1";
			$.objeto.style.filter = "alpha( opacity = " + ( $.invisible ? "50" : "100" ) + " )";
		break;
		case "tipoT":
			if( $.tipo == "tortuga" ){
				$.src = $.tipoT == 1 ? "imgs/bichos/tortuga_normal_izquierda.gif" : "imgs/bichos/tortuga_2_normal_izquierda.gif";
				$.src2 = $.tipoT == 1 ? "imgs/bichosTunel/tortuga_normal_izquierda.gif" : "imgs/bichos/tortuga_2_normal_izquierda.gif";
				
				$.objeto.style.background = "url(" + ( mapa.tipo == 1 ? $.src : $.src2 ) + ")";
			}
			else if( $.tipo == "tubo" ){
				var srcB = ( mapa.tipo == 1 ? "imgs/cuadraditos/tubo" : "imgs/cuadraditosTunel/tubo" ) + $.tipoT + "/";
				
				$.objeto2.style.background = "url(" + srcB + "tuboTL.gif)";
				$.objeto3.style.background = "url(" + srcB + "tuboTR.gif)";
				$.objeto4.style.background = "url(" + srcB + "tuboBL.gif)";
				$.objeto5.style.background = "url(" + srcB + "tuboBR.gif)";
			}
			else if( $.tipo == "figura" ){
				$.height = figurasSize[$.tipoT - 1][1];
				$.width = figurasSize[$.tipoT - 1][0];
				$.src = "imgs/figuras/figura" + $.tipoT + ".gif";
				
				$.objeto.style.background = "url(" + $.src + ")";
				$.objeto.style.height = $.height + "px";
				$.objeto.style.width = $.width + "px";
			}
		break;
		case "alto":
			$.objeto.style.height = ( $.alto * 32 ) + "px";
			$.height = $.alto * 32;
		break;
	}
}

function suprimir(){
	var $ = editor.dragDrop.objA;
	var mapa = editor.mapas[editor.mapaN];
	alert(mapa);
}