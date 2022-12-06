var precargarV = true;
var pregarcarPeso = 0;
var precargarImgs = [
	["background.gif", 89],
	["background2.gif", 81],
	["background3.gif", 663],
	
	["bichos/bicho.gif", 411],
	["bichos/bicho_muerto.gif", 248],
	["bichos/tortuga_agachada.gif", 196],
	["bichos/bolita.gif", 396],
	["bichos/estrella.gif", 426],
	["bichos/flor.gif", 454],
	["bichos/hongo1.gif", 195],
	["bichos/hongo2.gif", 179],
	["bichos/tortuga_muerta.gif", 355],
	["bichos/tortuga_normal_derecha.gif", 615],
	["bichos/tortuga_normal_izquierda.gif", 649],
	["bichos/tortuga_2_normal_derecha.gif", 597],
	["bichos/tortuga_2_normal_izquierda.gif", 643],
	["bichos/tortuga_2_agachada.gif", 196],
	["bichos/tortuga_2_muerta.gif", 184],
	["bichos/bichoAplastado.gif", 138],
	["bichos/hongo3.gif", 179],
	["bichos/planta.gif", 556],
	["bichos/hongoSeleccionar.gif", 99],
	
	["cuadraditos/moneda2.gif", 239],
	["cuadraditos/bandera.gif", 169],
	["cuadraditos/cubo_escalera.gif", 166],
	["cuadraditos/cubo_piso.gif", 185],
	["cuadraditos/cubo_rompible.gif", 141],
	["cuadraditos/cubo_roto.gif", 139],
	["cuadraditos/explocion.gif", 478],
	["cuadraditos/fragmento_cubo_rompible.gif", 199],
	["cuadraditos/moneda.gif", 364],
	["cuadraditos/signo.gif", 461],
	["cuadraditos/barra.gif", 203],
	["cuadraditos/tubo1/tuboBL.gif", 191],
	["cuadraditos/tubo1/tuboBR.gif", 199],
	["cuadraditos/tubo1/tuboTL.gif", 180],
	["cuadraditos/tubo1/tuboTR.gif", 165],
	["cuadraditos/tubo2/tuboBL.gif", 191],
	["cuadraditos/tubo2/tuboBR.gif", 152],
	["cuadraditos/tubo2/tuboTL.gif", 169],
	["cuadraditos/tubo2/tuboTR.gif", 110],
	["cuadraditos/tubo3/tuboBL.gif", 204],
	["cuadraditos/tubo3/tuboBR.gif", 201],
	["cuadraditos/tubo3/tuboTL.gif", 191],
	["cuadraditos/tubo3/tuboTR.gif", 201],
	["cuadraditos/tubo4/tuboBL.gif", 191],
	["cuadraditos/tubo4/tuboBR.gif", 199],
	["cuadraditos/tubo4/tuboTL.gif", 191],
	["cuadraditos/tubo4/tuboTR.gif", 199],
	
	["font/mario-0.gif", 70],
	["font/mario-1.gif", 70],
	["font/mario-2.gif", 70],
	["font/mario-3.gif", 70],
	["font/mario-4.gif", 70],
	["font/mario-5.gif", 70],
	["font/mario-6.gif", 70],
	["font/mario-7.gif", 70],
	["font/mario-8.gif", 70],
	["font/mario-9.gif", 70],
	["font/mario- .gif", 70],
	["font/mario-$.gif", 70],
	["font/mario-,.gif", 70],
	["font/mario--.gif", 70],
	["font/mario-_.gif", 70],
	["font/mario-+.gif", 70],
	["font/mario-A.gif", 70],
	["font/mario-B.gif", 70],
	["font/mario-C.gif", 70],
	["font/mario-D.gif", 70],
	["font/mario-E.gif", 70],
	["font/mario-F.gif", 70],
	["font/mario-G.gif", 70],
	["font/mario-H.gif", 70],
	["font/mario-I.gif", 70],
	["font/mario-J.gif", 70],
	["font/mario-K.gif", 70],
	["font/mario-L.gif", 70],
	["font/mario-M.gif", 70],
	["font/mario-N.gif", 70],
	["font/mario-O.gif", 70],
	["font/mario-P.gif", 70],
	["font/mario-Q.gif", 70],
	["font/mario-R.gif", 70],
	["font/mario-S.gif", 70],
	["font/mario-T.gif", 70],
	["font/mario-U.gif", 70],
	["font/mario-V.gif", 70],
	["font/mario-W.gif", 70],
	["font/mario-X.gif", 70],
	["font/mario-Y.gif", 70],
	["font/mario-Z.gif", 70],
	
	["marioChico/corriendo1.gif", 565],
	["marioChico/corriendo1r.gif", 565],
	["marioChico/corriendo2.gif", 510],
	["marioChico/corriendo2r.gif", 510],
	["marioChico/mario1.gif", 181],
	["marioChico/mario2.gif", 185],
	["marioChico/mario3.gif", 217],
	["marioChico/mario4.gif", 216],
	["marioChico/mario5.gif", 194],
	["marioChico/mario6.gif", 194],
	["marioChico/marioMuerte.gif", 203],
	["marioChico/mario11.gif", 326],
	["marioChico/mario12.gif", 203],
	["marioChico/mario13.gif", 183],
	
	["marioGrande/corriendo1.gif", 923],
	["marioGrande/corriendo1r.gif", 923],
	["marioGrande/corriendo2.gif", 930],
	["marioGrande/corriendo2r.gif", 930],
	["marioGrande/mario1.gif", 335],
	["marioGrande/mario2.gif", 374],
	["marioGrande/mario3.gif", 346],
	["marioGrande/mario4.gif", 385],
	["marioGrande/mario5.gif", 368],
	["marioGrande/mario6.gif", 371],
	["marioGrande/mario7.gif", 447],
	["marioGrande/mario8.gif", 370],
	["marioGrande/mario11.gif", 544],
	["marioGrande/mario12.gif", 323],
	["marioGrande/mario13.gif", 284],
	
	["marioTransision/mario1.gif", 373],
	["marioTransision/mario2.gif", 498],
	
	["superMarioGrande/corriendo1.gif", 951],
	["superMarioGrande/corriendo1r.gif", 951],
	["superMarioGrande/corriendo2.gif", 1400],
	["superMarioGrande/corriendo2r.gif", 1400],
	["superMarioGrande/mario1.gif", 335],
	["superMarioGrande/mario2.gif", 466],
	["superMarioGrande/mario3.gif", 491],
	["superMarioGrande/mario4.gif", 574],
	["superMarioGrande/mario5.gif", 343],
	["superMarioGrande/mario6.gif", 497],
	["superMarioGrande/mario7.gif", 282],
	["superMarioGrande/mario8.gif", 395],
	["superMarioGrande/mario9.gif", 307],
	["superMarioGrande/mario10.gif", 437],
	["superMarioGrande/mario11.gif", 544],
	["superMarioGrande/mario12.gif", 333],
	["superMarioGrande/mario13.gif", 287],
	
	["cuadraditosTunel/cubo_escalera.gif", 166],
	["cuadraditosTunel/cubo_piso.gif", 185],
	["cuadraditosTunel/cubo_rompible.gif", 135],
	["cuadraditosTunel/cubo_roto.gif", 139],
	["cuadraditosTunel/fragmento_cubo_rompible.gif", 183],
	["cuadraditosTunel/signo.gif", 461],
	["cuadraditosTunel/tubo1/tuboBL.gif", 191],
	["cuadraditosTunel/tubo1/tuboBR.gif", 199],
	["cuadraditosTunel/tubo1/tuboTL.gif", 180],
	["cuadraditosTunel/tubo1/tuboTR.gif", 165],
	["cuadraditosTunel/tubo2/tuboBL.gif", 191],
	["cuadraditosTunel/tubo2/tuboBR.gif", 152],
	["cuadraditosTunel/tubo2/tuboTL.gif", 169],
	["cuadraditosTunel/tubo2/tuboTR.gif", 110],
	["cuadraditosTunel/tubo3/tuboBL.gif", 204],
	["cuadraditosTunel/tubo3/tuboBR.gif", 201],
	["cuadraditosTunel/tubo3/tuboTL.gif", 191],
	["cuadraditosTunel/tubo3/tuboTR.gif", 201],
	["cuadraditosTunel/tubo4/tuboBL.gif", 191],
	["cuadraditosTunel/tubo4/tuboBR.gif", 199],
	["cuadraditosTunel/tubo4/tuboTL.gif", 191],
	["cuadraditosTunel/tubo4/tuboTR.gif", 199],
	
	["bichosTunel/bicho.gif", 376],
	["bichosTunel/bicho_muerto.gif", 194],
	["bichosTunel/bichoAplastado.gif", 138],
	["bichosTunel/planta.gif", 556],
	["bichosTunel/tortuga_agachada.gif", 196],
	["bichosTunel/tortuga_muerta.gif", 199],
	["bichosTunel/tortuga_normal_derecha.gif", 637],
	["bichosTunel/tortuga_normal_izquierda.gif", 558],
	
	["figuras/figura1.gif", 563],
	["figuras/figura2.gif", 310],
	["figuras/figura3.gif", 369],
	["figuras/figura4.gif", 503],
	["figuras/figura5.gif", 631],
	["figuras/figura6.gif", 244],
	["figuras/figura7.gif", 318],
	["figuras/figura8.gif", 686],
	["figuras/figura9.gif", 1500],
	["figuras/figura10.gif", 512],
	
	["editor/barra.gif", 159],
	["editor/mapaSortLeft.gif", 187],
	["editor/bichos.gif", 341],
	["editor/cubos.gif", 253],
	["editor/figuras.gif", 262]
];
for( x in precargarImgs ){
	pregarcarPeso += precargarImgs[x][1];
}

function precargar( n ){
	if( precargarV ){
		for( var x in precargarImgs ){
			
			elemento( "img", {
				src : "imgs/" + precargarImgs[x][0],
				alt : precargarImgs[x][1]
			}, get( "imgsPrecargar" ) );
			
		}
		
		var intervalo = setInterval( function(){
			
			var imagenes = get( "imgsPrecargar" ).getElementsByTagName( "img" );
			var completadas = 0;
			var pesoCagado = 0;
			for( var n in imagenes ){
				if( imagenes[n].complete ){
					completadas++;
					pesoCagado += Number( imagenes[n].alt );
				}
			}
			get( "imgsPreloadImgs" ).innerHTML = completadas + " / " + precargarImgs.length + " images";
			var porcentaje = Math.round( pesoCagado * 100 / pregarcarPeso );
			get( "imgsPrecargarBarC" ).style.width = porcentaje + "%";
			get( "imgsPrecargarBarC" ).innerHTML = porcentaje + "%";
			
			if( completadas == precargarImgs.length ){
				clearInterval( intervalo );
				if(nav == "IE"){
					get("sombra").style.visibility = "hidden";
				}
				get("sombra").style.display = "inline";
				get("imgsPreloadImgs").style.visibility = "hidden";
			}
			
		}, 100 );
	}
}