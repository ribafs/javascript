const name = 'keven';
const age = 24;
const isRaining = true;

const student1 = {
    name,
    age,
    dataNascimento: new Date(),
    year: 2020
}

const student2 = {
    name: 'publio'
}

const student3 = {
    name: 'Eduardo'
}

const students = [student1, student2, student3]

for (let i = 0; i < students.length; i++) { // FOR
    console.log(students[i].name)
}

console.log("----------------------------")

for (const student of students) { // FOR OF
    console.log(student.name)
}

console.log("----------------------------")

for (const studentKeys in student1) { // FOR IN
    console.log(studentKeys, student1[studentKeys])
}

console.log("----------------------------")

console.log(student1["age"])

const personalData = 'cpf';
const personalInfo = '121.1..1..1.1';

const accountBank = {
    name,
    age,
    [personalData]: personalData // Dynamic data mapping
}

const city = {
    habitants: 1234,
    name: 'Recife',
    state: 'Pernambuco'
}

delete city.name;

console.log("----------------------------")

const status = () => {};

switch (typeof status) {
    case "number": {
        console.log("Opa, number")
        break;
    }

    case "function": {
        console.log("Opa function")
        break;
    }

    case "string": {
        console.log("Opa string")
        break;
    }

    default: {
        console.log("Caso default")
    }
}

console.log("----------------------------")


