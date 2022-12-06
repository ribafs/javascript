function NodownHandler(event)
{
	//keine Tastenbelegung
}
			
function downHandler(event)		//jemand hat eine taste gedrückt
{
	switch(event.keyCode)		//welche taste?
	{
		case 27://Esc runter
			if( mario.finished || mario.dead )
				$('#back_to_menu').hide();
			else
				$('#back_to_menu').show();
			$('#controllpage').toggle();
			break;
		case 17://Strg runter
			mario.fast = true;	//Mario schnell laufen lassen
			Strg_down = true;
			if( mario.shooter )
				mario.shoot();	//Mario schießen lassen
			break;
		case 89://y runter
			mario.fast = true;	//Mario schnell laufen lassen
			y_down = true;
			if( mario.shooter )
				mario.shoot();	//Mario schießen lassen
			break;
		case 40://Pfeiltaste nach unten runter
			mario.crouching = true;
			mario.walking = false;				//während dem Ducken kann man Mario nicht seitlich bewegen!!!
			mario.stand();						//heißt zwar stand(), macht aber crouch()   ;-)
			break;
		case 39://Rechte Pfeiltaste runter
			rightkey_down = true;
			if( !mario.crouching )				//beim Ducken sollen Richtungsänderungen ignoriert werden
			{
				mario.direction = 'right';
				mario.walking = true;			//für horizontale Bewegung in move()-Methode
				if( !mario.moving )
					{
						mario.moving = true;	//löse move() aus, sofern noch nicht geschehen
						mario.move();
					}
			}
			break;
		case 37://Linke Pfeiltaste runter
			leftkey_down = true;
			if( !mario.crouching )				//beim Ducken sollen Richtungsänderungen ignoriert werden
			{
				mario.direction = 'left';
				mario.walking = true;			//für horizontale Bewegung in move()-Methode
				if( !mario.moving )
					{
						mario.moving = true;	//löse move() aus, sofern noch nicht geschehen
						mario.move();
					}
			}
			break;
		case 38://Pfeiltaste nach oben runter
			mario.jumping = true;
			mario.jump();
			break;
		case 83://s runter
			s_down = true;
			if( s_down && k_down && i_down && p_down )
			{
				s_down = k_down = i_down = p_down = false;
				mario.success();
			}
			break;
		case 75://k runter
			k_down = true;
			if( s_down && k_down && i_down && p_down )
			{
				s_down = k_down = i_down = p_down = false;
				mario.success();
			}
			break;
		case 73://i runter
			i_down = true;
			if( s_down && k_down && i_down && p_down )
			{
				s_down = k_down = i_down = p_down = false;
				mario.success();
			}
			break;
		case 80://p runter
			p_down = true;
			if( s_down && k_down && i_down && p_down )
			{
				s_down = k_down = i_down = p_down = false;
				mario.success();
			}
			break;
	}
}

function upHandler(event)		//jemand hat eine gedrückte taste losgelassen
{
	switch(event.keyCode)		//welche taste?
	{
		case 17://Strg hoch
			Strg_down = false;
			if( !y_down )
				mario.fast = false;	//Mario läuft wieder mit normaler Geschwindigkeit
			break;
		case 89://y hoch
			y_down = false;
			if( !Strg_down )
				mario.fast = false;	//Mario läuft wieder mit normaler Geschwindigkeit
			break;
		case 40://Pfeiltaste nach unten hoch
			mario.crouching = false;
			mario.stand();
			
			if( rightkey_down || leftkey_down )		//während des duckens war eine blockierte richtungstaste gedrückt
			{
				if( rightkey_down && leftkey_down ) {}			//hat hoffentlich positive auswirkungen auf die steuerung....
				else if( rightkey_down && mario.direction==='left' ) { mario.direction = 'right'; }
				else if( leftkey_down && mario.direction==='right' ) { mario.direction = 'left'; }
				
				mario.walking = true;
				if( !mario.moving )
					{
						mario.moving = true;	//löse move() aus, sofern noch nicht geschehen
						mario.move();
					}
			}
			break;
		case 39://Rechte Pfeiltaste hoch
			rightkey_down = false;
			if( !mario.crouching )				//beim Ducken sollen Richtungsänderungen ignoriert werden
			{
				if(leftkey_down==true)	//es waren beide Richtungstasten gedrückt
					mario.direction = 'left';
				else					//keine Richtungstaste mehr gedrückt
					mario.walking = false;	//stoppe horizontale Bewegung in move()-Methode
			}
			break;
		case 37://Linke Pfeiltaste hoch
			leftkey_down = false;
			if( !mario.crouching )				//beim Ducken sollen Richtungsänderungen ignoriert werden
			{
				if(rightkey_down==true)	//es waren beide Richtungstasten gedrückt
					mario.direction = 'right';
				else					//keine Richtungstaste mehr gedrückt
					mario.walking = false;	//stoppe horizontale Bewegung in move()-Methode
			}
			break;
		case 38://Pfeiltaste nach oben hoch
			mario.jumping = false;
			break;
		case 83://s hoch
			s_down = false;
			break;
		case 75://k hoch
			k_down = false;
			break;
		case 73://i hoch
			i_down = false;
			break;
		case 80://p hoch
			p_down = false;
			break;
	}
}

function newgameHandler()
{
	if( readCookies() )		//Falls es Cookies gibt
		$('#cookiepage').show();
	else					//keine Cookies -> starte neues Spiel
	{
		diashow = false;
		DefaultLevel(1);	//Erzeuge Standard-levelarray -> lade Level 1
		custom = false;
		LoadLevel();		//Zeichne Level, erzeuge Spielfigur, lade Gegner und Items gemäß levelarray....
							//startet außerdem die GameLoop()-Schleife, sobald alle animierten Objekte (Mario, Gegner, Münzen, etc.) vollständig geladen sind
		$('#menu').hide();
		$('#background').show();
		menuMusic.pause();
	}
}


function editHandler()
{
	$('#menu').hide();
	$('#editor').show();
	diashow = false;
	menuMusic.pause();
	editorMusic.currentTime = 0;
	editorMusic.play();
}
function editorBackHandler()
{
	diashow = true;
	animation();
	$('#editor').hide();
	$('#menu').show();
	editorMusic.pause();
	menuMusic.currentTime = 0;
	menuMusic.play();	
}

function controllsHandler()
{
	$('#back_to_menu').hide();
	$('#controllpage').show();
}

function exit_controllpageHandler()
{
	$('#controllpage').hide();
	$('#back_to_menu').hide();
}

function back_to_menuHandler()
{	
	document.onkeydown = NodownHandler;		//lösche Tastenbelegung für Mario-Steuerung
	document.onkeyup = NodownHandler;
	mario.finished = mario.dead = true;		//alle moves stoppen
	
	setTimeout( function() 
						{
							$('#controllpage').hide();
							$('#back_to_menu').hide();
							$('#background').hide();
							$('#menu').show();
							
							diashow = true;		//starte Diashow
							animation();		

							music.pause();
							invincibilityMusic.pause();
							gameoverMusic.pause();
							endingMusic.pause();
							successMusic.pause();
							creditMusic.pause();
							dieMusic.pause();
							menuMusic.currentTime = 0;
							menuMusic.play();
						} , 1000 );
	
	setTimeout( function() 
						{
							//sämtliche Münzen aus älteren Spieldurchgängen löschen, z.B. nachdem man gestorben ist und das Level neu geladen wurde: 
							for( var k = coins.length ; k-- ; )
								coins[k].body.destroy().remove();			//spritely beenden und Münzen-Div vernichten
							coins = new Array();	
							
							//alle alten Münzboxen löschen:
							for( var k = coinboxes.length ; k-- ; )
							{
								coinboxes[k].body.remove();					//Block-Div entfernen
								coinboxes[k].coin.remove();					//Münzen-Div vernichten, falls es noch existiert
							}
							coinboxes = new Array();	
							
							//alle alten Vielfach-Münzboxen löschen:
							for( var k = multiple_coinboxes.length ; k-- ; )
							{
								multiple_coinboxes[k].body.remove();		//Block-Div entfernen
								multiple_coinboxes[k].coin.remove();		//Münzen-Div vernichten, falls es noch existiert
							}
							multiple_coinboxes = new Array();	
							
							//lösche alle alten Sternboxen:
							for( var k = starboxes.length ; k-- ; )	
							{
								starboxes[k].body.destroy().remove();		//Block-Div entfernen
								starboxes[k].star.destroy().remove();		//Stern-Div vernichten, falls es noch existiert
							}
							starboxes = new Array();
							
							//lösche alle alten Pilzboxen:
							for( var k = mushroomboxes.length ; k-- ; )	
							{
								mushroomboxes[k].body.destroy().remove();	//Block-Div entfernen
								mushroomboxes[k].mushroom.remove();			//Pilz-Div vernichten, falls es noch existiert
							}
							mushroomboxes = new Array();
							
							//alle alten Pflanzen vernichten:
							for( var k = plants.length ; k-- ; )
							{
								plants[k].body.destroy().remove();			//spritely beenden und Pflanzen-Div vernichten
								if( plants[k].frame )
									plants[k].frame.remove();				//den Rahmen bei den Röhrenpflanzen entfernen
							}
							plants = new Array();
							
							//Lösche alle Gegner aus älteren Spieldurchgängen:
							for( var k = enemies.length ; k-- ; )
							{
								enemies[k].body.destroy().remove();			//spritely beenden und Gegner-Div vernichten
								if( enemies[k].shell )
									enemies[k].shell.destroy().remove();	//Schildkrötenpanzer vernichten
							}
							enemies = new Array();
							
							//Mario vernichten:
							mario.body.destroy().remove();
							for( var k = mario.bullets.length ; k-- ; )
								mario.bullets[k].body.remove();
							mario = null;
						} , 600 );
}

function exit_cookiepageHandler()
{
	$('#cookiepage').hide();
}

function newgame2Handler()
{
	diashow = false;
	DefaultLevel(1);	//Erzeuge Standard-levelarray -> lade Level 1
	custom = false;
	LoadLevel();		//Zeichne Level, erzeuge Spielfigur, lade Gegner und Items gemäß levelarray....
						//startet außerdem die GameLoop()-Schleife, sobald alle animierten Objekte (Mario, Gegner, Münzen, etc.) vollständig geladen sind
	$('#cookiepage').hide();
	$('#menu').hide();
	$('#background').show();
	menuMusic.pause();
	eraseCookies();		//Cookies löschen
}

function continueHandler()
{
	diashow = false;
	savegame = true;
	DefaultLevel(cookie_level);	//Erzeuge levelarray -> lade das zuletzt abgespeicherte Level
	custom = false;
	LoadLevel();		//Zeichne Level, erzeuge Spielfigur, lade Gegner und Items gemäß levelarray....
						//startet außerdem die GameLoop()-Schleife, sobald alle animierten Objekte (Mario, Gegner, Münzen, etc.) vollständig geladen sind
	
	//Cookiezustand wiederherstellen:
	setTimeout( function() 
					{
						mario.lives = cookie_lives;
						mario.coins = cookie_coins;
						mario.level = cookie_level;
						mario.state = cookie_state;
						mario.shooter = cookie_shooter;
						$('#number_of_lives').text(mario.lives.toString()+'x');
						$('#number_of_coins').text(mario.coins.toString()+'x');
						mario.stand();
					} , 200 );
	
	$('#cookiepage').hide();
	$('#menu').hide();
	$('#background').show();
	menuMusic.pause();
}