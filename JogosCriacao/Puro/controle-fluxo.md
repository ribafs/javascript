# Controle de fluxo em JavaScript

if

// Antes deve ter um arquivo js criado e incluído num html para executar este código
// Gradualmente vá comentando e descomentando os blocos ou excluindo os anteriores para testar

```js
/*
Cuidado: use == ao invés de =
if – estrututa condicional
if (condição) {
    // Bloco de código para ser executado.
}
*/
if (x < 5) {
    alert('x é menor que 5');
}
/*
if (x< 5) {
    mensagem = "É menor que 5";
} else if (x > 5){
    mensagem = "É maior que 5";
} else {
   mensagem = "É igual a 5";
}

document.write(mensagem);

if (dia == "Segunda-feira") 
   document.write ("Que tenha um ótimo começo de semana") 

if (credito >= preço) { 
   document.write("comprou o artigo " + novoArtigo) //mostro compra 
   carrinho += novoArtigo //coloco o artigo no carrinho da compra 
   credito -= preço //diminuo o crédito conforme o preço do artigo 
} else { 
   document.write("acabou o seu crédito") //informo que lhe falta dinhero 
   window.location = "carrinhodacompra.html" //vou à página do carrinho 
} 

var numero1=23;
var numero2=63;
if (numero1 == numero2){ 
   document.write("Os dois números são iguais") 
}else{ 
   if (numero1 > numero2) { 
      document.write("O primeiro número é maior que o segundo") 
   }else{ 
      document.write("O primeiro número é menor que o segundo") 
   } 
} 
*/

switch

var dia = 4;

switch (dia) { 
    case 1: 
       document.write("<h1>É segunda-feira") 
       break 
    case 2: 
       document.write("<h1>É terça-feira") 
       break 
    case 3: 
       document.write("<h1>É quarta-feira") 
       break 
    case 4: 
       document.write("<h1>É quinta-feira") 
       break 
    case 5: 
       document.write("<h1>É sexta-feira ") 
       break 
    case 6: 
    case 7: 
       document.write("<h1>É fim de semana") 
       break 
    default: 
       document.write("<h1>Esse dia não existe") 
} 

//Operadores aritméticos

var x = 2;
var y;

x ** 3;
document.write('<h1>'+x);

/*
y = x ** 3;
document.write('<h1>'+y); // 8

x++;
document.write('<h1>'+x); // 3

x--;
document.write('<h1>'+x); // 1
*/

//Operadores de atribuição

var x = 2;

x += 8;
x -= 2;
x *= 5;
x /= 4;

var x = 10, y;
y = x % 5;
document.write('<h1>'+y);
//y vale zero, que é o resto da divisão de 10 por 5.

//Operadores lógicos

var x = 2;
if(x == 2 || x == 3){
	document.write('<h1>Verdade, pois pelo menos um é verdadeiro');
}

var x = 2;
if(x == 2 && x == 3){
	//
}else{
    document.write('<h1>Falso, pois pelo menos um é falso');
}

var x = 2;
if(x != 2){ // Ou x !== 2
	//
}else{
    document.write('<h1>Falso');
}

//Operador ternário

/*
variável = (expressão) ? SeVerdadeiro: SeFalso;

momento = (hora_atual < 12) ? "Antes de meio-dia" : "Depois de meio-dia" 

var sexo = "M";
var retorno =  (sexo === 'M') ? 'Masculino' : 'Feminino';

var eSocio = false;

precoPago =  (eSocio) ? "2.00" : "10.00";
document.write(precoPago);

//Boas vindas pela hora
var agora = new Date();
var boasVindas = (agora.getHours()) > 12 ? "Boa tarde." : "Bom dia.");
document.write(boasVindas);
*/

//Prêmio pela idade
var idade = 19;
var premio = (idade < 21) ? 200 : 100;
document.write('<h1>'+premio);


//for

/*
for ( valor inicial; condição; incremento++ ou decremento-- ) {
	Ações;
}
*/
var i 
for (i=0;i<=10;i++) { 
    document.write('<h1>'+i) 
} 
/*
for (i=1;i<=20;i+=2) 
    document.write('<h1>'+i) 

for (i=343;i>=10;i--) 
    document.write('<h1>'+i) 
} 

//Obs: 
//O laço que incrementa testa com <
//O laço que decrementa esta com >

for (i=1;i<=6;i++) { 
    document.write("<H" + i + ">Cabeçalho de nível " + i + "</H" + i + ">") 
} 

var alunos = ['João Brito', 'Roberto Araújo', 'Antônio Queiroz'];

for (aluno of alunos){
	document.write('<h1>'+aluno);
}

// um array
var meu_array = new Array();

// Cria as chaves do array
meu_array = [ 'Oi, ', 'meu ', 'nome ', 'é Luiz' ];

// Cria o laço e acessa todas as chaves do array
for ( var i = 0; i < meu_array.length; i++ ) { 
	// Escreve: Oi, meu nome é Luiz
	document.write( meu_array[ i ]+'<h1><br>' );
}
*/

//while

/*
while (condição){ 
    sentenças a executar 
} 
*/
var i = 1, x = 2;
     
while(x < 20) {
      x = x + (x * i);
     
      document.write('<h1>O valor atual de x é: ' + x);
      i++;
}
/*
var i = 8;
while(i <= 10) {
	if (i == 3) {
	// O break interrompe a execução na terceira execução da
	// estrutura de repetição.		
		document.write('<h1>Linha ' + i + ' Fim do laço');	
		break;
	}
	document.write('<h1>Linha ' + i);
	i = i - 1;
}	

var i = 9;
while(i <= 10) {
	if (i == 3) {
	// O continue interrompe APENAS a terceira execução da
	// estrutura de repetição.		
		continue;
	}
	document.write('<h1>Linha ' + i);
	i -=1;
}	

// Crio uma variável com valor 0
var count = 0;

// Inicio o laço com a condição
while ( count <= 10 ) {
	// Escrevo a variável count na página
	document.write('<h1>'+ count );
	
	// Incremento a variável count em 1 a cada volta do laço
	count++;
} 
// Crio uma variável com valor 11
var count = 11;

// Inicio o laço com a condição
while ( count <= 10 ) {
	// Escrevo a variável count na página
	document.write('<h1>'+ count );
	
	// Incremento a variável count em 1 a cada volta do laço
	count++;
} 
*/

//forin

var arr = [1,2,3];
for(var n in arr) {  
	document.write ('<h1>'+n+ '-'+ arr[n]+'<br>');
}

/*
// um array
var meu_array = new Array();

// Cria as chaves do array
meu_array = [ 'Oi, ', 'meu ', 'nome ', 'é Luiz' ];

// Cria o laço e acessa todas as chaves do array
for ( meu_array in valores ) { 
	// Escreve: Oi, meu nome é Luiz
	document.write( valores );
}
*/

//continue

for (var i = 0; i < 20; i++) {
     // Verifica se i é maior ou igual a 10
     if (i == 10) continue; // Sai desta iteração apenas e continua na próxima iteração do laço

     document.write('<h1>'+i +'<br>'); 
}

/*
var nr;
  for (nr=1; nr<=20; nr++){
    if (nr%4 == 0){
      document.write ("pin");
      document.write ("<br>");
      continue; //ignora todo o resto e continua o loop
    }
    document.write (nr);
    document.write ("<br>");
  }
  */

//break

for ( var i = 0; i < 1000; i++ ) { 
	// Escreve
	document.write('<h1>'+ i + ', <br>' );
	
	// Verifica se i é maior ou igual a 10
	if ( i == 10 ) {
		// Para o laço
		break;
	}
}

//do while

/*
do { 
    sentenças do loop 
} while (condição) 
*/

// Crio uma variável com valor 11
var count = 11;

// Inicio o laço com uma ação
do {
	// Escrevo a variável count na página
	document.write('<h1>'+ count );
	
	// Incremento a variável count em 1 a cada volta do laço
	count++;
} while ( count <= 10 ) // Só agora verifico a condição


//funções

/*
function nomeFuncao () {
	// Código a ser processado. Um ou mais comandos
}

//Chamando:
//nomeFuncao();

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

//Chamando:
var resultado = soma(5, 10);

//Converter Fahrenheit para Celsius

function toCelsius(fahrenheit) {
	return (5/9) * (fahrenheit-32);
}
*/

```
