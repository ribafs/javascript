//#################################################
//############### Pastinha 0.9 ####################
//## Biblioteca Javascript para Pasta com Abas ####
//#################################################
// ################################################
//#################################################
//###### Autor: DANTE VASCONCELOS MEIRA ###########
//######    Licença: domínio público    ###########
//#################################################
// ################################################
// ################################################
// Para utilizar a biblioteca faça a chamada ao 
// arquivo pastinha-v0.9.js no <head>  da sua página
// e utilize as tags HTML customizadas <uma-pasta> 
// e <uma-aba>, fechadas respectivamente com as tags
// </uma-pasta> e </uma-aba>, para criar a estrutura
// de pastas com abas dentro das pastas.
// ################################################
// ################################################
// ################################################


//função para procurar atributo de uma classe nas stylesheets de CSS
function  encontraAtributo(classes, atributo){
       if(classes.trim().length < 1){ var retorno = "!cne";  return(retorno); }
       if(atributo.trim().length < 1){ var retorno = "!ane";  return(retorno); }
       if(document.styleSheets.length===0){ var retorno = "!cne";  return(retorno); } //classe não encontrada 
       
       var classesArray = classes.split(" ");        
         
         for(var j=0; j<classesArray.length; j++) { 
 
           if(classesArray[j].trim().length > 0){ 
           
                    for(var i=0; i<document.styleSheets.length; i++) {
                      var sheet = document.styleSheets[i];
                       
                      var c1 = 0;
                       for (var n = 0; n < sheet.cssRules.length; n++){ 

                            if (sheet.cssRules[n].selectorText == "."+classesArray[j].trim()){ 
                                      var cssText = sheet.cssRules[n].cssText;
                                      var innerRules =  ( cssText.split("{")[1] ).split("}") ;    

                                      var regras = innerRules[0].split(";"); 
                                      
                                      var c2 = 0;
                                        for (x = 0; x < regras.length-1; x++){
                                             var atribArray = regras[x].split(":");
                                             var nomedoatrib = atribArray[0].trim(); 
                                             if(nomedoatrib == atributo){
                                               c2++; 
                                               return(atribArray[1]);
                                             }
                                        }
                            
                                     c1++;     
                                  }
                              } // fim do for que procura a classe         
 
                       } // fim do loop procurando as StyleSheets           

           
              } // se não for só um espaço em branco
         
          } // fim do loop das multiplas classes
          
                     
                                      if ( c2 == 0) {
                                              var retorno = "!ane"; //atributo não encontrado   
                                              return(retorno);                  
                                         } 
           
                     if ( c1 == 0) {
                              var retorno = "!cne"; //classe não encontrada 
                              return(retorno);                  
                                     }                        
           
   } // fim da função encontraAtributo
   
   
   function doThisFirst(myCallbackFunction) {

    alert(myCallbackFunction);

    // Now call the function passed in
    myCallbackFunction();
}


// função para trocar a aba focalizada de uma pasta
function TrocaAbaFocalizada(pastaid, abaord){ 

let AbasArray = document.getElementById(pastaid).getElementsByTagName('uma-aba');

 for(var i = 0; i < AbasArray.length; i++){ 
     if(AbasArray[i].parentElement.id == pastaid){
         if(AbasArray[i].ordem == abaord){
            document.getElementById(pastaid+'corpoAba'+AbasArray[i].ordem).style.display = 'block';			     
			      document.getElementById(pastaid+'orelhaAba'+AbasArray[i].ordem).style.cursor = "default"; 
			      if(document.getElementById(pastaid).corOrelhaAbaFocalizada != 'mesma') { 
			            document.getElementById(pastaid+'orelhaAba'+AbasArray[i].ordem).style.backgroundColor = document.getElementById(pastaid).corOrelhaAbaFocalizada;
			        }else{
			            document.getElementById(pastaid+'orelhaAba'+AbasArray[i].ordem).style.backgroundColor = document.getElementById(pastaid+'corpoAba'+AbasArray[i].ordem).corOrelha;	 
			        }
         }else{
             document.getElementById(pastaid+'corpoAba'+AbasArray[i].ordem).style.display = 'none';
			       document.getElementById(pastaid+'orelhaAba'+AbasArray[i].ordem).style.backgroundColor =  document.getElementById(pastaid+'corpoAba'+AbasArray[i].ordem).corOrelha;	 
			       document.getElementById(pastaid+'orelhaAba'+AbasArray[i].ordem).style.cursor = "pointer";
        }   
     }

   }
    document.getElementById(pastaid).abaFocalizada = abaord;
   
   //verificando se há uma função "extra" a ser executada no OnClick da orelha da aba, passada pelo atributo "clica-orelha"
   var funcao =  document.getElementById(pastaid+'corpoAba'+abaord).clicaOrelha;
   if (document.getElementById(pastaid+'corpoAba'+abaord).clicaOrelha != 'nofunction'){
          document.getElementById(pastaid+'orelhaAba'+abaord).setAttribute("onclick",funcao) ; // muda o OnClick
          document.getElementById(pastaid+'orelhaAba'+abaord).click(); // simula um clique
          document.getElementById(pastaid+'orelhaAba'+abaord).setAttribute( "onclick","TrocaAbaFocalizada('"+ pastaid +"', '"+ abaord +"')" ) ;  //restaura o OnClick original    
   
    } 
		   
}

// função para onMouseOver
function MouseSobreOrelha(orelhaid){
if(document.getElementById(orelhaid).parentElement.abaFocalizada != document.getElementById(orelhaid).ordem){
   document.getElementById(orelhaid).style.backgroundColor = document.getElementById(orelhaid).parentElement.corOrelhaAbaHover;
}
}

// função para onMouseOut
function MouseDeixaOrelha(pastaid, ordem){
var orelhaid =  pastaid+"orelhaAba"+ordem;
var abaid = pastaid+"corpoAba"+ordem;

if(document.getElementById(orelhaid).parentElement.abaFocalizada == document.getElementById(orelhaid).ordem){
   document.getElementById(orelhaid).style.backgroundColor = document.getElementById(orelhaid).parentElement.corOrelhaAbaFocalizada;
}else{
   document.getElementById(orelhaid).style.backgroundColor = document.getElementById(abaid).corOrelha;
  
}

}

//############################################################################################################
// classe Aba
//############################################################################################################
class Aba extends HTMLElement  {	
	connectedCallback(){ 
	      this.titulo = this.getAttribute('titulo');
	      
	       this.corOrelha = this.getAttribute('cor-orelha'); 
	       if (this.corOrelha == null){ this.corOrelha = this.parentElement.corOrelhasAbasPadrao; } 
	       
	       // o atributo clica-orelha pode ser utilizado para passar uma função "extra" (passada sem ponto e vírgula) a ser executada após o onclick original da orelha da aba (que muda a aba selecionada)
	       if ( this.hasAttribute('clica-orelha') ){ this.clicaOrelha = this.getAttribute('clica-orelha');  }else{ this.clicaOrelha ='nofunction'; }
	      
				 this.style.position = "absolute";			
				 	 
				 this.style.top =  this.parentElement.topoDoCorpo;
				 
				 this.style.left = "0%";
				 this.style.display = "block";
				 this.style.width = "99%";
				 this.style.height= "86%";
				 this.style.paddingTop= "2%";
				 this.style.paddingLeft= "1%";
				 this.style.zIndex= "1";				 
				 this.style.borderTopLeftRadius = "1px";
				 this.style.borderTopRightRadius = "1px";
				 this.style.borderBottomLeftRadius = "1px";
				 this.style.borderBottomRightRadius = "1px";
         this.style.display = "block";
         
        let arrayAbas = this.parentElement.getElementsByTagName('uma-aba');	 
       let arrayAbasMesmoNivel = new Array(); // array para filtrar apenas as abas que estão no mesmo nivel que a aba atual, ou seja, no primeiro nivel do parentElement
       
       for(var i = 0; i < arrayAbas.length; i++){	
         if(arrayAbas[i].parentElement == this.parentElement){ arrayAbasMesmoNivel.push(arrayAbas[i]); }
       }
       
        let quantAbas = arrayAbasMesmoNivel.length;
        this.ordem = quantAbas; // definindo o número de ordem da aba dentro da pasta  
            
        if (this.titulo == null){ this.titulo='Aba '+quantAbas ; }
         this.titulo = this.titulo.trim();
        
        this.id = this.parentElement.id+"corpoAba"+this.ordem;
        
        
        var corAbaCorpo = this.style.backgroundColor+" ";
	      corAbaCorpo = corAbaCorpo.trim();
	       if (corAbaCorpo.length < 1){
	          var retorno = encontraAtributo(this.className, "background-color"); // procurando atributo background-color nas stylesheets de CSS para a classe da aba (não há problema se a aba não tiver classe designada)
	          if ( (retorno != "!cne") && (retorno != "!ane")){ corAbaCorpo = retorno.trim(); }else{ corAbaCorpo = this.parentElement.corPadraoCorpoAbas;}
	       }
	       	      
        this.style.backgroundColor =  corAbaCorpo;
        
        
        var bordaCorpo = this.style.border+" ";
	      bordaCorpo = bordaCorpo.trim();
	       if (bordaCorpo.length < 1){
	          var retorno = encontraAtributo(this.className, "border"); // procurando atributo border nas stylesheets de CSS para a classe da aba (não há problema se a aba não tiver classe designada)
	          if ( (retorno != "!cne") && (retorno != "!ane")){ bordaCorpo = retorno.trim(); }else{ bordaCorpo = this.parentElement.bordaPadraoCorpoAbas } 
	       }
	        this.style.border = bordaCorpo;
         
         //verificando CSS de bordas
         
         	var raioBorda = this.parentElement.style.borderRadius+" ";
	        raioBorda = raioBorda.trim();
	       
	       if (raioBorda.length < 1){
	          var retorno = encontraAtributo(this.parentElement.className, "border-radius"); // procurando atributo border-radius nas stylesheets de CSS para a classe da pasta (não há problema se a pasta não tiver classe designada)
	          if ( (retorno != "!cne") && (retorno != "!ane")){ raioBorda = retorno.trim(); }else{ raioBorda = "defaultvalues";}
	       }
	       
	       	    var raioBordaSuperiorEsquerda = this.parentElement.style.borderTopLeftRadius+" "; // esta variável vai armazenar o raio da borda superior esquerda do CORPO de cada aba e da ORELHA da primeira aba
               raioBordaSuperiorEsquerda = raioBordaSuperiorEsquerda.trim(); 
               
               if (raioBordaSuperiorEsquerda.length < 1){
                 var retorno = encontraAtributo(this.parentElement.className, "border-top-left-radius");
                 if ( (retorno != "!cne") && (retorno != "!ane")){ raioBordaSuperiorEsquerda = retorno.trim(); }else{ raioBordaSuperiorEsquerda = "defaultvalue";}
               }
              if(raioBordaSuperiorEsquerda=="defaultvalue"){ if(raioBorda == "defaultvalues"){ raioBordaSuperiorEsquerda = "15px";}else{ raioBordaSuperiorEsquerda = raioBorda; }  } //valor default é 10px
              

	       	    var raioBordaSuperiorDireita = this.parentElement.style.borderTopRightRadius+" "; // esta variável vai armazenar o raio da borda superior direita do CORPO de cada aba e da ORELHA da última aba
               raioBordaSuperiorDireita = raioBordaSuperiorDireita.trim(); 
               
               if (raioBordaSuperiorDireita.length < 1){
                 var retorno = encontraAtributo(this.parentElement.className, "border-top-right-radius");
                 if ( (retorno != "!cne") && (retorno != "!ane")){ raioBordaSuperiorDireita = retorno.trim(); }else{ raioBordaSuperiorDireita = "defaultvalue";}
               }
              if(raioBordaSuperiorDireita=="defaultvalue"){ if(raioBorda == "defaultvalues"){ raioBordaSuperiorDireita = "15px";}else{ raioBordaSuperiorDireita = raioBorda; }  } //valor default é 0px
	       
	             var raioBordaInferiorEsquerda = this.parentElement.style.borderBottomLeftRadius+" "; // esta variável vai armazenar o raio da borda inferior esquerda do CORPO de cada aba
               raioBordaInferiorEsquerda = raioBordaInferiorEsquerda.trim(); 
               
               if (raioBordaInferiorEsquerda.length < 1){
                 var retorno = encontraAtributo(this.parentElement.className, "border-bottom-left-radius");
                 if ( (retorno != "!cne") && (retorno != "!ane")){ raioBordaInferiorEsquerda = retorno.trim(); }else{ raioBordaInferiorEsquerda = "defaultvalue";}
               }
              if(raioBordaInferiorEsquerda=="defaultvalue"){ if(raioBorda == "defaultvalues"){ raioBordaInferiorEsquerda = "15px";}else{ raioBordaInferiorEsquerda = raioBorda; }  } //valor default é 10px
              
	       
               var raioBordaInferiorDireita = this.parentElement.style.borderBottomRightRadius+" "; // esta variável vai armazenar o raio da borda inferior direita do CORPO de cada aba
               raioBordaInferiorDireita = raioBordaInferiorDireita.trim(); 
               
               if (raioBordaInferiorDireita.length < 1){
                 var retorno = encontraAtributo(this.parentElement.className, "border-bottom-right-radius");
                 if ( (retorno != "!cne") && (retorno != "!ane")){ raioBordaInferiorDireita = retorno.trim(); }else{ raioBordaInferiorDireita = "defaultvalue";}
               }
              if(raioBordaInferiorDireita=="defaultvalue"){ if(raioBorda == "defaultvalues"){ raioBordaInferiorDireita = "15px";}else{ raioBordaInferiorDireita = raioBorda; }  } //valor default é 10px
              
        this.style.borderTopLeftRadius = raioBordaSuperiorEsquerda;
				this.style.borderTopRightRadius = raioBordaSuperiorDireita;
				this.style.borderBottomLeftRadius = raioBordaInferiorEsquerda;
				this.style.borderBottomRightRadius = raioBordaInferiorDireita;
	 
	}// fim de connectedCallback()

} // fim da classe Pasta


var divzIndexOrder = new Array(); // array para armazenar a ordem de zIndex das pastas

//############################################################################################################
//classe Pasta
//############################################################################################################
class Pasta extends HTMLElement  {

     // função auxiliar que troca o texto da orelha de uma aba
      mudaTextoOrelha(ordem, novotexto){
        document.getElementById(this.id + "orelhaAba" + ordem).innerHTML = novotexto;
        } 
	
	// função principal
	connectedCallback(){ 	
	 var retorno;
	 
	 this.abaFocalizada = 1;

	 this.id = this.getAttribute('id'); 
	 if (this.id.toString() == "null"){ this.id = "pasta" + Math.floor( (Math.random() * (9000000000-2)) + 1000000001 ); }
	 
	 	this.style.display = "block";	 	
	 	this.style.zIndex = 10;	 	 	
	 this.style.position = "absolute";
	 
    // verifica se a pasta tem o atributo arrastavel
   if ( this.hasAttribute('arrastavel') ){ this.arrastavel = 's';	 }else{  this.arrastavel = 'n';	 }
   
   if (this.hasAttribute('offset-direito')) { this.offsetDireito = parseInt(this.getAttribute('offset-direito')); }else{ this.offsetDireito = 2 ; }  
   if (this.hasAttribute('offset-esquerdo')) { this.offsetEsquerdo = parseInt(this.getAttribute('offset-esquerdo')); }else{ this.offsetEsquerdo = 0 ; }  
   
   this.corOrelhasAbasPadrao = this.getAttribute('cor-padrao-orelha-abas');
   if ( this.corOrelhasAbasPadrao == null){  this.corOrelhasAbasPadrao = "#8B0000" ; }

	  this.corOrelhaAbaHover = this.getAttribute('cor-hover-orelha-abas');
   if ( this.corOrelhaAbaHover == null){ this.corOrelhaAbaHover = "#FF8C00"; }

	  this.corOrelhaAbaFocalizada = this.getAttribute('cor-orelha-aba-selecionada');
   if ( this.corOrelhaAbaFocalizada == null){ this.corOrelhaAbaFocalizada = "#DC143C"; }
	 
	 this.corPadraoCorpoAbas = this.getAttribute('cor-padrao-corpo-abas');
   if ( this.corPadraoCorpoAbas == null){ 	 this.corPadraoCorpoAbas = "#F5DEB3";	 }
   
   	this.bordaPadraoCorpoAbas = this.getAttribute('borda-padrao-corpo-abas');
   if ( this.bordaPadraoCorpoAbas == null){ 	 this.bordaPadraoCorpoAbas = "2px solid #8B0000"; } 


	 
	 		    var pastaTop = this.style.top+" ";
	         pastaTop = pastaTop.trim();
	       
	       if (pastaTop.length < 1){
	          retorno = encontraAtributo(this.className, "top"); // procurando atributo top nas stylesheets de CSS para a classe da pasta (não há problema se a pasta não tiver classe designada)
	          if ( (retorno == "!cne") || (retorno == "!ane")){ this.style.top = "2%";}  //valor default do top é 2% se não estiver configurado de outra forma no CSS inline ou CSS de classe
	       }
	       
		       var pastaLeft = this.style.left+" ";
	         pastaLeft = pastaLeft.trim();
	       
	       if (pastaLeft.length < 1){
	         retorno = encontraAtributo(this.className, "left"); // procurando atributo left nas stylesheets de CSS para a classe da pasta (não há problema se a pasta não tiver classe designada)
	          if ( (retorno == "!cne") || (retorno == "!ane")){ this.style.left = "2%";}  //valor default do left é 2% se não estiver configurado de outra forma no CSS inline ou CSS de classe
	       }
	        	       
	  		   var pastaLargura = this.style.width+" ";
	         pastaLargura = pastaLargura.trim();
	       
	       if (pastaLargura.length < 1){
	         retorno = encontraAtributo(this.className, "width"); // procurando atributo width nas stylesheets de CSS para a classe da pasta (não há problema se a pasta não tiver classe designada)
	          if ( (retorno == "!cne") || (retorno == "!ane")){ this.style.width = "50%";}  //valor default da largura é 50% se não estiver configurado de outra forma no CSS inline ou CSS de classe
	       }   
	       
	  		  var pastaAltura= this.style.height+" ";
	         pastaAltura = pastaAltura.trim();
	       
	       if (pastaAltura.length < 1){
	          retorno = encontraAtributo(this.className, "height"); // procurando atributo height nas stylesheets de CSS para a classe da pasta (não há problema se a pasta não tiver classe designada)
	          if ( (retorno == "!cne") || (retorno == "!ane")){ this.style.height = "50%";}  //valor default da altura é 50% se não estiver configurado de outra forma no CSS inline ou CSS de classe
	       }
	       
	          //tamanho padrão da fonte nas orelhas das abas
          this.tamanhoPadraoFonteOrelha = this.getAttribute('tamanho-fonte-orelhas-abas');
               if ( this.tamanhoPadraoFonteOrelha == null){  
                      if( (this.offsetHeight - this.offsetTop) > ( window.innerHeight * 0.4 ) ){ this.tamanhoPadraoFonteOrelha = "20px" ;  }else{ this.tamanhoPadraoFonteOrelha = "18px" ; }
                      
                    }
                    
            // definindo a altura padrão que as orelhas das abas devem ter, de acordo com a altura da pasta     
           if( (this.offsetHeight - this.offsetTop) > ( window.innerHeight * 0.4 ) ){ 
                 this.alturaOrelha = "10%"; 
                 var alturaNum = 10;
           }else{  
                  this.alturaOrelha = "15%"; 
                 var alturaNum = 15;        
           }           
	                           
        // calculando o atributo Top do corpo das abas de acordo com a altura das orelhas + o atributo sep-orelha-corpo (se houver)
        if (this.hasAttribute('sep-orelha-corpo')) { var separacao = this.getAttribute('sep-orelha-corpo'); }else { var separacao = "0%"; }  
          
        if ( (separacao.slice(separacao.length - 1))=='x' ){
            var sepNumPixels = parseInt(  separacao.split("p")[0] );
            var separaPorcent = ( (sepNumPixels / window.innerHeight ) * 100 );
            this.topoDoCorpo = (alturaNum + separaPorcent)+"%";
        
        } else if( (separacao.slice(separacao.length - 1))=='%' ){
            alturaNum = alturaNum + parseFloat( separacao.split("%")[0] ) 
            this.topoDoCorpo = alturaNum+"%"; 
        }
           

	       divzIndexOrder.push(this.id); // colocando a div no array de controle da ordem de zIndex

	} // fim de connectedCallback()

} // fim da classe Pasta


//############################################################################################################
// função que torna as pastas arrastáveis
//############################################################################################################
function tornaArrastavel(elmnt) {

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
    document.getElementById(elmnt.id + "mover").onmousedown = dragMouseDown;
    
    document.getElementById(elmnt.id).onmousedown = function(){
                  for (let i = divzIndexOrder.indexOf(elmnt.id); i < divzIndexOrder.length-1 ;i++){ //loop começa no index do elemento clicado e vai até o penúltimo index
                     divzIndexOrder[i] = divzIndexOrder[i+1]; // copia o id do próximo index no array
                     document.getElementById(divzIndexOrder[i]).style.zIndex =  i+10; //pega o elemento que tem a id que agora está armazenada nesta posição do array e muda o zIndex para o index atual (mais 10)                

                  }
                  
                  divzIndexOrder[divzIndexOrder.length-1]  = elmnt.id; // a id do elemento clicado é jogado para o índice de maior valor do array
                  elmnt.style.zIndex = (divzIndexOrder.length-1)+10;  // zIndex do elemento clicado é setado para o valor do último índice do array (mais 10)
                }
       
          function dragMouseDown(e) {  
                  e = e || window.event;
                  e.preventDefault();
                 
                  
                 for (let i = divzIndexOrder.indexOf(elmnt.id); i < divzIndexOrder.length-1 ;i++){ //loop começa no index do elemento clicado e vai até o penúltimo index
                     divzIndexOrder[i] = divzIndexOrder[i+1]; // copia o id do próximo index no array
                     document.getElementById(divzIndexOrder[i]).style.zIndex =  i+10; //pega o elemento que tem a id que agora está armazenada nesta posição do array e muda o zIndex para o index atual (mais 10)                

                  }
                  
                  divzIndexOrder[divzIndexOrder.length-1]  = elmnt.id; // a id do elemento clicado é jogado para o índice de maior valor do array
                  elmnt.style.zIndex = (divzIndexOrder.length-1)+10;  // zIndex do elemento clicado é setado para o valor do último índice do array (mais 10)
  
                  // pega a localização do cursor do mouse no momento do evento mousedown:
                  pos3 = e.clientX;
                  pos4 = e.clientY;
                  
                  document.onmouseup = closeDragElement;
                  
                  // função chamada cada vez que o cursor se move:
                  document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();

                // calcula a nova posição do cursor:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                
                pos3 = e.clientX;
                pos4 = e.clientY;

                if(elmnt.parentElement.toString() != "[object HTMLBodyElement]"){   // se o parentElement não for o body

                 //verificando se está dentro dos limites do parentElement
                     
                  if(elmnt.offsetTop > 0 ){
                  if(elmnt.offsetLeft > 0){
                  if( (elmnt.offsetTop + elmnt.offsetHeight) < elmnt.parentElement.offsetHeight ) {
                  if( (elmnt.offsetLeft + elmnt.offsetWidth) <  elmnt.parentElement.offsetWidth ) {
                            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"; 
                           }else{
                            elmnt.style.left = (elmnt.parentElement.offsetWidth - (elmnt.offsetWidth+7))  + "px";  
                            closeDragElement(); 
                           }
                          } else{
                            elmnt.style.top = (elmnt.parentElement.offsetHeight - (elmnt.offsetHeight+22)) + "px";  
                            closeDragElement();     
                          }    

                      }else{
                            elmnt.style.left =  "1px";
                           closeDragElement();                      
                      }
                   }else{ 
                           elmnt.style.top = "1px";
                           closeDragElement();                       
                     }
                  
                  
                 }else{
                        //define a nova posição do elemento:
                        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                 }
                  
          }

          function closeDragElement() {
              
                document.onmouseup = null;
                document.onmousemove = null;
          }
}

//#################################################################################################################################################
// função chamada a cada 250 milissegundos se o documento ainda não tiver terminado de carregar, se tiver terminado ela insere as orelhas das abas
//#################################################################################################################################################
function InsereOrelhas(){
    if (document.readyState === 'complete'){
    
       var PastasArray = document.getElementsByTagName('uma-pasta');
		    
		     for(var i=0; i<PastasArray .length; i++) { 
			 
           let arrayAbas = PastasArray[i].getElementsByTagName('uma-aba');	 
           let arrayAbasMesmoNivel = new Array(); // array para filtrar apenas as abas que estão no primeiro nivel da pasta
	 
           for(var n = 0; n < arrayAbas.length; n++){	
             if(arrayAbas[n].parentElement == PastasArray[i]){ arrayAbasMesmoNivel.push(arrayAbas[n]); }
           }
           
                          
              for(var x = 0; x < arrayAbasMesmoNivel.length; x++){
              
                     //criando a lingueta de mover a pasta (se for arrastavel)       
                      if(x == 0){
                        if(PastasArray[i].arrastavel=='s'){
                          var divarrasta = document.createElement("div");
                            divarrasta.id = PastasArray[i].id+"mover";
                            divarrasta.title = "clique e arraste para mover a pasta";                         
                            divarrasta.style.position = "absolute";
                            divarrasta.style.display = "block";
                            divarrasta.style.backgroundColor = "#B0E0E6";
                            divarrasta.style.cursor = "move";
                            divarrasta.style.height = "8%";
                            divarrasta.style.width = "3%";                            
                            if (PastasArray[i].alturaOrelha == "15%"){ divarrasta.style.top = "7%"; } else { divarrasta.style.top = "3%"; }                            
                            divarrasta.style.left = PastasArray[i].offsetDireito+"%";                               
                            divarrasta.style.borderTopLeftRadius = "90%";
                            divarrasta.style.borderLeft = "solid 2px #8B0000";
                            divarrasta.style.borderTop = "solid 2px #8B0000"; 
                            
                             document.getElementById(PastasArray[i].id).appendChild(divarrasta);    
                             tornaArrastavel(document.getElementById(PastasArray[i].id)); // chamando a função que torna arrastavel                       
                        }
                      }              
              	
              	
              	     //trecho que esconde o CORPO das abas que não estão focalizadas e mostra o CORPO da aba focalizada:
                 		if(arrayAbasMesmoNivel[x].ordem==1){ arrayAbasMesmoNivel[x].style.display='block'; }else{ arrayAbasMesmoNivel[x].style.display='none'; }   
                 		 
                 		 // criando e estilizando as divs das orelhas das abas
                 		var divorelha = document.createElement("div");
					            	divorelha.id = PastasArray[i].id+"orelhaAba"+arrayAbasMesmoNivel[x].ordem;
					             	divorelha.ordem = arrayAbasMesmoNivel[x].ordem;
                 	      divorelha.style.width = ( ((95 - PastasArray[i].offsetDireito) - PastasArray[i].offsetEsquerdo)/arrayAbasMesmoNivel.length)+"%";
		                    divorelha.style.left = ( 3 + PastasArray[i].offsetDireito + ( (arrayAbasMesmoNivel[x].ordem - 1) * ( ((95 - PastasArray[i].offsetDireito) - PastasArray[i].offsetEsquerdo) / arrayAbasMesmoNivel.length)) )+"%" ; //left de cada orelha calculado de acordo com o seu número de ordem na pasta
		                    divorelha.style.position = "absolute";
                        divorelha.style.display = "block";
                        divorelha.style.top = "0%";
                        divorelha.style.backgroundColor =  arrayAbasMesmoNivel[x].corOrelha;  
                        divorelha.style.border = "2px solid #8B0000"; 
                        divorelha.style.height = PastasArray[i].alturaOrelha ;
                        divorelha.style.padding = "2px";
                        divorelha.style.display = "flex";
                        divorelha.style.justifyContent = "center";  
                        divorelha.style.alignItems = "center";
                        divorelha.style.lineHeight = "100%"; 
                        divorelha.style.cursor = "pointer";
                        divorelha.style.fontFamily = "Arial"; 
                        divorelha.style.fontSize = PastasArray[i].tamanhoPadraoFonteOrelha;
                        divorelha.style.color = "white";                        
                        divorelha.style.zIndex = "2";      
                        divorelha.innerHTML = arrayAbasMesmoNivel[x].titulo; 
                        divorelha.title = arrayAbasMesmoNivel[x].titulo;   
                        if(arrayAbasMesmoNivel[x].ordem == 1){ 
                           divorelha.style.borderTopLeftRadius = arrayAbasMesmoNivel[x].style.borderTopLeftRadius;  
                           divorelha.style.backgroundColor =  PastasArray[i].corOrelhaAbaFocalizada;  
                           divorelha.style.cursor = "default";
                         }
                        if(arrayAbasMesmoNivel[x].ordem == arrayAbasMesmoNivel.length){ divorelha.style.borderTopRightRadius = arrayAbasMesmoNivel[x].style.borderTopRightRadius;   }
                        divorelha.setAttribute("onclick","TrocaAbaFocalizada('" + PastasArray[i].id +"', "+arrayAbasMesmoNivel[x].ordem +");");
				            		divorelha.setAttribute("onmouseover","MouseSobreOrelha('"+divorelha.id +"');");
						            divorelha.setAttribute("onmouseout","MouseDeixaOrelha('"+ PastasArray[i].id+"', '"+divorelha.ordem+"');");
                        
                        document.getElementById(PastasArray[i].id).appendChild(divorelha);    
               } 
		     } 
       
     }else{ setTimeout(InsereOrelhas, 250);}

} // fim da função InsereOrelhas

customElements.define("uma-aba", Aba);
customElements.define("uma-pasta", Pasta);
setTimeout(InsereOrelhas, 250);
