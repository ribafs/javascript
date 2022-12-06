// const fruits = ['apple', 'pineaple', 'banana'];
// const newArray = [...cars, ...fruits]

const mainData = {
  city: "Recife",
  state: "Pernambuco",
  country: "Brasil",
  continent: "America Latina",
  habitantsNumber: 100000000,
  colleges: {
    name: "UFPE",
    num: 1,
    string: "keven",
    abc: 123,
    zzz: 1234
  }
};

const student = {
  city: "Caruaru",
  name: "keven",
  school: "UPE",
};

const student2 = {
  city: "Recife",
  name: "Erik",
  school: "UPE",
};

const { city, colleges, school } = mainData; // Nova forma com Destructuring
const { name, ...collegesData } = colleges; // Destructuring e Spread

const collegesData2 = {
  // Forma antiga
  num: mainData.colleges.num,
  string: mainData.colleges.string,
};

const [
  { name: studentName1, ...restStudent1 },
  { name: studentName2, ...restStudent2 },
] = [student, student2];

let [car1, car2] = ['mitsu', 'volks'];

car1 = 'camaro';

console.log(car1);

console.log(student2)

const automovel = {
    nome: 'hb20',
    marca: 'Hyundai',
    modelo: 'hb'
}

const automovelComCor = {
    ...automovel,
    cor: 'amarelo'
}

automovelComCor.cor = 'preto'

delete automovelComCor.modelo

console.log(automovelComCor)

const sum = (numberA, ...numbers) => {
    let finalNumber = numberA;
    for (const number of numbers) {
        finalNumber += number;
    }

    return finalNumber
};

const nome = 'keven';
const nomeMaiusculo = nome.toUpperCase();

// nome = nome.toUpperCase() // "KEVEN"

console.log(sum(10, 2, 3, 4, 5, 6))
