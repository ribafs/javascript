// Closure é o escorpo criado quando uma função é declarada
// Esse escorpo permite a função acessar e manipular variaveis externas

// contexto léxico em ação

const x ='global'

function fora() {
    const x = 'local'
    function dentro(){
        return x

    }
    return dentro
}

const minhaFuncao = fora()
console.log(minhaFuncao())