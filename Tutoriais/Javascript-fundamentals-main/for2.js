const notas = [5.3, 6.7, 6.8, 9.8, 7.2 ]

for( let i in notas){
    console.log(i, notas[i])
}

const pessoa = {
    nome: 'Levi',
    idade: 13,
    peso: 65
}
for(let atributo in pessoa){
    console.log(`${atributo} = ${pessoa [atributo]}`)
}