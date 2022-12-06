Array.prototype.forEach2 = function(callback) { // criei uma função associada ao prototype de Array chamada forEach2,
    for (let i = 0; i < this.length; i++) {     // essa função recebe um callback, e pra cada uma das interações
        callback(this[i], i, this)
    }
}

const aprovados = ['Agata', 'Bruno', 'Hugo', 'Ana']

aprovados.forEach2(function(nome, indice) {
    console.log(`${indice + 1} ${nome}`)
})