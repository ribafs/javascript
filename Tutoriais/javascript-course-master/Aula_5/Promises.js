const request = require("request");
const requestPromise = require("request-promise");

const WaitTimeOut = (timeOut) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Executou!")
            resolve(['Keven', 'Leone']);
        }, timeOut)
    })
}

const url = "https://jsonplaceholder.typicode.com/posts";
const options = {
  headers: {
    "content-type": "application/json",
  },
};

const onSuccess = () => {
    console.log("Opa, sucesso")
}

// request.get(url, options, (error, response, body) => {
//     if (error) {
//       console.log(error);
//       return;
//     }
  
//     console.log("Requisição");
//   });

// requestPromise
// .get(url, options)
// .then((body) => {
//   console.log("Return Promise");
// })
// .catch((error) => {
//   console.log(error);
// });

// const body = await requestPromise.get(url, options)

(async () => {
    console.log("Rodando")

    try {
       await Promise.all([
            WaitTimeOut(1000),
            WaitTimeOut(2000),
            WaitTimeOut(3000)
        ])
        console.log("Fim do promise all")
    } catch (error) {
        console.log(error)
    }

    console.log("Finalizando")
})()































// const WaitTimeOut = (comErro) => {
//     return new Promise((resolve, reject) => {
//         if (comErro) {
//             return reject("Você pediu")
//         }
//         setTimeout(() => {
//             console.log("Fim!")
//             resolve(['Keven', 'Leone']);
//         }, 2000)
//     })
// }

// const getAlunosBanco = () => {
//     WaitTimeOut(true).then((alunos) => {
//         console.log(alunos)
//     }).catch((error) => {
//         console.log(error)
//     })
//     // return ['Keven', 'Leone']
// };

// const alunos = getAlunosBanco(); // Chamada ao banco de dados

// processo A
// processo B
// processo C

// console.log(alunos)
