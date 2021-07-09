//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion rompe un cubo y hace lo necesario dependiendo de cada cubo.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function romper( cubo ){
	switch( cubo.tipo ){ // depende del tipo de cubo lo que pasa cuando se rompe
		case "3": case"4": // si es un signo de pregunta o un cubo rompible
			
			//--------- Si hay una moneda arriba del cubo la toma
			var monedasEliminar = [];
			for( o = 0; o < tablaMonedas.length; o++ ){
				if(cubo.left == tablaMonedas[o].left / 32){
					if(cubo.top - 1 == ( tablaMonedas[o].top + 16 ) / 32 ){
						monedasEliminar.push(o);
					}
				}
			}
			if( monedasEliminar.length ){
				eliminarMonedas( monedasEliminar, true );
			}
			
			//--------- Si hay un bicho arriba del cubo la hace saltar
			for( i = 0; i < bichos.length; i++ ){ // por cada bicho
				if( !bichos[i].inicio ){
					if( bichos[i].posx + bichos[i].largo > cubo.left * 32 && bichos[i].posx < cubo.left * 32 + 32 ){
						if( cubo.top * 32 - 48 == bichos[i].posy ){
							if( bichos[i].tipo == 4 ){
								var puntos = bichos[i].puntos;
								var x = setX( bichos[i].posx - 32 );
								var y = setY( bichos[i].posy - 32 );
								bichoMuerte( bichos[i].tipo, bichos[i].posx, bichos[i].posy );
								eliminarBicho( i );
								sumarPuntos( puntos, x, y );
							}
							else{
								bichos[i].movy = true;
								bichos[i].vely = 6;
							}
						}
					}
				}
			}
			
			if( cubo.disp ){ // si se puede romper
				
				if( cubo.invisibilidad == "1" ){ // si era invisible
					cubo.invisibilidad = "0";
					cubo.imagen.style.visibility = "visible"; // ahora es visible
					for( i = 0; i < tablaPisos.length; i++ ){ // por cada piso
						if( tablaPisos[i].id == cubo.id ){ // si es uno piso del cubo
							tablaPisos[i].cons = 3; // le da consistencia al piso
						}
					}
					
					for( i = 0; i < tablaParedes.length; i++ ){ // por cada pared
						if(tablaParedes[i].id == cubo.id){ // si es una paredes del cubo
							tablaParedes[i].cons = 3; // le da consistencia
						}
					}
				}
				
				if( Number( cubo.tiempo ) == 0 ){ // si no hay mas drop
					if( cubo.drop == "0" ){ // si es un cubo rompible y no tiene nada
					
						if( marioF == 1 ){ // si mario es chico
							new efecto({
								obj : cubo.imagen,
								prop : "style.top",
								valor : "$1px",
								$1 : [setY(cubo.top * 32 - 16) - 1, setY(cubo.top * 32 - 16), [.01, setY(1.1), 0, setY( 10 ) ] ]
							});
							
							cubo.disp = false;
							setTimeout(function(){
								cubo.disp = true;
							}, 15 * intS);
											
						}
						else{ // si mario es grande
							
							cubo.imagen.style.visibility = "hidden"; // se oculta la imagen
							
							cubo.roto = true; // el cubo esta roto
							
							var src = tunel ? "imgs/cuadraditosTunel/fragmento_cubo_rompible.gif" : 
							"imgs/cuadraditos/fragmento_cubo_rompible.gif";
							
							cubo.imagen3 = elemento("img", {
								src : src,
								id : "cubo_roto" + cubo.id,
								style : {
									position : "absolute",
									left : setX(cubo.left * 32) + "px",
									top : setY(cubo.top * 32 - 16) + "px",
									zIndex : 2,
									width : setX(16) + "px",
									height : setY(16) + "px"
								}
							} , get("cubosDiv"));
							
							cubo.imagen4 = elemento("img", {
								src : src,
								id : "cubo_roto" + cubo.id,
								style : {
									position : "absolute",
									left : setX(cubo.left * 32 + 16) + "px",
									top : setY(cubo.top * 32 - 16) + "px",
									zIndex : 2,
									width : setX(16) + "px",
									height : setY(16) + "px"
								}
							} , get("cubosDiv"));
							
							cubo.imagen5 = elemento("img", {
								src : src,
								id : "cubo_roto" + cubo.id,
								style : {
									position : "absolute",
									left : setX(cubo.left * 32) + "px",
									top : setY(cubo.top * 32) + "px",
									zIndex : 3,
									width : setX(16) + "px",
									height : setY(16) + "px"
								}
							} , get("cubosDiv"));
							
							cubo.imagen6 = elemento("img", {
								src : src,
								id : "cubo_roto" + cubo.id,
								style : {
									position : "absolute",
									left : setX(cubo.left * 32 + 16) + "px",
									top : setY(cubo.top * 32) + "px",
									zIndex : 3,
									width : setX(16) + "px",
									height : setY(16) + "px"
								}
							} , get("cubosDiv"));
							
							new efecto({
								obj : cubo.imagen3,
								prop : "style.top",
								valor : "$1px",
								$1 : [setY(cubo.top * 32 - 16), setY(500), [3.1, setY(1), 1, setY(10)] ]
							});
							new efecto({
								obj : cubo.imagen3,
								prop : "style.left",
								valor : "$1px",
								$1 : [setX(cubo.left * 32), setX(cubo.left * 32) - 1, [3.1, setX(.1), 1, setX(7)] ],
								onFinish : function(){
									if( cubo.imagen3.parentNode ){
										cubo.imagen3.parentNode.removeChild( cubo.imagen3 );
									}
								}
							});
							
							new efecto({
								obj : cubo.imagen4,
								prop : "style.top",
								valor : "$1px",
								$1 : [setY(cubo.top * 32 - 16), setY(500), [3.1, setY(1), 1, setY(10)] ]
							});
							new efecto({
								obj : cubo.imagen4,
								prop : "style.left",
								valor : "$1px",
								$1 : [setX(cubo.left * 32), setX(cubo.left * 32 + 1), [3.1, setX(.1), 1, setX(7)] ],
								onFinish : function(){
									if( cubo.imagen4.parentNode ){
										cubo.imagen4.parentNode.removeChild( cubo.imagen4 );
									}
								}
							});
							
							new efecto({
								obj : cubo.imagen5,
								prop : "style.top",
								valor : "$1px",
								$1 : [setY(cubo.top * 32), setY(500), [3.1, setY(1), 1, setY(8)] ]
							});
							new efecto({
								obj : cubo.imagen5,
								prop : "style.left",
								valor : "$1px",
								$1 : [setX(cubo.left * 32), setX(cubo.left * 32) + 1, [3.1, setX(.1), 1, setX(5)] ],
								onFinish : function(){
									if( cubo.imagen5.parentNode ){
										cubo.imagen5.parentNode.removeChild( cubo.imagen5 );
									}
								}
							});
							
							new efecto({
								obj : cubo.imagen6,
								prop : "style.top",
								valor : "$1px",
								$1 : [setY(cubo.top * 32), setY(500), [3.1, setY(1), 1, setY(8)] ]
							});
							new efecto({
								obj : cubo.imagen6,
								prop : "style.left",
								valor : "$1px",
								$1 : [setX(cubo.left * 32 + 16), setX(cubo.left * 32) - 1, [3.1, setX(.1), 1, setX(5)] ],
								onFinish : function(){
									if( cubo.imagen6.parentNode ){
										cubo.imagen6.parentNode.removeChild( cubo.imagen6 );
									}
								}
							});
							
							cubo.imagen.style.visibility = "hidden"; // se oculta el cubo
							
							for( i = 0; i < tablaPisos.length; i++ ){ // por cada piso
								if(tablaPisos[i].id == cubo.id){ // si es uno piso del cubo
									tablaPisos[i].cons = 0; // le saca consistencia al piso
								}
							}
							
							for( i = 0; i < tablaParedes.length; i++ ){ // por cada pared
								if(tablaParedes[i].id == cubo.id){ // si es una paredes del cubo
									tablaParedes[i].cons = 0; // le da consistencia
								}
							}
						}
						
					}
					else{ // sino
						cubo.imagen.style.visibility = "hidden"; // se oculta la imagen
						cubo.roto = true; // el cubo esta roto
						cubo.imagen1 = document.createElement( "img" ); // se crea una nueva imagen (el cubo roto)
						cubo.imagen1.className = "cubo"; // se le pone clase
						cubo.imagen1.src = !tunel ? "imgs/cuadraditos/cubo_roto.gif" : "imgs/cuadraditosTunel/cubo_roto.gif";
						// se le pone direccion url
						cubo.imagen1.style.left = setX( cubo.left * 32 ) + "px"; // se le pone posicion x
						cubo.imagen1.style.top = setY( cubo.top * 32 - 16 ) + "px"; // se le pone posicion y
						cubo.imagen1.id = "cubo_roto" + cubo.id; // se le pone id
						cubo.imagen1.style.zIndex = 1; // se le pone x-index
						cubo.imagen1.style.width = setX( 32 ) + "px"; // se le pone largo
						cubo.imagen1.style.height = setY( 32 ) + "px"; // se le pone alto
						get("cubosDiv").appendChild( cubo.imagen1 ); // se la agrega al mapa
						
						new efecto({
							obj : cubo.imagen1,
							prop : "style.top",
							valor : "$1px",
							$1 : [setY( cubo.top * 32 - 16 ) - 1, setY( cubo.top * 32 - 16 ), [.01, setY( 1.1 ), 0, setY( 10 ) ] ]
						});
					}
				}
				else{ // si sigue habiendo drop
					
					new efecto({
						obj : cubo.imagen,
						prop : "style.top",
						valor : "$1px",
						$1 : [setY( cubo.top * 32 - 16 ) - 1, setY( cubo.top * 32 - 16 ), [.01, setY( 1.1 ), 0, setY( 10 ) ] ]
					});
					
					if( cubo.tiempoE == false ){ // si es la primera ves que lo choca
						cubo.tiempoE = true; // ya no es mas
						
						setTimeout(function(){
							cubo.tiempo = 0;
							cubo.tiempoE = null;
						}, cubo.tiempo * 1000);
					}
				}
				
				drop( cubo );
				
			break;
		}
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion larga algo de un cubo.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function drop( cubo ){
	switch( cubo.drop ){
		case 1: // si larga monedas
			empezarS( "sound3" );
			cubo.disp = false;
			cubo.imagen2 = document.createElement( "img" ); // se crea una nueva imagen (la moneda que sale)
			cubo.imagen2.className = "cubo"; // se le pone clase
			cubo.imagen2.src = "imgs/cuadraditos/moneda2.gif"; // se le pone direccion url
			cubo.imagen2.style.left = setX( cubo.left * 32 ) + "px"; // se le pone posicion x
			cubo.imagen2.style.top = setY( cubo.top * 32 - 16 ) + "px"; // se le pone posicion y
			cubo.imagen2.id = "moneda" + cubo.id; // se le pone id
			cubo.imagen2.style.width = setX( 32 ) + "px"; // se le pone largo
			cubo.imagen2.style.height = setY( 32 ) + "px"; // se le pone alto
			cubo.imagen2.style.zIndex = 3;
			get("cubosDiv").appendChild( cubo.imagen2 ); // se la agrega al mapa
			new efecto({
				obj : cubo.imagen2,
				prop : "style.top",
				valor : "$1px",
				$1 : [ parseInt( cubo.imagen2.style.top ) - setY( 33 ), parseInt( cubo.imagen2.style.top ) - setY( 32 ),
				[4, setY( 2.3 ), 0, 0 - setY( 20 ) ] ],
				onFinish : function(){
					sumarMonedas( 1 ); // las monedas son aumentada
					sumarPuntos(
						cubo.puntos,setX( cubo.left * 32 - 33 ),
						parseInt( cubo.imagen2.style.top ) + parseInt( cubo.imagen2.style.height )
					);
					cubo.imagen2.parentNode.removeChild( cubo.imagen2 ); // se elimina la imagen
					cubo.disp = true;
				}
			});
		break;
		case 2: // si larga hongos/flores
			cubo.disp = false;
			setTimeout( function(){
				cubo.disp = true;
			}, 15 * intS );
			
			if( marioF == 1 ){ // si mario es chico
				empezarS( "sound9" );
				new crearBicho( 1, cubo.left, cubo.top - 1, cubo.puntos ); // se crea un nuevo hongo
			}
			else{ // si mario es grande
				new crearBicho( 6, cubo.left, cubo.top - 1, cubo.puntos ); // se crea una nueva flor
			}
		break;
		case 3: // si largo un hongo de vida
			cubo.disp = false;
			setTimeout(function(){
				cubo.disp = true;
			}, 15 * intS);
			
			empezarS("sound9");
			new crearBicho(2, cubo.left, cubo.top - 1, cubo.puntos); // se crea un nuevo hongo de vida
		break;
		case 4: // si larga un hongo que mata
			cubo.disp = false;
			setTimeout(function(){
				cubo.disp = true;
			}, 15 * intS);
			
			empezarS("sound9");
			new crearBicho(3, cubo.left, cubo.top - 1, cubo.puntos); // se crea un nuevo hongo de vida
		break;
		case 5: // si largo una estrella
			new crearBicho(7, cubo.left, cubo.top - 1, cubo.puntos); // se crea una nueva estrella
		break;
	}
}