//General Array Function
function MakeArray(n) {
  this.length = n;
  for (var i = 1; i <= n; i++) {
    this[i] = 0;
  }
}


//Initialize Days of Week Array
days = new MakeArray(7);
days[0] = "Sábado"
days[1] = "Domingo"
days[2] = "Segunda-feira"
days[3] = "Terça-feira"
days[4] = "Quarta-feira"
days[5] = "Quinta-feira"
days[6] = "Sexta-feita"

//Initialize Months Array
months = new MakeArray(12);
months[1] = "Janeiro"
months[2] = "Fevereiro"
months[3] = "Março"
months[4] = "Abril"
months[5] = "Maio"
months[6] = "Junio"
months[7] = "Julio"
months[8] = "Agosto"
months[9] = "Setembro"
months[10] = "Outubro"
months[11] = "Novembro"
months[12] = "Dezembro"


//Day of Week Function
function compute(form) {

  var val1 = Number(val1);
  var val2 = Number(val2);
  var val3 = Number(val3);


  var val1 = parseInt(form.day.value, 10)

  if ((val1 < 0) || (val1 > 31)) {
    alert("Dia inválido. O dia precisa ser menor ou igual a 31 😑😑")
  }
  var val2 = parseInt(form.month.value, 10)
  if ((val2 < 0) || (val2 > 12)) {
    alert("Mês inválido. O mês deve ser menor ou igual a 12 😑😑")
  }
  var val2x = parseInt(form.month.value, 10)
  var val3 = parseInt(form.year.value, 10)
  if (val3 < 1000) {
    alert("Pela idade, já era pra estar morto! 👎👻")
  }
  if (val2 == 1) {
    val2x = 13;
    val3 = val3 - 1
  }
  if (val2 == 2) {
    val2x = 14;
    val3 = val3 - 1
  }
  var val4 = parseInt(((val2x + 1) * 3) / 5, 10)
  var val5 = parseInt(val3 / 4, 10)
  var val6 = parseInt(val3 / 100, 10)
  var val7 = parseInt(val3 / 400, 10)
  var val8 = val1 + (val2x * 2) + val4 + val3 + val5 - val6 + val7 + 2
  var val9 = parseInt(val8 / 7, 10)
  var val0 = val8 - (val9 * 7)
  form.result1.value = form.day.value + " de " +months[val2] + " de " +  form.year.value
  form.result2.value = "Você nasceu na(o) " + days[val0]
}

         // end script -->
