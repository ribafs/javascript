
```php
function factorial($s){
    if($s) $r = $s * factorial($s - 1);
    else $r = 1;
    return $r;
}
print factorial(5);


<?php 
echo(round(1.95583, 2)."\n"); 
echo(round(1241757, -3)."\n"); 
echo(round(9.5, 0, PHP_ROUND_HALF_UP)."\n"); 
echo(round(9.5, 0, PHP_ROUND_HALF_DOWN)."\n"); 
echo(round(9.5, 0, PHP_ROUND_HALF_EVEN)."\n"); 
echo round(9.5, 0, PHP_ROUND_HALF_ODD); 
?> 

Output :

1.96
1242000
10
9
10
9


Arredondar para cima
PHP Math: ceil() function

The ceil() function rounds fractions up.
Syntax

    float ceil ( float $value )  

Example

    <?php  
    echo (ceil(3.3)."<br/>");// 4  
    echo (ceil(7.333)."<br/>");// 8  
    echo (ceil(-4.8)."<br/>");// -4  
    ?>  

Output:

4
8
-4

Arredondar para baixo

PHP Math: floor() function

The floor() function rounds fractions down.
Syntax

    float floor ( float $value )  

Example

    <?php  
    echo (floor(3.3)."<br/>");// 3  
    echo (floor(7.333)."<br/>");// 7  
    echo (floor(-4.8)."<br/>");// -5  
    ?>  

Output:

3
7
-5


```


