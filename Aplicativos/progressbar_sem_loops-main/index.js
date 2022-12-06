// recursos
let $ = (e) => document.querySelector(e);
var countItem = $(".count");
var countStart = $(".progressBarStart i");



// controles
const controls = { count : 0, tempo : 0 }

// funcao
Carregador = ()=>{
    if(controls.tempo == 5)
    {
        controls.count++
        countItem.innerText = controls.count+' %';
        countStart.style.setProperty('width',controls.count+'%');
        
        // zerar tempo
        controls.tempo = 0
    }

    if(controls.count >= 100)
    {
        countItem.innerText = controls.count+'% - Concluido';
        clearInterval(tempoFinal) // elimina temporizador
        controls.count = 0
    }
    controls.tempo++  
}



// conometro
var tempoFinal = setInterval(()=>{Carregador()}, 60);