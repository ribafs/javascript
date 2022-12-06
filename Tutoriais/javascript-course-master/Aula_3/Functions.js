function connectaBanco() {
    console.log("Conectado")
}

(() => { // Função Anonima
    console.log("Conectado!")
})

const connectaBanco2 = (nomeBanco, callback) => {
    if (nomeBanco === 'alunos') {
        callback(["Keven", "Erik", "Públio"])
    } else {
        callback(null, "Banco não existe!")
    }
}

const CallBackBanco = (sucesso, error) => {
    if (sucesso) {
        console.log({sucesso})
    } else {
        console.log({error})
    }
}

const soma = (valor, valor2, multiplicaFunction) => {
    return multiplicaFunction(valor + valor2);
}

soma(1,2, function(total) {
    console.log(total * 2)
})





