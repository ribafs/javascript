class Aluno {
    constructor(nome, sobrenome, dataNascimento) {
        this.primeiroNome = nome;
        this.segundoNome = sobrenome;
        this.dataNascimento = dataNascimento;
        console.log("Executando")
    }

    getFullName() {
       console.log(`${this.primeiroNome} ${this.segundoNome} - ${this.dataNascimento}`)
    }
}

const firstDayOfYear = new Date(2020, 0, 20);

const aluno = new Aluno("Keven", "Leone", new Date());
const aluno2 = new Aluno("Eduardo", "Erik", new Date());

for (const alunoX of [aluno, aluno2]) {
    // console.log(alunoX)
    for (const key in alunoX) {
        if (alunoX.hasOwnProperty(key)) {
            const element = alunoX[key];
            console.log({element})
        }
    }
}

// aluno.getFullName()
// aluno2.getFullName()