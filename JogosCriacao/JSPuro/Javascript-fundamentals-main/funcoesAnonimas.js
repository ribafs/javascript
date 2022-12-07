const soma  = function(x, y){
    return x + y
}

const ImprimirResultado = function(a, b, operacao = soma){
    console.log(operacao(a, b))
}

ImprimirResultado(3, 4)
ImprimirResultado(3, 4, soma)
ImprimirResultado(3, 4, function( x, y){
    return x - y 
})
ImprimirResultado(3, 4, (x, y) => x * y)

const pessoa = {
    falar: function(){
        console.log('opa')
    }
}

pessoa.falar()