//Código por Henrique Felipe (GitHub: HenriqueIni)
#include <stdio.h>
#include <stdlib.h>
 
int MMC(int num1, int num2)
{
    int x,y,r,mmc;
       
    x = num1;
    y = num2;
    do
    {
        r = x % y;
        x = y;
        y = r;
    }
    while (r != 0);

    mmc = (num1 * num2) / x;

    return mmc;
}

int main() {
    printf("MMC\n");
    printf("MMC(30, 60) = %d\n", MMC(30, 60));
    printf("MMC(60, 100) = %d\n", MMC(60, 100));
    printf("MMC(36, 14) = %d\n", MMC(36, 14));
}
