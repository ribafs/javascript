const alunos = [
    {nome:'João', nota: 7.3, bolsista: false },
    {nome:'Maria', nota: 9.3, bolsista: true},
    {nome:'Pedro', nota: 9.6, bolsista: false},
    {nome:'Ana', nota: 8.7, bolsista: true}
]

// Todos os alunos são bolsistas?
const todosBolsista = (resultado, bolsista) => resultado && bolsista
console.log(alunos.map(a => a.bolsista).reduce(todosBolsista))

// Algum aluno é bolsista?
const algumBolsista = (resultado, bolsista) => resultado || bolsista
console.log(alunos.map(a => a.bolsista).reduce(algumBolsista))