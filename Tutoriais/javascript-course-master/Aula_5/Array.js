let alunos = ['keven', 'publio', 'eduardo', 'rodrigo', 'ricardo'];

const aluno = alunos[alunos.length - 1]

alunos = ["Erik", ...alunos];

// map, filter, find, foreach

// for (const aluno of alunos) {
//     console.log(aluno)
// }

const processaAluno = (aluno, id) => ({id, nome: aluno})
const filtraAluno = aluno => aluno.nome.startsWith("r")
const getAlunoKeven = aluno => aluno.nome === "keven"

const alunosObj = alunos.map(processaAluno);
const alunosComR = alunosObj.filter(filtraAluno);
const alunoR = alunosObj.find(getAlunoKeven)

const sumFor = (...numbers) => {
    let finalNumber = 0;
    for (const number of numbers) {
        finalNumber += number;
    }

    return finalNumber
};

const sumReducer = (...numbers) => {
    const finalNumber = numbers.reduce((valorA, valorB) => {
        return valorA + valorB
    })

    return finalNumber
}

const sumReducerB = (...numbers) => {
    return numbers.reduce((valorA, valorB) => valorA + valorB)
}

const sumReducerC = (...numbers) => numbers.reduce((valorA, valorB) => valorA + valorB)

console.log(alunoR)

// console.log(sumFor(10, 2, 3, 4, 5, 6))
// console.log(sumReducer(10, 2, 3, 4, 5, 6))
// console.log(sumReducerB(10, 2, 3, 4, 5, 6))
// console.log(sumReducerC(10, 2, 3, 4, 5, 6))
