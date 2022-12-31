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
