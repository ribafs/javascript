// usando a notação literal
const obj1 = {}
console.log(obj1)

//object em JS
console.log(typeof Object, typeof new Object)
const obj2 = new Object
console.log(obj2)

// funções construturas 
function produto(nome, preco, desc){
    this.nome = nome
    this.getPrecoComDesconto = () => {
        return preco * (1 - desc)
    }
}

const p1 = new produto('caneta', 7.99, 0,15)
const p2 = new produto('notebook', 2889.99, )

// função factory
function criarFuncionario(nome, salarioBase, faltas){
    return{
        nome,
        salarioBase,
        faltas,
        getSalario(){
            return(salarioBase / 30) * (30 - faltas)
        }
    }
}

const f1 = criarFuncionario('João', 7980, 4)
const f2 = criarFuncionario('Maria', 11470, 1)
console.log(f1.getSalario(), f2.getSalario()) 

// Object.create
const filha = Object.create(null)
filha.nome = 'Ana'
console.log(filha)

// Uma função famosa que retorna objeto..
const fromJSON = JSON.parse('{"info": "sou um JSON"}')
console.log(fromJSON.info)