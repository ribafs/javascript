function createCookies(days) 
{
	var date = new Date();												//heutiges Datum
	date.setTime( date.getTime() + ( days * 24 * 3600 * 1000 ) );		//Datum in ms + days Tage in ms -> setze date neu -> Ablaufdatum des Cookies!!!
	
	var cookie_ende = "; expires=" + date.toGMTString() + "; path=/";	//Anhängsl an das Name-Wert-Paar des Cookies
	
	//Erstelle Cookies:
	document.cookie = "lives=" + mario.lives.toString() + cookie_ende;	//wieviele Leben hatte der Spieler?
	document.cookie = "coins=" + mario.coins.toString() + cookie_ende;	//wieviele Münzen hatte der Spieler?
	document.cookie = "level=" + mario.level.toString() + cookie_ende;	//welches Level hatte der Spieler erreicht?
	document.cookie = "state=" + mario.state + cookie_ende;				//war Mario groß oder klein?
	document.cookie = "shooter=" + mario.shooter.toString() + cookie_ende;//konnte man schießen?
}

function readCookies()
{	
	var cookieArray = document.cookie.split(';');						//alle Name-Wert-Paare in einem Array abspeichern
	for( var i = cookieArray.length ; i-- ; )
	{
		var c = cookieArray[i];											//aktuelles Cookie
		
		while( c.charAt(0) == ' ' ) 
			c = c.substring(1,c.length);								//unnötige Leerzeichen entfernen
		
		//Cookies auslesen und abspeichern:
		if( c.indexOf( "lives=" ) == 0 ) 
			cookie_lives = parseInt( c.substring( 6 , c.length ) );
		else if( c.indexOf( "coins=" ) == 0 ) 
			cookie_coins = parseInt( c.substring( 6 , c.length ) );
		else if( c.indexOf( "level=" ) == 0 ) 
			cookie_level = parseInt( c.substring( 6 , c.length ) );
		else if( c.indexOf( "state=" ) == 0 ) 
			cookie_state = c.substring( 6 , c.length );
		else if( c.indexOf( "shooter=" ) == 0 ) 
			cookie_shooter = c.substring( 8 , c.length );
	}
	
	//Schauen ob sinnvolle Werte in den Cookies drin waren: 
	if( isNaN( cookie_lives ) || cookie_lives < 0 )
		return false;
	if( isNaN( cookie_coins ) || cookie_coins < 0 || cookie_coins > 99 )
		return false;
	if( isNaN( cookie_level ) )
		return false;
	if( cookie_state != 'small' && cookie_state != 'big' )
		return false;
	if( cookie_shooter == 'true' )
		cookie_shooter = true;
	else if( cookie_shooter == 'false' )
		cookie_shooter = false;
	else return false;
	
	//Alles hat geklappt:
	return true;
}

function eraseCookies()
{
	createCookies(-1);			//die Cookies sind gestern abgelaufen und werden deswegen gelöscht
}