//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion redimenciona el largo del juego.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function actualizarX(){
	get("mario").style.width = setX(32) + "px";
	get("mario").style.left = setX( posx - scroll ) + "px";
	
	get("sombra").style.width = setX(580) + "px";
	get("sombra").style.marginLeft = "-" + setX(580 / 2) + "px";
	
	get("juego").style.width = setX(510) + "px";
	get("juego").style.left = "-" + (setX(510) / 2) + "px";
	get("interfaz").style.width = setX(510) + "px";
	get("interfaz").style.left = "-" + (setX(510) / 2) + "px";
	get("resize").style.width = setX(510) + "px";
	get("resize").style.left = "-" + (setX(510) / 2) + "px";
	get("resizeB").style.width = setX(510) + "px";
	get("resizeB").style.left = "-" + (setX(510) / 2) + "px";
	get("inicio").style.width = setX(510) + "px";
	get("inicio").style.left = "-" + (setX(510) / 2) + "px";
	get("menu").style.width = setX(510) + "px";
	get("menu").style.left = "-" + (setX(510) / 2) + "px";
	get("gameOver").style.width = setX(510) + "px";
	get("gameOver").style.left = "-" + (setX(510) / 2) + "px";
	get("marioTxt").style.left = setX(50) + "px";
	get("puntosTxt").style.left = setX(50) + "px";
	get("monedasTxt").style.left = setX(180) + "px";
	get("mundoTxt").style.left = setX(288) + "px";
	get("mundoNTxt").style.left = setX(288) + "px";
	get("mundoNTxt").style.width = setX(80) + "px";
	get("tiempoTxt").style.left = setX(300) + "px";
	get("tiempoTxt").style.width = setX(160) + "px";
	get("tiempoNTxt").style.left = setX(300) + "px";
	get("tiempoNTxt").style.width = setX(160) + "px";
	get( "jugar" ).style.left = setX( 175 ) + "px";
	get( "jugar" ).style.width = setX( 220 ) + "px";
	get( "jugarInstrucciones" ).style.left = setX( 175 ) + "px";
	get( "jugarInstrucciones" ).style.width = setX( 220 ) + "px";
	get( "cargarMapa" ).style.left = setX( 175 ) + "px";
	get( "cargarMapa" ).style.width = setX( 220 ) + "px";
	get( "crearMapa" ).style.left = setX( 175 ) + "px";
	get( "crearMapa" ).style.width = setX( 220 ) + "px";
	get( "puntosTop" ).style.left = setX( 175 ) + "px";
	get( "puntosTop" ).style.width = setX( 220 ) + "px";
	get( "hongoSeleccionar" ).style.left = setX( 145 ) + "px";
	get( "hongoSeleccionar" ).style.width = setX( 16 ) + "px";
	
	if( !tunel ){
		get("mapax").style.left = setX(mapax * 32 + 1000) + "px";
	}
	else{
		get("mapax").style.left = setX(tunelx * 32 + 1000) + "px";
	}
	
	if( bandera ){
		bandera.img.style.left = setX( bandera.left - 32 ) + "px";
		bandera.img.style.width = setX( 32 ) + "px";
		if( bandera.puntosD ){
			bandera.puntosD.style.left = setX( bandera.left + 10 ) + "px";
			bandera.puntosD.style.width = setX( 100 ) + "px";
			bandera.puntosD.innerHTML = "";
			bandera.puntosD.appendChild( escribir( String( bandera.bPuntos ), 12 ) );
		}
	}
	
	for( u = 0; u < figuras.length; u++ ){
		figuras[u].img.style.left = setX( figuras[u].left ) + "px";
		figuras[u].img.style.width = setX( figurasSize[figuras[u].tipo - 1][0] ) + "px";
	}
	for( x = 0; x < tubos.length; x++ ){
		for( n = 0; n < tubos[x]["imgs"].length; n++ ){
			tubos[x]["imgs"][n].img.style.left = setX( tubos[x]["imgs"][n].left ) + "px";
			tubos[x]["imgs"][n].img.style.width = setX( 32 ) + "px";
		}
	}
	for(j = 0; j < marioImgs.length; j++){
		get(marioImgs[j]).style.width = setX(Number(get(marioImgs[j]).name.split("x")[0])) + "px";
	}
	for(k = 0; k < tablaMonedas.length; k++){
		tablaMonedas[k].imagen.style.left = setX(tablaMonedas[k].left) + "px";
		tablaMonedas[k].imagen.style.width = setX(32) + "px";
	}
	get("mario").style.left = setX(posx - scroll) + "px";
	
	for(f = 0; f < bichos.length; f++){
		bichos[f].obj.style.width = setX(bichos[f].largo) + "px";
		bichos[f].imagen.style.width = setX(bichos[f].largo) + "px";
		bichos[f].obj.style.left = setX(bichos[f].posx) + "px";
		
		if( bichos[f].tipo == 5 ){
			bichos[f].imagen2.style.width = setX(bichos[f].largo) + "px";
			bichos[f].imagen3.style.width = setX(bichos[f].largo) + "px";
		}
	}
	for(i in cubos){
		if(cubos[i].imagen){
			cubos[i].imagen.style.left = setX(cubos[i].left * 32) + "px";
			cubos[i].imagen.style.width = setX(32) + "px";
		}
		if(cubos[i].imagen1){
			cubos[i].imagen1.style.left = setX(cubos[i].left * 32) + "px";
			cubos[i].imagen1.style.width = setX(32) + "px";
		}
		if(cubos[i].imagen2){
			cubos[i].imagen2.style.left = setX(cubos[i].left * 32) + "px";
			cubos[i].imagen2.style.width = setX(32) + "px";
		}
	}
	for( a = 0; a < barras.length; a++ ){
		for( y = 0; y < barras[a].barras.length; y++ ){
			var $ = barras[a].barras[y];
			if( !$.fin ){
				$.img.style.left = setX( $.left ) + "px";
				$.img.style.top = setY( $.top ) + "px";
				$.img.style.width = setX( 96 ) + "px";
				$.img.style.height = setY( 16 ) + "px";
			}
		}
	}
	get("juego").scrollLeft = setX(scroll);
	escribirTxt();
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion redimenciona el alto del juego.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function actualizarY(){
	
	get("contenedor").style.top = ( setX(225) + 25 ) + "px";
	
	get("mario").style.height = setY(64) + "px";
	get("mario").style.top = setY( posy ) + "px";
	
	get("sombra").style.height = setY(519) + "px";
	get("sombra").style.marginTop = ( 25 - setY(35) ) + "px";
	
	get("about").style.paddingTop = ( setY(500) ) + "px";
	
	get("juego").style.height = setY(450) + "px";
	get("juego").style.top = "-" + (setY(450) / 2) + "px";
	get("interfaz").style.height = setY(450) + "px";
	get("interfaz").style.top = "-" + (setY(450) / 2) + "px";
	get("resize").style.height = setY(450) + "px";
	get("resize").style.top = "-" + (setY(450) / 2) + "px";
	get("resizeB").style.height = setY(450) + "px";
	get("resizeB").style.top = "-" + (setY(450) / 2) + "px";
	get("inicio").style.height = setY(450) + "px";
	get("inicio").style.top = "-" + (setY(450) / 2) + "px";
	get("menu").style.height = setY(450) + "px";
	get("menu").style.top = "-" + (setY(450) / 2) + "px";
	get("gameOver").style.height = setY(450) + "px";
	get("gameOver").style.top = "-" + (setY(450) / 2) + "px";
	get("mundoInicio").style.top = setY(150) + "px";
	get("vidas").style.top = setY(200) + "px";
	get("marioTxt").style.top = setY(16) + "px";
	get("puntosTxt").style.top = setY(32) + "px";
	get("monedasTxt").style.top = setY(32) + "px";
	get("mundoTxt").style.top = setY(16) + "px";
	get("mundoNTxt").style.top = setY(32) + "px";
	get("tiempoTxt").style.top = setY(16) + "px";
	get("tiempoNTxt").style.top = setY(32) + "px";
	get( "jugar" ).style.bottom = setY( 180 ) + "px";
	get( "jugarInstrucciones" ).style.bottom = setY( 235 ) + "px";
	get( "cargarMapa" ).style.bottom = setY( 145 ) + "px";
	get( "crearMapa" ).style.bottom = setY( 110 ) + "px";
	get( "puntosTop" ).style.bottom = setY( 60 ) + "px";
	get( "hongoSeleccionar" ).style.bottom = setY( menu[menuSeleccionado][1] ) + "px";
	get( "hongoSeleccionar" ).style.height = setY( 32 ) + "px";
	get( "gameOverTxt" ).style.bottom = setY( 195 ) + "px";
	
	get( "gmario7" ).style.marginTop = "-" + setY( 12 ) + "px";
	get( "gmario8" ).style.marginTop = "-" + setY( 12 ) + "px";
	
	get( "smario7" ).style.marginTop = "-" + setY( 12 ) + "px";
	get( "smario8" ).style.marginTop = "-" + setY( 12 ) + "px";
	
	get( "mario" ).style.marginTop = "-" + setY( 12 ) + "px";
	get( "mario" ).style.paddingTop = setY( 12 ) + "px";
	
	if( bandera ){
		bandera.img.style.top = setY( bandera.top + bandera.imgTop ) + "px";
		bandera.img.style.height = setY( 32 ) + "px";
		if( bandera.puntosD ){
			bandera.puntosD.style.top = setY( bandera.top + 304 - 12 - bandera.imgTop ) + "px";
			bandera.puntosD.style.height = setY( 12 ) + "px";
			bandera.puntosD.innerHTML = "";
			bandera.puntosD.appendChild( escribir( String( bandera.bPuntos ), 12 ) );
		}
	}
	
	for( u = 0; u < figuras.length; u++ ){
		figuras[u].img.style.top = setY( figuras[u].top ) + "px";
		figuras[u].img.style.height = setY( figurasSize[figuras[u].tipo - 1][1] ) + "px";
	}
	for( x = 0; x < tubos.length; x++ ){
		for( n = 0; n < tubos[x]["imgs"].length; n++ ){
			tubos[x]["imgs"][n].img.style.top = setY( tubos[x]["imgs"][n].top ) + "px";
			tubos[x]["imgs"][n].img.style.height = setY( 32 ) + "px";
		}
	}
	for(j = 0; j < marioImgs.length; j++){
		get(marioImgs[j]).style.height = setY(Number(get(marioImgs[j]).name.split("x")[1])) + "px";
	}
	for(k = 0; k < tablaMonedas.length; k++){
		tablaMonedas[k].imagen.style.top = setY(tablaMonedas[k].top) + "px";
		tablaMonedas[k].imagen.style.height = setY(32) + "px";
	}
	get("mario").style.top = setY(posy - (marioGY != false ? marioGY[1] - marioGY[0] : 0)) + "px";
	
	for(f = 0; f < bichos.length; f++){
		bichos[f].obj.style.height = setY(bichos[f].alto) + "px";
		bichos[f].imagen.style.height = setY(bichos[f].alto) + "px";
		bichos[f].obj.style.top = setY(bichos[f].posy) + "px";
		
		if( bichos[f].tipo == 5 ){
			bichos[f].obj.style.height = setY( 48 ) + "px";
			bichos[f].obj.style.marginTop = "-" + setY( 16 ) + "px";
			bichos[f].obj.style.height = setY( 48 ) + "px";
			bichos[f].imagen.style.height = setY( 48 ) + "px";
			bichos[f].imagen2.style.height = setY( 48 ) + "px";
			bichos[f].imagen3.style.height = setY( 48 ) + "px";
			bichos[f].obj.scrollTop = setY( bichos[f].forma == 1 ? 0 : ( bichos[f].forma == 2 ? 48 : 96 ) );
		}
		else if( bichos[f].tipo == 9 ){
			bichos[f].imagen.style.height = setY( 44 ) + "px";
		}
		
	}
	
	for(i in cubos){
		if(cubos[i].imagen){
			cubos[i].imagen.style.top = setY(cubos[i].top * 32 - 16) + "px";
			cubos[i].imagen.style.height = setY(32) + "px";
		}
		if(cubos[i].imagen1){
			cubos[i].imagen1.style.top = setY(cubos[i].top * 32 - 16) + "px";
			cubos[i].imagen1.style.height = setY(32) + "px";
		}
		if(cubos[i].imagen2){
			cubos[i].imagen2.style.top = setY(cubos[i].top * 32 - 16) + "px";
			cubos[i].imagen2.style.height = setY(32) + "px";
		}
	}	
	escribirTxt();
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion redimensiona el juego.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function redimensionJuego(n,e){
	ctr = false;
	
	var mX = 0;
	var mY = 0;
	
	if( document.layers ){
		mX = e.x;
		mY = e.y;
	}
	else if( document.all ){
		mX = event.clientX;
		mY = event.clientY;
	}
	else if( document.getElementById ){
		mX = e.clientX;
		mY = e.clientY;
	}
	
	mouseX = mX - (get("contenedor").offsetLeft + get("resize").offsetLeft); // la posicion x del mouse con respecto al juego
	mouseY = mY - (get("contenedor").offsetTop); // la posicion y del mouse con respecto al juego
	
	switch(n){ // depende de donde se corre la funcion que hay que hacer
		case 0: case 3: case 4: // si se empieza a arrastrar una barra
			if(n == 0){ // si se empieza a mover la barra de la derecha
				document.body.style.cursor = 'w-resize'; // el cursor es el de redimensionar
				_mouseX = mouseX - get("derecha").offsetLeft;
				// calcula la posicion del mouse con respecto a la barra de la derecha y se lo asigna a _mouseX
				resize = 1; // la forma de resizeado es 1
			}
			else if(n == 3){ // si se empieza a mover la barra de abajo
				document.body.style.cursor = 's-resize'; // el cursor es el de redimensionar
				_mouseY = mouseY - get("abajo").offsetTop;
				// calcula la posicion del mouse con respecto a la barra de abajo y se lo asigna a _mouseY
				resize = 2; // la forma de resizeado es 2
			}
			else{
				document.body.style.cursor = 'se-resize'; // el cursor es el de redimensionar
				_mouseY = mouseY - get("abajoDerecha").offsetTop;
				// calcula la posicion del mouse con respecto a la barra de abajo a la derecha y se lo asigna a _mouseX
				_mouseX = mouseX - get("abajoDerecha").offsetLeft;
				// calcula la posicion del mouse con respecto a la barra de abajo a la derecha y se lo asigna a _mouseY
				resize = 3; // la forma de resizeado es 3
			}
			
			fadeIn("resizeB",0.2,"resizeInfoFondo",0.3,"resizeInfo",0.5); // se hace fadeIn a los divs
			
			get("resizeInfoC").style.display = "inline"; // se muestra el div con la informacion del alto y el largo
			get("resizeInfo").innerHTML = "";
			get("resizeInfo").appendChild( escribir( String( Math.round( 510 * largoX ) ), 10, true) );// se escribe el largo del mapa
			get("resizeInfo").appendChild( escribir( "," + Math.round( 450 * altoX ), 10, true) ); // se escribe el alto del mapa
		break;
		
		//----------------------
		
		case 1: // si se esta arrastrando alguna barra
			if( resize == 1 || ( resize == 3 && (ctr || (mouseX - _mouseX) / 510 > (mouseY - _mouseY) / 450 ) ) ){
				// si se tiene que actualizar el largo
				largoX = (mouseX - _mouseX) / 510; // calcula el nuevo largo y se lo asigna a largoX
				largoX = largoX > 0.95 && largoX < 1.05 ? 1 : largoX;// si el largo es igual esta cerca de lo normal
				largoX = largoX < 0.55 ? 0.5 : largoX; // si el largo es menor a la mitad, el largo es igual a la mitad
				altoX = ctr?altoX:largoX; // si no esta el control apretado el alto es proporcional al largo
				altoX = 450 * altoX > documentSize().height - 28 ? altoX = (documentSize().height - 12) / 450 : altoX;
				largoX = ctr?largoX:altoX; // si no esta el control apretado el alto es proporcional al largo
				largoX = 510 * largoX > documentSize().width - 28 ? largoX = (documentSize().width - 12) / 510 : largoX;
				altoX = ctr?altoX:largoX; // si no esta el control apretado el alto es proporcional al largo
			}
			if( resize == 2 || ( resize == 3 && ( ctr || (mouseY - _mouseY) / 450 > (mouseX - _mouseX) / 510 ) ) ){
				// si se tiene que actuaizar el alto
				altoX = (mouseY - _mouseY) / 450; // calcula el nuevo alto y se lo asigna a altoX
				altoX = altoX > 0.95 && altoX < 1.05 ? 1 : altoX; 
				// si el largo es igual esta cerca de lo normal, el largo es el normal
				altoX = altoX < 0.55 ? 0.5 : altoX; // si el alto es menor a la mitad, el alto es igual a la mitad
				largoX = ctr?largoX:altoX; // si no esta el control apretado el largo es proporcional al alto
				largoX = 510 * largoX > documentSize().width - 28 ? largoX = (documentSize().width - 12) / 510 : largoX;
				altoX = ctr?altoX:largoX; // si no esta el control apretado el alto es proporcional al largo
				altoX = 450 * altoX > documentSize().height - 28 ? altoX = (documentSize().height - 12) / 450 : altoX;
				largoX = ctr?largoX:altoX; // si no esta el control apretado el alto es proporcional al largo
			}
			get("resizeInfo").innerHTML = ""; // se escribe el largo del mapa
			get("resizeInfo").appendChild( escribir( String( Math.round( 510 * largoX ) ), 10, true ) );
			get("resizeInfo").appendChild( escribir("," + String(Math.round(450*altoX)), 10, true) ); // se escribe el alto del mapa
			get("resizeB").style.width = setX(510) + "px"; // se le pone largo al div que se usa para marca la nueva posicion
			get("resizeB").style.height = setY(450) + "px"; // se le pone alto al div que se usa para marca la nueva posicion
			get("resizeB").style.left = "-" + setX(255 + 4) + "px";
			// le le pone posicion x al div que se usa para marca la nueva posicion
			//get("resizeB").style.top =  "-" +  setY(225 + 4) + "px"; 
			// le le pone posicion y al div que se usa para marca la nueva posicion
			get("resize").style.width = setX(510) + "px"; // se le pone largo al div que contiene las barras para resizear
			get("resize").style.height = setY(450) + "px"; // se le pone alto al div que contiene las barras para resizear
			get("resize").style.left = "-" + setX(255) + "px"; // le le pone posicion x al div que contiene las barras para resizear
			get("resize").style.top =  "-" +  setY(225) + "px"; // le le pone posicion y al div que contiene las barras para resizear
		break;
		
		//----------------------
		
		case 2: // si se termina de arrastrar una barra
			resize = false; // ya no se esta redimensionando
			document.body.style.cursor = 'default'; // el cursor se pone normal
			
			fadeOut("resizeB",0,"resizeInfoFondo",0,"resizeInfo",0); // se hace fadeOut a los divs
			setCookie("dimensiones", largoX + "," + altoX, fixDate()); // se pone en las cookies las dimensiones
			actualizarX(); // se actualiza el largo del juego
			actualizarY(); // se actualiza el alto del juego
			get("mario").style.left = setX(posx - scroll) + "px"; // se actualiza la posicion x de mario
			get("mario").style.top = setY(posy - (marioGY != false ? marioGY[1] - marioGY[0] : 0)) + "px";
			// se actualiza la posicion y de mario
		break;
	}
}