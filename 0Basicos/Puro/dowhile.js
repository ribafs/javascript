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

