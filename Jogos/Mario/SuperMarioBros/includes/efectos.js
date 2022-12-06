function get(d){
	return document.getElementById(d);
}

var _t = [];
var _int = false;

function efecto(set){
	if(set.id){set.obj = get(set.id);}
	
	var pos = _t.length;
	
	for(n = 0; n < _t.length; n++){
		if(_t[n].obj == set.obj && _t[n].prop == set.prop){
			pos = n;
		}
	}
	
	for(n = 1; n; n++){
		if(set.valor.indexOf('$' + n) > -1){
			var str = typeof(set["$" + n][1]) == "string";
			set["$" + n][1] = Number(set["$" + n][1]);
			set["$" + n].push( set["$" + n][0] < set["$" + n][1] );
			var vel = set["$" + n][2];
			if( typeof(vel) == "string" ){
				vel = (set["$" + n][3] ? set["$" + n][1] - set["$" + n][0] : set["$" + n][0] - set["$" + n][1]) / Number(vel) * 20;
			}
			if( typeof(vel) == "object" ){
				vel[2] = vel[2] ? true : false;
				vel[3] = vel[3] ? vel[3] : 1;
			}
			set["$" + n][2] = vel;
			if(str){
				set["$" + n][1] = String(set["$" + n][1]);
			}
		}
		else{
			break;
		}
	}
	_t[pos] = set;
}

function aCEfectos(){
	for(x = 0; x < _t.length; x++){
		var valorN = _t[x].valor;
		var finish = true;
		for(n = 1; n; n++){
			if(_t[x].valor.indexOf('$' + n) > -1){
				var $ = _t[x]["$" + n];
				var rnd = typeof($[1]) == "string";
				if(rnd){
					$[1] = Number($[1]);
				}
				if($[0] != $[1]){
					if(typeof($[2]) == "number"){
						$[0] += $[3] ? $[2] : 0 - $[2];
						if(($[3] && $[0] > $[1]) || (!$[3] && $[0] < $[1])){
							$[0] = $[1];
						}
					}
					else{
						if($[2][0]<=1){$[2][0]+=1;}
						if(!$[2][2]){
							$[2][3] += $[2][1];
							$[0] += !$[3] ? 0 - $[2][3] : $[2][3];
							if(($[3] && $[0] > $[1]) || (!$[3] && $[0] < $[1])){
								$[0] = $[1] + .1;
								$[2][3] = $[2][3] / (3 - $[2][0]);
								$[2][2] = true;
								 if($[2][3] < ($[2][0] * $[2][1])){
									$[0] = $[1];
								}
							}
						}
						else if($[2][2]){
							if($[2][3] > $[2][1]){
								$[2][3] -= $[2][1];
								$[0] += $[3] ? 0 - $[2][3] : $[2][3]; 
							}
							else{
								$[2][2] = false;
							}
						}
					}
					finish = false;
				}
				valorN = valorN.split("$" + n).join(rnd ? Math.round($[0]) : $[0]);
				if(rnd){
					$[1] = String($[1]);
				}
			}
			else{
				break;
			}
		}
		_t[x].obj.style[_t[x].prop.replace("style.","")] = valorN;
		if(finish){
			var fn = _t[x].onFinish;
			var pr = _t[x].param;
			_t.splice(String(x), "1");
			if(fn){
				fn(pr);
			}
		}
	}
}

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion hace fadeIn en los divs que se pasan por argumanto.
Ej : fadeIn("div1",0,"div2",0.3);
De esta manera la opacidad del div1 va desde la actual a 0 y la del div2 a 0.3.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function fadeIn(){
	var array = fadeIn.arguments; // los ids a los que se va a hacer fade in
	
	for(a=0;a<array.length;a+=2){ // por cada id
	
		get(array[a]).style.display = "inline"; // se muestra el objeto
		
		var opA = Number(get(array[a]).style.opacity); // la opacidad actual del objeto
		opA = opA?opA:0; // si no existe es 0
		
		get(array[a]).style.opacity = opA;
		get(array[a]).style.filter = "alpha( opacity : " + (opA * 100) + " )";
		
		new efecto({ // para ie se cambia la opacidad desde la actual a la nueva de a 2
			id : array[a],
			prop : "style.filter",
			valor : "alpha( opacity = $1 )",
			$1 : [opA * 100, String(array[a + 1] * 100), 4]
		});
		
		new efecto({ // para otros se cambia la opacidad desde la actual a la nueva de a 0.02
			id : array[a],
			prop : "style.opacity",
			valor : "$1",
			$1 : [opA, array[a + 1], 0.04]
		});
	}
}
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/*
Esta funcion hace fadeOut en los divs que se pasan por argumanto.
Ej : fadeOut("div1",1,"div2",0.7);
De esta manera la opacidad del div1 va desde la actual a 1 y la del div2 a 0.7.
*/
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function fadeOut(){
	var array = fadeOut.arguments; // los ids a los que se va a hacer fade out
	
	for(a=0;a<array.length;a+=2){ // por cada id
	
		var opA = Number(get(array[a]).style.opacity); // la opacidad actual del objeto
		opA = opA?opA:0; // si no existe es 0
		
		get(array[a]).style.opacity = opA;
		get(array[a]).style.filter = "alpha( opacity : " + (opA * 100) + " )";
		
		new efecto({ // para ie se cambia la opacidad desde la actual a la nueva de a 2
			id : array[a],
			prop : "style.filter",
			valor : "alpha( opacity = $1 )",
			$1 : [opA * 100, String(array[a + 1] * 100), 4]
		});
		
		new efecto({ // para otros se cambia la opacidad desde la actual a la nueva de a 0.02
			id : array[a],
			prop : "style.opacity",
			valor : "$1",
			$1 : [opA, array[a + 1], 0.04],
			onFinish : function(obj){
				obj.style.display = "none";
			},
			param : get(array[a])
		});
	}
}
function opacity( div, op ){
	get( div ).style.opacity = op;
	get( div ).style.filter = "alpha( opacity = " + ( op * 100 ) + " )";
}