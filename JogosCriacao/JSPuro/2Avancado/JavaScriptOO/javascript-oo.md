# JavaScript Orientado a Objetos

Classes em JavaScript são introduzidas no ECMAScript 2015 e são simplificações da linguagem para as heranças baseadas nos protótipos. A sintaxe para classes não introduz um novo modelo de herança de orientação a objetos em JavaScript. Classes em JavaScript provêm uma maneira mais simples e clara de criar objetos e lidar com herança.

Definindo classes

As Classes são, de fato, "funções especiais", e, assim como você pode definir "function expressions" e "function declarations", a sintaxe de uma classe possui dois componentes: "class expressions" e  "class declarations".
Declarando classes

Programação Orientada a Objetos

Programação Orientada a Objetos é um paradigma de programação que usa abstração para criar modelos baseados no mundo real. POO usa várias técnicas vindas de paradigmas previamente estabelecidos, incluindo modularidade, polimorfismo e encapsulamento. Atualmente, muitas linguagens de programação populares (como Java, JavaScript, C #, C ++, Python, PHP, Ruby e Objective-C) permitem a programação orientada a objetos (POO).

A POO pode ser vista como o projeto de software utilizando uma coleção de objetos em cooperação, em oposição a uma vista tradicional, em que um programa pode ser visto como uma série de funções, ou simplesmente como uma lista de instruções para o computador. Em OOP, cada objeto é capaz de receber mensagens, processar dados e envio de mensagens para outros objetos. Cada objeto pode ser visto como uma pequena máquina independente, com um papel ou responsabilidade distinta.

A POO se destina a promover uma maior flexibilidade e facilidade de manutenção na aplicação, e é muito popular em engenharia de softwares de grande escala. Em virtude de sua forte ênfase na modularidade, código orientado a objetos destina-se a ser mais simples de desenvolver e mais fácil de entender mais tarde, prestando-se a uma análise mais direta, codificação e compreensão de situações e procedimentos mais complexos do que nos métodos de programação menos modulares.
Terminologia

Namespaces
    Um recipiente que permite empacotar todas as funcionalidades em um nome único e específico da aplicação.

Classe
    Define as características do objeto. Uma classe é uma definição modelo das propriedades e métodos de um objeto.
Objeto
    Um exemplar de uma classe.
Atributo
    Uma característica do objeto, como cor, modelo, fabricante se estivemos representando um veículo, por exemplo.
Método
    Uma ação do objeto, como ligar, desligar, frear se estivemos representando um veículo, por exemplo. É uma subrotina ou função associada a uma classe.
Construtor
    Um método chamado assim que um novo exemplar do objeto for criado. Ele geralmente tem o mesmo nome da classe que o contém.
Herança
    Uma classe pode herdar características de outra classe.
Encapsulamento
    Uma maneira de agrupar os dados e os métodos que usam os dados.
Abstração
    A conjunção de herança complexa, métodos, propriedades de um objeto devem refletir adequadamente um modelo da realidade.
Polimorfismo
    Diferentes classes podem definir o mesmo método ou propriedade.

Para uma descrição mais extensiva sobre programação orientada a objetos, veja Orientação a objetos na Wikipédia.


Uma maneira de definir uma classe é usando uma declaração de classe. Para declarar uma classe, você deve usar a palavra-chave class seguida pelo nome da classe (aqui "Retangulo").

class Retangulo {
  constructor(altura, largura) {
    this.altura = altura;
    this.largura = largura;
  }
}

Uso antes da declaração (Hoisting - Tradução Literal: Lançamento)

Uma diferença importante entre declarações de funções das declarações de classes, é que  declararações de  funções são hoisted e declarações de classes não são. Primeiramente deve declarar sua classe para só então acessá-la, pois do contrário o código a seguir irá lançar uma exceção: ReferenceError:

const p = new Retangulo(); // Erro de referência (ReferenceError)

class Retangulo {}

Expressões de Classes

Uma Expressão de Classe (class expression) é outra forma para definir classes. Expressões de Classes podem possuir nomes ou não (anônimas). O nome dado para uma expressão de classe é local ao corpo da classe.

// sem nome
let Retangulo = class {
  constructor(altura, largura) {
    this.altura = altura; 
    this.largura = largura;
  }
};

// nomeada
let Retangulo = class Retangulo {
  constructor(altura, largura) { 
    this.altura = altura;
    this.largura = largura;
  }
};

Nota: As expressões de classe também sofrem com o mesmo problema de hoisted mencionados em declarações de classe.

Métodos Protótipos

Veja também definições de métodos (method definitions).

class Retangulo {
    constructor(altura, largura) {
      this.altura = altura; this.largura = largura;
    }
  //Getter
    get area() {
        return this.calculaArea()  
    }  
  
    calculaArea() {  
        return this.altura * this.largura;  
    }
}

const quadrado = new Retangulo(10, 10);

console.log(quadrado.area);

Métodos estáticos

A palavra-chave static define um método estático de uma classe. Métodos estáticos são chamados sem a instanciação da sua classe e não podem ser chamados quando a classe é instanciada. Métodos estáticos são geralmente usados para criar funções de utilidades por uma aplicação.

class Ponto {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distancia(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
    }
}

const p1 = new Ponto(5, 5);
const p2 = new Ponto(10, 10);

p1.distancia; //undefined
p2.distancia; //undefined

console.log(Ponto.distancia(p1, p2));

Empacotando com protótipos e métodos estáticos

Quando um método estático ou protótipo é chamado sem um objeto "this" configurado (ou com "this" como boolean, string, number, undefined ou null), então o valor "this" será undefined dentro da função chamada. Autoboxing não vai acontecer. O comportamento será o mesmo mesmo se escrevemos o código no modo não-estrito.

class Animal { 
  falar() {
    return this;
  }
  static comer() {
    return this;
  }
}

let obj = new Animal();
obj.falar(); // Animal {}
let falar = obj.falar;
falar(); // undefined

Animal.comer(); // class Animal
let comer = Animal.comer;
comer(); // undefined

Se escrevemos o código acima usando classes baseadas em função tradicional, então o autoboxing acontecerá com base no valor de "this" para o qual a função foi chamada.

function Animal() { }

Animal.prototype.falar = function() {
  return this;
}

Animal.comer = function() {
  return this;
}

let obj = new Animal();
let falar = obj.falar;
falar(); // objeto global

let comer = Animal.comer;
comer(); // objeto global

Propriedades de instância

Propriedades de instâncias devem ser definidas dentro dos métodos da classe:

class Retangulo {
  constructor(altura, largura) {    
    this.altura = altura;
    this.largura = largura;
  }
}

Propriedades de dados estáticos e propriedades de dados prototipados (prototype) devem ser definidos fora da declaração do corpo da classe.

Retangulo.larguraEstatico = 20;
Retangulo.prototype.larguraPrototipagem = 25;

Sub classes com o extends

A palavra-chave extends é usada em uma declaração de classe, ou em uma expressão de classe para criar uma classe como filha de uma outra classe.

class Animal { 
  constructor(nome) {
    this.nome = nome;
  }
  
  falar() {
    console.log(this.nome + ' emite um barulho.');
  }
}

class Cachorro extends Animal {
  falar() {
    console.log(this.nome + ' latidos.');
  }
}

let cachorro = new Cachorro('Mat');
cachorro.falar();

Se existir um contrutor nas subclasses, é necessário primeiro chamar super() antes de usar a keyword "this".

Também é possivel ampliar (extends) "classes" baseadas em funções tradicionais.

function Animal (nome) {
  this.nome = nome;
}

Animal.prototype.falar = function() {
   console.log(this.nome + ' faça barulho.');
}

class Cachorro extends Animal { 
  falar() {
    console.log(this.nome + ' lati.');
  }
}

let cachorro = new Cachorro('Mitzie');
cachorro.falar(); // Mitzie lati.

Note que classes não extendem objetos normais (não construíveis). Se você quer herdar de um objeto, é necessário utilizar Object.setPrototypeOf():

let Animal = {
   falar() {
      console.log(this.nome + ' faça barulho.');
   }
};

class Cachorro {
   constructor(nome) {
      this.nome = nome;
   }
}

Object.setPrototypeOf(Cachorro.prototype, Animal); 

let cachorro = new Cachorro('Mitzie');
cachorro.falar(); //Mitzie faça barulho.

Species

Você pode querer retornar um objeto Array na sua classe MinhaArray derivada de array. O padrão Species permite a sobrescrita do construtor padrão.

Por exemplo, quando utilizando um método como map() que retorna o construtor padrão, você pode querer que esse método retorne um objeto Array ao invés do objeto MinhaArray. O Symbol.species te permite fazer isso:

class MinhaArray extends Array {
   // Sobrescreve species para o construtor da classe pai Array
   static get [Symbol.species]() { return Array; }
}

let a = new MinhaArray(1,2,3);
let mapped = a.map(x => x * x);
 
console.log(mapped instanceof MyArray); // false
console.log(mapped instanceof Array); // true

Chamada da classe pai com super

A palavra-chave (keyword) super é utilizada para chamar funções que pertencem ao pai do objeto.

class Gato {
   constructor(nome) {
      this.nome = nome;
   }

   falar() {
      console.log(this.nome + ' faça barulho.');
   }
}

class Leao extends Gato {
   falar() {
      super.falar();
      console.log(this.nome + ' roars.');
   }
}

let leao = new Leao('Fuzzy');
leao.falar();

// Fuzzy faça barulho.
// Fuzzy roars.

Mix-ins

Subclasses abstratas ou mix-ins são templates para classes. Uma classe do ECMAScript pode apenas ter uma classe pai, assim sendo, não é possível a classe ter herança múltipla.

Para se ter um comportamento similar ao de herança múltipla no ECMAScript usa-se mix-ins, uma forma de implementar mix-ins é usar um template de subclasse que é uma função que instancia uma classe base e retorna uma subclasse extendida desta classe base:

class Humano {
  constructor(nome) { 
    this.nome = nome;
  }
  andar() { 
    return this.nome+' andou um passo'
  }
}

const HumanoFalante = Base => class extends Base {
  falar() { 
    return this.nome+' diz: olá mundo!'
  }
}

const HumanoFalanteMixado = Base => class extends Base {}

const HumanoFinal = HumanoFalanteMixado(HumanoFalante(Humano))

const humano = new HumanoFinal('Bill Gates')

console.log(humano.andar())
console.log(humano.falar())


