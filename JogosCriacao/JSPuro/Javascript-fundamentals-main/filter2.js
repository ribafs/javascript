Array.prototype.filter2 = function(callback) {
    const newArray = []
    for(let i = 0; i < this.length; i++ )
    if(callback(this[i], i, this)) {
        newArray.push(this[i])
    }
    return newArray
}

const produtos = [
    {nome: 'Notebook', preco: 2499, fragil: true},
    {nome: 'Ipad pro', preco:4235, fragil: true},
    {nome: 'Copo plástico', preco: 23.44, fragil: false},
    {nome: 'copo vidro', preco: 25.99, fragil: true},
    {nome: 'Geladeira', preco: 4000, fragil: false},
    {nome: 'fogão', preco: 4060, fragil: false}
]

console.log(produtos.filter2(function(p){
    return p.preco > 2000 && p.fragil
}))