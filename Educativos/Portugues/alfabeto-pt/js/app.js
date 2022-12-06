document.onkeypress = function(event){
    const randColor = () =>  {
        return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
        // https://www.educative.io/answers/how-to-generate-a-random-color-in-javascript
    }
    let erro = ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']
    let letra = event.key

    if(letra < 'a' || letra > 'z') {
        document.getElementById("letter").innerHTML = '';
    }else{         
        document.getElementById("letter").style.color = randColor();
        document.getElementById("letter").innerHTML = letra.toUpperCase();
    }
}

document.addEventListener('keydown', function(e) {
  let letr = String.fromCharCode(e.keyCode).toLowerCase();
  if(e.keyCode == 65) document.getElementById(letr).play();
  if(e.keyCode == 66) document.getElementById(letr).play();
  if(e.keyCode == 67) document.getElementById('c').play();
  if(e.keyCode == 68) document.getElementById('d').play();
  if(e.keyCode == 69) document.getElementById('e').play();
  if(e.keyCode == 70) document.getElementById('f').play();
  if(e.keyCode == 71) document.getElementById('g').play();
  if(e.keyCode == 72) document.getElementById('h').play();
  if(e.keyCode == 73) document.getElementById('i').play();
  if(e.keyCode == 74) document.getElementById('j').play();
  if(e.keyCode == 75) document.getElementById('k').play();
  if(e.keyCode == 76) document.getElementById('l').play();
  if(e.keyCode == 77) document.getElementById('m').play();
  if(e.keyCode == 78) document.getElementById('n').play();
  if(e.keyCode == 79) document.getElementById('o').play();
  if(e.keyCode == 80) document.getElementById('p').play();
  if(e.keyCode == 81) document.getElementById('q').play();
  if(e.keyCode == 82) document.getElementById('r').play();
  if(e.keyCode == 83) document.getElementById('s').play();
  if(e.keyCode == 84) document.getElementById('t').play();
  if(e.keyCode == 85) document.getElementById('u').play();
  if(e.keyCode == 86) document.getElementById('v').play();
  if(e.keyCode == 87) document.getElementById('w').play();
  if(e.keyCode == 88) document.getElementById('x').play();
  if(e.keyCode == 89) document.getElementById('y').play();
  if(e.keyCode == 90) document.getElementById('z').play();
  if(e.keyCode < 65 || e.keyCode > 90 ) document.getElementById("erro").play();
});
