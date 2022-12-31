function generateRandomNumber(min,max) {
  return Math.floor(Math.random()*(max-min+1) + min);
}
let result = {};
let rightCount = 0
let wrongCount = 0

function playGame() {
  var field1 = generateRandomNumber(20,50);
  var field2 = generateRandomNumber(20,50);
  var sum = field1 + field2;

  let resultsArray = generateRandomOptions(sum);
  resultsArray.push(sum);
  resultsArray.sort(function(a,b) {return 0.5-Math.random()});

  result = {
    field1: field1,
    field2: field2,
    resultsArray: resultsArray,
    answer:sum
  };

   document.getElementById('field1').innerHTML = result.field1;
   document.getElementById('field2').innerHTML = result.field2;
   document.getElementById('option1').innerHTML= result.resultsArray[0];
   document.getElementById('option2').innerHTML= result.resultsArray[1];
   document.getElementById('option3').innerHTML= result.resultsArray[2];
   document.getElementById('option4').innerHTML= result.resultsArray[3];
}

function generateRandomOptions(sum) {
  let resultsArray = [];
  let randomNumberArray = [];

  while (randomNumberArray.length < 3){
    let random = generateRandomNumber(1,10);
    if(randomNumberArray.indexOf(random) > -1) continue;
    randomNumberArray.push(random);
  }

  for (let i=0; i<3; i++) {
    let addSubtract = generateRandomNumber(0,1);
    let num = sum;
    if (addSubtract === 1){
      num += randomNumberArray[i];
    }else{
      num -= randomNumberArray[i]
    }
    resultsArray.push(num);
  }

  return resultsArray;
}

function CheckAnswer(selectedElem){
  let after = document.getElementById('after');
  if (selectedElem.innerHTML == result.answer){
    rightCount += 1;
    after.classList.remove('hide');
    after.classList.add('correct');
    after.classList.add('animated');
    after.classList.add('ZoomInDown');
    after.innerHTML = 'Muito bem! Aperte o botão abaixo para jogar novamente';
    document.getElementById('correctScore').innerHTML = 'Pontos = ' + rightCount;
  }else{
    wrongCount += 1;
    after.classList.remove('hide');
    after.classList.add('wrong');
    after.classList.add('animated');
    after.classList.add('ZoomInDown');
    after.innerHTML = 'Não é bem isso! Tente novamente';
    document.getElementById('wrongScore').innerHTML = 'Erros = ' + wrongCount;
  }
  document.getElementById('totalScore').innerHTML = 'Pontos totais = ' + (rightCount - wrongCount);
}

function playAgain(){
  let after = document.getElementById('after');
  after.classList.remove('wrong');
  after.classList.remove('correct');
  after.classList.add('hide');
  playGame();
}
