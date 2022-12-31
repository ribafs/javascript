//Código por Henrique Felipe (GitHub: HenriqueIni)
#include <stdio.h>
#include <stdlib.h>
 
//Algoritmo de Euclides iterativo
int mdc(int a, int b){
    while(b != 0){
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}
//Algoritmo do MMC
int mmc(int a, int b){
    return a * (b / mdc(a, b));
}
//Testes
int main() {
    printf("MMC\n");
    printf("mmc(30, 60) = %d\n", mmc(30, 60));
    printf("mmc(60, 100) = %d\n", mmc(60, 100));
    printf("mmc(36, 14) = %d\n", mmc(36, 14));
    return 0;
}
/* https://www.blogcyberini.com/2018/03/algoritmo-para-calcular-o-mmc.html */
