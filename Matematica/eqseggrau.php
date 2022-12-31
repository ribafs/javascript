<h3>Equação do Segundo Grau</h3>
<form method="post" action="">
Valor de a<input name="a"><br>
Valor de b<input name="b"><br>
Valor de c<input name="c"><br>
<input type="submit" name="enviar" value="Enviar">
</form>

<?php 
if(isset($_POST['enviar'])){
    // Valores
    $a = $_POST['a'];
    $b = $_POST['b'];
    $c = $_POST['c'];

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
}
