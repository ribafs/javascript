function decCalc() 
{
var bin	= document.getElementById("bin").value;
var dec = document.getElementById("dec");
var hex = document.getElementById("hex");
dec.value = bin2dec(bin);
hex.value = toHex(bin2dec(bin));
}

function binCalc() 
{
var dec;
if (document.getElementById("dec").value < 0)			dec = 0;
else if (document.getElementById("dec").value <= 65536)	dec = document.getElementById("dec").value;
else dec = 65536;
var bin	= document.getElementById("bin");
var hex = document.getElementById("hex");
bin.value = dec2bin(dec);
hex.value = toHex(dec);
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

function bin2dec(b){
    return parseInt(b, 2);
}


function minmax(n,min,max)
{
	n = parseFloat(n);
	if (min != null && n < min) n = min;
	if (max != null && n > max) n = max;
	return n || '';
}

function toHex(d) {
  var r = d % 16;
  var result;
  if (d - r == 0)
    result = toChar(r);
  else
    result = toHex( (d - r)/16 ) + toChar(r);
  return result;
}

function toChar(n) {
  const alpha = "0123456789ABCDEF";
  return alpha.charAt(n);
}

function resetValues(form)
{
  for(var i = 0; i < form.elements.length; i++) {
  if(form.elements[i].type == "text") { form.elements[i].value = '';}
  }
}
