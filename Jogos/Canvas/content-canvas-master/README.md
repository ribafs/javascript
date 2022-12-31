HTML5 Canvas - From zero to hero.

Olá, meu nome é Lucas Chain e sou desenvolvedor na Just Digital.

Os arquivos referentes a esse tutorial estão localizados no GitHub do projeto 
https://github.com/justdigital/content-canvas

O elemento Canvas no HTML5 funciona exatamente como uma tela de pintura: Um quadro onde você pode desenhar para usuário utilizando uma API em javascript

Para começar, crie uma estrutura básica :
    CSS
    body{
      background-color: black;
    }
    #quadro{
      margin: 50px auto 0 auto;
      width: 640px;
      height: 480px;
    }

    HTML
    <canvas width="640" height="480" id="quadro"></canvas>

Até agora só temos um quadro branco em um fundo preto. O próximo passo é extrair o _contexto_ do nosso quadro para começar a desenhar.

O contexto gerencia tudo o que é colocado no quadro, portanto, sempre que formos desenhar 2d, precisaremos de um contexto 2d.

Para obter o contexto de um canvas, utilize a função createContext('2d'):

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

Antes de desenhar com o contexto, é preciso definir um estilo para ser utilizado, depois, utilizar o método de desenho, por exemplo:

1) Criar retângulo azul com o contexto:
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

2) Criar um círculo com cor gradiente linear
    /*
      Define um gradiente linear com as seguintes propriedades:
      x inicial: 50
      y inicial: 50
      x final: 100
      y final: 100
    */
    var grd = ctx.createLinearGradient(50,50,100,100);
    
    //Define as cores do gradiente (do vermelho em 0% ao verde em 45% para o azul em 100%)
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

O conceito é o mesmo para animações, a diferença é que a animação será feita dentro de um laço que será repetido várias vezes num curto intervalo de tempo, como no exemplo:

3) Escrever no canvas:
    //Definindo a fonte do contexto
    ctx.font="20px Georgia";

    //Definindo a cor do estilo
    ctx.fillStyle="red";

    //Desenhando o texto
    ctx.fillText("Olá blog!",10,50);

4) Criar um círculo animado:
    
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

Para concluir, quero dizer que essa é apenas uma pequena introdução ao universo canvas, com eles, podemos fazer coisas inacreditáveis como jogos, apps mobile, UX inovadores e muito mais!

Para mais referências sobre a documentação do canvas, recomendo os seguintes links:
    http://www.w3schools.com/tags/tag_canvas.asp
    http://www.html5canvastutorials.com
    http://diveintohtml5.info/canvas.html

No proximo post vamos falar mais sobre performance de canvas em diferentes browsers e como receber input (mouse e teclado) do usuário para adicionar interatividade.

Até mais!
