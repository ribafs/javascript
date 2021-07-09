if(!Array.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}

var appName = navigator.appName;
var nav = appName.indexOf("Microsoft") >-1?"IE":appName.indexOf("Netscape")>-1?"NT":appName.indexOf("Opera")>-1?"OP":""; // Navegador
onload = function(){
	
	opacity("derecha", .8);
	opacity("abajo", .8);
	
	setTimeout(function(){
		opacity("derecha", 0);
		opacity("abajo", 0);
	}, 1200);
	
	setTimeout(function(){
		opacity("derecha", .8);
		opacity("abajo", .8);
	}, 1400);
	
	setTimeout(function(){
		opacity("derecha", 0);
		opacity("abajo", 0);
	}, 1600);
	
	setTimeout(function(){
		opacity("derecha", .8);
		opacity("abajo", .8);
	}, 1800);
	
	setTimeout(function(){
		opacity("derecha", 0);
		opacity("abajo", 0);
	}, 2000);
	
	menuA = true;
	get( "contenedor" ).style.display = "inline";
	get( "imgsPrecargarBar" ).style.display = "none";
	opacity( "editorScrollContenedor", .5 );
		
	cargarLetras();
	cargarMenu();
	setInterval( function(){
		if( !resize && !crecerM && inicio && !marioMuerte && !autoMov ){
			actualizar();
		}
		else if( !resize && autoMov ){
			autoMovM();
		}
		if( _t.length ){
			aCEfectos();
		}
	}, intS );
}
function cargarMenu(){
	menuA = true;
	opacity( "inicio", 0 );
	get( "inicio" ).style.display = "inline";
	get( "menu" ).style.display = "inline";
	configuracion( ["1", "3", "0", "0", mundoN, "400", "15"] );
	
	mundoN = mapas[0][0].replace( /config:/, "" ).split( /,+/ )[4];
	
	escribirTxt();
	
	var mapaNuevo = [""];
	
	for( d = 1; d < mapas[0].length; d++ ){
		if( Number( mapas[0][d].split( "," )[1] ) < 16 ){
			mapaNuevo.push( mapas[0][d] );
		}
		else{
			break;
		}
	}
	
	cargarMapa( mapaNuevo );
	
	actualizarScroll(1);
	posx = 1;
	actualizarX();
	actualizarY();
}
var velC = 6; // velociad con que camina
var velCo = 10; // velocidad con la que corre
var saltoV = 125; // 0 - 200 - altura del salto
var peso = .2; // el peso de mario

/*
los pisos no cargados son los que no estan en la pantalla
los cargados son los que estan en la pantalla
*/

var puntosTop = 0; // el maximo de puntos al que se llego
var menu = [["jugar", 180],["cargar", 145],["crear", 110]]; // las opciones del menu
var menuSeleccionado = 0; // la opcion del menu que esta seleccionada
var menuA = false; // si se esta en el menu


var largoX = 1; // el largo del juego
var altoX = 1; // el alto del juego
var cookie = getCookie("dimensiones");
if(cookie){
	largoX = cookie.split(",")[0];
	altoX = cookie.split(",")[1];
}
var tablaPisos = [ {left : 0, top : 0, width : 0} ]; // array que contiene los pisos no cargados
var tablaParedes = []; // array que contiene los pisos no cargados
var tablaPisos1 = []; // array que contiene los pisos cargados
var tablaParedes1 = []; // array que contiene las paredes cargados
var scroll = 0; // posicion del scroll
var delayx = 0; // dilay x
var velx = 0; // velocidad x
var vely = 0; // velocidad y
var movy = null; // movimiento y (null = ninguno, true para arriba y false para abajo)
var mario = "mario1"; // imagen de mario
var posx = 0; // posicion x de mario
var posy = 0; // posicion y de mario 
var teclas = [false,false]; // teclas apretadas
var intS = nav == "NT" ? 30 : 20; // velocidad del juego segun el navegador
var correr = false; // cuando corre
var salto = false; // cuando salta
var saltoB = false; // si esta apretado o no en boton de salto
var saltoPD = 3; // velocidad a la que desciende la velocidad a la que sube cuando salta
var saltoL = null; // lado para el que se salta
var saltoVe = false; // velocidad cuando salta
var alto = 64; // alto en px de la imagen de mario
var largo = 32; // largo en px de la imagen de mario
var piso = 0; // el piso en el que esta parado mario (0 es poque no esta parado)
var pisosS = 0; // cantidad pisos borradas
var paredesS = 0; // cantidad paredes borradas
var mapax = 0; // largo del mapa
var tunelx = 0; // largo del tunel
var cubos = new Array(); // se almacena un objeto por cada cubo con sus propiedades y un una imagen correspondiente a ese cubo
var cubosN = 0; // numero de cubos que se crean
var puntos = 0; // los puntos
var monedas = 0; // las monedas
var mundoN = "1-1"; // nombre del mundo
var tiempoR = 400; // el timepo que resta
var tiempo = 400; // el tiempo del mapa
var vidas = 3; // la cantidad de vidas
var mapaT = 1; // el tipo de mapa
var marioF = 1; // la forma de mario
var resize = false; // si el juego se esta resizando
var _mouseX = 0; // variable que se usa en el drag and drop cuando se resiza el juego
var _mouseY = 0; // variable que se usa en el drag and drop cuando se resiza el juego
var ctr = false; // si el contro esta apretado
var bichos = new Array(); // los hongos
var bichosS = 0; // la cantidad de bichos sacados
var hongos = 0; // la cantidad de hongos
var bichosN = 0; // la cantidad de bichos comunes
var tortugas = 0; // la cantidad de tortugas
var crecerM = false; // si mario esta creciendo
var marioImgs = ["marioVidas", "gmario1", "gmario2", "gmario3", "gmario4", "gmario5", "gmario6", "gcorriendo1", "gcorriendo1_1", "gcorriendo1_2", "gcorriendo2", "gcorriendo2_1", "gcorriendo2_2", "gmario7", "gmario8", "gmario11", "gmario12", "mario1", "mario2", "mario3", "mario4", "mario5", "mario6", "corriendo1", "corriendo1_1", "corriendo1_2", "corriendo2", "corriendo2_1", "corriendo2_2", "marioMuerte", "mario11", "mario12", "mario13", "smario1", "smario2", "smario3", "smario4", "smario5", "smario6", "scorriendo1", "scorriendo1_1", "scorriendo1_2", "scorriendo2", "scorriendo2_1", "scorriendo2_2", "smario7", "smario8", "smario9", "smario10", "smario11", "smario12"]; 
// todas las imagenes de mario
var marioGY = false; // si mario se tiene que agrandar (crecio y tiene una pared arriba)
var tablaMonedas1 = new Array(); // las monedas que todavia no se cargaron
var tablaMonedas = new Array(); // las monedas cargadas
var inicio = false; // si el juego inicio
var sonido = false; // si hay sonido
var tubos = new Array(); // los tubos del mapa
var agachar = false; // si mario esta agachado
var marioMuerte = false; // si mario esta muerto
var posiciones = new Array(); // las posiciones donde nace mario
var transparente = false; // si mario es transparente o no
var flores = 0; // la cantidad de flores
var estrella = false; // si mario se agarro una estrella
var estrellaT = 0; // el tiempo que falta para que se acabe el efecto de una estrella
var marioOpacity = 1; // la opacidad de mario
var marioOpacityC = false;
var camara = true; // si se mueve la camara
var tunel = false; // si mario esta adentro de un tunel
var figuras = new Array(); // las figuras del fondo
var figurasSize = [[160, 96],[96, 64],[80, 48],[112, 48],[144, 48],[80, 32],[112, 32],[144, 32],[160, 160],[32, 320],[510, 130]];
// tamaño de las figuras de fondo
var bandera = false; // la bandera
var autoMov = false; // si mario se esta moviendo solo
var autoMovR = 0; // la distancia que deve auto caminar mario
var autoMovD = [0, 0]; // dimensiones del div "mario" cuando entra en un castillo
var autoMovE = false; // que hacer cuando termine de auto moverse mario
var mapaA = 0; // el mapa actual
var imagenes = new Array(); // las imagenes no cargadas
var imagenes2 = new Array(); // las imagenes cargadas
var linkM = false; // nombre del tunel principal si el tipo de mapa es 2
var mapaC = false; // el mapa cargado
var tiempoP = false; // si se esta pasando el tiempo a puntos
var tiempoE = false; // si el tiempo termino en 9, 6 o 3
var barras = new Array(); // las barras que suben o bajan

function configuracion(){
	/*
	segun los parametros que recive indetifica y configura:
		* el tipo de mapa
		* la cantidad de vidas
		* puntos
		* monedas
		* nombre del mapa
		* cantida de tiempo al inicio
		* largo del mapa
	*/
	var config = configuracion.arguments[0];
	
	mapaT = config[0];
	
	vidas = Number(config[1]);
	
	puntos = Number(config[2]);
	
	monedas = Number(config[3]);
	
	mundoN = config[4];
	
	tiempo = Number(config[5]);
	tiempoR = tiempo;
	
	mapax = Number(config[6]);
	
	posiciones = [];
	for( x = 7; x < config.length; x += 2 ){
		posiciones.push( [Number( ( config[x] * 32 ) ), Number( ( config[x + 1] * 32 - 16 ) )] );
	}
}

function comienzoJuego( time, mapa, mapaTA ){ // comienza el juego
	
	editor.editando = false; // no se esta editando un mapa
	menuA = false; // ya no se esta en el manu
	
	marioMuerte = false;
	
	time = time ? time : 0;
	if( !time ){
		configuracion( mapa[0].replace( /config:/, "" ).split( /,+/ ) ); // configura el juego
		escribirTxt();
	}
	if( time == 2 ){
		var config = mapa[0].replace( /config:/, "" ).split( /,+/ );
		
		mapaT = Number( config[0] );
		
		mundoN = config[1];
		
		tiempo = Number(config[2]);
		tiempoR = tiempo;
		
		mapax = Number(config[3]);
		
		posiciones = [];
		for( x = 4; x < config.length; x += 2 ){
			posiciones.push( [Number( ( config[x] * 32 ) ), Number( ( config[x + 1] * 32 - 16 ) )] );
		}
		
	}
	
	get("mapax").style.left = setX( mapax * 32 + 1000 ) + "px";
	
	var posxNueva = 0;
	var posyNueva = 0;
	
	for( k = 0; k < posiciones.length; k++ ){
		if( posiciones[k][0] < posx || k == 0 ){
			posxNueva = posiciones[k][0];
			posyNueva = posiciones[k][1];
		}
	}
	
	posx = posxNueva;
	posy = posyNueva - ( alto - 32 );
	
	if(posx - 230 > scroll){ // si tiene que actualizar el scroll
		scroll = posx - 230; // lo actualiza
	}
	get("juego").scrollLeft = setX(scroll);
	
	//------------------
	cargarMapa( mapas[mapaA], 1 ); // se carga el mapa
	//------------------
	
	// empieza el intervalo que actualiza el juego
	crearElementos(); // crea los elementos que estan cerca de mario
	actualizarX(); // se alcualiza el largo del juego
	actualizarY(); // se alcualiza el alto del juego
	get("inicio").style.display = "inline";
	setTimeout(function(){
		new efecto({ // para otros se cambia la opacidad de la pantalla negra desde 1 a 0 de a 0.1
			obj : get("inicio"),
			prop : "style.opacity",
			valor : "$1",
			$1 : [1, .1, 0.2],
			onFinish : function(){
				if( nav != "IE" ){
					get("inicio").style.display = "none";
				}
			}
		});
		new efecto({ // para ie se cambia la opacidad de la pantalla negra desde 100 a 0 de a 2
			obj : get("inicio"),
			prop : "style.filter",
			valor : "alpha( opacity = $1 );",
			$1 : [100, "0", 20]
		});
		get("mario").style.display = "inline"; // muestra el mario
		if( mapaT == 2 && !mapaTA ){
			actualizarMario( "corriendo1" );
			autoMov = 10;
			autoMovR = 226;
			autoMovE = "tunel";
			movy = true;
			salto = true;
		}
		else{
			inicio = true; // comienza el juego!
		}
	},time==2?3000:1000);
	actualizarMario( "mario1" );
}
document.onselectstart = function(){
	if( resize || editor.editando ){
		return false;
	}
}


function cargarMapa( mapa, tipoM ){
	mapaC = mapa;
	tunel = tipoM == 2;
	
	get( "juego" ).style.backgroundColor = !tunel ? "#5C94FC" : "#000";
	
	for(e = 1; e < mapa.length; e++){ // crea cada objeto del mapa
		var split = mapa[e].split(",");
		var tipo = split[0];
		var left = false;
		var top = false;
		var drop = false;
		var invisibilidad = false;
		var puntos = false;
		var tiempo = false;
		var width = false;
		var height = false;
		var tortugaT = false;
		var tuboT = false;
		var tuboB = false;
		var tuboId = false;
		var tuboL = false;
		var movy = false;
		
		switch(tipo){ // segun el tipo se identifican los argumentos
			case "1": case "2": // los cubos del piso
				left = Number( split[1] );
				top = Number( split[2] );
			break;
			case "3": case "4": // signo de prugunta o cubo rompible
				left = Number( split[1] );
				top = Number( split[2] );
				drop = Number( split[3] );
				invisibilidad = Number( split[4] );
				puntos = Number( split[5] );
				tiempo = Number( split[6] );
				if( !tiempo ){
					tiempo = 0;
				}
			break;
			case "5": case "6":
				left = Number( split[1] );
				top = Number( split[2] );
				puntos = Number( split[3] );
			break;
			case "7":
				left = Number( split[1] );
				top = Number( split[2] );
				tortugaT = Number( split[3] );
				puntos = Number( split[4] );
			break;
			case "8":
				left = Number( split[1] );
				top = Number( split[2] );
				tuboT = Number( split[3] );
				dimension = Number( split[4] );
				tuboB = Number( split[5] );
				tuboId = Number( split[6] );
				tuboL = split[7] ? split[7] : false;
			break;
			case "9":
				left = Number( split[1] );
				top = Number( split[2] );
				figura = Number( split[3] );
			break;
			case "10":
				left = Number( split[1] );
				top = Number( split[2] );
			break;
			case "11":
				left = Number( split[1] );
				movy = Number( split[2] );
			break;
		}
		
		//------------------
		//if( left <= mapax ){ // si esta adentro del mapa
			switch( tipo ){ // segun el tipo de objeto una accion deferente
				case "1": case "2": case "3": case "4": // los cubos rijidos
					cubosN++;
					var piso1 = { // crea el piso de arriba del cubo
						left : left * 32,
						top : top * 32 - 16,
						width : 32,
						id : cubosN,
						cons : 3
					};
					var piso2 = { // crea el piso de abajo del cubo
						left : left * 32,
						top : top * 32 + 32 - 16,
						width : 32,
						id : cubosN,
						cons : 3
						
					};
					var pared1 = { // crea la pared de la izquierda del cubo
						left : left * 32,
						top : top * 32 - 16,
						height : 32,
						id : cubosN,
						cons : 3
					};
					var pared2 = { // crea la pared derecha del cubo
						left : left * 32 + 32,
						top : top * 32 - 16,
						height : 32,
						id : cubosN,
						cons : 3
					};
					var imagen = document.createElement( "img" ); // se crea una imagen
					var src = false;
					switch( tipo ){ // depende del tipo la direccion url de la imagen
						case "1": // si es un cubo del piso
							src = !tunel ? "imgs/cuadraditos/cubo_piso.gif" : "imgs/cuadraditosTunel/cubo_piso.gif"; 
							// la imagen es un cubo del piso
						break;
						case "2": // si el segundo cubo del piso
							src = !tunel ? "imgs/cuadraditos/cubo_escalera.gif" : "imgs/cuadraditosTunel/cubo_escalera.gif"; 
							// la imagen es la de el segundo cubo del piso
						break;
						case "3": // si es un digno de preguntas
							src = !tunel ? "imgs/cuadraditos/signo.gif" : "imgs/cuadraditosTunel/signo.gif";
							// la imagen es la de un signo de pregunta
						break;
						case "4":
							src = !tunel ? "imgs/cuadraditos/cubo_rompible.gif" : "imgs/cuadraditosTunel/cubo_rompible.gif";
							// la imagen es de un cubo rompible
						break;
					}
					imagen.src = src; // se le pone la direccion url
					imagen.className = "cubo"; // se le pone clase
					imagen.style.left = setX( left * 32 ) + "px"; // se le pone la posicion x
					imagen.style.top = setY( top * 32 - 16 ) + "px"; // se le pone la posicion y
					imagen.style.width = setX( 32 ) + "px";
					imagen.style.height = setY( 32 ) + "px";
					imagen.style.zIndex = 1;
					imagen.id = "cubo" + cubosN;
					if( invisibilidad == "1" ){ // si es invisible
						imagen.style.visibility = "hidden"; // se hace invisible a la imagen
						piso1.cons = 0; // se hace que le piso 1 no sea rijido
						piso2.cons = 1; // se hace que le piso 2 no sea rijido cuando se toca de arriba pero si de abajo
						pared1.cons = 0; // se hace que la pared 1 no sea rijida
						pared2.cons = 0; // se hace que le pared 2 no sea rijida
						/*
						consistencia :
							pisos :
								0 : mario simepre transpasa el piso
								1 : mario solo puede tocar el piso con la cabeza
								2 : mario solo lo toca cuando se para
								3 : mario siempre toca el piso
							paredes :
								0 : mario nunca toca la pred
								1 : mario solo toca la pared cuando va hacia la derecha
								2 : mario solo toca la pared cuando va hacia la izquierda
								3 : mario simpre toca la pared
						*/
					}
					else if( invisibilidad == "2" ){
						imagen.style.visibility = "hidden"; // se hace invisible a la imagen
						invisibilidad = "1";
					}
					cubos[cubosN] = { // se crea un cubo en el array de cubos con la informacion de este cubo
						id : cubosN,
						tipo : tipo,
						left : left,
						top : top,
						drop : drop,
						invisibilidad : invisibilidad,
						puntos : puntos,
						tiempo : tiempo,
						tiempoE : false,
						roto : false,
						disp : true,
						removed : false
					};
					cubos[cubosN].imagen = imagen; // se le asigna al item del array de cubos como imagen la imagen creada
					//get( "cubosDiv" ).appendChild( cubos[cubosN].imagen ); // se inserta la imagen en el mapa
					imagenes.push( { left : left * 32, imagen : imagen } );
					switch( tipo ){ // depende del tipo la funcion que se llama cuando se choca al cubo
						case "3": case "4": // si es n signo de pregunta o un cubo compible
							piso2.ev1 = function(){ // la funcion que se corre cuando mario choca el cubo
								if( !cubos[this.id].roto ){ // si el cubo no esta roto
									romper( cubos[this.id] ); // rompe el cubo
								}
							}
						break;
					}
					tablaPisos1.push( piso1 ); // pone el piso en el array de pisos no cargados
					tablaPisos1.push( piso2 ); // pone el otro piso en el array de pisos no cargados
					tablaParedes1.push( pared1 ); // pone la pared en el array de paredes no cargados
					tablaParedes1.push( pared2 ); // pone la otra pared en el array de paredes no cargados
				break;
				case "5": // las monedas
					var nMoneda = { // se crea una nueva moneda
						top : top * 32 - 16, // se le pone posicion y
						left : left * 32, // se le pone posicion
						puntos : puntos // se le pone los puntos
					};
					tablaMonedas1.push( nMoneda ); // se la agrega a la lista de monedas sin cargar
				break;
				case "6":
					new crearBicho( 4, left, top, puntos ); // se crea un nuevo bicho
				break;
				case "7":
					new crearBicho( 5, left, top, puntos, true, Number( tortugaT ) ); // se crea un nuevo bicho
				break;
				case "8":
					
					var top = top * 32 - 16;
					var left = left * 32;
					
					var tubo = {
						top : top,
						left : left,
						largo : 64,
						alto : dimension * 32,
						id : tuboId,
						link : tuboL,
						tipo : tuboT,
						imgs : new Array()
					};
					
					for( i = 1; i <= 2; i++ ){
						
						for( f = 1; f <= dimension; f++ ){
							
							var imgLeft = ( left + ( ( i - 1 ) * 32 ) );
							var imgTop = ( top + ( ( f - 1 ) * 32 ) );
							
							var img = elemento( "img", {
								style : {
									position : "absolute",
									left : setX( imgLeft ) + "px",
									top : setY( imgTop ) + "px",
									width : setX( 32 ) + "px",
									height : setY( 32 ) + "px"
								},
								src : ( !tunel ? "imgs/cuadraditos/tubo" : "imgs/cuadraditosTunel/tubo" ) + tuboT + "/" +
								( i == 1 ? ( f == 1 ? "tuboTL.gif" : "tuboBL.gif" ) : ( f == 1 ? "tuboTR.gif" : "tuboBR.gif" ) )
							}, get( "cubosDiv" ) );
							
							var imgA = {
								left : imgLeft,
								top : imgTop,
								img : img
							};
							
							tubo.imgs.push( imgA );
							
						}
						
					}
					var piso1 = { // crea el piso de arriba del tubo
						left : left,
						top : top,
						width : 64,
						id : cubosN,
						cons : 3
					};
					var piso2 = { // crea el piso de abajo del tubo
						left : left,
						top : top + ( dimension * 32 ),
						width : 64,
						id : cubosN,
						cons : 3
						
					};
					var pared1 = { // crea la pared de la izquierda del tubo
						left : left,
						top : top,
						height : dimension * 32,
						id : cubosN,
						cons : 3
					};
					var pared2 = { // crea la pared derecha del tubo
						left : left + 64,
						top : top,
						height : dimension * 32,
						id : cubosN,
						cons : 3
					};
					
					tablaPisos1.push( piso1 ); // pone el piso en el array de pisos no cargados
					tablaPisos1.push( piso2 ); // pone el otro piso en el array de pisos no cargados
					tablaParedes1.push( pared1 ); // pone la pared en el array de paredes no cargados
					tablaParedes1.push( pared2 ); // pone la otra pared en el array de paredes no cargados
					
					if( tuboB == "1" ){
						tubo.bicho = new crearBicho( 9, ( left / 32 ) + .5, ( ( top + 16 ) / 32 ) - 1, 0 );
					}
					
					tubos.push( tubo );
					
				break;
				case "9":
					left = left * 32;
					top = top * 32 + 16;
					figuras.push({
						top : top,
						left : left,
						tipo : figura,
						img : elemento( "img", {
							src : "imgs/figuras/figura" + figura + ".gif",
							style : {
								position : "absolute",
								left : setX( left ) + "px",
								top : setY( top ) + "px",
								width : setX( figurasSize[figura - 1][0] ) + "px",
								height : setY( figurasSize[figura - 1][1] ) + "px"
							}
						}, get( "figurasDiv" ) )
					});
				break;
				case "10":
					bandera = {
						left : left * 32,
						top : top * 32 - 16,
						img : elemento( "img", {
							src : "imgs/cuadraditos/bandera.gif",
							style : {
								position : "absolute",
								width : setX( 32 ) + "px",
								height : setY( 32 ) + "px",
								left : setX( left * 32 - 32 ) + "px",
								top : setY( top * 32 ) + "px"
							}
						}, get( "cubosDiv" ) ),
						imgTop : 16
					};
					tablaParedes1.push({
						left : left * 32 - 2,
						top : top * 32 - 16,
						height : 304,
						cons : 3
					});
				break;
				case "11":
					var barra = {
						left : left * 32,
						movy : movy,
						tiempo : 10,
						incio : true,
						barras : new Array()
					};
					barras.push( barra );
				break;
			}
			
			
		//}
	}
}
function descargarMapa( marioFN ){
	tablaPisos = [ {left : 0, top : 0, width : 0} ];
	tablaParedes = [];
	tablaPisos1 = [];
	tablaParedes1 = [];
	scroll = 0;
	delayx = 0;
	velx = 0;
	vely = 0;
	movy = null;
	salto = false;
	saltoPD = 3;
	piso = 0;
	pisosS = 0;
	paredesS = 0;
	cubos = new Array();
	cubosN = 0;
	bichos = new Array();
	bichosS = 0;
	hongos = 0;
	bichosN = 0;
	tortugas = 0;
	crecerM = false;
	marioGY = false;
	tablaMonedas1 = new Array();
	tablaMonedas = new Array();
	inicio = false;
	tubos = new Array();
	agachar = false;
	flores = 0;
	estrella = false;
	estrellaT = 0;
	marioOpacity = 1;
	marioOpacityC = false;
	camara = true;
	figuras = new Array();
	autoMov = false;
	autoMovR = 0;
	autoMovD = [0, 0];
	autoMovE = false;
	marioF = marioFN;
	imagenes = new Array();
	imagenes2 = new Array();
	mapaC = false;
	tiempoP = false;
	barras = new Array();
	
	actualizarMario( "mario1" );
	
	opacity( "mario", 1 );
	get( "cubosDiv" ).innerHTML = "";
	get( "bichosDiv" ).innerHTML = "";
	get( "figurasDiv" ).innerHTML = "";
	
	get( "inicio" ).style.display = "inline";
	opacity( "inicio", 1 );
	get( "mario" ).style.display = "none";
	
	escribirTxt();
	
}
function cargarTunel( link, posxB ){
	var mapaCB = mapaC;
	
	tablaPisos = [ {left : 0, top : 0, width : 0} ];
	tablaParedes = [];
	tablaPisos1 = [];
	tablaParedes1 = [];
	delayx = 0;
	velx = 0;
	vely = 0;
	posx = 0;
	posy = 0;
	scroll = 0;
	movy = null;
	salto = false;
	saltoB = false;
	saltoPD = 3;
	saltoL = null;
	saltoVe = false;
	piso = 0;
	pisosS = 0;
	paredesS = 0;
	cubos = new Array();
	cubosN = 0;
	bichos = new Array();
	bichosS = 0;
	hongos = 0;
	bichosN = 0;
	tortugas = 0;
	crecerM = false;
	marioGY = false;
	tablaMonedas1 = new Array();
	tablaMonedas = new Array();
	tubos = new Array();
	agachar = false;
	marioMuerte = false;
	flores = 0;
	figuras = new Array();
	autoMov = false;
	autoMovR = 0;
	autoMovD = [0, 0];
	autoMovE = false;
	imagenes = new Array();
	imagenes2 = new Array();
	tiempoP = false;
	barras = new Array();
	actualizarMario( "mario1" );
	
	opacity( "mario", 1 );
	get( "cubosDiv" ).innerHTML = "";
	get( "bichosDiv" ).innerHTML = "";
	get( "figurasDiv" ).innerHTML = "";
	
	if( link.indexOf( "T" ) != -1 ){
		inicio = true;
		
		get( "mario" ).style.display = "inline";
		
		var config = tuneles[link][0].replace( /config:/, "" ).split( /,+/ );
		tunelx = Number( config[0] ); 
		
		if( posxB ){
			posx = posxB;
		}
		
		var posicionesT = [];
		for( x = 3; x < config.length; x += 2 ){
			posicionesT.push( [Number( ( config[x] * 32 ) ), Number( ( config[x + 1] * 32 - 16 ) )] );
		}
		var posxNueva = 0;
		var posyNueva = 0;
		for( k = 0; k < posicionesT.length; k++ ){
			if( posicionesT[k][0] < posx || k == 0 ){
				posxNueva = posicionesT[k][0];
				posyNueva = posicionesT[k][1];
			}
		}
		posx = posxNueva;
		posy = posyNueva - ( alto - 32 );
		
		cargarMapa( tuneles[link], 2 );
		
		actualizarScroll( 1 );
		actualizarScroll( posx - 230 );
		
		piso = 0;
		
		camara = Number( config[1] ) ? true : false;
		
		actualizarX();
		actualizarY();
	}
	else{
		cargarMapa( mapas[mapaA], 1 );
		
		if( mapaT == 2 && ( mapaCB != tuneles[tubos[0].link] ) ){
			cargarMapa( tuneles[linkM], 2 );
		}
		
		for( z = 0; z < tubos.length; z++ ){
			if( tubos[z].id == Number( link ) ){
				posx = tubos[z].left + ( 32 - largo / 2 );
				posy = tubos[z].top - alto;
				
				if( tubos[z].bicho ){
					tubos[z].bicho.posy += tubos[z].bicho.alto;
					tubos[z].bicho.alto = 0;
					tubos[z].bicho.espera = 100;
				}
				
			}
		}
		
		camara = true;
		
		actualizarScroll( 1 );
		actualizarScroll( posx - 230 );
		
		piso = 0;
		
		
		actualizarX();
		actualizarY();
		
		get( "mario" ).style.overflow = "hidden";
		get( "mario" ).style.height = "0px";
		get( "mario" ).style.top = setY( posy + alto ) + "px";
		salto = true;
		
		setTimeout( function(){
			get( "mario" ).style.left = setX( posx - scroll ) + "px";
		}, 0);
		new efecto({
			obj : get( "mario" ),
			prop : "style.top",
			valor : "$1px",
			$1 : [ setY( posy + alto ), setY( posy ), setY( 2 ) ]
		});
		new efecto({
			obj : get( "mario" ),
			prop : "style.height",
			valor : "$1px",
			$1 : [ 0, setY( alto ), setY( 2 ) ],
			onFinish : function(){
				get( "mario" ).style.overflow = "";
				get( "mario" ).style.height = "";
				get( "mario" ).style.top = setY( posy ) + "px";
				get( "mario" ).style.left = setX( posx - scroll ) + "px";
				salto = false;
				inicio = true;
			}
		});
	}
}
function cargarNMapa(){
	if( mapas[mapaA + 1] ){
		descargarMapa( marioF );
		mapaA++;
		comienzoJuego( 2, mapas[mapaA] );
	}
	else{
		if( puntos > puntosTop ){
			puntosTop = puntos;
		}
		trace( "You win!" );
		mapaA = 0;
		descargarMapa( 1 );
		cargarMenu();
	}
}