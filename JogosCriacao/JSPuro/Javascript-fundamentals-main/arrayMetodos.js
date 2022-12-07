const pilotos = ['Vettel', 'Alonso', 'Raikkonen', 'Massa']
pilotos.pop() // remove o ultimo elemento do array.
console.log(pilotos)

pilotos.push('Verstappen') // push adiciona um elemento na ultima posição do array
console.log(pilotos)

pilotos.shift() // remove o primeiro elemento do array
console.log(pilotos)

pilotos.unshift('Hamilton') // adiciona um elemento na primeira posiçao do array
console.log(pilotos)

// splice pode adicionar e romover elementos

// adicionar
pilotos.splice(2, 0 , 'Bottas', 'Massa') // (indica o indice, nº de removidos, indices que foram adicionados. )
console.log(pilotos)

// remover
pilotos.splice(3, 1)
console.log(pilotos)

const algunsPilotos1 = pilotos.slice(2) // retorna um novo array, a partir do indice indicado ()
console.log(algunsPilotos1)

const algunsPilotos2 = pilotos.slice(1, 4) // novo array excluindo o ultimo elemento indicado ()
