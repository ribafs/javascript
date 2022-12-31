const produtos = [
    {nome: 'Notebook', preco: 2499, fragil: true},
    {nome: 'Ipad pro', preco:4235, fragil: true},
    {nome: 'Copo plástico', preco: 23.44, fragil: false},
    {nome: 'copo vidro', preco: 25.99, fragil: true},
    {nome: 'Geladeira', preco: 4000, fragil: false},
    {nome: 'fogão', preco: 4060, fragil: false}
]

console.log(produtos.filter(function(p){
    return p.preco > 2000 && p.fragil
}))