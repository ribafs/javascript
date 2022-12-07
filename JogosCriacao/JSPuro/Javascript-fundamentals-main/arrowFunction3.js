let ComparaComThis = function(param){
    console.log(this === param)
}

ComparaComThis(global)

const obj  = {}
ComparaComThis = ComparaComThis.bind(obj)
ComparaComThis(global)
ComparaComThis(obj)

let ComparaComThisArrow = param => console.log(this === param)
ComparaComThisArrow(global)
ComparaComThisArrow(module.exports)

ComparaComThisArrow = ComparaComThisArrow.bind(obj)
ComparaComThisArrow(obj)
ComparaComThisArrow(module.exports)