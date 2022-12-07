// função em JS é Fist-Class Object (Citizens)
// Higher-order function

// criar de forma literal
function fun1() { }

// armazenar em uma variável
const fun2 = function() { }

// armazenar em um array
const array = [function (a, b) { return a + b}, fun1, fun2]
console.log(array[0](2, 5))

// armazenar em um atributo de objeto
const obj = {}
obj.falar = function () { return 'Opa' }
console.log(obj.falar()) 

// passar função como paramêtro
function run(fun) {
    fun()
}

run(function () { console.log('executando...')})

// uma função pode retornar/ pode conter uma função
function soma(a, b){
    return function(c) {
        console.log(a + b + c)
    }
}

soma(4, 2)(5)