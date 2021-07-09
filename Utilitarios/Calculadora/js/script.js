function calcular (tipo,valor) {
	const resul = document.getElementById('resultado');
	if ( tipo === 'acao') {
		if (valor === 'c') {
			// this.resul	= document.getElementById('resultado');
			resul.value = '';	
		} 
	if (valor === '+' || valor === '-' || valor === '*' || valor === '/' || valor === '.') {
		resul.value += valor;
	}					
	if (valor === '=') {
		const valor_campo = resul.value;
		const calc = eval(valor_campo);
		document.getElementById('resultado').value = calc;
	}
		} else if (tipo === 'valor' ) {
			resul.value += valor;
		}
}	