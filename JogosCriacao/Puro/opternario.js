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

