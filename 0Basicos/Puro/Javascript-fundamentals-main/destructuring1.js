// novo recurso do ES2015

const pessoa = {
    nome: 'Bruno',
    apelido: 'meu noivo',
    idade: 30,
    endereco:{
        logradouro: 'Rua dos Bananas',
        numero: 24
    }
}
           

const { nome, apelido} = pessoa
console.log(nome, apelido)         

const { nome: n, apelido: a} = pessoa
console.log(n, a)

const { endereco: { logradouro, numero}} = pessoa
console.log(logradouro, numero)

