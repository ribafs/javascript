const [a] = [10]
console.log(a)

const [ n1, n3, n5, n6 = 0] = [10, 4, 8 , 9]
console.log(n1, n3, n5, n6)

const [, [, nota]] = [[, 8, 8], [9, 6, 8]]
console.log(nota)