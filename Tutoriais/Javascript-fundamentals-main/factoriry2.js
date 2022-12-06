function CriarProduto(nome, preco){
    return{
        nome, 
        preco,
        desconto: 0.1
    }
}

console.log(CriarProduto('notebook', 2199.99 ))
