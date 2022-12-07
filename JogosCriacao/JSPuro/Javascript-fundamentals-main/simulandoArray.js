const quaseArray = {0: 'Rafa', 1: 'Bia', 2: 'Ana'}
console.log(quaseArray)
Object.defineProperty(quaseArray, 'toString',{
    value: function() { return Object.values(this)},
    enumerable: false
})

console.log(quaseArray[0])

const meuArray = ['Rafa', 'Bia', 'Ana']  
console.log(quaseArray.toString(), meuArray)
