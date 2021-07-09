class BinaryCalculator{
	constructor(binaryNumber){
		this.binaryNumber = binaryNumber
	}
	binaryToDecimal(binaryNumber){
			let decimal = 0,
			binary = this.binaryNumber;
			for (let i = 0; i < binary.length; i++) {
					if (binary[binary.length - (i + 1)] === '1') {
						decimal += 2 ** i;
					}
			}
			return decimal;
	}
}

function binaryOnly(e){
	var key=(window.event)?event.keyCode:e.which;
	if((key==48 || key==49)) return true;
	else{
	return false;
	}
}

function convertBtnClick(){
	inputBinary = document.getElementById('input-binary').value
	console.log(inputBinary)
	outputDecimalNumber = document.getElementById('decimal-return')
	if(inputBinary.length > 8) {
		outputDecimalNumber.innerHTML='Enter up to 8 digits'
	} else{
			let binaryToDecimalConvert = new BinaryCalculator(inputBinary)
			let converted = binaryToDecimalConvert.binaryToDecimal()
			outputDecimalNumber.innerHTML=converted
	}
}