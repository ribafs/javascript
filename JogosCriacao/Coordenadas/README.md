# Coornedanas em Javascript

Para mover elementos ao redor, é necessário aprender sobre coordenadas. A maioria dos métodos JavaScript opera com um dos dois sistemas de coordenadas a seguir: Relativo à janela/window e relativo ao documento/document. 

O primeiro sistema usa position:fixed e é calculado a partir da borda superior/esquerda da janela/window. Suas coordenadas serão indicadas como clientX/clientY.

O segundo usa position:absolute e é calculado a partir da borda superior/esquerda do document. Eles serão indicados como páginaX/páginaY.

Essas coordenadas são iguais quando a página é rolada até o início, da mesma forma que o canto superior/esquerdo da janela é o canto superior/esquerdo do documento. No entanto, quando o documento muda, as coordenadas relativas à janela dos elementos mudam: elas se movem pela janela e as coordenadas relativas ao documento permanecem da mesma maneira.

Exemplo

1.html

Assim, para a páginaY a coordenada relativa ao documento permaneceu a mesma, sendo contada a partir do topo do documento. Para clientY, a coordenada relativa à janela foi modificada, tornando a seta mais curta. Isso porque o mesmo ponto ficou mais próximo do topo da janela.

Coordenadas do elemento: getBoundingClientRect

O método elem.getBoundingClientRect() retorna as coordenadas da janela para um retângulo mínimo envolvendo elem como um objeto de classe DOMRect. DOMRect tem duas propriedades primárias: x/y e largura/altura. A primeira propriedade abrange as coordenadas de origem do retângulo X/Y em relação à janela. O segundo inclui a largura e a altura do retângulo. Também pode ser negativo.

Há também propriedades derivadas adicionais, como top/bottom e left/right . O primeiro inclui a coordenada Y para a borda superior/inferior do retângulo. A segunda - a coordenada X para a borda esquerda/direita do retângulo.

Exemplo

2.html

Ao rolar o exemplo 2.html e repetir, pode-se notar que, à medida que a posição do botão relativo à janela muda, suas coordenadas de janela são modificadas em paralelo. A imagem da saída elem.getBoundingClientRect() terá a seguinte aparência:

3.html

Por favor, leve em consideração que frações decimais podem ser usadas para coordenadas. Por exemplo, 10.5. Não há necessidade de arredondá-los ao definir style.left/top.

Além disso, coordenadas negativas podem ser usadas. Por exemplo, se você rolar a página de forma que elem fique acima da janela, então elem.getBoundingClientRect().top será negativo.

Existem algumas semelhanças entre as coordenadas relativas à janela e a posição CSS:fixed. Mas também há diferenças. Por exemplo, no posicionamento CSS, a propriedade right considera a distância da borda e o bottom- a distância da borda inferior. Em JavaScript, é diferente: todas as coordenadas da janela são contadas a partir do canto superior esquerdo.

ElementFromPoint(x, y)

Nas coordenadas da janela/window (x, y), a chamada document.elementFromPoint(x, y) retorna o elemento mais aninhado. Sua sintaxe fica assim:

let elem = document.elementFromPoint(x, y);

Para destacar e emitir a tag do elemento, que fica no meio da janela, é utilizado o código abaixo:

let centerX = document.documentElement.clientWidth / 2;
let centerY = document.documentElement.clientHeight / 2;
let el = document.elementFromPoint(centerX, centerY);
el.style.background = "green";
console.log(el.tagName);

Como as coordenadas da janela/window são usadas por ele, o elemento pode ser diferente dependendo da posição de rolagem atual.

O método document.elementFromPoint(x,y) opera somente quando (x,y) está na área visível.

Caso alguma coordenada exceda a largura/altura da janela ou seja negativa, será retornado nulo.

Um erro típico que pode ocorrer em caso de não verificação é o seguinte:

deixe el = document.elementFromPoint(x, y);
// se as coordenadas estiverem fora da janela, então el = null
el.estilo.fundo = ''; // Erro!

Posicionamento “fixo”

Principalmente, as coordenadas são usadas para posicionar algo.

O método getBoundingClientRect pode ser usado para mostrar algo próximo a um elemento. Ele é usado para obter suas coordenadas e, em seguida, o CSS getBoundingClientRect com right/bottom e left/top é usado.

## Referência

https://www.w3docs.com/learn-javascript/javascript-coordinates.html


