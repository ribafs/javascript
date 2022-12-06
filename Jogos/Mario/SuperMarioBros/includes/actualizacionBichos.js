
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion actualiza la posicion de los bichos y hace lo necesario en de caso que toquen a mario.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function actualizarBichos(){
	var eliminar = new Array(); // los bichos a eliminar
	for(i = 0; i < bichos.length; i++){ // por cada bicho
		if( !bichos[i].inicio ){ // si se esta moviendo
			
			posxBack = bichos[i].posx; // se hace un backup de la posicion x del bicho
			posyBack = bichos[i].posy; // se hace un backup de la posicion y del bicho
			if(bichos[i].movx == true){ // si el hongo se mueve para la derecha
				var pared = movxBichoDerecha(bichos[i].posx, bichos[i].posy, bichos[i].velx, bichos[i].alto, bichos[i].largo);
				// comprueva si el hongo choca alguna pared
				if(pared == false){ // si no choco
					bichos[i].posx += bichos[i].velx; // se actualiza la posicion
				}
				else{ // sino
					bichos[i].movx = false; // el hongo se mueve para la izquierda
					bichos[i].posx = pared - bichos[i].largo;
					
					if( bichos[i].tipo == 5 ){
						if( bichos[i].forma == 2 ){
							bichos[i].forma = 1;
							bichos[i].obj.scrollTop = 0;
						}
					}
					
					if( bichos[i].tipo == 8 ){
						eliminar.push( i );
						explocion( bichos[i].posx - 8, bichos[i].posy - 8 );
					}
					
				}
			}
			
			else if(bichos[i].movx == false){ // si se mueve para la izquierda
				var pared = movxBichoIzquierda(bichos[i].posx, bichos[i].posy, bichos[i].velx, bichos[i].alto,bichos[i].largo);
				// comprueva si el hongo choca alguna pared
				if(pared == false){ // si no choco
					bichos[i].posx -= bichos[i].velx; // se actualiza la posicion
				}
				else{ // sino
					bichos[i].movx = true; // el hongo se mueve para la derecha
					bichos[i].posx = pared;
					
					if( bichos[i].tipo == 5 ){
						if( bichos[i].forma == 1 ){
							bichos[i].forma = 2;
							bichos[i].obj.scrollTop = setY( 48 );
						}
					}
					if( bichos[i].tipo == 8 ){
						eliminar.push( i );
						explocion( bichos[i].posx - 8, bichos[i].posy - 8 );
					}
				}
			}
			//-----------------
			if( bichos[i].movy == false ){ // si el bicho esta callendo
				if( bichos[i].tipo != 9 ){
					if(bichos[i].vely < 10 * (bichos[i].peso + 1)){ // si no llego a la velocidad maxima de caida
						bichos[i].vely += bichos[i].peso + 1; // la velocida aumenta
					}
					
					bichos[i].posy += bichos[i].vely; // se baja la posicion y de hongo
					
					if(bichos[i].posy > 457){
						eliminar.push(i);
					}
					
					var piso = movyBichoFalse(bichos[i].posx, bichos[i].posy, bichos[i].vely, bichos[i].alto,bichos[i].largo);
					// comprueva si el bicho toca un piso
					if(piso != false){
						bichos[i].piso = piso[0]; // el piso del hongo es el primer item
						bichos[i].posy = piso[1] - bichos[i].alto; // la posicion y es el segundo item
						bichos[i].vely = 0; // la velocidad y es 0
						bichos[i].movy = null; // el movimiento y es nullo
						
						if( bichos[i].tipo == 7 ){
							bichos[i].movy = true;
							bichos[i].vely = 9;
						}
						else if( bichos[i].tipo == 8 ){
							bichos[i].movy = true;
							bichos[i].vely = 7;
						}
					}
				}
				else{
					if( bichos[i].espera == false ){
						bichos[i].alto -= 2;
						bichos[i].posy += 2;
						if( bichos[i].alto <= 0 ){
							bichos[i].posy -= bichos[i].alto;
							bichos[i].alto = 0;
							bichos[i].espera = 80;
						}
						bichos[i].obj.style.top = setY( bichos[i].posy ) + "px";
						bichos[i].obj.style.height = setY( bichos[i].alto ) + "px";
					}
					else{
						bichos[i].espera -= 1;
						if( bichos[i].espera < 5 ){
							bichos[i].movy = true;
							bichos[i].espera = false;
						}
					}
				}
			}
			else if( bichos[i].movy == true ){
				if( bichos[i].tipo != 9 ){
					var saltoPD = ( 205 - ( bichos[i].peso + 1 ) * 100 ) / 100;
					
					bichos[i].vely -= saltoPD;
					bichos[i].posy -= bichos[i].vely;
					
					for(x = 0; x < tablaPisos.length; x++){ // comprueva si el bicho choca la cabeza
						if( !( bichos[i].posx + bichos[i].largo < tablaPisos[x].left + 1 
						|| bichos[i].posx > tablaPisos[x].left + tablaPisos[x].width - 1) ){
							if( bichos[i].posy - bichos[i].vely < tablaPisos[x].top 
							&& bichos[i].posy - bichos[i].vely > tablaPisos[x].top - bichos[i].vely - 20 ){
								if( tablaPisos[x].cons != 0 && tablaPisos[x].cons != 2 ){ 
								// si la consistencia permite que mario choque la cabeza
									bichos[i].movy = false;
									bichos[i].vely = 5;
									bichos[i].posy = tablaPisos[x].top;
								}
							}
						}
					}
					
					if( bichos[i].vely < 1 ){
						bichos[i].movy = false;
					}
				}
				else{
					if( bichos[i].espera == false ){
						bichos[i].alto += 2;
						bichos[i].posy -= 2;
						if( bichos[i].alto >= 44 ){
							bichos[i].posy -= 44 - bichos[i].alto;
							bichos[i].alto = 44;
							
							bichos[i].espera = 40;
						}
						bichos[i].obj.style.top = setY( bichos[i].posy ) + "px";
						bichos[i].obj.style.height = setY( bichos[i].alto ) + "px";
					}
					else{
						bichos[i].espera -= 1;
						if( bichos[i].espera < 5 ){
							bichos[i].movy = false;
							bichos[i].espera = false;
						}
					}
				}
			}
			else if(bichos[i].movy == null){ // si el bicho no esta callendo
				var caida = caidaBicho(bichos[i].posx, bichos[i].posy, bichos[i].alto, bichos[i].largo, bichos[i].piso);
				// comprueva si el hongo se cae de donde esta parado
				if(caida){ // si se cae
					bichos[i].vely = 3; // la velocidad y es 2
					bichos[i].movy = false; // el hongo se mueve para abajo
				}
			}
			
			var choque = comprBichoHit(bichos[i].posx, bichos[i].posy, bichos[i].alto, bichos[i].largo );
			
			if( choque ){
				
				if( !estrella && ( transparente && ( ( bichos[i].tipo == 4 || bichos[i].tipo == 5 ) && choque == 2 ) ) ){
					choque = false;
				}
				else if( !estrella && ( transparente && ( bichos[i].tipo == 9 ) ) ){
					choque = false;
				}
				
			}
			
			// comprueva si el bicho toca a mario 
			if( choque != false ){ // si lo toca
				switch(bichos[i].tipo){ // depende del tipo
					case 1: // si es un hongo que hace crecer a mario
						agrandarMario(); // mario crece
						var bicho = bichos[i];
						setTimeout( function(){
							sumarPuntos( bicho.puntos, setX(posx - 33), setY(posy - 32) );
						}, 0);
						eliminar.push(i); // se elimina el bicho
					break;
					case 2: // si es un hongo de vida
						vidas++;
						setTimeout(function(){
							sumarPuntos('1UP', setX(posx - 33), setY(posy - 32), true);
						},0);
						eliminar.push(i); // se elimina el bicho
						empezarS("sound2");
					break;
					case 3: // si es un hongo que mata
						muerte( 1 );
						if( marioF > 1 ){
							eliminar.push(i); // se elimina el bicho
						}
					break;
					case 4: // si es un bicho comun
						if( !estrella ){
							if( choque == 1 ){
								salto = true;
								vely = 10;
								posy -= vely;
								movy = true;
								var bicho = bichos[i];
								setTimeout(function(){
									sumarPuntos( bicho.puntos, setX(posx - 33), setY(posy - 32) );
								},0);
								eliminar.push(i); // se elimina el bicho
								
								var bichoAplastado = elemento( "img", {
									src : !tunel ? "imgs/bichos/bichoAplastado.gif" : "imgs/bichosTunel/bichoAplastado.gif",
									style : {
										position : "absolute",
										height : setY( 32 ) + "px",
										width : setX( 32 ) + "px",
										top : setY( bichos[i].posy + 2 ) + "px",
										left : setX( bichos[i].posx ) + "px"
									}
								}, get( "bichosDiv" ) );
								setTimeout( function(){
									if( bichoAplastado && bichoAplastado.parentNode ){
										bichoAplastado.parentNode.removeChild( bichoAplastado );
									}
								}, 700 );
							}
							else{
								muerte( 1 );
							}
						}
						else{
							bichoMuerte( 4, bichos[i].posx, bichos[i].posy );
							
							var bicho = bichos[i];
							setTimeout(function(){
								sumarPuntos( bicho.puntos, setX(posx - 33), setY(posy - 32) );
							},0);
							eliminar.push( i );
						}
					break;
					case 5: // si es una tortuga
						if( !estrella ){
							function hit(){
								salto = true;
								vely = 10;
								posy -= vely;
								movy = true;
								var puntos = bichos[i].puntos;
								setTimeout(function(){
									sumarPuntos( puntos, setX(posx - 33), setY(posy - 32) );
								},0);
								
								bichos[i].puntos += bichos[i].puntosAdd;
							}
							if( bichos[i].forma != 3 ){
								if( choque == 1 ){
									hit();
									bichos[i].velx = 0;
									bichos[i].obj.scrollTop = setY( 128 );
									bichos[i].forma = 3;
									
								}
								else{
									muerte( 1 );
								}
							}
							else{
								if( !bichos[i].velx ){
									
									if( choque == 1 ){
										hit();
									}
									
									bichos[i].velx = 10;
									bichos[i].movx = ( posx + ( largo / 2 ) ) < ( bichos[i].posx + ( bichos[i].largo / 2 ) );
								}
								else{
									if( choque == 1 ){
										hit();
										bichos[i].velx = 0;
									}
									else{
										muerte( 1 );
									}
								}
							}
						}
						else{
							bichoMuerte( 5, bichos[i].posx, bichos[i].posy, bichos[i].tortugaT );
							
							var bicho = bichos[i];
							setTimeout(function(){
								sumarPuntos( bicho.puntos, setX(posx - 33), setY(posy - 32) );
							},0);
							eliminar.push( i );
						}
					break;
					case 6: // si es una flor
						agrandarMario(); // mario crece
						var bicho = bichos[i];
						setTimeout(function(){
							sumarPuntos( bicho.puntos, setX(posx - 33), setY(posy - 32) );
						}, 0);
						eliminar.push(i); // se elimina el bicho
					break;
					case 7:
						var bicho = bichos[i];
						setTimeout( function(){
							sumarPuntos( bicho.puntos, setX(posx - 33), setY(posy - 32) );
						}, 0);
						estrellaM();
						eliminar.push(i); // se elimina el bicho
					break;
					case 9:
						muerte( 1 );
					break;
				}
			}
			
			if( bichos[i].tipo == 4 || bichos[i].tipo == 5 || bichos[i].tipo == 8 ){
				var choqueBichos = comprBichoHitBicho(bichos[i].posx, bichos[i].posy, bichos[i].alto, bichos[i].largo, i);
				if( choqueBichos.length ){
					for( s = 0; s < choqueBichos.length; s++ ){
						eliminar.push( choqueBichos[s].n );
						
						if( bichos[choqueBichos[s].n].tipo != 8 ){
							bichoMuerte( bichos[choqueBichos[s].n].tipo,
							bichos[choqueBichos[s].n].posx, bichos[choqueBichos[s].n].posy, bichos[choqueBichos[s].n].tortugaT );
							
							var puntos = choqueBichos[s].puntos;
							var x = setX( bichos[choqueBichos[s].n].posx - 32 );
							var y = setY( bichos[choqueBichos[s].n].posy - 32 );
							
							setTimeout( function(){
								sumarPuntos( puntos, x, y );
							}, 0);
						}
						
					}
				}
			}
			
			if(bichos[i].posx != posxBack){
				bichos[i].obj.style.left = setX(bichos[i].posx) + "px";
			}
			if(bichos[i].posy != posyBack){
				bichos[i].obj.style.top = setY(bichos[i].posy) + "px";
			}
		}
	}
	
	for( h in bichos ){
		bichos[h].choqueB = bichos[h].tipo != 4 && bichos[h].tipo != 5 && bichos[h].tipo == 8;
	}
	
	eliminar = eliminar.sort().reverse();
	var eliminarN = new Array();
	
	for( r = 0; r < eliminar.length; r++ ){
		if( !eliminarN.lenght ){
			eliminarN.push( eliminar[r] );
		}
		else{
			if( eliminarN[eliminarN.lenght - 1] != eliminar[r] ){
				eliminarN.push( eliminar[r] );
			}
		}
	}
	
	for( r = 0; r < eliminarN.length; r++ ){
		eliminarBicho( eliminarN[r] );
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion comprueva si un bicho que se mueve para la derecha toca una pared.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function movxBichoDerecha(posx,posy,velx,alto,largo){
	var pared = false;
	for(v = 0; v < tablaParedes.length; v++){ // por cada pared
		if(posy + alto > tablaParedes[v].top && posy < tablaParedes[v].top + tablaParedes[v].height){
			// si el bicho esta a la misma altura que la pared
			if(posx + largo + velx > tablaParedes[v].left && posx + largo < tablaParedes[v].left + 10){
				// y choca la pared
				if(tablaParedes[v].cons != 0 && tablaParedes[v].cons != 2){
					// y la pared tiene consistencia
					pared = tablaParedes[v].left; // se le asigna a pared la pared que choca
				}
			}
		}
	}
	if(!pared){ // si no hay pared
		return false; // devuelve falso
	}
	else{ // sino
		return pared; // devuelve la pared
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion comprueva si un bicho que se mueve para la izquierda toca una pared.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function movxBichoIzquierda(posx,posy,velx,alto,largo){
	var pared = false;
	for(v = 0; v < tablaParedes.length; v++){ // por cada pared
		if(posy + alto > tablaParedes[v].top && posy < tablaParedes[v].top + tablaParedes[v].height){
			// si el bicho esta a la misma altura que la pared
			if(posx - velx < tablaParedes[v].left && posx > tablaParedes[v].left - 10){
				// y choca la pared
				if(tablaParedes[v].cons != 0 && tablaParedes[v].cons != 1){
					// y la pared tiene consistencia
					pared = tablaParedes[v].left; // se le asigna a pared la pared que choca
				}
			}
		}
	}
	if(!pared){ // si no hay pared
		return false; // devuelve falso
	}
	else{ // sino
		return pared; // devuelve la pared
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion comprueva si un bicho que esta callendo toca el piso.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function movyBichoFalse(posx,posy,vely,alto,largo){
	var bichoPiso = [false,false];
	for(s = 0; s < tablaPisos.length; s++){ // por cada piso
		if(!(posx + largo - 1 < tablaPisos[s].left + 1 || posx + 1 > tablaPisos[s].left + tablaPisos[s].width - 1)){
			// si el bicho esta el la misma posicion x que el piso
			if(posy + alto + vely > tablaPisos[s].top && posy + alto + vely < tablaPisos[s].top + vely + 10){
				// y si toca el piso
				if(tablaPisos[s].cons != 0 && tablaPisos[s].cons != 1){
					// y el piso tiene consistencia
					bichoPiso[0] = s; // el piso es igual al numero de piso
					bichoPiso[1] = tablaPisos[s].top;
				}
			}
		}
	}
	if(bichoPiso[0]==false){ // si no toco el piso
		return false;
	}
	else{
		return bichoPiso;
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion comprueva si un bicho se cae de donde esta parado.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function caidaBicho(posx, posy, alto, largo, piso){
	var bichoCaida = false;
	if(
	   posx + largo < tablaPisos[piso].left || // si se cae por la izquierda
	   posx > tablaPisos[piso].left + tablaPisos[piso].width || // o si se cae por la derecha
	   posy + alto < tablaPisos[piso].top || // o esta mas alto que el piso
	   posy + alto > tablaPisos[piso].top // o esta mas bajo que el piso
	   ){
		var bichoCaida = true;
	}
	return bichoCaida;
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion elimina a un bicho.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function eliminarBicho(n){
	if( bichos[n] ){ // si existe el bicho
		var imagen = bichos[n].imagen; // la imagen del bicho
		var obj = bichos[n].obj; // el objeto del bicho
		obj.removeChild(imagen); // se remueve la imagen
		obj.parentNode.removeChild(obj); // se remueve el objeto
		bichos = filtrar(bichos,n); // se saca el item del array
		bichosS++; // se saco un bicho mas
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion comprueva si un bicho toca a mario.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function comprBichoHit(Bposx,Bposy,Balto,Blargo,Bmovy,Bvely){
	var bichoChoque = false;
	if(posx + largo > Bposx && posx < Bposx + Blargo){
		// si estan el la misma posicion x
		if(posy + alto > Bposy && posy < Bposy + Balto){
			// si estan el la misma posicion y
			if( movy == false ){ // si mario esta callendo
				bichoChoque = 1; // toca por arriba al bicho
			}
			else{ // sino
				bichoChoque = 2; // el bicho toca a mario
			}
		}
	}
	return bichoChoque;	
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion comprueva si un bicho toca a otro bicho.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function comprBichoHitBicho(Bposx,Bposy,Balto,Blargo,t){
	
	var eliminarBichos = new Array();
	
	for( h in bichos ){
		if( h != t ){
			if( ( bichos[h].tipo == 4 || bichos[i].tipo == 5 || bichos[i].tipo == 8 ) && bichos[h].choqueB == false ){
				if(bichos[h].posx + bichos[h].largo > Bposx && bichos[h].posx < Bposx + Blargo){
					// si estan el la misma posicion x
					bichos[h].choqueB = true;
					bichos[t].choqueB = true;
					if(bichos[h].posy + bichos[h].alto > Bposy && bichos[h].posy < Bposy + Balto){
						if( bichos[t].tipo == 5 && bichos[t].forma == 3 && bichos[t].velx ){
								eliminarBichos.push( { n : h, puntos : bichos[t].puntos } );
								bichos[t].puntos += bichos[t].puntosAdd;
						}
						else if( bichos[t].tipo == 8 ){
							if( bichos[h].tipo == 4 || bichos[h].tipo == 5 ){
								eliminarBichos.push( { n : h, puntos : bichos[h].puntos } );
								eliminarBichos.push( { n : t, puntos : 0 } );
								explocion( bichos[h].posx - 8, bichos[h].posy - 8 );
							}
						}
						else{
							function tortuga( bicho ){
								if( bicho.tipo == 5 && bicho.velx ){
									bicho.forma = bicho.forma == 1 ? 2 : 1;
									bicho.obj.scrollTop = setY( bicho.forma == 1 ? 0 : 48 );
								}
							}
							
							if( bichos[h].movx != bichos[t].movx ){
								bichos[h].movx = !bichos[h].movx;
								bichos[t].movx = !bichos[t].movx;
								tortuga( bichos[h] );
								tortuga( bichos[t] );
							}
							else{
								if( bichos[h].velx > bichos[t].velx ){
									bichos[h].movx = !bichos[h].movx;
									tortuga( bichos[h] );
								}
								else if( bichos[h].velx < bichos[t].velx ){
									bichos[t].movx = !bichos[t].movx;
									tortuga( bichos[t] );
								}
							}
							
							if( bichos[h].tipo == 5 && !bichos[h].velx ){
								bichos[h].velx = 10;
							}
						}
					}
				}
			}
		}
	}
	
	return eliminarBichos;
}