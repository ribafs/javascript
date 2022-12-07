function carro(velocidadeMaxima = 200, delta = 5){
    // atributo ptivado
    let velocidaAtual = 0

    // metodo publico
    this.acelerar = function () {
        if (velocidadeMaxima + delta <= velocidadeMaxima){
            velocidaAtual += delta
        } else {
            velocidaAtual = velocidadeMaxima
        }
    }
}

//metodo publico
this.getVelocidadeAtual = function(){
    return velocidaAtual
}

const uno = new carro
uno.acelerar()
console.log(uno.getVelocidadeAtual()) 

const ferrari = new carro(320, 40)
ferrari.acelerar()
ferrari.acelerar()
ferrari.acelerar()
ferrari.acelerar()
console.log(ferrari.getVelocidadeAtual())

console.log(typeof carro)
