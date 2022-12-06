function actualizar(){ // actualiza todo
	
	var posxBack = posx;
	var posyBack = posy;
	
	if( barras.length ){
		actualizarBarras();
	}
	
	if( estrella ){
		estrellaT -= intS;
		
		if( marioOpacityC == false ){
			if( marioOpacity == 1 ){
				
				marioOpacity = 0;
				
				if( estrellaT < 2000 ){
					marioOpacity = 1 - estrellaT / 2000;
				}
				
				opacity( "mario", marioOpacity );
				
			}
			else{
				marioOpacity = 1;
				opacity( "mario", 1 );
			}
		}
		
		marioOpacityC = !marioOpacityC;
		
		if( estrellaT < 0 ){
			estrella = false;
			opacity( "mario", 1 );
		}
	}
	
	if( !salto ){ // si mario no esta saltando
		if( ( teclas[0] == true || teclas[1] == true ) && delayx == 0 && !agachar ){ 
		// si no se mueve para algun lado, el dilay es nullo y mario no esta agachado
			movimientoX(); // actualiza la posicion de mario
		}
		else if(delayx){ // si existe el delay
			delay(); // calcula la nueva posicion y la actualiza
		}
	}
	else{ // si salta
		movimientoXSalto(); // mueve mario por el aire
	}
	movimientoY(); // calcula y actualiza la posicion de mario
	
	if(movy == null){ // si no hay movimiento y (no esta saltando ni cayendo)
		if(
		posx + largo <= tablaPisos[piso].left ||
		posx + 1 > tablaPisos[piso].left + tablaPisos[piso].width ||
		posy + alto < tablaPisos[piso].top ||
		posy + alto > tablaPisos[piso].top ||
		tablaPisos[piso].cons != 0 ||
		tablaPisos[piso].cons != 1){ // comprueva si mario se cae de donde esta parado
			if(posx + largo < tablaPisos[piso].left && posx + 3 > scroll){
				var velxB = velx;
				velx = 3;
				movxIzquierda();
				velx = velxB;
			}
			var piso1 = false;
			for(s=0;s<tablaPisos.length;s++){ // por cada piso se fija se paso sin scaerse
			if(!(posx + largo < tablaPisos[s].left + 1 || posx > tablaPisos[s].left + tablaPisos[s].width - 1)){
				if(posy + alto == tablaPisos[s].top){
					if(tablaPisos[s].cons != 0 && tablaPisos[s].cons != 1){ // si la consistencia permite a mario pararse
						piso = s;
						piso1 = true;
						vely = 0;
						if(tablaPisos[s].ev){ // si hay alguna evaluacion la realiza
							tablaPisos[s].ev();
						}
					}
				}
			}
			}
			if(!piso1){ // si mario no esta tocando el piso
				var movx = Number(mario.charAt(mario.length-1))%2?true:false; // el lado para el que se mueve mario
				movy = false; // el movmiento y es falso (mario cae)
				vely = 3; // (la velocidad con la que cae esde 3px/actualizacion)
				salto = true; // el mario esta saltando
				saltoL = movx; // el lado para el que salta es igual a movx
				delayx = 0; // cuando cae no hay delay
				saltoVe = velC; // la velocidad x maxima a la que se mueve en el aire
				if( !agachar ){
					actualizarMario(movx?"mario3":"mario4"); // actualiza la imagen de mario
				}
			}
		}
	}
		
	if(marioGY != false){ // si mario crecio y tenia un piso arriba
		var techo = false; // si sigue abiendo un piso arriba
		
		for(u = 0; u < tablaPisos.length; u++){ // por cada piso
			if(!(posx + largo - 1 < tablaPisos[u].left + 1 || posx + 1 > tablaPisos[u].left + tablaPisos[u].width - 1)){
				// si mario esta en la misma posicion x que el piso
				if(posy + 3 > tablaPisos[u].top && posy - 3 < tablaPisos[u].top){
					// si esta tocando el que el piso
					if( tablaPisos[u].cons == 3 ){
						techo = true; // el techo sigue estando
						velx1 = velx;
						velx = 3;
						movxDerecha();
						velx = velx1;
					}
				}
			}
		}
		if(!techo){ // si no esta mas el techo
			posy -= marioGY[1] - marioGY[0]; // se sube la posicion y
			marioGY = false; // ya no hay mas un techo sobre mario
			actualizarMario(mario.substring(1,mario.length)); // se actualiza la imagen de mario 
		}
	}
	
	if(tablaMonedas.length){
		var eliminar = new Array();
		for(o = 0; o < tablaMonedas.length; o++){
			if(posx + largo > tablaMonedas[o].left && posx < tablaMonedas[o].left + 32){
				if(posy + alto > tablaMonedas[o].top && posy < tablaMonedas[o].top + 32){
					eliminar.push(o);
				}
			}
		}
		if( eliminar.length ){
			eliminarMonedas( eliminar );
		}
	}
	
	actualizarBichos();
	
	if(posx != posxBack){
		actualizarScroll( posx - 230 ); // se actualiza el scroll del juego
		get("mario").style.left = setX( posx - scroll ) + "px"; // se actualiza la posicion x de mario
	}
	
	if(posy != posyBack){
		get("mario").style.top = setY( posy - (marioGY != false ? marioGY[1] - marioGY[0] : 0 ) ) + "px";
		// se actualiza la posicion y de mario
	}
	
	var timepoRB = tiempoR;
	tiempoR -= 0.070;
	//tiempoR -= 1;
	
	if( parseInt( tiempoR ) < parseInt( timepoRB ) ){
		escribirTxt( 7 );
	}
	
	if( tiempoR < 75 ){
		opacity( "tiempoNTxt", get( "tiempoNTxt" ).style.opacity == "1" ? 0 : 1 );
	}
	if( tiempoR < 0 ){
		marioF = 1;
		muerte( 1 );
	}
	
	if( bandera && !tunel ){ // se fija si mario toco la bandera
		if( posx + largo == bandera.left - 2 ){
			actualizarMario( "mario11" );
			
			if( agachar ){
				agachar = false;
				marioGY = false;
				posy -= 32;
				get( "mario" ).style.top = setY( posy ) + "px";
			}
			
			posx = bandera.left + 2 - largo;
			get( "mario" ).style.left = setX( posx - scroll ) + "px";
			
			inicio = false;
			salto = true; 
			autoMov = 1;
			autoMovE = "mapChange";
			var bPosy = posy + largo - bandera.top;
			var bPuntos = bPosy < 50 ? 5000 : ( bPosy < 120 ? 2000 : ( bPosy < 200 ? 800 : ( bPosy < 250 ? 400 : 200 ) ) );
			bandera.puntosD = elemento( "div", {
				style : {
					position : "absolute",
					left : setX( bandera.left + 10 ) + "px",
					top : setY( bandera.top + 304 - 12 - 16 ) + "px",
					height : setY( 12 ) + "px",
					width : setX( 100 ) + "px",
					overflow : "hidden",
					zIndex : "1" 
				}
			}, get( "cubosDiv" ) );
			
			bandera.puntosD.innerHTML = "";
			bandera.puntosD.appendChild( escribir( String( bPuntos ), 12 ) );
			bandera.bPuntos = bPuntos;
			
			puntos += bPuntos;
			
			escribirTxt( 2 );
			
		}
	}
}

function movimientoX(){ // cuando se mueve
	if( teclas[0] == true ){
		movxDerecha();
	}
	else if( teclas[1] == true ){
		movxIzquierda();
		if( posx < scroll ){
			posx = scroll;
			if( velx > 0.4 ){
				velx -= 0.4;
			}
			else{
				velx = 0;
			}
		}
	}
}


function movimientoY(){ // cuando salta o cae
	
	if( salto ){
		if( movy == true ){
			var saltoPD;
			if( saltoB ){
				saltoPD = ( 205 - saltoV ) / 100;
				saltoPD -= velx > velC - 1 ? (velx - velC) / 20 : 0;
			}
			else{
				saltoPD = ( 205 - saltoV ) / 100 * 3.75;
				saltoPD -= velx > velC - 1 ? (velx - velC) / 20 : 0;
			}
			if( vely < 4 ){
				saltoPD = ( 205 - saltoV ) / 100;
			}
			
			vely -= saltoPD;
			posy -= vely;
			
			for(i = 0; i < tablaPisos.length; i++){ // si choca la cabeza
				if( !( posx + largo < tablaPisos[i].left + 1 || posx > tablaPisos[i].left + tablaPisos[i].width - 1) ){
					if( posy - vely < tablaPisos[i].top && posy - vely > tablaPisos[i].top - vely - 20 ){
						if( tablaPisos[i].cons != 0 && tablaPisos[i].cons != 2 ){ 
						// si la consistencia permite que mario choque la cabeza
							movy = false;
							vely = 5;
							posy = tablaPisos[i].top;
							if( tablaPisos[i].ev1 ){
								tablaPisos[i].ev1();
								break;
							}
						}
					}
				}
			}
			if( vely < 1 ){
				movy = false;
				vely = 3;
			}
		}
	}
	
	if( movy == false ){
		if( posy > 457 ){
			muerte( 2 );
		}
		
		var piso1 = false;
		if( vely < 10 * ( peso + 1 ) ){
			vely += peso + 1;
		}
		
		for(s = 0; s < tablaPisos.length; s++){ // comprueva si mario toca el piso
			if(!(posx + largo - 1 < tablaPisos[s].left + 1 || posx + 1 > tablaPisos[s].left + tablaPisos[s].width - 1)){
				if(posy + alto + vely > tablaPisos[s].top && posy + alto + vely < tablaPisos[s].top + vely + 10){
					if(tablaPisos[s].cons != 0 && tablaPisos[s].cons != 1){ // si la consistencia permite a mario pararse
						piso = s; // el piso es igual al numero de piso
						piso1 = tablaPisos[s].top
						if(tablaPisos[s].ev){ // si hay alguna funcion
							tablaPisos[s].ev(); // la corre
						}
					}
				}
			}
		}
		
		if( piso1 != false ){ // si toca el piso
			posy = piso1 - alto;
			vely = 0;
			movy = null;
			salto = false;
			if( !agachar ){
				if( teclas[0] && !teclas[1] ){ // si se mueve para la derecha
					if( saltoL ){
						if( !agachar ){
							actualizarMario("corriendo1");
						}
						if( velx < correr ? velCo : velC ){
							delayx = 3;
						}
					}
					else{
						if( !agachar ){
							actualizarMario("mario6");
						}
						delayx = 6;
					}
				}
				else if( teclas[1] && teclas[0] == false ){ // si se mueve para la izquierda
					if( saltoL ){
						if( !agachar ){
							actualizarMario("mario5");
						}
						delayx = 5;
					}
					else{
						if( !agachar ){
							actualizarMario("corriendo2");
						}
						if( velx < correr ? velCo : velC ){
							delayx = 4;
						}
					}
				}
				else if( teclas[1] && teclas[0] ){ // si se mueve para los dos lados
					if( saltoL ){
						if( !agachar ){
							actualizarMario("corriendo1");
						}
						delayx = 1;
					}
					else{
						if( !agachar ){
							actualizarMario("corriendo2");
						}
						delayx = 2;
					}
				}
				else{ // si no se mueve
					if( saltoL ){
						if( !agachar ){
							actualizarMario("corriendo1");
						}
						delayx = 1;
					}
					else{
						if( !agachar ){
							actualizarMario("corriendo2");
						}
						delayx = 2;
					}
				}
			}
			else{
				keyUp( 40 );
			}
		}
		else{
			posy += vely;
		}
	}
}

function movimientoXSalto(){ // moviemeinto x cuado salta
	if( saltoL ){ // si se esta moviendo para la derecha
		if( teclas[0] && !teclas[1] ){ // si la tecla de la derecha esta apretada
			velx += velx < saltoVe ? ( saltoVe - velx ) / 17 : 0; // la velocidad sube
		}
		else if( teclas[1] && teclas[0] == false ){  // si la tecla de la izquierda esta apretada
			velx -= ( velCo - velx ) / 20; // la velocidad baja
			if( velx < 0.5 ){
				saltoL = false;
			}
		}
		else if(teclas[1]&&teclas[0]){ // si las dos teclas estan apretadas
			if(velx>0.5){velx -= 0.1;} // la velocidad baja 0.1 hasta llegar a 0.5
		}
		else{ // si ninguna tecla esta paretada
			if(velx>0.5){velx -= 0.1;} // la velocidad baja 0.1 hasta llegar a 0.5
		}
		movxDerecha();
	}
	else{
		if(teclas[0]&&!teclas[1]){ // si se mueve para la derecha
			velx -= (velCo-velx)/20;
			if(velx < 0.5){
				saltoL = true;
			}
		}
		else if(teclas[1]&&teclas[0]==false){ // si se mueve para la izquierda
			velx += velx<saltoVe?(saltoVe-velx)/17:0;
		}
		else if(teclas[1]&&teclas[0]){ // si se mueve para los dos lados
			if(velx>0.50){velx -= 0.1;}
		}
		else{ // si no se mueve
			if(velx>0.50){velx -= 0.1;}
		}
		movxIzquierda();
		if( posx < scroll ){
			posx = scroll;
		}
	}
}


function delay(){ // delay
	switch (delayx){
		case 1:
			if(velx>0.4){
				velx -= 0.4;
				movxDerecha();
			}
			else{
				if( !agachar ){
					actualizarMario("mario1");
				}
				delayx = 0;
				velx = 0;
			}
		break;
		
		case 2:
			if(velx>0.4){
				velx -= 0.4;
				movxIzquierda();
				if( posx < scroll ){
					posx = scroll;
					if( !agachar ){
						actualizarMario("mario2");
					}
				}
			}
			else{
				if( !agachar ){
					actualizarMario("mario2");
				}
				delayx = 0;
				velx = 0;
			}
		break;
		case 3:
			if( velx < velC ){
				velx += 0.4;
				movxDerecha();
			}
			else{
				delayx = correr ? 7 : 0;
				velx = correr ? velx : velC;
			}
		break;
		
		case 4:
			if( velx < velC ){
				velx += 0.4;
				movxIzquierda();
				if( posx < scroll ){
					delayx = 0;
					posx = scroll;
				}
			}
			else{
				delayx = correr ? 8 : 0;
				velx = correr ? velx : velC;
			}
		break;
		
		case 5:
			if(velx>2){
				velx -= 0.5;
				movxDerecha();
			}
			else{
				delayx = 4;
				actualizarMario("corriendo2");
			}
		break;
		
		case 6:
			if(velx>2){
				velx -= 0.5;
				movxIzquierda();
				if( posx < scroll ){
					posx = scroll;
				}
			}
			else{
				actualizarMario("corriendo1");
				delayx = 3;
			}
		break;
		
		case 7:
			if(velx<velCo){
				velx += 0.6;
				movxDerecha();
			}
			else{
				delayx = 0;
				velx = velCo;
			}
		break;
		
		case 8:
			if(velx<velCo){
				velx += 0.6;
				movxIzquierda();
				if( posx < scroll ){
					delayx = 0;
					posx = scroll;
				}
			}
			else{
				velx = velCo;
				delayx = 0;
			}
		break;
		
		case 9:
			if(velx>velC){
				velx -= 0.6;
				movxDerecha();
			}
			else{
				actualizarMario("corriendo1");
				delayx = 0;
				velx = velC;
			}
		break;
		
		case 10:
			if(velx>velC){
				velx -= 0.6;
				movxIzquierda();
				if( posx < scroll ){
					posx = scroll;
					delayx = 0;
					actualizarMario("mario2")
				}
			}
			else{
				actualizarMario("corriendo2");
				delayx = 0;
				velx = velC;
			}
		break;
	}
}

function keyDown( n ){ // al presionar una tecla
	var salida = true;
	
	var delayxB = delayx;
	if( n == 17 || n == 32 ){
		ctr = true;
	}
	if( menuA ){
		if( !resize ){
			switch(n){
				case 38:
					if( menu[menuSeleccionado - 1] ){
						menuSeleccionado--;
						get( "hongoSeleccionar" ).style.bottom = setY( menu[menuSeleccionado][1] ) + "px";
					}
					get("jugarInstrucciones").style.display = menuSeleccionado == 0 ? "inline" : "none";
					salida = false;
				break;
				case 40:
					if( menu[menuSeleccionado + 1] ){
						menuSeleccionado++;
						get( "hongoSeleccionar" ).style.bottom = setY( menu[menuSeleccionado][1] ) + "px";
					}
					get("jugarInstrucciones").style.display = menuSeleccionado == 0 ? "inline" : "none";
					salida = false;
				break;
				case 13:
					var hideMenu = true;
					switch( menu[menuSeleccionado][0] ){
						case "jugar":
							comienzoJuego( false, mapas[0] );
							opacity( "inicio", 1 );
						break;
						case "crear":
							cargarEditor();
						break;
						default:
							hideMenu = false;
						break;
					}
					if( hideMenu ){
						get( "menu" ).style.display = "none";
					}
					salida = false;
				break;
			}
		}
	}
	else if( editor.editando && editor.lugar == "mapaModificar" ){
		if( n == 46 ){
			suprimir();
			salida = false;
		}
	}
	else{
		if( ( ( n == 39 && !teclas[0] ) || ( n==37 && !teclas[1] ) ) ){
			switch(n){
				case 39:
					teclas[0] = true;
					salida = false;
				break;
				case 37:
					teclas[1] = true;
					salida = false;
				break;
			}
			if( !resize && !crecerM && !agachar && !salto ){
				if(teclas[0]&&!teclas[1]){ // si se mueve para la derecha
					if(delayxB != 2){
						actualizarMario("corriendo1");
						delayx = 3;
						velx = 0;
					}
					else{
						delayx = 6;
						actualizarMario("mario6");
					}
				}
				else if(teclas[1]&&!teclas[0]){ // si se mueve para la izquierda
					if(delayx != 1 && velx>4){
						actualizarMario("corriendo2");
						delayx = 4;
						velx = 0;
					}
					else{
						delayx = 5;
						actualizarMario("mario5");
					}
				}
				else if(teclas[1]&&teclas[0]){ // si se mueve para los dos lados
					switch(n){
						case 39:
							delayx = 2;
							salida = false;
						break;
						case 37:
							delayx = 1;
							salida = false;
						break;
					}
				}
			}
		}
		
		if( !resize && !crecerM && inicio ){
			if( n == 65 && correr == false ){
				salida = false;
				correr = true;
				get("scorriendo1_1").style.display = "none";
				get("scorriendo1_2").style.display = "inline";
				get("scorriendo2_1").style.display = "none";
				get("scorriendo2_2").style.display = "inline";
				get("gcorriendo1_1").style.display = "none";
				get("gcorriendo1_2").style.display = "inline";
				get("gcorriendo2_1").style.display = "none";
				get("gcorriendo2_2").style.display = "inline";
				get("corriendo1_1").style.display = "none";
				get("corriendo1_2").style.display = "inline";
				get("corriendo2_1").style.display = "none";
				get("corriendo2_2").style.display = "inline";
				if( !agachar ){
					if( teclas[0] == false && teclas[1] && ( delayx == 0 || delayx == 10 ) ){
						delayx = 8;
					}
					else if( teclas[0] && teclas[1] == false && ( delayx == 0 || delayx == 9 ) ){
						delayx = 7;
					}
					if( marioF == 3 ){
						get( "marioNormal" ).style.display = "none";
						get( "marioDisparo" ).style.display = "inline";
						
						var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? true : false;
						
						get( movx ? "smario9" : "smario10" ).style.display = "inline";
						get( movx ? "smario10" : "smario9" ).style.display = "none";
						
						setTimeout( function(){
							get( "marioNormal" ).style.display = "inline";
							get( "marioDisparo" ).style.display = "none";
						} , 200 );
						
						var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? true : false;
						
						new crearBicho( 8, posx / 32 + ( movx ? 1 : 0 ), posy / 32 + 1, 20, movx );
					}
				}
			}
			else if( n == 83 && salto == false && movy == null && saltoB == false ){
				salida = false;
				
				empezarS("sound1");
				var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? true : false;
				salto = true;
				saltoB = true;
				movy = true;
				vely = 15;
				saltoL = movx;
				delayx = 0;
				saltoVe = velx < velC ? velC - 2 : velCo - 3;
				if( !agachar ){
					actualizarMario( /mario6/.test(mario) ? "mario3" : ( /mario5/.test(mario) ? "mario4" : (movx ? "mario3" : "mario4") ) );
				}
			}
			else if( n == 40 ){
				salida = false;
				
				var tuboE = false;
				
				for( o = 0; o < tubos.length; o++ ){
					if( inicio ){
						if( posy + alto == tubos[o].top && ( posx > tubos[o].left && posx + largo < tubos[o].left + tubos[o].largo ) ){
							if( tubos[o].link && tubos[o].tipo != 2 ){
								tuboE = true;
								inicio = false;
								salto = true;
								
								get( "mario" ).style.overflow = "hidden";
								get( "mario" ).style.height = setY( alto ) + "px";
								get( "mario" ).style.width = setX( largo ) + "px";
								
								var link = tubos[o].link;
								
								new efecto({
									obj : get( "mario" ),
									prop : "style.top",
									valor : "$1px",
									$1 : [ setY( posy ), setY( posy + alto ), setY( 2 ) ]
								});
								new efecto({
									obj : get( "mario" ),
									prop : "style.height",
									valor : "$1px",
									$1 : [ setY( alto ), 0, setY( 2 ) ],
									onFinish : function(){
										get( "mario" ).style.overflow = "";
										get( "mario" ).style.height = "";
										get( "mario" ).style.width = "";
										get( "mario" ).style.top = setY( posy ) + "px";
										salto = false;
										cargarTunel( link );
									}
								});
							}
						}
					}
				}
				
				if( marioF > 1 && movy == null && !agachar ){
					if( !tuboE ){
						agachar = true;
						var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? true : false;
						delayx = movx ? 1 : 2;
						actualizarMario( movx ? "mario7" : "mario8" );
						alto = 32;
						posy += 32;
						get("mario").style.top = setY( posy - ( marioGY != false ? marioGY[1] - marioGY[0] : 0 ) ) + "px";
					}
				}
				
			}
		}
	}
	
	return salida;
}

function keyUp(n){ // al soltar una tecla
	if( n == 17 || n == 32 ){
		ctr = false;
	}
	switch( n ){
		case 39:
			teclas[0] = false;
		break;
		case 37:
			teclas[1] = false;
		break;
		case 65:
			correr = false;
			get("scorriendo1_2").style.display = "none";
			get("scorriendo1_1").style.display = "inline";
			get("scorriendo2_2").style.display = "none";
			get("scorriendo2_1").style.display = "inline";
			get("gcorriendo1_2").style.display = "none";
			get("gcorriendo1_1").style.display = "inline";
			get("gcorriendo2_2").style.display = "none";
			get("gcorriendo2_1").style.display = "inline";
			get("corriendo1_2").style.display = "none";
			get("corriendo1_1").style.display = "inline";
			get("corriendo2_2").style.display = "none";
			get("corriendo2_1").style.display = "inline";
			if(teclas[0]==false&&teclas[1]&&(delayx==0||delayx==8)){
				delayx = 10;
			}
			else if(teclas[0]&&teclas[1]==false&&(delayx==0||delayx==7)){
				delayx = 9;
			}
		break;
		case 83:
			saltoB = false;
		break;
		case 40:
			if( marioF > 1 && ( ( movy == null && agachar ) || agachar ) && !crecerM ){
				agachar = false;
				if( marioGY ){
					posy -= 32;
				}
				marioGY = [32, 64]; // el alto de mario tiene que agrandarse a 64 px
				get("mario").style.top = setY( posy - ( marioGY != false ? marioGY[1] - marioGY[0] : 0 ) ) + "px";
				var movx = Number( mario.charAt( mario.length - 1 ) ) % 2 ? true : false;
				actualizarMario( movy == null ? ( movx ? "mario1" : "mario2" ) : ( movx ? "mario3" : "mario4" ) );
				if( teclas[0] || teclas[1] ){
					if( movy == null ){
						if( teclas[0] && !teclas[1] ){ // si se mueve para la derecha
							if( movx ){
								actualizarMario("corriendo1");
								if( velx < correr ? velCo : velC ){
									delayx = 3;
								}
							}
							else{
								actualizarMario("mario6");
								delayx = 6;
							}
						}
						else if( teclas[1] && teclas[0] == false ){ // si se mueve para la izquierda
							if( movx ){
								actualizarMario("mario5");
								delayx = 5;
							}
							else{
								actualizarMario("corriendo2");
								if( velx < correr ? velCo : velC ){
									delayx = 4;
								}
							}
						}
						else if( teclas[1] && teclas[0] ){ // si se mueve para los dos lados
							if( movx ){
								actualizarMario("corriendo1");
								delayx = 1;
							}
							else{
								actualizarMario("corriendo2");
								delayx = 2;
							}
						}
						else{ // si no se mueve
							if( movx ){
								actualizarMario("corriendo1");
								delayx = 1;
							}
							else{
								actualizarMario("corriendo2");
								delayx = 2;
							}
						}
					}
					else{
						actualizarMario( movx ? "mario3" : "mario4" );
					}
				}
			}
		break;
	}
	if( !resize && !crecerM && !agachar && !salto ){
		if(n==39||n==37){
			var delayxB = delayx;
			delayx = 0;
			if(teclas[0]&&!teclas[1]){ // si se mueve para la derecha
				if(delayxB != 2 && velx>4){
					actualizarMario("corriendo1");
					delayx = 3;
					velx = 0;
				}
				else{
					delayx = 6;
					actualizarMario("mario6");
				}
			}
			else if(teclas[1]&&teclas[0]==false){ // si se mueve para la izquierda
				if(delayxB != 1 && velx>4){
					actualizarMario("corriendo2");
					delayx = 4;
					velx = 0;
				}
				else{
					delayx = 5;
					actualizarMario("mario5");
				}
			}
			else{ // si no se mueve
				switch(n){
					case 39:
						delayx = 1;
						if(delayxB == 6){
							delayx=2;
						}
					break;
					case 37:
						delayx = 2;
						if(delayxB==5){
							delayx=1;
						}
					break;
				}
			}
		}
	}
}
function movxDerecha(){ // mueve mario para la derecha
	var pared = false;
	for(v=0;v<tablaParedes.length;v++){
		if(posy + alto > tablaParedes[v].top && posy < tablaParedes[v].top + tablaParedes[v].height){
			if(posx + largo + velx > tablaParedes[v].left && posx + largo < tablaParedes[v].left + 10){
				if(tablaParedes[v].cons != 0 && tablaParedes[v].cons != 2){
					pared = tablaParedes[v].left;
				}
			}
		}
	}
	if(!pared){
		posx += velx;
	}
	else{
		posx = pared - largo;
		velx = 0;
	}
	
	for( o = 0; o < tubos.length; o++ ){
		if( posx + largo == tubos[o].left && ( posy >= tubos[o].top && posy + alto <= tubos[o].top + tubos[o].alto ) ){
			if( tubos[o].link && tubos[o].tipo == 2 ){
				if( agachar ){
					keyUp( 40 );
				}
				inicio = false;
				salto = true;
				get( "mario" ).style.overflow = "hidden";
				get( "mario" ).style.height = setY( alto ) + "px";
				get( "mario" ).style.width = setX( largo ) + "px";
				
				var link = tubos[o].link;
				
				new efecto({
					obj : get( "mario" ),
					prop : "style.left",
					valor : "$1px",
					$1 : [ setX( posx - scroll ), setX( posx + largo - scroll ), setX( 2 ) ]
				});
				new efecto({
					obj : get( "mario" ),
					prop : "style.width",
					valor : "$1px",
					$1 : [ setX( largo ), 0, setX( 2 ) ],
					onFinish : function(){
						get( "mario" ).style.overflow = "";
						get( "mario" ).style.height = "";
						get( "mario" ).style.width = "";
						get( "mario" ).style.left = setX( posx - scroll ) + "px";
						salto = false;
						
						cargarTunel( link );
					}
				});
			}
		}
	}
}
function movxIzquierda(){ // mueve mario para la izquierda
	var pared = false;
	for(v=0;v<tablaParedes.length;v++){
		if(posy + alto > tablaParedes[v].top && posy < tablaParedes[v].top + tablaParedes[v].height){
			if(posx - velx < tablaParedes[v].left && posx > tablaParedes[v].left - 10){
				if(tablaParedes[v].cons != 0 && tablaParedes[v].cons != 1){
					pared = tablaParedes[v].left;
				}
			}
		}
	}
	if(!pared){
		posx -= velx;
	}
	else{
		posx = pared;
		velx = 0;
	}
}
function autoMovM(){
	switch( autoMov ){
		case 1:
			bandera.imgTop += 5;
			if( bandera.imgTop > 272 ){
				bandera.imgTop = 272;
			}
			bandera.img.style.top = setY( bandera.top + bandera.imgTop ) + "px";
			bandera.puntosD.style.top = setY( bandera.top + 304 - bandera.imgTop - 12  ) + "px";
			
			posy += 5;
			if( posy + alto > bandera.top + 304 ){
				
				if( mario.charAt( mario.length - 1 ) != "3" ){
					actualizarMario( "mario13" );
				}
				
				posy = bandera.top + 304 - alto;
				
				if( bandera.imgTop > 240 ){
					
					actualizarMario( "mario12" );
					posx = bandera.left - 2;
					
					if( bandera.imgTop == 272 ){
						autoMov = 2;
						posx += 4;
						actualizarMario( "corriendo1" );
						if( correr ){
							keyUp( 65 );
						}
					}
					
				}
			}
		break;
		case 2: case 3:
			posx += 4;
			autoMov++;
		break;
		case 4:
			posx += 4;
			autoMov++;
			actualizarMario( "mario3" );
		break;
		case 5: case 6: case 7: case 8:
			posx += 4;
			posy += autoMov;
			autoMov++;
		break;
		case 9:
			posx += 4;
			posy += 5;
			autoMov++;
			actualizarMario( "corriendo1" );
			autoMovR = 125;
		break;
		case 10:
			posx += 4;
			autoMovR -= 4;
			if( autoMovR <= 0 ){
				posx += autoMovR;
				autoMovR = 0;
				autoMov++;
				get( "mario" ).style.overflow = "hidden";
				get( "mario" ).style.height = setY( alto ) + "px";
				get( "mario" ).style.width = setX( largo ) + "px";
				autoMovD = [largo, alto];
			}
			
		break;
		case 11:
			autoMovD[0] -= 4;
			posx += 4;
			if( autoMovD[0] <= 0 ){
				posx += autoMovD[0];
				autoMovD = [0, 0];
				
				get( "mario" ).style.display = "none";
				get( "mario" ).style.overflow = "";
				get( "mario" ).style.height = "";
				get( "mario" ).style.width = "";
				
				if( autoMovE == "mapChange" ){
					
					autoMov = 12;
					
				}
				else if( autoMovE == "tunel" ){
					linkM = tubos[0].link;
					cargarTunel( tubos[0].link );
				}
				
				autoMovE = false;
				
			}
			get( "mario" ).style.width = setX( autoMovD[0] ) + "px";
		break;
		case 12:
			tiempoR -= 1;
			puntos += 50;
			if( tiempoR > 0 ){
			//	if( parseInt( Math.ceil( tiempoR ) / 5 ) == Math.ceil( tiempoR ) / 5 ){
					escribirTxt( 7 );
					escribirTxt( 2 );
			//	}
			}
			else{
				tiempoR = 0;
				escribirTxt( 7 );
				escribirTxt( 2 );
				autoMov = false;
				cargarNMapa();
			}
		break;
	}
	
	get( "mario" ).style.top = setY( posy ) + "px";
	get( "mario" ).style.left = setX( posx - scroll ) + "px";
	if( autoMovE != "tunel" ){
		actualizarScroll( posx - 230 - 32 );
	}
}
function actualizarBarras(){
	for( b = 0; b < barras.length; b++ ){
		if( !barras[b].inicio ){
			
			
			barras[b].tiempo--;
			if( barras[b].tiempo < 0 ){
				barras[b].tiempo = 70;
				var barra = {
					top : !barras[b].movy ? 450 : -16,
					left : barras[b].left,
					img : elemento( "img", {
						src : "imgs/cuadraditos/barra.gif",
						style : {
							position : "absolute",
							width : setX( 96 ) + "px",
							height : setY( 16 ) + "px",
							left : setX( barras[b].left ) + "px",
							top : setY( !barras[b].movy ? 450 : -16 ) + "px",
							zIndex : "1"
						}
					}, get( "cubosDiv" ) ),
					fin : false,
					piso1 : {
						left : barras[b].left,
						top : !barras[b].movy ? 450 : -16,
						width : 96,
						cons : 3
					},
					piso2 : {
						left : barras[b].left,
						top : !barras[b].movy ? 466 : 0,
						width : 96,
						cons : 3
					},
					pared1 : {
						left : barras[b].left,
						top : !barras[b].movy ? 466 : 0,
						height : 16,
						cons : 3
					},
					pared2 : {
						left : barras[b].left + 96,
						top : !barras[b].movy ? 466 : 0,
						height : 16,
						cons : 3
					}
				}
				tablaPisos.push( barra.piso1 );
				tablaPisos.push( barra.piso2 );
				tablaParedes.push( barra.pared1 );
				tablaParedes.push( barra.pared2 );
				barras[b].barras.push( barra );
			}
		}
		
		
		for( u = 0; u < barras[b].barras.length; u++ ){
			if( !barras[b].barras[u].img.fin ){
				
				barras[b].barras[u].top += !barras[b].movy ? -3 : 3;
				barras[b].barras[u].piso1.top += !barras[b].movy ? -3 : 3;
				barras[b].barras[u].piso2.top += !barras[b].movy ? -3 : 3;
				barras[b].barras[u].pared1.top += !barras[b].movy ? -3 : 3;
				barras[b].barras[u].pared2.top += !barras[b].movy ? -3 : 3;
				
				if( tablaPisos[piso] === barras[b].barras[u].piso1 && movy === null ){
					posy = barras[b].barras[u].piso1.top - alto;
				}
				
				barras[b].barras[u].img.style.top = setY( barras[b].barras[u].top ) + "px";
				
				if( ( !barras[b].movy && barras[b].barras[u].top < -16 ) || ( barras[b].movy && barras[b].barras[u].top > 466 ) ){
					
					get( "cubosDiv" ).removeChild( barras[b].barras[u].img );
					barras[b].barras[u].piso1.cons = 0;
					barras[b].barras[u].piso2.cons = 0;
					barras[b].barras[u].pared1.cons = 0;
					barras[b].barras[u].pared2.cons = 0;
					barras[b].barras[u].img.fin = true;
				}
			}
		}
		
	}
}