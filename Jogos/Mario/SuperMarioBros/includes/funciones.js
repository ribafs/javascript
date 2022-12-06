//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion se corre en el evento mouseDown.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function mouseDown( e ){
	if( resize != false ){
		redimensionJuego( 1, e );
	}
	else if( editor.editando ){
		editor.aPM( e );
		if( editor.sortDragDrop.dragDroping ){
			editor.sortDragDrop.actualizar( e );
		}
	}
	
	if( editor.scroll.moviendo ){
		editor.scroll.actualizar();
	}
	
	if( editor.dragDrop.dragDroping ){
		editor.dragDrop.actualizar( e );
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion se corre en el evento mouseUp.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function mouseUp(){
	if( resize ){
		redimensionJuego( 2, 0 );
	}
	else if( editor.editando ){
		editor.sortDragDrop.terminar();
	}
	
	if( editor.scroll.moviendo ){
		editor.scroll.terminar();
	}
	
	if( editor.dragDrop.dragDroping ){
		editor.dragDrop.terminar(); 
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion escribe un texto en div trace.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
var traced = new Array();
var tracedN = 1;
function trace( texto ){
	traced.push( texto + "  |" + tracedN );
	if( traced.length > 10 ){
		traced.shift();
	}
	get( "trace" ).innerHTML = traced.join( "<br />" );
	get( "trace" ).scrollTop = 999999;
	tracedN++;
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion actualiza los textos que contienen la cantida de monedas, los puntos, etc.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function escribirTxt(n){
	var paddingA = "<a style='padding-right: " + setX( 10 ) + "px'></a>";
	switch( n ){
		case 1:
			get( "marioTxt" ).innerHTML = ""; 
			get( "marioTxt" ).appendChild( escribir( "MARIO" ) );// Escribe mario.
		break;
		case 2:
			var puntosN = String( puntos ); // Toma los puntos.
			for( i = puntosN.length; i < 6; i++ ){ // Agrega los ceros que faltan al principio.
				puntosN = "0" + puntosN;
			}
			get( "puntosTxt" ).innerHTML = "";
			get( "puntosTxt" ).appendChild( escribir( puntosN ) );// Y los escribe.
		break;
		case 3:
			var monedasN = String( monedas ); // Toma las monedas.
			for( i = monedasN.length; i < 2; i++ ){ // Agrega los ceros que faltan al principio.
				monedasN = "0" + monedasN;
			}
			get( "monedasTxt" ).innerHTML = "";
			get( "monedasTxt" ).appendChild( escribir( "_*" + monedasN ) );
		break;
		case 4:
			get( "mundoTxt" ).innerHTML = "";
			get( "mundoTxt" ).appendChild( escribir( "WORLD" ) );
		break;
		case 5:
			get( "mundoNTxt" ).innerHTML = "";
			get( "mundoNTxt" ).appendChild( escribir( mundoN.toUpperCase() ) );
		break;
		case 6:
			get( "tiempoTxt" ).innerHTML = "";
			get( "tiempoTxt" ).appendChild( escribir( "TIME" ) );
		break;
		case 7:
			get( "tiempoNTxt" ).innerHTML = "";
			get( "tiempoNTxt" ).appendChild( escribir( String( Math.ceil( tiempoR ) ) ) );
		break;
		case 8:
			get( "mundoInicio" ).innerHTML = "";
			get( "mundoInicio" ).appendChild( escribir( "WORLD " + mundoN.toUpperCase() ) );
		break;
		case 9:
			get( "vidasN" ).innerHTML = "<nobr>";
			get( "vidasN" ).appendChild( escribir( " , " + vidas ) );
		break;
		case 10:
			get( "jugar" ).innerHTML = "";
			get( "jugar" ).appendChild(  escribir( "1 PLAYER GAME" ) );
			get( "jugarInstrucciones" ).innerHTML = "";
			get( "jugarInstrucciones" ).appendChild(  escribir( "USE A AND S" ) );
			get( "cargarMapa" ).innerHTML = "";
			get( "cargarMapa" ).appendChild( escribir( "LOAD MAP" ) );
			get( "crearMapa" ).innerHTML = "";
			get( "crearMapa" ).appendChild( escribir( "MAP EDITOR" ) );
			
			var puntosTN = String( Math.ceil( puntosTop ) );
			for( i = puntosTN.length; i < 6; i++ ){ 
				puntosTN = "0" + puntosTN;
			}
			get( "puntosTop" ).innerHTML = "";
			get( "puntosTop" ).appendChild( escribir( "TOP - " + puntosTN ) );
		break;
		case 11:
			get( "gameOverTxt" ).innerHTML = "";
			get( "gameOverTxt" ).appendChild( escribir( "GAME OVER" ) );
		break;
		default:
			escribirTxt( 1 );
			escribirTxt( 2 );
			escribirTxt( 3 );
			escribirTxt( 4 );
			escribirTxt( 5 );
			escribirTxt( 6 );
			escribirTxt( 7 );
			escribirTxt( 8 );
			escribirTxt( 9 );
			escribirTxt( 10 );
			escribirTxt( 11 );
		break;
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion crea los elmentos cuando mario se acerca a ellos.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function crearElementos(){
	
	while( tablaParedes1.length && tablaParedes1[0].left < scroll + 700 ){
		// mientras que exista tablaPisos1 y la pared con menor x este cerca
		tablaParedes.push( tablaParedes1[0] ); // agrega a tablaParedes la pared que se acerca
		tablaParedes1.shift(); // quita la pared con menor x de tablaParedes1
	}
	while( tablaPisos1.length && tablaPisos1[0].left < scroll + 700 ){
		// mientras exista tablaPisoss1 y el piso con menor x este ceca
		tablaPisos.push( tablaPisos1[0] ); // agrega a tablaPisos la pared que se acerca
		tablaPisos1.shift(); // quita el piso con menor x de tablaPisos1
	}
	while( tablaMonedas1.length && tablaMonedas1[0].left < scroll + 700 ){
		// mientras exista tablaMonedas1 y la moneda con menor x este cerza
		tablaMonedas.push( tablaMonedas1[0] ); // se agrega a tablaMonedas la moneda
		tablaMonedas1.shift(); // se quita la moneda con menor x
		var imagen = document.createElement( "img" ); // se crea una nueva imagen
		imagen.src = "imgs/cuadraditos/moneda.gif"; // se le pone direccion url
		imagen.className = "position"; // se le pone clase
		imagen.style.width = setX( 32 ) + "px"; // se le pone largo
		imagen.style.height = setY( 32 ) + "px"; // se le pone alto
		imagen.style.zIndex = 2; // se le pon e zIndex
		imagen.style.top = setY( tablaMonedas[tablaMonedas.length - 1].top ) + "px"; // se le pone posicion y
		imagen.style.left = setX( tablaMonedas[tablaMonedas.length - 1].left ) + "px"; // se le pone posicion x
		tablaMonedas[tablaMonedas.length - 1].imagen = imagen;
		get("cubosDiv").appendChild( tablaMonedas[tablaMonedas.length - 1].imagen );
	}
	while( imagenes.length && imagenes[0].left < scroll + 600 ){
		if( imagenes[0].left > scroll - 32 ){
			get( "cubosDiv" ).appendChild( imagenes[0].imagen );
			imagenes2.push( imagenes[0] );
		}
		imagenes.shift();
	}
	
	while( imagenes2.length && imagenes2[0].left + 32 < scroll ){
		get( "cubosDiv" ).removeChild( imagenes2[0].imagen );
		imagenes2.shift();
	}
	
	for( x = 0; x < bichos.length; x++ ){
		if( bichos[x].inicio && ( bichos[x].tipo == 4 || bichos[x].tipo == 5 || bichos[x].tipo == 9 ) && 
		( bichos[x].posx < scroll + 550 && bichos[x].posx + bichos[x].largo >= scroll ) ){
			bichos[x].inicio = false;
		}
	}
	for( m = 0; m < barras.length; m++ ){
		if( barras[m].inicio && barras[m].left < scroll + 1000 ){
			barras[m].inicio = false;
		}
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion borra los elmentos cuando mario se aleja de ellos.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function borrarElementos(){
	if( tablaPisos.length ){ // si todavia no se crearon todos los pisos
		for( i = 0; i < tablaPisos.length; i++ ){ // por cada piso
			if( tablaPisos[i].left + tablaPisos[i].width < scroll - 100 ){ // si el piso se alejo
				piso--; // se resta un piso a mario
				for(e = 0; e < bichos.length; e++){ // por cada bicho
					if( bichos[e].piso ){ // si tiene piso
						bichos[e].piso--; // se le resta uno al piso del bicho
					}
				}
				tablaPisos = filtrar( tablaPisos , i ); // se saca el piso
				pisosS++; // se aumentan los pisos sacados
			}
		}
	}
	if( tablaParedes1.length ){ // si todavia no se crearon todas las paredes
		while( tablaParedes[0].left < scroll - 100 ){ 
			// mientras que la pared con menor x este lejos
			paredesS++; // se suma una pared sacada resta una pared
			tablaParedes.shift(); // se borra la pared de la lista
		}
	}
	while( tablaMonedas.length && tablaMonedas[0].left < scroll - 100 ){
		// mientra que hayan monedas y la moneda con menor x este lejos
		get( "cubosDiv" ).removeChild( tablaMonedas[0].imagen );
		tablaMonedas.shift(); // se borra la moneda
	}
	
	if( figuras[0] ){
		if( figuras[0].left + figurasSize[figuras[0].tipo - 1][0] < scroll - 100 ){
			get( "figurasDiv" ).removeChild( figuras[0].img );
			figuras.shift();
		}
	}
	while( barras.length && barras[0].left < scroll - 300 ){
		barras.shift();
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion elimina un item de un array:
	argumento 1: array
	argumento 2: posicion del array para eliminar
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function filtrar( obj, n ){
	obj.splice( n, 1 );
	return obj;
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion mata o achica a mario
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function muerte( n ){
	if( n == 2 || marioF == 1 ){ // si hay que matarlo
		vidas--; // se saca una vida
		if( n == 2 ){
			
			if( vidas != 0 ){
				tiempoR = tiempo;
				if( mapaT == 1 ){
					descargarMapa( 1 );
					comienzoJuego( 1 );
				}
				else if( mapaT == 2 ){
					var posxB = posx;
					descargarMapa( 1 );
					comienzoJuego( 1, false, true );
					cargarTunel( tubos[0].link, posxB );
				}
			}
			else{
				gOver();
			}
			
		}
		else{
			tiempoR = tiempo;
			actualizarMario( "marioMuerte" );
			marioMuerte = true;
			new efecto({
				obj : get( "mario" ),
				prop : "style.top",
				valor : "$1px",
				$1 : [ setY( posy ) - 1, setY( 450 ), [ 4, setY( 1.1 ), 0, 0 - setY( 15 ) ] ],
				onFinish : function(){
					if( vidas != 0 ){
						if( mapaT == 1 ){
							descargarMapa( 1 );
							comienzoJuego( 1 );
						}
						else if( mapaT == 2 ){
							var posxB = posx;
							descargarMapa( 1 );
							comienzoJuego( 1, false, true );
							cargarTunel( tubos[0].link, posxB );
						}
					}
					else{
						gOver();
					}
				}
			});
		}
	}
	else{ // si hay que achicar a mario
		achicarMario();
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion crea un bicho.
	Tipo de bichos :
		1 : hongo de crecimiento,
		2 : hondo de vida,
		3 : hogo que mata,
		4 : bicho comun,
		5 : tortuga,
		6 : flor,
		7 : estrella,
		8 : bolitas que larga superMarioGrande,
		9 : bicho que sale de los tubos
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function crearBicho( tipo, x, y, puntos, movxB, tortugaT ){
	this.tipo = tipo; // se pone el tipo
	this.choqueB = tipo != 4 && tipo != 5 && tipo != 8;
	this.inicio = true; // el bicho todavia no se empieza a mover
	this.movy = false; // se mueve para abajo
	this.vely = 1; // la velocidad y es de 1
	if( tipo < 4 ){ // si el bicho es un hongo
		this.movx = true; // se mueve para la derecha
		hongos++; // hay un hongo mas
		this.velx = 3; // la velocidad x es de 3
	}
	else if( tipo == 4 ){ // si es un bicho comun
		this.movx = false; // se mueve para la izquierda
		bichosN++; // hay un bicho comun mas
		this.velx = 2; // la velocidad x es de 2
	}
	else if( tipo == 5 ){ // si es una tortuga
		this.movx = false; // se mueve para la izquierda
		tortugas++; // hay una tortuga mas
		this.velx = 2; // la velocidad x es de 2
		this.puntosAdd = puntos * 5;
		this.tortugaT = tortugaT;
	}
	else if( tipo == 6 ){
		this.movx = true; // se mueve para la derecha
		flores++; // hay una flor mas
		this.velx = 0; // la velocidad x es de 0
	}
	else if( tipo == 7 ){
		this.velx = 3;
		this.movx = true;
		this.movy = true;
		this.vely = 8;
	}
	else if( tipo == 8 ){
		this.movx = movxB;
		this.velx = 14; // la velocidad x es de 14
		this.vely = 7; // la velocidad y es de 7
		this.inicio = false;
	}
	else if( tipo == 9 ){
		this.velx = 0;
		this.movx = true;
		this.movy = false;
		this.espera = false;
	}
	this.posy = y * 32 - 16; // la posicion y
	this.posx = x * 32; // la posicion x
	this.alto = 32; // el alto es 32
	this.largo = 32; // el largo es 32
	this.peso = .2; // el peso del bicho
	this.piso = false; // el hongo no esta tocando el piso
	this.puntos = puntos; // se le ponen los puntos
	
	if( tipo == 5 ){
		this.forma = 1;
	}
	else if( tipo == 7 ){
		this.peso = .4;
	}
	else if( tipo == 8 ){
		this.alto = 16;
		this.largo = 16;
		this.peso = .3;
	}
	else if( tipo == 9 ){
		this.alto = 44;
		this.posy -= 12;
	}
	
	this.obj = document.createElement("div"); // se crea un div que contendra al hongo
	this.obj.style.position = "absolute"; // se le pone posicion absoluta
	this.obj.style.height = setY(32) + "px"; // se le pone alto al div
	this.obj.style.width = setX(32) + "px"; // se le pone largo al div
	this.obj.style.top = setY(y * 32 - 16) + "px"; // se le pone posicion y
	this.obj.style.left = setX(x * 32) + "px"; // se le pone posicion x
	this.obj.style.overflow = "hidden"; // se le pone overflow hidden
	this.imagen = document.createElement("img"); // se crea una imagen del bicho
	this.imagen.style.height = setY( this.alto ) + "px"; // se le pone alto
	this.imagen.style.width = setX( this.largo ) + "px"; // se le pone largo
	this.imagen.src = "";
	
	switch(tipo){ // depende del tipo
		case 1: // si es de tipo 1 (hongo que hace crecer a mario)
			this.imagen.src = "imgs/bichos/hongo1.gif"; // la imagen es un hogo que hace crecer a mario
		break;
		case 2: // si es un hongo de vida
			this.imagen.src = "imgs/bichos/hongo2.gif"; // la imagen es un hongo de vida
		break;
		case 3:
			this.imagen.src = "imgs/bichos/hongo3.gif"; // la imagen es un hongo que mata a mario
		break;
		case 4:
			this.imagen.src = !tunel ? "imgs/bichos/bicho.gif" : "imgs/bichosTunel/bicho.gif"; // la imagen es un bicho comun
		break;
		case 5:
			this.obj.style.height = setY( 48 ) + "px";
			this.obj.style.marginTop = "-" + setY( 16 ) + "px";
			
			var srcB = !tunel ? "imgs/bichos" : "imgs/bichosTunel";
			this.obj.style.height = setY( 48 ) + "px";
			this.imagen.src = tortugaT == 1 ? srcB + "/tortuga_normal_izquierda.gif" : "imgs/bichos/tortuga_2_normal_izquierda.gif"; 
			// la imagen es una tortuga que va para la izquierda
			
			this.imagen2 = document.createElement("img"); // se crea una imagen con la tortuga que va para la derecha
			this.imagen2.src =  tortugaT == 1 ? srcB + "/tortuga_normal_derecha.gif" : "imgs/bichos/tortuga_2_normal_derecha.gif";
			this.imagen.style.height = setY( 48 ) + "px"; // se le pone alto
			this.imagen.style.width = setX( 32 ) + "px"; // se le pone largo
			
			this.imagen3 = document.createElement("img"); // se crea una imagen del caparazon de la tortuga
			this.imagen3.src = tortugaT == 1 ? srcB + "/tortuga_agachada.gif" : "imgs/bichos/tortuga_2_agachada.gif";
			this.imagen3.style.height = setY( 48 ) + "px"; // se le pone alto
			this.imagen.style.width = setX( 32 ) + "px"; // se le pone largo
			
		break;
		case 6:
			this.imagen.src = "imgs/bichos/flor.gif"; // la imagen es una flor que hace crecer a mario
		break;
		case 7:
			this.imagen.src = "imgs/bichos/estrella.gif"; // la imagen es una estrella
		break;
		case 8:
			this.imagen.src = "imgs/bichos/bolita.gif"; // la imagen es una bolita
		break;
		case 9:
			this.imagen.src = !tunel ? "imgs/bichos/planta.gif" : "imgs/bichosTunel/planta.gif"; // la imagen es una planta
		break;
	}	
	
	
	bichosN = bichos.length; // el numero de bicho
	bichos.push( this ); // se pone el bicho en el array de bichos que se usa para actualizarlos
	
	this.obj.appendChild( this.imagen ); // se pone la imagen dentro del div
	if( tipo == 5 ){
		this.obj.appendChild( this.imagen2 ); // se pone la imagen2 dentro del div
		this.obj.appendChild( this.imagen3 ); // se pone la imagen3 dentro del div
	}
	get("bichosDiv").appendChild( bichos[bichosN].obj ); // se pone el div en bichosDiv
	
	if( tipo == 5 ){
		this.obj.scrollTop = 0;
	}
	var bichoA = this;
	if( tipo < 4 || tipo == 6 || tipo == 7 ){
		this.imagen.style.marginTop = setY(32) + "px"; // se lo culta para que salga
		
		new efecto({ // se modifica el margen top de la imagen para que suba
			obj : this.imagen,
			prop : "style.marginTop",
			valor : "$1px",
			$1 : [setY(32), 0, "700"],
			onFinish : function(n){
				bichoA.inicio = false;
			}
		});
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion devuelve el html necesario para escribir un texto con el font de Mario.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function cargarLetras(){
	var letras = "$ _-,+QWERTYUIOPASDFGHJKLZXCVBNM0123456789".split( "" );
	var contenedor = elemento( "div", { id : "letrasDiv", style : { display : "none" } } );
	
	for( k = 0; k < letras.length; k++ ){
		elemento( "img", {
			id : "letra" + letras[k],
			alt : letras[k],
			src : "imgs/font/mario-" + letras[k] + ".gif",
			className : "letras",
			style : {
				height : "14px",
				width : "14px"
			}
		}, contenedor );
	}
	
	document.body.appendChild( contenedor );
}
function escribir( txt, size, t ){
	txt = txt.replace(/\*/g,",");
	
	var tamanio = 14;
	
	if( size ){
		tamanio = size;
	}
	
	var resultado = elemento( "label", {} );
	
	var split = txt.split("");
	
	for(i = 0; i < split.length; i++){
		
		if( /([A-Z]|[0-9]|-|\,|\+|\_| |\$)/.test( split[i] ) ){
			
			var letra = get( "letra" + split[i] ).cloneNode( true );
			letra.style.height = ( t ? tamanio : setY( tamanio ) ) + "px";
			letra.style.width = ( t ? tamanio : setX( tamanio ) ) + "px";
			
			if( nav != "IE" ){
				letra.style.paddingLeft = setX( 1.5 ) + "px";
			}
			
			resultado.appendChild( letra );
			
		}
	}
	return resultado;
}

var puntosTxtN = 0; // la cantidad de textos con puntos que hay
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion sube los puntos y crea un texto con los puntos ganados que se mueve para arriba y desaparece.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function sumarPuntos(n, left, top, suma){
	if(suma != true){ // si hay que sumar los puntos
		puntos += n; // se suman los puntos
		escribirTxt(2); // y se escriben
	}
	
	puntosTxtN++;
	var texto = document.createElement("a"); // se crea un anchor que contiene la cantidad de puntos que se ganaron
	texto.className = "position puntos"; // se le pone clase
	texto.id = "puntosTxt" + puntosTxtN; // se le pone id
	
	texto.innerHTML = ""; // se le escribe la cantidad de puntos
	texto.appendChild( escribir( String( n ), 10 ) );
	texto.style.left = left + "px"; // se le pones posicion x
	texto.style.top = top + "px"; // se le pone posicion y
	texto.style.width = setX(96) + "px"; // se le pone largo
	texto.style.zIndex = "2"; // se le pone x-index
	get("juego").appendChild(texto); // se lo pone como hijo a el div texto
	
	new efecto({
		obj : texto,
		prop : "style.top",
		valor : "$1px",
		$1 : [top, (top - setY(60)), "600"],
		onFinish : function(){
			texto.parentNode.removeChild(texto);
		}
	});
	
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion suma las monedas y actuaiza el texto, cuando las monedas llegan a 100 aumenta la cantidad de vidas en 1.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function sumarMonedas(n){
	monedas += n; // suma las monedas
	if(monedas >= 100){ // si se llega al maximo de monedas
		monedas -= 100; // se restan 100 monedas
		vidas++; // se aumenta una vida
	}
	escribirTxt(3); // se actualiza el texto
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Si queres saber lo que hacen las siguientes dos funciones, fijate.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function setX(n){
	return n * largoX;
}
function setY(n){
	return n * altoX;
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion atualiza la imagen de mario.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function actualizarMario(n){
	if( !marioMuerte ){
		if( marioF == 2 ){
			n = "g" + n;
		}
		else if( marioF == 3 ){
			n = "s" + n;
		}
		get( mario ).style.display = "none"; // se oculta la imagen actual de mario
		mario = n; // se actualiza la variable que contiene la forma de mario
		get( mario ).style.display = "inline"; // se mustra el nuevo mario
		if( marioGY != false ){
			alto = marioGY[0];
		}
		else{
			alto = Number(get(mario).name.split("x")[1]); // se toma el alto del nuevo mario
		}
		largo = Number(get(mario).name.split("x")[0]); // se toma el largo de nuevo mario
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion actualiza el scroll del juego.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function actualizarScroll(n){
	if( camara && n > scroll && n > 0 ){
		scroll = n;
		get("juego").scrollLeft = setX(scroll);
		crearElementos();
		borrarElementos();
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion agranda a Mario.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function agrandarMario(){
	if( !crecerM ){
		if( marioF == 1 ){ // si mario es chico
			crecerM = true; // mario esta creciedo
			
			get( mario ).style.display = "none";
			
			posy -= 32;
			get("mario").style.top = setY( posy ) + "px";
			
			
			var efecto = elemento( "div", {
				style : {
					position : "absolute",
					height : setY( 64 ) + "px",
					width :  setX( 32 ) + "px",
					overflow : "hidden"
				},
				id : "crecerM"
			} );
			
			var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? 1 : 2;
			
			elemento( "img", {
				src : "imgs/marioChico/mario" + movx + ".gif",
				style : {
					margin : setY( 32 ) + "px 0 0 " + setX( 4 ) + "px",
					width : setX( 24 ) + "px",
					height : setY( 32 ) + "px"
				}
			} , efecto );
			
			elemento( "img", {
				src : "imgs/marioTransision/mario" + movx + ".gif",
				style : {
					width : setX( 32 ) + "px",
					height : setY( 64 ) + "px"
				}
			} , efecto );
			
			elemento( "img", {
				src : "imgs/marioGrande/mario" + movx + ".gif",
				style : {
					width : setX( 32 ) + "px",
					height : setY( 64 ) + "px"
				}
			} , efecto );
			
			get( "mario" ).appendChild( efecto );
			
			function scrollE( n ){
				efecto.scrollTop = setY( n );
			}
			
			setTimeout(function(){scrollE(0)}, 100);
			setTimeout(function(){scrollE(64)}, 200);
			setTimeout(function(){scrollE(0)}, 300);
			setTimeout(function(){scrollE(64)}, 400);
			setTimeout(function(){scrollE(0)}, 500);
			setTimeout(function(){scrollE(64)}, 600);
			setTimeout(function(){scrollE(128)}, 700);
			setTimeout(function(){scrollE(0)}, 800);
			setTimeout(function(){scrollE(64)}, 900);
			setTimeout(function(){
				get( "mario" ).removeChild( efecto );
				
				marioF++;
				marioGY = [32,64];
				posy += 32;
				get("mario").style.top = setY(posy - (marioGY != false ? marioGY[1] - marioGY[0] : 0)) + "px";
				
				actualizarMario( mario );
				
				crecerM = false;
			}, 1000);
			
		}
		else if(marioF == 2){ // sino, si mario es grande pero no dispara
			
			if( agachar ){
				keyUp( 40 );
			}
			
			crecerM = true;
			
			get( mario ).style.display = "none";
			
			var efecto = elemento( "div", {
				style : {
					position : "absolute",
					height : setY( 64 ) + "px",
					width :  setX( 32 ) + "px",
					overflow : "hidden"
				},
				id : "crecerM"
			} );
			
			var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? 1 : 2;
			
			elemento( "img", {
				src : "imgs/marioGrande/mario" + movx + ".gif",
				style : {
					width : setX( 32 ) + "px",
					height : setY( 64 ) + "px"
				}
			}, efecto );
					
			elemento( "img", {
				src : "imgs/superMarioGrande/mario" + movx + ".gif",
				style : {
					width : setX( 32 ) + "px",
					height : setY( 64 ) + "px"
				}
			}, efecto );
			
			get( "mario" ).appendChild( efecto );
			
			function scrollE( n ){
				efecto.scrollTop = setY( n );
			}
			
			setTimeout(function(){scrollE(0)}, 100);
			setTimeout(function(){scrollE(64)}, 200);
			setTimeout(function(){scrollE(0)}, 300);
			setTimeout(function(){scrollE(64)}, 400);
			setTimeout(function(){scrollE(0)}, 500);
			setTimeout(function(){scrollE(64)}, 600);
			setTimeout(function(){scrollE(0)}, 700);
			setTimeout(function(){scrollE(64)}, 800);
			setTimeout(function(){
				get( "mario" ).removeChild( efecto );
				
				marioF++;
				
				mario = mario.substr( 1, mario.length );
				actualizarMario( mario );
				
				crecerM = false;
			}, 900);
		}
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion achica a Mario.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function achicarMario(){
	if( !crecerM ){
		if( marioF == 2 || marioF == 3 ){ // si mario es grande
			
			var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? 1 : 2;
			
			crecerM = true; // mario esta creciedo
			
			get( mario ).style.display = "none";
			
			if( agachar ){
				agachar = false;
				posy -= 32;
				get( "mario" ).style.top = setY( posy ) + "px";
				mario = ( marioF == 2 ? "g" : "s"  ) + "mario" + movx;
			}
			
			get("mario").style.top = setY( posy ) + "px";
			
			var efecto = elemento( "div", {
				style : {
					position : "absolute",
					height : setY( 64 ) + "px",
					width :  setX( 32 ) + "px",
					overflow : "hidden"
				},
				id : "crecerM"
			} );
			
			elemento( "img", {
				src : "imgs/" + ( marioF == 2 ? "marioGrande" : "superMarioGrande" ) + "/mario" + movx + ".gif",
				style : {
					width : setX( 32 ) + "px",
					height : setY( 64 ) + "px"
				}
			} , efecto );
			
			elemento( "img", {
				src : "imgs/marioTransision/mario" + movx + ".gif",
				style : {
					width : setX( 32 ) + "px",
					height : setY( 64 ) + "px"
				}
			} , efecto );
			
			elemento( "img", {
				src : "imgs/marioChico/mario" + movx + ".gif",
				style : {
					margin : setY( 32 ) + "px 0 0 " + setX( 4 ) + "px",
					width : setX( 24 ) + "px",
					height : setY( 32 ) + "px"
				}
			} , efecto );
			
			get( "mario" ).appendChild( efecto );
			
			function scrollE( n ){
				efecto.scrollTop = setY( n );
			}
			
			setTimeout(function(){scrollE(0)}, 100);
			setTimeout(function(){scrollE(64)}, 200);
			setTimeout(function(){scrollE(0)}, 300);
			setTimeout(function(){scrollE(64)}, 400);
			setTimeout(function(){scrollE(0)}, 500);
			setTimeout(function(){scrollE(64)}, 600);
			setTimeout(function(){scrollE(128)}, 700);
			setTimeout(function(){scrollE(0)}, 800);
			setTimeout(function(){scrollE(64)}, 900);
			setTimeout(function(){
				get( "mario" ).removeChild( efecto );
				
				marioF = 1;
				posy += 32;
				get("mario").style.top = setY(posy - (marioGY != false ? marioGY[1] - marioGY[0] : 0)) + "px";
				
				mario = mario.substr( 1, mario.length );
				actualizarMario( mario );
				
				crecerM = false;
				transparente = true;
				
				opacity( "mario", 1 );
				fadeIn( "mario", .7 );
				
				setTimeout( function(){
					transparente = false;
					fadeIn( "mario", 1 );
				} , 3000);
			}, 1000);
		}
	}
}

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion empieza un sonido.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function empezarS(n){
	if(sonido){
		get("sonidos").comienzo(n);
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion detiene un sonido.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function detenerS(n){
	if(sonido){
		get("sonidos").pausa(n);
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion reinicia un sonido.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function reiniciarS(n){
	if(sonido){
		get("sonidos").reiniciar(n);
	}
}

function fuckScroll(){
	get("resize").style.display = "none";
	get("resizeB").style.display = "none";
	get("juego").style.overflow = "auto";
	get("juego").style.zIndex = "10";
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion devuelve las dimensiones del documento.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function documentSize(){
	
	var width = self.innerWidth ? self.innerWidth : 
	(document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth :
		(document.body ? document.body.clientWidth : 0)
	);
	
	var height = self.innerHeight ? 
	self.innerHeight : 
	(document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight :
		(document.body ? document.body.clientHeight : 0)
	);
	
	return {height : height, width : width};
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion devuelve un numero random.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function random(n1, n2){
	return ( Math.floor( Math.random() * ( n2 - n1 + 1 ) + ( n1 ) ) );
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion crea un elemento y lo devuelve.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function elemento( tag, set, padre ){
	var elemento = document.createElement( tag );
	
	for( x in set ){
		if( x != "style" ){
			elemento.setAttribute( x, set[x] );
		}
		else{
			for( n in set.style ){
				elemento.style[n] = set.style[n];
			}
		}
	}
	if( padre ){
		padre.appendChild( elemento );
	}
	
	return elemento;
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion eliminar monedas.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function eliminarMonedas( array, cuboM ){
	array = array.sort().reverse();
	for(b = 0; b < array.length; b++){
		var moneda = tablaMonedas[array[b]];
		if( moneda ){
			
			var imagen = moneda.imagen;
			imagen.parentNode.removeChild( imagen );
			
			if( !cuboM ){
				sumarMonedas( 1 );
				sumarPuntos( moneda.puntos, setX( moneda.left - 32 ),
				setY( moneda.top - 32 ) );
				empezarS("sound6");
			}
			else{
				var cuboMEfecto = elemento( "img", {
					src : "imgs/cuadraditos/moneda2.gif",
					style : {
						position : "absolute",
						left : setX( moneda.left ) + "px",
						top : setY( moneda.top ) + "px",
						width : setX( 32 ) + "px",
						height : setY( 32 ) + "px",
						zIndex : 3
					}
				}, get( "cubosDiv" ) );
				
				var puntos = moneda.puntos;
				var top = moneda.top;
				var left = moneda.left;
				new efecto({
					obj : cuboMEfecto,
					prop : "style.top",
					valor : "$1px",
					$1 : [setY( moneda.top - 1), setY( moneda.top ), [4, setY( 2.3 ), 0, 0 - setY( 20 ) ] ],
					onFinish : function(){
						sumarMonedas( 1 );
						sumarPuntos( puntos, setX( left - 32 ), setY( top ) );
						get( "cubosDiv" ).removeChild( cuboMEfecto );
					}
				});
				
			}
			
			tablaMonedas.splice( array[b], 1 );
		}
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion crea la imagen de un bicho que se muere.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function bichoMuerte( tipo, x, y, tortugaT ){
	var bichoSrc = !tunel ? "imgs/bichos/bicho_muerto.gif" : "imgs/bichosTunel/bicho_muerto.gif";
	var torutugaSrc = tortugaT == 1 ? ( !tunel ? "imgs/bichos/tortuga_muerta.gif" : "imgs/bichosTunel/tortuga_muerta.gif" ) : 
	"imgs/bichos/tortuga_2_muerta.gif"
	var bichoMuerto = elemento( "img", {
		src : tipo == 4 ? bichoSrc : torutugaSrc,
		style : {
			position : "absolute",
			top : setY( y ) + "px",
			left : setX( x ) + "px",
			height : setY( 32 ) + "px",
			width : setX( 32 ) + "px",
			zIndex : "1"
		}
	}, get( "cubosDiv" ) );
	
	new efecto({
		obj : bichoMuerto,
		prop : "style.top",
		valor : "$1px",
		$1 : [ setY( y ) - 1, setY( 450 ), [ 4, setY( 1.1 ), 0, 0 - setY( 10 ) ] ],
		onFinish : function(){
			get( "cubosDiv" ).removeChild( bichoMuerto );
		}
	});
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion crea la imagen de una explosion.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function explocion( x, y ){
	var explocion = elemento( "img", {
		src : "imgs/cuadraditos/explocion.gif",
		style : {
			position : "absolute",
			left : setX( x ) + "px",
			top : setY( y ) + "px",
			width : setX( 32 ) + "px",
			height : setY( 32 ) + "px"
		}
	}, get( "cubosDiv" ) );
	
	setTimeout( function(){
		if( explocion.parentNode ){
			explocion.parentNode.removeChild( explocion );
		}
	}, 500);
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion combierte a mario cuando agarra una estrella.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function estrellaM(){
	if( !estrella ){
		estrella = true;
		transparente = false;
		opacity( "mario", 1 );
		marioOpacity = 1;
		marioOpacityC = false;
		estrellaT = 10000;
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion termina el juego.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function gOver(){
	if( puntos > puntosTop ){
		puntosTop = puntos;
	}
	mapaA = 0;
	descargarMapa( 1 );
	cargarMenu();
	get( "gameOver" ).style.display = "inline";
	menuA = false;
	setTimeout( function(){
		menuA = true;
		get( "gameOver" ).style.display = "none";
	}, 3000 );
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion debulebe true o false dependiendo si se toca un numero o una letra.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function checkNum( e ){
	var key = window.Event ? e.which : e.keyCode;
	return ( key <= 13 || key == 46 || ( key >= 48 && key <= 57 ) || ( key >= 96 && key <= 105 ) || ( key >= 37 && key <= 40 ) );
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion redondea un numero.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function round( n, cifras ){
	return Math.round( parseFloat( n ) * Math.pow( 10, cifras ) ) / Math.pow( 10, cifras );
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion agrega un evento a un objeto.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function addEvent( obj, type, fn ) {
	if( obj.attachEvent ){
		obj['e' + type + fn] = fn;
		obj[type + fn] = function(){
			obj['e' + type + fn]( window.event );
		}
		obj.attachEvent( 'on' + type, obj[type + fn] );
	}
	else{
		obj.addEventListener( type, fn, false );
	}
}