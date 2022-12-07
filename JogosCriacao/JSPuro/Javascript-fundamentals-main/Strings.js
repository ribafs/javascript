const escola = "cod3r"
console.log (escola. charAt(4))
console.log(escola.charAt(5))

console.log(escola.charCodeAt(3))

console.log(escola.indexOf('3'))

console.log(escola.substring(1))  // Imprime a partir do índice "1" até o final.
console.log(escola.substring(0, 3)) // Imprime do índice "0" até o índice "3", sem imprimir o 3 em diante

console.log('escola '.concat(escola).concat("!"))
console.log('escola '+ escola + "!")

console.log(escola.replace(3, 'e'))
console.log(escola.replace(/\d/, 'e'))
console.log(escola.replace(/\w/g, 'e'))

console.log('Ana,Maria,Pedro'.split(','))
