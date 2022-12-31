#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int main()
 {
    int limite, i;
    
	for (i = 1; i <= 100; i++)

        if(i % 5 == 0){
    	    printf("Número %d\n", i);
        }else{
    	    printf("Número %d", i);
        }    
	return 0;
}

/*
Compilar
g++ cem.cpp -o cem

Rolar
./cem
*/
