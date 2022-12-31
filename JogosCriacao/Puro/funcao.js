/*
function nomeFuncao () {
	// Código a ser processado. Um ou mais comandos
}

Chamando:
nomeFuncao();

function nomeFuncao (param1, param2, paramn){
	// Código
}

function nomeFuncao (param1){
	result = param1 * 5;
	return result;
}
*/
function soma (x, y){
	return x+y;
}

//Executando/chamando a função soma
var x = 5;
var y = 10;
var res = soma(x, y);
document.write('<h1>'+res);
/*
//Ou função anônima

var soma = function(a, b) {
	return a + b;
};

Chamando:
var resultado = soma(5, 10);

Converter Fahrenheit para Celsius

function toCelsius(fahrenheit) {
	return (5/9) * (fahrenheit-32);
}
*/
