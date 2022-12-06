// STRING
// toLowerCase()
// toUpperCase()
// repeat()
// charAt
// replace
// split
// substr
// substring

// ---------------

// Keven Leone Dos Santos

let arrayComposto = [];
const nome = "Keven Leone dos Santos";

const getComposto = (name, index, allData) => {
    if (index % 2) {
        arrayComposto.push([`${allData[index - 1]} ${name}`])
    }
}

const nomeSeparado = nome.split(" ");

nomeSeparado.forEach(getComposto)

console.log(`${nomeSeparado[nomeSeparado.length - 1]}, ${nomeSeparado[0]} ${nomeSeparado[1]}`)

console.log(new Date().getFullYear())

const aluno = {
    name: 'keven',
    idade: 24,
    account: {
        tipo: 'PJ',
        account: 1231203123
    }
}

const keys = Object.keys(aluno) // OBJECT

const alunoString = JSON.stringify(aluno) // JSON
const alunoObject = JSON.parse(alunoString); // JSON

console.log(alunoObject)

