# Como gerar o array

## Com palavras em português delimitadas por aspas

Procurei um texto contendo as palavras. Eliminei as vírgulas, pontos e letras em maiúsculas. Tentei eliminar as palavras repetidas.
Copiei o texto e colei em um arquivo no VSCode. Então pesquisei todas as ocorrências de espaço em branco e as substitui por ", ".

Eu tinha isso:

procurei um texto contendo as palavras

E o VSCode me devolve isso:

procurei" "um" "texto" "contendo" "as" "palavras

Faltou apenas colocar as aspas no início da primeira palavra e ao final da última.


Também procurei uma rotina em jS para remover as palavras duplicadas de string
https://stackoverflow.com/questions/16843991/remove-occurrences-of-duplicate-words-in-a-string

Array.prototype.removeDuplicate = function(){
   var result = [];
   for(var i =0; i < this.length ; i++){
       if(result.indexOf(this[i]) == -1) result.push(this[i]);
   }
   return result;
}
var str = "spanner, span, spaniel, span";
str = str.replace(/[ ]/g,"").split(",").removeDuplicate().join(", ");


Mudar a palavra Corretas

Quando for a primeira palavra mostrar apenas Correta 
E Corretas quando mais de uma
