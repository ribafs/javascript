<?php 
// Valores fixos
$a = 2;
$b = 4;
$c = 2;

// Descobrindo Delta
$delta = ($b * $b) - ((4 * $a) * $c);

// Calculando os valores de X
$x1 = (-$b + sqrt($delta)) / (2 * $a);
$x2 = (-$b - sqrt($delta)) / (2 * $a);

// Se delta não for negativo, exibe os valores
if ($x1 != "NAN" and $x2 != "NAN") {
// Exibindo os valores
echo "x1 = " . $x1 . "<br ?-->";
echo "x2 = " . $x2;
// Caso delta seja negativo
} else {
echo "Impossivel calcular o valor, delta negativo (".$delta.")";
}

