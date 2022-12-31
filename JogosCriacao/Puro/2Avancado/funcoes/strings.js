function remover_acentos(campo){
	campo.value = campo.value.toLowerCase();

	var estranha = "áéíóúàèìòùâêîôûäëïöüãõ@#$%^&*()_+=-~` ç";
	var correta  = "aeiouaeiouaeiouaeiouao________________c";
	var retorno  = "";

	for(i=0;i<estranha.length;i++)
   		{
   
   		for(j=0;j<campo.value.length;j++)
      	{
      		retorno = campo.value.replace(estranha.substr(i,1),correta.substr(i,1));
	  		retorno = retorno.replace("_","");
      		campo.value = retorno;
      	}
	}
}

// Uso: <input type="text" name="teste" size="45" ONBLUR="return troca(this)">

