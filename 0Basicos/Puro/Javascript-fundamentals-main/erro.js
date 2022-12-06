function tratarErroELancar(erro) {
       // throw new Error('...')
        //throw 10
       // throw true
       // throw 'mensagem'
       throw {
           nome: erro.name,
           msg: erro.message,
           date: new Date

       }
}

function ImprimirNomeGritando(obj){
    try{
        console.log(obj.name.toUpercase() + '!!!')
    } catch (e)  {
        tratarErroELancar(e)
     } finally { 
         console.log('final')
     }
}

const obj = {nome: 'Roberto'}
ImprimirNomeGritando(obj)