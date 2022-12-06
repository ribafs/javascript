var xvalor, resulta;
function btn(n1){
   xvalor= document.calculadora.valor.value +=n1;
}
function limpar(){
    document.calculadora.valor.value = "";
}
function calcula(){
    resulta = eval(xvalor);
    document.calculadora.valor.value = resulta.toLocaleString('pt-ao');
     
}