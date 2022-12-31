// O código aqui foi escrito com finalidades didáticas, por isso, não se apegue a arquitetura e nem às nomenclaturas

var canvas = document.getElementById('quadro');
var ctx = canvas.getContext('2d');

// Funções de exemplo
function exemplo1(){
  //Define o estilo do contexto (cor azul)
  ctx.fillStye = '#0000FF';

  /*
    Desenha um retângulo no canvas com as seguintes propriedades:
    posição x (lateral): 30
    posição y (vertical de cima para baixo): 50
    largura: 100
    altura: 80
  */
  ctx.fillRect(30, 50, 100, 80);
}

function exemplo2(){
  /*
    Define um gradiente linear com as seguintes propriedades:
    x inicial: 50
    y inicial: 50
    x final: 100
    y final: 100
  */
  var grd = ctx.createLinearGradient(50,50,100,100);
  
  //Define as cores do gradiente (do vermelho em 0% ao azul em 100%)
  grd.addColorStop(0, "red");
  grd.addColorStop(0.45, "green");
  grd.addColorStop(1, "blue");

  //Definindo o estilo do contexto com o gradiente que acabamos e criar
  ctx.fillStyle = grd;
  
  //Para criar o círculo, devemos fazer um PATH (caminho), o caminho vai fazer um arco de 360 graus para que seja preenchido depois.
  
  //Inicia o caminho com o contexto:
  ctx.beginPath();

  /*
    O caminho percorre um arco de 0 até 360 graus. O centro do arco fica na posição 75,75(x,y)
  */
  ctx.arc(75,75,50,0,2*Math.PI);

  // Preenchemos o circulo (com o estilo de gradiente préviamente definido)
  ctx.fill();
}

function exemplo3(){
  //Definindo a fonte do contexto
  ctx.font="20px Georgia";

  //Definindo a cor do estilo
  ctx.fillStyle="red";

  //Desenhando o texto
  ctx.fillText("Olá blog!",10,50);
}

function exemplo4(){
  //Criamos esse objeto que representa um círculo que será animado
  var circulo = {
    x: 0,
    y: 40,
    desenhar: function(ctx, canvas){
      //Limpa o canvas das posições 0 até o seu limite (largura e altura)
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
      ctx.fill();
    },
    mover: function(){
      this.x += 3;
    }
  };

  //Executa o método mover e depois desenhar em um intervalo de 20 em 20 milissegundos. Caso já exista um circulo em movimento, o circulo antigo é cancelado
  if (window.circuloInterval) clearInterval(window.circuloInterval);
  window.circuloInterval = setInterval(function(){
    circulo.mover();
    circulo.desenhar(ctx, canvas);
  }, 20);
}

var runButton = document.getElementById('run-example');
var exampleSelect = document.getElementById('example-selection');
runButton.addEventListener("click", function(e){
  eval(exampleSelect.value + "()");
});
