//par nome / valor
const saudacao = 'Opa!' // contexto léxico 1

function exec() {
    const saudacao = 'Falaaa'  // contexto léxico 2
    return saudacao
}

//objetos são grupos aninhadosde de pares nome/valor
const Cliente = {
    nome: 'Paloma',
    idade: 22,
    peso: 62, 
    endereço: {
        logradouro: 'Rua Frei Henrique',
        numero: 437
    }
}

console.log(saudacao)
console.log(exec())
console.log(Cliente)