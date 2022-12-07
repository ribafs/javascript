function passwordcreate( len ) {
	var length = (len)?(len):(10);
	var string = "abcdefghijklnopqrstuvwxyz"; //to upper 
	var numeric = '0123456789';
	var punctuation = '!@#$%^*()_+~`|}{[]\:;?><,./-=';
	var password = "";
	var character = "";
	var crunch = true;
	punctuation = '!@#_';
	punctuation = '';
	while( password.length<length ) {
		entity1 = Math.ceil(string.length * Math.random()*Math.random());
		entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
		entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
		hold = string.charAt( entity1 );
		hold = (entity1%2==0)?(hold.toUpperCase()):(hold);
		character += hold;
		character += numeric.charAt( entity2 );
		character += punctuation.charAt( entity3 );
		password = character;
	}
	return password;
}