function LoadLevel()
{
	$('#levelloading').show();
	
	if( mario == null ) 							//Falls noch keine Spielfigur erstellt wurde
	{
		mario = new Hero('mario','mario-sprites.png');//Erzeuge eine neue Spielfigur
		//Events zuweisen (nicht früher, weil mario schon geladen sein muss!!!):
		document.onkeydown = downHandler;			//taste runter
		document.onkeyup = upHandler;				//taste hoch
	}
		
	levelwidth = levelarray.length * 32;
	
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
	
	
	//Zeichne Level in das Canvaselement:
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	canvas.width = levelwidth;
	canvas.height = 15*32;
	context.fillStyle = 'rgba(0,0,0,0)';	
	context.fillRect(0,0,canvas.width,canvas.height);		//transparente Hintergrundfarbe für das Canvas
	
	objects = new Image();
		objects.onload = function() 
					{
						for( var i = 0 ; i < levelarray.length ; i++ )		//sämtliche Levelspalten: von links nach rechts im Level
						for( var j = 0 ; j < 15 ; j++ )						//sämtliche Levelzeilen: von oben nach unten je Spalte
						{	
							//zeichne das Level Kachel für Kachel:
							switch(levelarray[i][j])
							{
								case 'grass_top':
									context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_right':
									context.drawImage(objects,922,404,32,32,i*32,j*32,32,32);
									break;
								case 'grass_right':
									context.drawImage(objects,922,438,32,32,i*32,j*32,32,32);
									break;
								case 'grass_left':
									context.drawImage(objects,854,438,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_left':
									context.drawImage(objects,854,404,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_left_rounded':
									context.drawImage(objects,854,506,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_left_rounded_soil':
									context.drawImage(objects,956,506,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_right_rounded':
									context.drawImage(objects,922,506,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_right_rounded_soil':
									context.drawImage(objects,990,506,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_right_corner':
									context.drawImage(objects,612,868,32,32,i*32,j*32,32,32);
									break;
								case 'grass_top_left_corner':
									context.drawImage(objects,648,868,32,32,i*32,j*32,32,32);
									break;
								case 'soil':
									context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									break;
								case 'soil_left':
									context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									break;
								case 'soil_right':
									context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									break;
								case 'bush_left':
									context.drawImage(objects,178,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_middle_left':
									context.drawImage(objects,212,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_middle':
									context.drawImage(objects,348,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_middle_right':
									context.drawImage(objects,314,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_right':
									context.drawImage(objects,382,928,32,32,i*32,j*32,32,32);
									break;
								case 'planted_soil_left':
									context.drawImage(objects,714,832,32,32,i*32,j*32,32,32);
									break;
								case 'planted_soil_middle':
									context.drawImage(objects,748,832,32,32,i*32,j*32,32,32);
									break;
								case 'planted_soil_right':
									context.drawImage(objects,782,832,32,32,i*32,j*32,32,32);
									break;
								case 'brown_block':
									//Brauche ich hinter dem braunen Block noch ein Bild?
									if( i > 0 && i < levelwidth / 32 - 1 && j > 0 )	//für den Rand des Levels
									if( levelarray[i-1][j] === 'grass_top' || levelarray[i-1][j] === 'grass_top_left' || levelarray[i-1][j] === 'grass_top_left_rounded' || levelarray[i-1][j] === 'grass_top_left_rounded_soil' || levelarray[i-1][j] === 'grass_top_right_corner' || levelarray[i-1][j] === 'pipe_right_grass' )
									{
										if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
											context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
											context.drawImage(objects,648,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_right_corner' || levelarray[i][j+1] === 'grass_right' )
											context.drawImage(objects,922,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_right' )
										{
											if( levelarray[i+1][j] === 'soil_right' || levelarray[i+1][j] === 'grass_right' || levelarray[i+1][j] === 'grass_top_right_corner' || levelarray[i+1][j] === 'grass_top_left_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_left_soil' )
												context.drawImage(objects,990,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,922,506,32,32,i*32,j*32,32,32);
										}
									}
									else if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
									{
										if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
											context.drawImage(objects,612,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_left_corner' || levelarray[i][j+1] === 'grass_left' )
											context.drawImage(objects,854,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_left' )
										{
											if( levelarray[i+1][j] === 'soil_left' || levelarray[i+1][j] === 'grass_left' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_right_soil' )
												context.drawImage(objects,956,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,854,506,32,32,i*32,j*32,32,32);
										}
									}	
									else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
										context.drawImage(objects,854,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
										context.drawImage(objects,922,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_left' || levelarray[i][j-1] === 'grass_top_left_rounded' || levelarray[i][j-1] === 'grass_top_left_rounded_soil' )
										context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_right' || levelarray[i][j-1] === 'grass_top_right_rounded' || levelarray[i][j-1] === 'grass_top_right_rounded_soil' )
										context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_top_right_corner' || levelarray[i][j-1] === 'grass_top_left_corner' || levelarray[i][j-1] === 'grass_top' || levelarray[i][j-1] === 'soil' || levelarray[i][j-1] === 'planted_soil_left' || levelarray[i][j-1] === 'planted_soil_middle' || levelarray[i][j-1] === 'planted_soil_right' )
										context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									
									context.drawImage(objects,514,194,32,32,i*32,j*32,32,32);	//zeichne braunen Block drüber
									break;
								case 'stone':
									//Brauche ich hinter dem Stein noch ein Bild?
									if( i > 0 && i < levelwidth / 32 - 1 && j > 0 )	//für den Rand des Levels
									if( levelarray[i-1][j] === 'grass_top' || levelarray[i-1][j] === 'grass_top_left' || levelarray[i-1][j] === 'grass_top_left_rounded' || levelarray[i-1][j] === 'grass_top_left_rounded_soil' || levelarray[i-1][j] === 'grass_top_right_corner' || levelarray[i-1][j] === 'pipe_right_grass' )
									{
										if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
											context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
											context.drawImage(objects,648,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_right_corner' || levelarray[i][j+1] === 'grass_right' )
											context.drawImage(objects,922,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_right' )
										{
											if( levelarray[i+1][j] === 'soil_right' || levelarray[i+1][j] === 'grass_right' || levelarray[i+1][j] === 'grass_top_right_corner' || levelarray[i+1][j] === 'grass_top_left_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_left_soil' )
												context.drawImage(objects,990,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,922,506,32,32,i*32,j*32,32,32);
										}
									}
									else if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
									{
										if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
											context.drawImage(objects,612,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_left_corner' || levelarray[i][j+1] === 'grass_left' )
											context.drawImage(objects,854,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_left' )
										{
											if( levelarray[i+1][j] === 'soil_left' || levelarray[i+1][j] === 'grass_left' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_right_soil' )
												context.drawImage(objects,956,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,854,506,32,32,i*32,j*32,32,32);
										}
									}	
									else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
										context.drawImage(objects,854,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
										context.drawImage(objects,922,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_left' || levelarray[i][j-1] === 'grass_top_left_rounded' || levelarray[i][j-1] === 'grass_top_left_rounded_soil' )
										context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_right' || levelarray[i][j-1] === 'grass_top_right_rounded' || levelarray[i][j-1] === 'grass_top_right_rounded_soil' )
										context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_top_right_corner' || levelarray[i][j-1] === 'grass_top_left_corner' || levelarray[i][j-1] === 'grass_top' || levelarray[i][j-1] === 'soil' || levelarray[i][j-1] === 'planted_soil_left' || levelarray[i][j-1] === 'planted_soil_middle' || levelarray[i][j-1] === 'planted_soil_right' )
										context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									
									context.drawImage(objects,550,160,32,32,i*32,j*32,32,32);	//zeichne Stein drüber
									break;
								case 'pipe_top_left':
									context.drawImage(objects,2,358,32,32,i*32,j*32,32,32);
									break;
								case 'pipe_top_right':
									context.drawImage(objects,36,358,32,32,i*32,j*32,32,32);
									break;
								case 'pipe_left':
									context.drawImage(objects,2,390,32,32,i*32,j*32,32,32);
									break;
								case 'pipe_right':
									context.drawImage(objects,36,390,32,32,i*32,j*32,32,32);
									break;
								case 'pipe_left_grass':
									context.drawImage(objects,2,424,32,32,i*32,j*32,32,32);
									break;
								case 'pipe_right_grass':
									context.drawImage(objects,36,424,32,32,i*32,j*32,32,32);
									break;
								case 'pipe_left_soil':
									context.drawImage(objects,2,458,32,32,i*32,j*32,32,32);
									break;
								case 'pipe_right_soil':
									context.drawImage(objects,36,458,32,32,i*32,j*32,32,32);
									break;
								case 'coin':
									coins.push( new coin(i,j) );										//Erstelle eine Münze
									
									//Brauche ich hinter dem Objekt ein Bild?
									if( levelarray[i][j-1] === 'soil_left' || levelarray[i][j-1] === 'grass_top_left_rounded' || levelarray[i][j-1] === 'grass_top_left_rounded_soil' )
										context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_right' || levelarray[i][j-1] === 'grass_top_right_rounded' || levelarray[i][j-1] === 'grass_top_right_rounded_soil' )
										context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_top_right_corner' || levelarray[i][j-1] === 'grass_top_left_corner' || levelarray[i][j-1] === 'grass_top' || levelarray[i][j-1] === 'soil' || levelarray[i][j-1] === 'planted_soil_left' || levelarray[i][j-1] === 'planted_soil_middle' || levelarray[i][j-1] === 'planted_soil_right' )
										context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									
									break;
								case 'coinbox':
									coinboxes.push( new coinbox(i,j) );									//Erstelle eine Münzbox
									
									//Brauche ich hinter dem Objekt ein Bild?
									if( levelarray[i-1][j] === 'grass_top' || levelarray[i-1][j] === 'grass_top_left' || levelarray[i-1][j] === 'grass_top_left_rounded' || levelarray[i-1][j] === 'grass_top_left_rounded_soil' || levelarray[i-1][j] === 'grass_top_right_corner' || levelarray[i-1][j] === 'pipe_right_grass' )
									{
										if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
											context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
											context.drawImage(objects,648,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_right_corner' || levelarray[i][j+1] === 'grass_right' )
											context.drawImage(objects,922,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_right' )
										{
											if( levelarray[i+1][j] === 'soil_right' || levelarray[i+1][j] === 'grass_right' || levelarray[i+1][j] === 'grass_top_right_corner' || levelarray[i+1][j] === 'grass_top_left_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_left_soil' )
												context.drawImage(objects,990,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,922,506,32,32,i*32,j*32,32,32);
										}
									}
									else if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
									{
										if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
											context.drawImage(objects,612,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_left_corner' || levelarray[i][j+1] === 'grass_left' )
											context.drawImage(objects,854,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_left' )
										{
											if( levelarray[i+1][j] === 'soil_left' || levelarray[i+1][j] === 'grass_left' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_right_soil' )
												context.drawImage(objects,956,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,854,506,32,32,i*32,j*32,32,32);
										}
									}	
									else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
										context.drawImage(objects,854,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
										context.drawImage(objects,922,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_left' || levelarray[i][j-1] === 'grass_top_left_rounded' || levelarray[i][j-1] === 'grass_top_left_rounded_soil' )
										context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_right' || levelarray[i][j-1] === 'grass_top_right_rounded' || levelarray[i][j-1] === 'grass_top_right_rounded_soil' )
										context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_top_right_corner' || levelarray[i][j-1] === 'grass_top_left_corner' || levelarray[i][j-1] === 'grass_top' || levelarray[i][j-1] === 'soil' || levelarray[i][j-1] === 'planted_soil_left' || levelarray[i][j-1] === 'planted_soil_middle' || levelarray[i][j-1] === 'planted_soil_right' )
										context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									
									break;
								case 'multiple_coinbox':
									multiple_coinboxes.push( new multiple_coinbox(i,j) );				//Erstelle eine Vielfach-Münzbox
									
									//Brauche ich hinter dem Objekt ein Bild?
									if( levelarray[i-1][j] === 'grass_top' || levelarray[i-1][j] === 'grass_top_left' || levelarray[i-1][j] === 'grass_top_left_rounded' || levelarray[i-1][j] === 'grass_top_left_rounded_soil' || levelarray[i-1][j] === 'grass_top_right_corner' || levelarray[i-1][j] === 'pipe_right_grass' )
									{
										if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
											context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
											context.drawImage(objects,648,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_right_corner' || levelarray[i][j+1] === 'grass_right' )
											context.drawImage(objects,922,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_right' )
										{
											if( levelarray[i+1][j] === 'soil_right' || levelarray[i+1][j] === 'grass_right' || levelarray[i+1][j] === 'grass_top_right_corner' || levelarray[i+1][j] === 'grass_top_left_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_left_soil' )
												context.drawImage(objects,990,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,922,506,32,32,i*32,j*32,32,32);
										}
									}
									else if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
									{
										if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
											context.drawImage(objects,612,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_left_corner' || levelarray[i][j+1] === 'grass_left' )
											context.drawImage(objects,854,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_left' )
										{
											if( levelarray[i+1][j] === 'soil_left' || levelarray[i+1][j] === 'grass_left' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_right_soil' )
												context.drawImage(objects,956,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,854,506,32,32,i*32,j*32,32,32);
										}
									}	
									else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
										context.drawImage(objects,854,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
										context.drawImage(objects,922,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_left' || levelarray[i][j-1] === 'grass_top_left_rounded' || levelarray[i][j-1] === 'grass_top_left_rounded_soil' )
										context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_right' || levelarray[i][j-1] === 'grass_top_right_rounded' || levelarray[i][j-1] === 'grass_top_right_rounded_soil' )
										context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_top_right_corner' || levelarray[i][j-1] === 'grass_top_left_corner' || levelarray[i][j-1] === 'grass_top' || levelarray[i][j-1] === 'soil' || levelarray[i][j-1] === 'planted_soil_left' || levelarray[i][j-1] === 'planted_soil_middle' || levelarray[i][j-1] === 'planted_soil_right' )
										context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									
									break;
								case 'starbox':
									starboxes.push( new starbox(i,j) );									//Erstelle eine Sternbox
									
									//Brauche ich hinter dem Objekt ein Bild?
									if( levelarray[i-1][j] === 'grass_top' || levelarray[i-1][j] === 'grass_top_left' || levelarray[i-1][j] === 'grass_top_left_rounded' || levelarray[i-1][j] === 'grass_top_left_rounded_soil' || levelarray[i-1][j] === 'grass_top_right_corner' || levelarray[i-1][j] === 'pipe_right_grass' )
									{
										if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
											context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
											context.drawImage(objects,648,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_right_corner' || levelarray[i][j+1] === 'grass_right' )
											context.drawImage(objects,922,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_right' )
										{
											if( levelarray[i+1][j] === 'soil_right' || levelarray[i+1][j] === 'grass_right' || levelarray[i+1][j] === 'grass_top_right_corner' || levelarray[i+1][j] === 'grass_top_left_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_left_soil' )
												context.drawImage(objects,990,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,922,506,32,32,i*32,j*32,32,32);
										}
									}
									else if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
									{
										if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
											context.drawImage(objects,612,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_left_corner' || levelarray[i][j+1] === 'grass_left' )
											context.drawImage(objects,854,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_left' )
										{
											if( levelarray[i+1][j] === 'soil_left' || levelarray[i+1][j] === 'grass_left' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_right_soil' )
												context.drawImage(objects,956,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,854,506,32,32,i*32,j*32,32,32);
										}
									}	
									else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
										context.drawImage(objects,854,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
										context.drawImage(objects,922,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_left' || levelarray[i][j-1] === 'grass_top_left_rounded' || levelarray[i][j-1] === 'grass_top_left_rounded_soil' )
										context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_right' || levelarray[i][j-1] === 'grass_top_right_rounded' || levelarray[i][j-1] === 'grass_top_right_rounded_soil' )
										context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_top_right_corner' || levelarray[i][j-1] === 'grass_top_left_corner' || levelarray[i][j-1] === 'grass_top' || levelarray[i][j-1] === 'soil' || levelarray[i][j-1] === 'planted_soil_left' || levelarray[i][j-1] === 'planted_soil_middle' || levelarray[i][j-1] === 'planted_soil_right' )
										context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									
									break;
								case 'mushroombox':
									mushroomboxes.push( new mushroombox(i,j) );							//Erstelle eine Pilzbox
									
									//Brauche ich hinter dem Objekt ein Bild?
									if( levelarray[i-1][j] === 'grass_top' || levelarray[i-1][j] === 'grass_top_left' || levelarray[i-1][j] === 'grass_top_left_rounded' || levelarray[i-1][j] === 'grass_top_left_rounded_soil' || levelarray[i-1][j] === 'grass_top_right_corner' || levelarray[i-1][j] === 'pipe_right_grass' )
									{
										if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
											context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
											context.drawImage(objects,648,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_right_corner' || levelarray[i][j+1] === 'grass_right' )
											context.drawImage(objects,922,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_right' )
										{
											if( levelarray[i+1][j] === 'soil_right' || levelarray[i+1][j] === 'grass_right' || levelarray[i+1][j] === 'grass_top_right_corner' || levelarray[i+1][j] === 'grass_top_left_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_left_soil' )
												context.drawImage(objects,990,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,922,506,32,32,i*32,j*32,32,32);
										}
									}
									else if( levelarray[i+1][j] === 'grass_top' || levelarray[i+1][j] === 'grass_top_right' || levelarray[i+1][j] === 'grass_top_right_rounded' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'pipe_left_grass' )
									{
										if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
											context.drawImage(objects,612,868,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'grass_top_left_corner' || levelarray[i][j+1] === 'grass_left' )
											context.drawImage(objects,854,404,32,32,i*32,j*32,32,32);
										else if( levelarray[i][j+1] === 'soil_left' )
										{
											if( levelarray[i+1][j] === 'soil_left' || levelarray[i+1][j] === 'grass_left' || levelarray[i+1][j] === 'grass_top_left_corner' || levelarray[i+1][j] === 'grass_top_right_rounded_soil' || levelarray[i+1][j] === 'soil' || levelarray[i+1][j] === 'planted_soil_left' || levelarray[i+1][j] === 'planted_soil_middle' || levelarray[i+1][j] === 'planted_soil_right' || levelarray[i+1][j] === 'pipe_right_soil' )
												context.drawImage(objects,956,506,32,32,i*32,j*32,32,32);
											else
												context.drawImage(objects,854,506,32,32,i*32,j*32,32,32);
										}
									}	
									else if( levelarray[i][j-1] === 'grass_left' || levelarray[i][j-1] === 'grass_top_left' )
										context.drawImage(objects,854,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_right' || levelarray[i][j-1] === 'grass_top_right' )
										context.drawImage(objects,922,438,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_left' || levelarray[i][j-1] === 'grass_top_left_rounded' || levelarray[i][j-1] === 'grass_top_left_rounded_soil' )
										context.drawImage(objects,854,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'soil_right' || levelarray[i][j-1] === 'grass_top_right_rounded' || levelarray[i][j-1] === 'grass_top_right_rounded_soil' )
										context.drawImage(objects,922,540,32,32,i*32,j*32,32,32);
									else if( levelarray[i][j-1] === 'grass_top_right_corner' || levelarray[i][j-1] === 'grass_top_left_corner' || levelarray[i][j-1] === 'grass_top' || levelarray[i][j-1] === 'soil' || levelarray[i][j-1] === 'planted_soil_left' || levelarray[i][j-1] === 'planted_soil_middle' || levelarray[i][j-1] === 'planted_soil_right' )
										context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									
									break;
								case 'staticplant':
									plants.push( new staticplant(i,j) );								//Erstelle eine statische Pflanze
									break;
								case 'pipeplant':
									plants.push( new pipeplant(i,j) );									//Erstelle eine Röhrenpflanze
									break;
								case 'spikedturtle':
									enemies.push( new spikedturtle(i,j) );								//Erstelle eine Stachelschildkröte
									break;
								case 'ballmonster':
									enemies.push( new ballmonster(i,j) );								//Erstelle ein Kugelmonster
									break;
								case 'greenturtle':
									enemies.push( new greenturtle(i,j) );								//Erstelle eine grüne Schildkröte
									break;
								case 'mario':																	
									mario.x = i*32;														//Setze Mario an den Anfang des Levels
									mario.y = (14-j)*32;
									mario.finished = false;												//und resete alle nötigen Eigenschaften
									mario.dead = false;
									mario.invulnerable = false;
									mario.deadly = false;
									mario.moving = false;
									mario.walking = false;
									mario.crouching = false;
									mario.onground = true;
									mario.jumping = false;
									mario.fast = false;
									mario.direction = 'right';
									for( var k = mario.bullets.length ; k-- ; )
									{
										mario.bullets[k].body.hide();
										mario.bullets[k].active = false;
										mario.bullets[k].velocity_y = 0;
									}
									if( custom )
										mario.level = -1;												//damit in der success()-Methode keine Folgelevel geladen wird
									break;
							}
						}
						
						//Canvasinhalt als levelimage abspeichern und in #world einfügen:
						levelimage = canvas.toDataURL('image/png');
						$('#world').css( { 'background-image' : 'url(' + levelimage + ')' } );   
						
						//Wo ist Mario zu Beginn des Spiels?
						if( mario.x < width04 )		//Mario am linken Bildschirmrand
						{
							screenpos_x = mario_x = mario.x;
							$('#world').css( { 'background-position' : '0px 0px' } );
							$('#background').css( { 'background-position' : '0px -380px' } );
						}
						else if( mario.x > levelwidth - screenwidth + width06 )		//Mario am rechten Bildschirmrand
						{
							mario_x = mario.x;
							screenpos_x = screenwidth - levelwidth + mario.x;
							$('#world').css( { 'background-position' :  (screenwidth-levelwidth).toString() + 'px 0px' } );
							$('#background').css( { 'background-position' : ((screenwidth-levelwidth)/3).toString() + 'px -380px' } );
						}
						else				//Mario irgendwo in Bildschirmmitte
						{
							screenpos_x = width04;
							mario_x = mario.x;
							$('#world').css( { 'background-position' :  (screenpos_x-mario_x).toString() + 'px 0px' } );
							$('#background').css( { 'background-position' : ((screenpos_x-mario_x)/3).toString() + 'px -380px' } );
						}
						
						mario.move();		//Falls man Mario in der Luft abgesetzt hat, soll er erst mal zu Boden fallen.
						mario.body.show();	//Falls Mario blinkend gestorben ist und gerade unsichtbar war. (Sicher ist sicher!)
						
						//Geld- und Lebensanzeigen aktualisieren:
						$('#number_of_coins').text(mario.coins.toString()+'x');
						$('#number_of_lives').text(mario.lives.toString()+'x');
						
						//Richtungstasten noch nicht gedrückt:
						leftkey_down = false;
						rightkey_down = false;
						
						//Die Pflanzen sollen anfangen nach Mario zu schnappen:
						for( var k = plants.length ; k-- ; )
						{
							plants[k].bite();
							plants[k].body.show();
						}
						
						//Die Gegner laufen los:
						for( var k = enemies.length ; k-- ; )
						{
							enemies[k].move();
							enemies[k].body.show();
						}
						
						//Starte das Spiel:
						setTimeout( function() 
										{ 
											$('#levelloading').hide(); 
											music.currentTime = 0;
											music.play();
										} , 300 );
						GameLoop();			//Dauerschleife, die das Spiel am Laufen hält...
					};
		objects.src = 'mario-objects.png';	//lade die Objekt-Sprites: ?, Pilze, Graslandschaften, etc.
}

function DefaultLevel(level)
{	
	levelarray = new Array();
	
	//Lege Level spaltenweise an, beginnend links oben. Jede Spalte hat 15 Einträge (= Höhe des Levels)!!!
	if(level==1)	//Remake vom 1. Level von Super Mario Land
	{	
		$('#levelloading').show();
		$('#background').css( { 'background-image' : 'url(\'mario-background_1.png\')' } );
		
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'mushroombox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_top_left_corner' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'ballmonster' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'mushroombox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'bush_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , 'coinbox' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , 'coinbox' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'planted_soil_middle' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'starbox' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_top_left_corner' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top_left_rounded' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top_right_rounded' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'grass_top_left_rounded' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'coin' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'coin' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'brown_block' , 'brown_block' , '' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'coin' , 'brown_block' , 'brown_block' , 'coin' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'coin' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'coin' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , 'coin' , '' , 'coin' , '' , 'coin' , '' , 'coin' , '' , 'coin' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		
		return true;
	}
	else if(level==2)		//Graslandschaften
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_1.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_1.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','mario','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','mushroombox','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','bush_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','ballmonster','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','pipe_top_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','brown_block','brown_block','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','multiple_coinbox','','','','brown_block','brown_block','brown_block','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','brown_block','brown_block','grass_top','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_left','grass_left','grass_top_left_corner','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','bush_left','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','bush_right','grass_top','soil','planted_soil_left','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','planted_soil_middle','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','planted_soil_right','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','greenturtle','grass_top_right','grass_right','grass_right','grass_right','grass_right','grass_right' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','brown_block','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','coin','brown_block','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','brown_block','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','coin','brown_block','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','brown_block','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','coin','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_left','grass_left','grass_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','bush_middle_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','bush_middle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','mushroombox','','','bush_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','grass_top','soil','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','spikedturtle','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right','grass_right','grass_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_left','grass_left','grass_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','starbox','','','bush_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','greenturtle','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','spikedturtle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','bush_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_left','grass_left','grass_top_left_corner','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','spikedturtle','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right','grass_right','grass_right','grass_right','grass_right','grass_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','coin','coin','','','brown_block','brown_block','grass_top_left','grass_left','grass_left','grass_left' ) );
		levelarray.push( new Array( '','','','','','coin','coin','','','brown_block','brown_block','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','coin','coin','','','brown_block','brown_block','grass_top','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','coin','coin','','ballmonster','brown_block','brown_block','grass_top','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','coin','coin','','','brown_block','brown_block','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','coin','coin','','','brown_block','brown_block','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','grass_top_right','grass_top_right_corner','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','brown_block','grass_top_right','grass_top_right_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','brown_block','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','greenturtle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','coin','coin','','','','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','coin','coin','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','mushroombox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_right','grass_top_right_corner' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_left','grass_top_left_corner' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','coin','coin','','','','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','coin','coin','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','ballmonster','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_left','grass_left','grass_left','grass_top_left_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','ballmonster','grass_top','soil','planted_soil_left','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','grass_top','soil','planted_soil_middle','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','grass_top','soil','planted_soil_middle','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','grass_top','soil','planted_soil_middle','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','planted_soil_right','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil','pipe_right_soil','pipe_right_soil','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right','grass_right','grass_right','grass_right','grass_top_right_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','brown_block','brown_block','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','coin','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','coin','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','coinbox','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','mushroombox','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','coinbox','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','coin','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','coin','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','brown_block','brown_block','brown_block','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_left','grass_left','grass_left','grass_top_left_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','bush_left','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','bush_middle_right','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','bush_middle_left','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','bush_middle_right','grass_top','soil','soil','planted_soil_left','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','bush_right','grass_top','soil','soil','planted_soil_middle','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','greenturtle','grass_top','soil','soil','planted_soil_middle','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','planted_soil_right','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right','grass_top_right_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','spikedturtle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_right','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_middle' ) );
		
		return true;
	}
	else if(level==3)		//Graslandschaften
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_1.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_1.png\')' } ); } , 8000 );
			
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'brown_block' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'brown_block' , 'brown_block' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'grass_top' , 'planted_soil_left' , 'soil' , 'grass_top_right_rounded_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , '' , '' , 'coin' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , '' , '' , 'coin' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , '' , '' , 'coin' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , '' , '' , 'coin' , 'coin' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , '' , '' , 'coin' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'coin' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'coin' , 'grass_top' , 'planted_soil_right' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_middle' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , '' , 'brown_block' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'coin' , 'brown_block' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , 'brown_block' , '' , 'brown_block' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , 'coin' , 'brown_block' , 'coin' , 'brown_block' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'brown_block' , 'coin' , 'brown_block' , '' , 'multiple_coinbox' , '' , 'coinbox' , '' , '' , 'mushroombox' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , 'coin' , 'brown_block' , 'coin' , 'brown_block' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , 'brown_block' , '' , 'brown_block' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'coin' , 'brown_block' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , '' , 'brown_block' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'coinbox' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'coinbox' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'pipe_top_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_top_right_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_top_left_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'starbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_right' , 'grass_right' , 'grass_right' , 'grass_right' , 'grass_right' , 'grass_right' , 'grass_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		
		return true;
	}
	else if(level==4)		//Gebirgslevel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_8.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_8.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','mario','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','coinbox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','coinbox','','','ballmonster','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','coinbox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','coinbox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','coinbox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','coinbox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','coinbox','','','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','mushroombox','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','greenturtle','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','soil_right','soil_right','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','ballmonster','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','brown_block','brown_block','brown_block','grass_top_left_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','brown_block','brown_block','grass_top_right_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','multiple_coinbox','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','brown_block','brown_block','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','ballmonster','stone','brown_block','brown_block','brown_block','brown_block','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','stone','brown_block','brown_block','brown_block','brown_block','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block','grass_top_left_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block','grass_top_right_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','stone','brown_block','brown_block','brown_block','brown_block','brown_block','grass_top','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','stone','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','brown_block','','','','','stone','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','stone','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','brown_block','','','','','stone','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','stone','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','brown_block','brown_block','brown_block','brown_block','brown_block','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','ballmonster','stone','stone','brown_block','brown_block','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','grass_top_left_rounded','soil_left','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','grass_top','stone','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','mushroombox','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','greenturtle','grass_top','soil','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right','grass_right','grass_top_right_corner','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','coinbox','','','','','stone','','','','','','spikedturtle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','planted_soil_left','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','planted_soil_right','soil','soil','soil','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','ballmonster','grass_top','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','soil','stone','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','grass_top_right_rounded','soil_right','soil_right','soil_right','soil_right','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','brown_block','brown_block','brown_block','brown_block','grass_top_left_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','brown_block','brown_block','brown_block','brown_block','grass_top_right_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','coin','coin','','','pipeplant','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','coin','coin','','','','pipe_top_right','pipe_right','pipe_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','coinbox','','','','','brown_block','brown_block','brown_block','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','brown_block','brown_block','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','pipeplant','pipe_top_left','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','pipe_top_right','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','mushroombox','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_left_rounded','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		
		return true;
	}
	else if(level==5)		//Gebirgslevel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_8.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_8.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','mario','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','mushroombox','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','spikedturtle','brown_block','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','multiple_coinbox','','','','stone','','','','','','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_left_rounded','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','greenturtle','grass_top','soil','grass_top_left_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_left','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','mushroombox','grass_top','planted_soil_right','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','grass_top','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','grass_top','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','grass_top','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','grass_top_right_rounded','soil_right','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','multiple_coinbox','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','multiple_coinbox','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','stone','stone','stone','coin','coin','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','coin','coin','','','stone','stone','stone','coin','coin','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','coin','coin','','','stone','stone','','','','','','','','grass_top_right_rounded' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','brown_block','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','brown_block','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','brown_block','','','','','brown_block' ) );
		levelarray.push( new Array( '','','','','','','ballmonster','stone','stone','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','brown_block','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','brown_block','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','coin','','','stone','stone','brown_block','','','','','','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','coin','','','stone','stone','','','','','','','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','coin','','','stone','','','','','','','','','' ) );
		levelarray.push( new Array( '','','coin','','spikedturtle','stone','','','','','','','','','' ) );
		levelarray.push( new Array( '','','coin','','','stone','brown_block','brown_block','brown_block','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','coin','','','stone','brown_block','brown_block','brown_block','','','','','','brown_block' ) );
		levelarray.push( new Array( '','','coin','','','stone','','','','','','','','','' ) );
		levelarray.push( new Array( '','','coin','','','stone','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','grass_top_left_rounded','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','grass_top','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','grass_top','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','stone','','','','','stone','','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','stone','','','','','','','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','stone','','','','','','','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','coinbox','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','grass_top_right_rounded','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','starbox','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','ballmonster','stone','stone','brown_block','brown_block','brown_block','brown_block','brown_block','brown_block','brown_block' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','stone','stone','brown_block','brown_block','brown_block','brown_block','brown_block','brown_block','brown_block','grass_top_left_rounded' ) );
		levelarray.push( new Array( '','','','','spikedturtle','stone','stone','brown_block','brown_block','brown_block','brown_block','brown_block','brown_block','brown_block','grass_top_right_rounded' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','stone','stone','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','','','','','grass_top_left_rounded','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','stone','stone','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','stone','stone','stone','stone','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','stone','stone','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','stone','stone','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','grass_top','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','grass_top','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','mushroombox','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','greenturtle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','spikedturtle','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','coinbox','','','','spikedturtle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','stone','soil' ) );
		levelarray.push( new Array( '','','','','coinbox','','','','','brown_block','brown_block','brown_block','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','brown_block','brown_block','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','coinbox','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right_grass','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','ballmonster','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','spikedturtle','brown_block','','','multiple_coinbox','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','coin','coin','coin','coin','coin','coin','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','stone','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','stone','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','stone','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','stone','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','stone','stone','stone','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','stone','stone','stone','grass_top_right','grass_top_right_corner' ) );
		levelarray.push( new Array( '','','','','','stone','stone','stone','stone','coin','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','stone','stone','stone','stone','coin','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','stone','stone','stone','stone','coin','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','stone','stone','stone','stone','coin','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','greenturtle','stone','stone','stone','stone','coin','coin','coin','coin','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','stone','stone','stone','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','stone','stone','stone','stone','stone','stone','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','stone','stone','stone','grass_top_left','grass_top_left_corner' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','stone','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','stone','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','spikedturtle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','stone','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		
		return true;
	}
	else if(level==6)		//Dschungel-Einstiegslevel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_3.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_3.png\')' } ); } , 8000 );
	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , 'mushroombox' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , 'mario' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'stone' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'brown_block' , '' , '' , '' , '' , 'multiple_coinbox' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'brown_block' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'stone' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'ballmonster' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , 'stone' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , 'stone' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , 'greenturtle' , 'stone' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left_grass' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right_grass' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'bush_middle_left' , 'mushroombox' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'spikedturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'greenturtle' , 'stone' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'brown_block' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'brown_block' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'greenturtle' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'brown_block' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( 'multiple_coinbox' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'brown_block' , 'coin' , 'coin' , 'stone' , 'brown_block' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , 'brown_block' , 'coin' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' , '' , 'coin' , 'coin' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'coin' , '' , 'ballmonster' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , 'coin' , 'coin' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'coin' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , 'coin' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_left' ) );
		levelarray.push( new Array( '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_right' , 'grass_top_right_corner' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_right' , 'grass_top_right_corner' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_right' , 'grass_top_right_corner' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'coinbox' , '' , '' , '' , 'coinbox' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'coinbox' , '' , '' , '' , 'coinbox' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_right' , 'grass_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_right' , 'grass_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'mushroombox' , '' , '' , '' , 'brown_block' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'mushroombox' , '' , '' , '' , 'brown_block' , 'coin' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'coin' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'coin' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		
		return true;
	}
	else if(level==7)		//Dschungel-Einstiegslevel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_3.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_3.png\')' } ); } , 8000 );
	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'mushroombox' , '' , '' , '' , 'stone' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'multiple_coinbox' , '' , '' , '' , 'stone' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_top_right_corner' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' ) );
		levelarray.push( new Array( '' , '' , 'mushroombox' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'bush_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'brown_block' , '' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , 'bush_middle_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , 'brown_block' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , 'bush_middle_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , 'bush_middle_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , 'bush_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'stone' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'ballmonster' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'ballmonster' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'bush_left' , 'grass_top' ) );
		levelarray.push( new Array( 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'bush_middle' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'mushroombox' , '' , 'brown_block' , '' , 'bush_middle_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'brown_block' , '' , 'bush_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , 'coin' , '' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , 'coin' , '' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , 'brown_block' , '' , '' , 'stone' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , 'coin' , '' , 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , 'coin' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right_grass' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_top_left_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'coinbox' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'multiple_coinbox' , '' , '' , '' , 'spikedturtle' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'coinbox' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_top_right_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , 'coin' , 'coin' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , 'coin' , 'coin' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' ) );
		levelarray.push( new Array( '' , '' , '' , 'coin' , 'coin' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' ) );
		levelarray.push( new Array( '' , '' , '' , 'coin' , 'coin' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'starbox' , '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_top_left_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_top_right_corner' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'stone' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_left' , 'grass_left' , 'grass_top_left_corner' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'stone' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'stone' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		
		return true;
	}
	
	else if(level==8)		//Dschungel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_5.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_5.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','mario','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','coinbox','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','coinbox','','','','','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','ballmonster','brown_block','','','','','grass_top','soil','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','coinbox','','','','bush_left','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','bush_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','greenturtle','grass_top','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','mushroombox','','','','brown_block','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','grass_top_right_rounded','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','spikedturtle','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','soil_left','soil_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','staticplant','grass_top','soil','soil','soil','planted_soil_left','soil','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_right','grass_top_right_corner','soil','grass_top_left_rounded_soil','soil_left','soil_left','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right','grass_top_right_corner','grass_top','soil','planted_soil_left','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right_rounded','grass_top','soil','planted_soil_middle','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','planted_soil_middle','soil','soil' ) );
		levelarray.push( new Array( '','coin','coin','','brown_block','','','','','ballmonster','grass_top','soil','planted_soil_right','soil','soil' ) );
		levelarray.push( new Array( '','coin','coin','','brown_block','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil' ) );
		levelarray.push( new Array( '','coin','coin','','brown_block','','','','','','','grass_top_right','grass_top_right_corner','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right','grass_top_right_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','pipe_top_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_left','grass_left','grass_top_left_corner','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right_grass','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','coin','coin','coin','coin','coin','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','coin','coin','coin','coin','coin','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','ballmonster','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left_rounded','soil_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','staticplant','grass_top','planted_soil_left','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','planted_soil_right','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left_rounded','soil_left','soil_left','grass_top_right_rounded_soil','soil_right','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','soil','soil','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','coinbox','','','','grass_top','soil','soil','soil','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','mushroombox','','','','grass_top','soil','soil','soil','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','coinbox','','','','grass_top','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','grass_top_left_rounded_soil','soil_left','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','staticplant','grass_top','soil','grass_top','planted_soil_left','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','grass_top','planted_soil_middle','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right_rounded','soil_right','grass_top','planted_soil_middle','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','planted_soil_right','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','greenturtle','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','grass_top_left_rounded_soil','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right_rounded','soil_right','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','staticplant','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_right','pipe_right_grass','pipe_right_soil','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','ballmonster','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left','grass_left','grass_left','grass_top_left_corner','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','brown_block','soil','brown_block','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','soil','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','staticplant','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','coinbox','','','','','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','brown_block','','','','bush_left','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','mushroombox','','','','bush_middle_left','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','brown_block','','','','bush_middle_right','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','coinbox','','','','bush_middle','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','bush_middle_left','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','bush_right','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','staticplant','grass_top','brown_block','soil','coin','soil','brown_block','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','coin','soil','brown_block','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','brown_block','soil','soil','soil','brown_block','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right','grass_right','brown_block','soil_right','soil_right','brown_block','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','staticplant','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','multiple_coinbox','','','','','brown_block','','','','','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','staticplant','grass_top_right_rounded','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','grass_top','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','greenturtle','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','soil','grass_top_right_rounded_soil','soil_right','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','planted_soil_left','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','staticplant','grass_top','soil','soil','planted_soil_middle','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','planted_soil_right','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','coin','coin','','','','pipe_top_left','pipe_left_grass','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','coin','coin','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil','pipe_right_soil','pipe_right_soil','pipe_right_soil','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','ballmonster','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left','grass_top_left_corner','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_top_left_corner','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left','grass_top_left_corner','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left','grass_top_left_corner','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','grass_top','soil','planted_soil_left','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','grass_top','soil','planted_soil_middle','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','grass_top','soil','planted_soil_middle','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','spikedturtle','grass_top','soil','planted_soil_middle','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','grass_top','soil','planted_soil_right','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','grass_top','soil','soil','soil','soil','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','coinbox','','','','','grass_top','soil','soil','soil','soil','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','soil','soil','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','staticplant','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		
		return true;
	}
	else if(level==9)		//Dschungel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_5.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_5.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'mushroombox' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top_right' , 'grass_right' , 'grass_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_top_left_corner' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left_grass' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' , 'pipe_left_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right_grass' ) );
		levelarray.push( new Array( '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mushroombox' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' , 'soil_right' , 'soil_right' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'grass_top_left_rounded_soil' , 'soil_left' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'grass_top_right_rounded_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left_grass' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right_grass' , 'pipe_right_soil' , 'pipe_right_soil' , 'pipe_right_soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'grass_top_right_corner' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'pipe_top_right' , 'pipe_right_grass' , 'pipe_right_soil' , 'pipe_right_soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_middle' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_middle' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','brown_block','','','','','','','','bush_middle','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','coin','brown_block','','','','','','','bush_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','coin','coin','brown_block','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','coin','coin','mushroombox','','','','','pipeplant','pipe_top_left','pipe_left_grass','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','coin','coin','multiple_coinbox','','','','','','pipe_top_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','coin','coin','brown_block','','','','','','','grass_top_right','grass_right','grass_top_right_corner' ) );
		levelarray.push( new Array( '','','','coin','brown_block','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','brown_block','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','staticplant','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left_grass' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_right','pipe_right_grass','pipe_right_soil','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right','grass_top_right_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','ballmonster','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','staticplant','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','mushroombox','','','','brown_block','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','bush_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','bush_middle_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_middle_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','bush_right','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','coinbox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','coinbox','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','pipe_top_right','pipe_right_grass','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','grass_top_left_rounded_soil','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','grass_top','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','grass_top_right_rounded','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','brown_block','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','starbox','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','brown_block','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','staticplant','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','coinbox','coin','coin','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','coin','coin','coin','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','coin','coin','coin','coin','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','coin','coin','coin','coin','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','coin','coin','coin','coin','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','coin','coin','coin','coin','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','coinbox','coin','coin','coin','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','brown_block','brown_block','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','brown_block','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','brown_block','soil_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		
		return true;
	}
	else if(level==10)		//Wolkenlevel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_6.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_6.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top' , 'soil' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'mushroombox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );	
		levelarray.push( new Array( '','','','','','','','','','','','bush_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_right','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right','grass_right','grass_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left','grass_left','grass_left','grass_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','ballmonster','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','coinbox','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','grass_top','soil','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','multiple_coinbox','','','','','grass_top','soil','soil','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','spikedturtle','brown_block','','','','bush_left','grass_top','soil','soil','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','coinbox','','','','bush_middle_right','grass_top','soil','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','bush_right','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','grass_top_right','grass_right','grass_right','grass_right' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left','grass_left','grass_left','grass_left','grass_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','greenturtle','grass_top','soil','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','pipeplant','pipe_top_left','pipe_left_grass','pipe_left_soil','pipe_left_soil','pipe_left_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_right','pipe_right_grass','pipe_right_soil','pipe_right_soil','pipe_right_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right','grass_right','grass_right','grass_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','greenturtle','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','spikedturtle','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','coin','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left','grass_left','grass_left','grass_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right','grass_top_right_corner','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','coin','grass_top_right','grass_top_right_corner','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','coin','grass_top_right','grass_top_right_corner' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','coin','grass_top_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','brown_block','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','brown_block','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','brown_block','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','','','','mushroombox','','','','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','','','','coinbox','','','','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','brown_block','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','ballmonster','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','grass_top_left','grass_left','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','grass_top','soil','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','grass_top','planted_soil_left','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','grass_top','planted_soil_right','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','grass_top','soil','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','grass_top_right','grass_right','stone','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','pipe_top_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','pipe_top_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_left','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_left','grass_top','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_middle_right','grass_top','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_right','grass_top','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left','grass_left','grass_top_left_corner','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','stone','' ) );
		levelarray.push( new Array( '','','','coin','coin','','','pipeplant','pipe_top_left','pipe_left','pipe_left_grass','pipe_left_soil','pipe_left_soil','pipe_left_soil','pipe_left' ) );
		levelarray.push( new Array( '','','','coin','coin','','','','pipe_top_right','pipe_right','pipe_right_grass','pipe_right_soil','pipe_right_soil','pipe_right_soil','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','grass_right','grass_right','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','mushroombox','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left','grass_left','grass_left','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','greenturtle','grass_top','soil','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','bush_left','grass_top','soil','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','coinbox','','','','bush_middle','grass_top','soil','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','coinbox','','','','bush_middle_left','grass_top','soil','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','multiple_coinbox','','','','bush_middle_left','grass_top','soil','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','coinbox','','','','bush_right','grass_top','soil','planted_soil_left','stone','','','','' ) );
		levelarray.push( new Array( '','','coinbox','','','','','grass_top','soil','planted_soil_middle','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','ballmonster','grass_top','soil','planted_soil_right','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_right','grass_right','grass_right','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','brown_block','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','grass_top_left','grass_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','grass_top_left','grass_left','grass_left','stone','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','staticplant','grass_top','soil','soil','stone','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','grass_top','soil','soil','stone','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','starbox','','','','','grass_top','soil','soil','stone','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','grass_top','soil','soil','stone','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','grass_top','soil','soil','stone','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','spikedturtle','grass_top','soil','soil','stone','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','bush_left','grass_top','soil','soil','stone','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','bush_middle','grass_top','soil','soil','stone','','','coin','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','bush_middle_right','grass_top','soil','soil','stone','','coin','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','bush_middle','grass_top','soil','soil','stone','','','coin','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','bush_right','grass_top','soil','soil','stone','','coin','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','grass_top','soil','soil','stone','','','coin','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','greenturtle','grass_top','soil','soil','stone','','coin','','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','grass_top_right','grass_right','grass_right','stone','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','coin','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_right','grass_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','pipe_top_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','coinbox','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','spikedturtle','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','mushroombox','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','coinbox','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','stone','','','' ) );
		levelarray.push( new Array( '','','','','brown_block','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','brown_block','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','brown_block','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		
		return true;
	}
	else if(level==11)		//Wolkenlevel
	{
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_6.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_6.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top' , 'soil' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'mushroombox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right' , 'grass_right' , 'stone' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );	
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'multiple_coinbox' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','ballmonster','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','brown_block','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left','grass_left','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','greenturtle','grass_top','planted_soil_left','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','','grass_top','planted_soil_right','stone','','','','' ) );
		levelarray.push( new Array( '','','','','coin','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right','grass_right','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( 'coin','coin','','','','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( 'coin','coin','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','coin','coin','','','','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','coin','coin','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_left','grass_left','stone','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','planted_soil_left','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','grass_top','planted_soil_middle','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','grass_top','planted_soil_right','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','mushroombox','','','bush_left','grass_top','soil','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','bush_middle','grass_top','soil','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','bush_middle_right','grass_top','soil','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','','','','bush_right','grass_top','soil','soil','stone','','' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','stone','','' ) );
		levelarray.push( new Array( '','','','brown_block','','','','','ballmonster','grass_top_right','grass_right','grass_right','stone','','' ) );
		levelarray.push( new Array( '','','','brown_block','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','brown_block','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','coin','coin','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','coin','coin','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','brown_block','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_left','grass_left','grass_left','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','bush_left','grass_top','soil','soil','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','bush_middle','grass_top','soil','soil','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','bush_middle_left','grass_top','soil','soil','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','bush_right','grass_top','soil','soil','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','grass_top','soil','soil','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','grass_top','soil','planted_soil_left','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','grass_top','soil','planted_soil_middle','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','coinbox','','','','grass_top','soil','planted_soil_middle','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','ballmonster','grass_top','soil','planted_soil_right','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','soil','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right','grass_right','grass_right','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','stone','coin','stone' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','stone' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','brown_block','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','pipeplant','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','pipe_top_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left','pipe_left' ) );
		levelarray.push( new Array( '','','','','','','','pipe_top_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right','pipe_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left','grass_left','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','multiple_coinbox','','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right','grass_right','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','mushroombox','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','coinbox','','','ballmonster','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','brown_block','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','grass_top_left','stone','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','grass_top','stone','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','grass_top','stone','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','grass_top_right','stone','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		
		return true;
	}
	else if(level==12)		//Nachtwelt
	{	
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_7.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_7.png\')' } ); } , 8000 );

		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );			
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top_left' , 'grass_left' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left_grass' , 'pipe_left_soil' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'starbox' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'grass_top_left_rounded' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'spikedturtle' , 'brown_block' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'coin' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'coin' , 'soil' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_top_left_corner' , 'coin' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'coin' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_left' , 'grass_left' , 'grass_top_left_corner' , 'soil' , 'soil' , 'soil' , 'coin' , 'soil' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'soil' , 'soil' , 'mushroombox' , 'soil' , 'coin' , 'soil' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' , 'soil' , 'coinbox' , 'soil' , 'coin' , 'soil' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( 'coinbox' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'stone' , '' , 'brown_block' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'staticplant' , 'grass_top_right_rounded' , 'soil_right' , 'stone' , 'coin' , 'coin' , 'brown_block' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'coin' , 'coin' , 'coin' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'stone' , 'coin' , 'coin' , 'coin' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'stone' , 'coin' , 'coin' , 'coin' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'stone' , 'coin' , 'coin' , 'coin' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'coin' , 'coin' , 'brown_block' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'coin' , 'coin' , 'brown_block' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'brown_block' , 'soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'coin' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'coinbox' , 'soil' , 'soil' , 'soil' , 'coin' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'starbox' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'stone' , 'coin' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'stone' , 'coin' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'coin' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'coin' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'coin' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , 'stone' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , 'stone' , '' , '' , '' , '' , 'coin' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , 'stone' , '' , '' , '' , '' , '' , 'coin' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'stone' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'stone' , 'soil' , 'soil' ) );
		levelarray.push( new Array( '' , '' , 'mushroombox' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'grass_top_right_rounded_soil' , 'soil_right' , 'soil_right' , 'stone' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'staticplant' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		
		return true;
	}
	
	else if(level==13)		//Inselwelt
	{	
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_2.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_2.png\')' } ); } , 8000 );
		
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_left_rounded','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','mario','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_left','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','bush_right','grass_top','soil','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left_rounded','soil_left','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','ballmonster','grass_top','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','soil_left','grass_top','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','coin','','','grass_top','coinbox','soil','soil','soil','grass_top','grass_top_left_rounded_soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','grass_top','brown_block','soil','soil','soil','grass_top_right_rounded_soil','grass_top','grass_top_right_rounded_soil','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','coin','','','grass_top','coinbox','soil','soil','soil','soil','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','grass_top','brown_block','soil','soil','soil','soil','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','coin','','bush_left','grass_top','coinbox','soil','soil','planted_soil_left','soil','grass_top_right_rounded_soil','soil_right','grass_top_left_rounded_soil','soil_left' ) );
		levelarray.push( new Array( '','','','','bush_middle','grass_top','soil','soil','soil','planted_soil_middle','soil','soil','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','coin','','bush_middle_left','grass_top','soil','soil','soil','planted_soil_right','soil','soil','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','bush_middle_right','grass_top','soil','soil','soil','soil','soil','soil','grass_top_left_rounded_soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','coin','','bush_right','grass_top','soil','soil','grass_top_left_rounded_soil','soil_left','soil_left','soil_left','grass_top','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','grass_top','soil','soil','grass_top','soil','soil','soil','grass_top','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','','coin','','','grass_top','soil','soil','grass_top','soil','soil','planted_soil_left','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','greenturtle','grass_top','soil','soil','grass_top','soil','soil','planted_soil_right','grass_top_right_rounded_soil','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','coin','','','grass_top','soil','soil','grass_top','soil','soil','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','grass_top_right_rounded','soil_right','soil_right','grass_top','soil','soil','soil','soil','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','ballmonster','grass_top','soil','grass_top_left_rounded_soil','soil_left','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right_rounded','soil_right','grass_top','soil','planted_soil_left','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','planted_soil_middle','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','bush_left','grass_top','soil','planted_soil_right','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','bush_middle','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','bush_right','grass_top','soil','soil','soil','grass_top_left_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','mushroombox','soil','soil','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right','soil_right','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top_right_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','ballmonster','grass_top','soil','soil','grass_top_left_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left_rounded','soil_left','soil_left','grass_top','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','soil','grass_top_right_rounded_soil','soil_right','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','planted_soil_left','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','coinbox','','','','','grass_top','soil','planted_soil_middle','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','brown_block','','','','','grass_top','soil','planted_soil_right','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','multiple_coinbox','','','','','grass_top','soil','soil','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','brown_block','','','','greenturtle','grass_top','soil','grass_top_left_rounded_soil','soil_left','soil_left','coin','grass_top' ) );
		levelarray.push( new Array( '','','','coinbox','','','','bush_left','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','bush_middle','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','bush_middle_right','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','bush_right','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','grass_top','soil','soil','soil','grass_top_right_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right_rounded','soil_right','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','grass_top_left_rounded_soil','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','spikedturtle','grass_top','grass_top','soil','planted_soil_left','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right_rounded','grass_top','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_middle','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','planted_soil_right','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','stone','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','soil_left','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','planted_soil_left','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','planted_soil_middle','soil','soil','grass_top_left_rounded_soil','soil_left' ) );
		levelarray.push( new Array( '','','','','','','greenturtle','grass_top','soil','soil','planted_soil_right','soil','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','bush_left','grass_top','soil','soil','soil','grass_top_left_rounded_soil','soil_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','bush_middle','grass_top','soil','soil','soil','grass_top','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','bush_middle_right','grass_top','soil','soil','soil','grass_top','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','bush_right','grass_top','soil','soil','soil','grass_top','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','soil','grass_top','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_right_rounded','soil_right','soil_right','soil_right','grass_top','coin','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','ballmonster','grass_top','soil','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','','','','','','coinbox','','','','','grass_top','soil','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','mushroombox','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','coinbox','','','grass_top_left_rounded','soil_left','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','grass_top','soil','soil','grass_top_left_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top','soil','grass_top','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','grass_top_left_rounded','soil_left','soil_left','grass_top','planted_soil_left','grass_top','soil','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','grass_top','soil','soil','grass_top','planted_soil_middle','grass_top_right_rounded_soil','soil_right','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','spikedturtle','grass_top','soil','soil','grass_top','planted_soil_middle','soil','soil','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','grass_top','soil','soil','grass_top','planted_soil_right','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','grass_top','soil','soil','grass_top','soil','soil','grass_top_left_rounded_soil','soil_left','grass_top_right_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','grass_top_right_rounded','soil_right','soil_right','grass_top','soil','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','starbox','','','','','','','','grass_top','soil','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','greenturtle','grass_top','soil','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','grass_top_right_rounded','soil_right','soil_right','grass_top','soil','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','stone','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','stone','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','ballmonster','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left_rounded','soil_left','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','greenturtle','grass_top','coin','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','grass_top','soil','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','grass_top_left_rounded','soil_left','soil_left','grass_top_right_rounded_soil','soil_right','soil_right','soil_right','grass_top','soil','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','coin','','','grass_top','soil','soil','soil','soil','soil','coin','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','grass_top','soil','soil','soil','soil','soil','soil','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','grass_top','coin','soil','soil','grass_top_left_rounded_soil','soil_left','soil_left','grass_top','grass_top_left_rounded_soil','soil_left','soil_left' ) );
		levelarray.push( new Array( '','coin','','','grass_top','soil','soil','soil','grass_top','soil','soil','grass_top','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','grass_top','soil','planted_soil_left','soil','grass_top','soil','soil','grass_top_right_rounded_soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','ballmonster','grass_top','soil','planted_soil_middle','soil','grass_top','soil','soil','soil','grass_top','grass_top_left_rounded_soil','soil_left' ) );
		levelarray.push( new Array( '','coin','','','grass_top','soil','planted_soil_right','soil','multiple_coinbox','soil','soil','soil','grass_top','grass_top','soil' ) );
		levelarray.push( new Array( '','','','bush_left','grass_top','soil','soil','soil','grass_top','soil','coin','soil','grass_top','grass_top','soil' ) );
		levelarray.push( new Array( '','','','bush_middle_right','grass_top','soil','soil','soil','grass_top','planted_soil_left','soil','soil','grass_top_right_rounded_soil','grass_top','soil' ) );
		levelarray.push( new Array( '','coin','','bush_middle','grass_top','soil','soil','grass_top_left_rounded_soil','grass_top','planted_soil_middle','soil','soil','coin','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','bush_middle_left','grass_top','coin','soil','grass_top','grass_top','planted_soil_right','grass_top_left_rounded_soil','soil_left','soil_left','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','bush_middle_right','grass_top','soil','soil','grass_top','grass_top_right_rounded_soil','soil_right','grass_top','soil','soil','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','coin','','bush_right','grass_top','soil','soil','grass_top','soil','soil','grass_top','soil','soil','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','grass_top_right_rounded','soil_right','soil_right','grass_top','soil','soil','grass_top','soil','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','grass_top','coin','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','ballmonster','grass_top_right_rounded','soil_right','soil_right','grass_top','soil','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','spikedturtle','grass_top','soil','soil','grass_top_right_rounded_soil','grass_top_left_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right','soil_right','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','ballmonster','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','bush_left','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','bush_middle_left','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','bush_middle_right','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','bush_right','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','mushroombox','','','','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','spikedturtle','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top_right_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','stone','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','stone','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','stone','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','stone','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','stone','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','grass_top_left_rounded' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_left_rounded','soil_left','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','stone','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left_rounded','soil_left','soil_left','soil_left','soil_left','grass_top','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','bush_left','grass_top','soil','planted_soil_left','soil','soil','grass_top','coin','grass_top' ) );
		levelarray.push( new Array( '','','','coinbox','','','bush_middle','grass_top','soil','planted_soil_middle','soil','soil','grass_top','soil','grass_top' ) );
		levelarray.push( new Array( '','','','multiple_coinbox','','','bush_right','grass_top','soil','planted_soil_right','soil','mushroombox','grass_top','coin','grass_top' ) );
		levelarray.push( new Array( '','','','coinbox','','','greenturtle','grass_top','soil','soil','soil','soil','grass_top','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','mushroombox','soil','soil','soil','grass_top','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_right_rounded','soil_right','soil_right','soil_right','soil_right','grass_top','soil','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','ballmonster','grass_top','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left_rounded','soil_left','grass_top','soil','grass_top_right_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','ballmonster','grass_top','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_left_rounded','soil_left','grass_top','soil','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','grass_top','soil','grass_top_right_rounded_soil','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','greenturtle','grass_top','planted_soil_left','grass_top','soil','soil','soil','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','bush_left','grass_top','planted_soil_middle','grass_top','soil','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','bush_middle_left','grass_top','planted_soil_right','grass_top_right_rounded_soil','grass_top_left_rounded_soil','soil_left','soil_left','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','bush_middle','grass_top','soil','soil','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','bush_right','grass_top','soil','soil','grass_top','soil','grass_top_left_rounded_soil','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right_rounded','soil_right','soil_right','grass_top','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','grass_top_left_rounded_soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','grass_top','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right_rounded','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		
		return true;
	}
	else if(level==14)		//Inselwelt
	{	
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_2.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_2.png\')' } ); } , 8000 );
		
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coin' , '' , 'coin' , '' , 'coin' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , 'ballmonster' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'coin' , 'grass_top_left_rounded_soil' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'coin' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'mushroombox' , '' , '' , 'coin' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'grass_top' , 'planted_soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'coin' , 'grass_top' , 'planted_soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'coin' , 'grass_top_right_rounded_soil' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'coin' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'coin' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'coin' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'coin' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'coin' , 'planted_soil_left' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'coinbox' , 'soil' , 'planted_soil_right' , 'soil' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'starbox' , 'soil' , 'soil' , 'soil' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'multiple_coinbox' , 'soil' , 'soil' , 'soil' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'coinbox' , 'soil' , 'soil' , 'soil' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'spikedturtle' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'grass_top' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' , 'grass_top_left_rounded_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , 'coinbox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'grass_top' , 'soil' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'coin' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top_left_rounded' , 'soil_left' , 'soil_left' , 'soil_left' , 'grass_top_right_rounded_soil' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' , 'soil' , 'soil' , 'planted_soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , 'mushroombox' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' , 'soil_left' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil' , 'grass_top_left_rounded_soil' , 'soil_left' , 'coin' , 'grass_top' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'grass_top' , 'soil' , 'coin' , 'grass_top' , 'planted_soil_left' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'coin' , 'grass_top' , 'planted_soil_middle' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'coin' , 'grass_top' , 'planted_soil_right' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'planted_soil_middle' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' , 'planted_soil_right' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top_left_rounded_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'multiple_coinbox' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'multiple_coinbox' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' , 'soil' , 'soil' , 'grass_top_right_rounded_soil' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top_right_rounded' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' , 'soil_right' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array('' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top_left_rounded','soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_left' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','grass_top','planted_soil_middle' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_left_rounded','soil_left','grass_top','planted_soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top_left','stone','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','grass_top','soil','soil','grass_top','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','ballmonster','grass_top','planted_soil_left','soil','grass_top_right_rounded_soil','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','grass_top_left_rounded','soil_left','soil_left','grass_top','planted_soil_right','soil','coin','grass_top_left_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','grass_top','soil','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','spikedturtle','grass_top','planted_soil_left','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','grass_top_left_rounded','soil_left','grass_top','planted_soil_right','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','coinbox','','','','grass_top','soil','grass_top','soil','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','brown_block','','','','grass_top','soil','grass_top_right_rounded_soil','soil_right','soil_right','grass_top','soil','planted_soil_left','coin','grass_top' ) );
		levelarray.push( new Array( '','coinbox','','','','grass_top','soil','soil','soil','planted_soil_middle','grass_top','soil','planted_soil_middle','coin','grass_top' ) );
		levelarray.push( new Array( '','brown_block','','','','grass_top','soil','soil','grass_top_left_rounded_soil','soil_left','grass_top','soil','planted_soil_middle','coin','grass_top' ) );
		levelarray.push( new Array( '','coinbox','','','ballmonster','grass_top','soil','soil','grass_top','soil','grass_top','soil','planted_soil_right','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','grass_top_right_rounded','soil_right','soil_right','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','spikedturtle','grass_top','soil','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','grass_top_right_rounded','soil_right','grass_top','soil','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','greenturtle','grass_top_right','grass_top_right_corner','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','coin','grass_top' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','coin','grass_top_right_rounded_soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top','soil','soil','soil' ) );
		levelarray.push( new Array( '','','','','','','','','','','','grass_top_right_rounded','soil_right','soil_right','soil_right' ) );
		levelarray.push( new Array( '','','','','','','','','','','','','','','' ) );
		
		return true;
	}
		else if(level==15)		// Sternwelt
	{	
		if(savegame)
		{
			$('#levelloading').show(); 
			$('#background').css( { 'background-image' : 'url(\'mario-background_4.png\')' } );
			savegame = false;
		}
		else
			setTimeout( function() { $('#levelloading').show(); $('#background').css( { 'background-image' : 'url(\'mario-background_4.png\')' } ); } , 8000 );
			
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'coinbox' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'coinbox' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' ) );
		levelarray.push( new Array( 'coin' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , 'ballmonster' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'stone' , 'brown_block' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , 'ballmonster' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( 'coin' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'stone' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , 'pipeplant' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' ) );
		levelarray.push( new Array( '' , 'coin' , 'coin' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'mushroombox' , '' , '' , '' , 'greenturtle' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'starbox' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , 'greenturtle' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mushroombox' , '' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'multiple_coinbox' , '' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , 'multiple_coinbox' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , '' , '' , 'stone' , 'stone' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , 'stone' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' , 'stone' , 'stone' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , 'stone' , 'stone' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_left' , 'pipe_left' , 'pipe_left' , 'pipe_left' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'pipe_top_right' , 'pipe_right' , 'pipe_right' , 'pipe_right' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , 'starbox' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'stone' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'stone' , '' , 'stone' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'stone' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'stone' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'coin' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'coin' , 'stone' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'coin' , 'stone' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'coin' , 'stone' , '' , 'stone' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , 'stone' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'greenturtle' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , 'brown_block' , 'brown_block' , '' , 'spikedturtle' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'staticplant' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'stone' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , 'spikedturtle' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , 'spikedturtle' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , 'spikedturtle' , 'brown_block' , '' , '' , '' , '' , '' , 'brown_block' , 'stone' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , 'staticplant' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'mushroombox' , '' , '' , 'spikedturtle' , 'brown_block' , '' , 'stone' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , 'spikedturtle' , 'brown_block' , '' , 'stone' , '' , 'stone' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , '' , 'stone' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'stone' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , 'stone' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , 'stone' , 'stone' , 'stone' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , 'stone' , '' , '' , '' , 'stone' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , 'stone' , 'stone' , 'stone' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		levelarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , 'brown_block' , '' , '' , '' , '' , '' , '' ) );
		
		return true;
	}
			
	else return false;								//keine weiteren Level da...
}

function Ending()									//Endsequenz (Mario trifft Daisy) und Credits
{
	document.onkeydown = NodownHandler;				//Tastenbelegung aufheben
	document.onkeyup = NodownHandler;
	
	if(!custom)	eraseCookies();						//Cookies löschen
	
	//Alle unnötig gewordenen divs löschen:
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
	//Mario selbst:
	mario.body.destroy().remove();
	for( var k = mario.bullets.length ; k-- ; )
		mario.bullets[k].body.remove();
	mario = null;
	
	// Alle Audios stoppen
	music.pause();
	invincibilityMusic.pause();
	gameoverMusic.pause();
	endingMusic.pause();
	successMusic.pause();
	creditMusic.pause();
	dieMusic.pause();
	
	//Customlevels bekommen keine Endsequenz und keine Credits zu sehen:
	if( custom )		
	{
		$('#background').hide();
		$('#menu').show();
		menuMusic.currentTime = 0;
		menuMusic.play();
		
		return;
	}
	
	//Musik ab:
	endingMusic.currentTime = 0;
	endingMusic.play();
	
	//Hintergrund für die Endsequenz:
	var endarray = new Array();
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_left' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'planted_soil_middle' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_left' , 'grass_top' , 'soil' , 'planted_soil_right' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_left' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_middle_right' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'bush_right' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_left' , 'soil' ) );
	endarray.push( new Array( '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'planted_soil_middle' , 'soil' ) );
	
	$('#background').css( { 'background-image' : 'url(\'mario-background_4.png\')' } );
	
	//Zeichne Treffpunkt von Mario und Daisy in das Canvaselement:
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	canvas.width = screenwidth;
	canvas.height = 15*32;
	context.fillStyle = 'rgba(0,0,0,0)';	
	context.fillRect(0,0,canvas.width,canvas.height);		//transparente Hintergrundfarbe für das Canvas
	
	objects = new Image();
		objects.onload = function() 
					{
						for( var i = 0 ; i < endarray.length ; i++ )		//sämtliche Levelspalten: von links nach rechts im Level
						for( var j = 0 ; j < 15 ; j++ )						//sämtliche Levelzeilen: von oben nach unten je Spalte
						{	
							//zeichne das Level Kachel für Kachel:
							switch(endarray[i][j])
							{
								case 'grass_top':
									context.drawImage(objects,888,404,32,32,i*32,j*32,32,32);
									break;
								case 'soil':
									context.drawImage(objects,888,438,32,32,i*32,j*32,32,32);
									break;
								case 'bush_left':
									context.drawImage(objects,178,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_middle_left':
									context.drawImage(objects,212,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_middle':
									context.drawImage(objects,348,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_middle_right':
									context.drawImage(objects,314,928,32,32,i*32,j*32,32,32);
									break;
								case 'bush_right':
									context.drawImage(objects,382,928,32,32,i*32,j*32,32,32);
									break;
								case 'planted_soil_left':
									context.drawImage(objects,714,832,32,32,i*32,j*32,32,32);
									break;
								case 'planted_soil_middle':
									context.drawImage(objects,748,832,32,32,i*32,j*32,32,32);
									break;
								case 'planted_soil_right':
									context.drawImage(objects,782,832,32,32,i*32,j*32,32,32);
									break;
							}
						}
						
						//Canvasinhalt als levelimage abspeichern und in #world einfügen:
						levelimage = canvas.toDataURL('image/png');
						$('#world').css( { 'background-image' : 'url(' + levelimage + ')' } );
						$('#world').css( { 'background-position' : '0px 0px' } );
					};
		objects.src = 'mario-objects.png';	//lade die Objekt-Sprites: ?, Pilze, Graslandschaften, etc.
	
	//Peach und Mario erstellen:
	$('#world').append('<div id=\'peach\'></div>');
	$('#peach').css( { 'margin' : '0' ,
		     	       'padding' : '0' ,
				       'width' : '46px' , 
				       'height' : '64px' , 
				       'background-image' : 'url(\'mario-peach.png\')' , 
				       'background-position' : '0px -80px' , 		//nach links schauende Peach
				       'position' : 'absolute' ,					//Positionierung der Spielfigur erfolgt relativ zum übergeordneten world-Div
				       'left' : '550px' ,								
				       'bottom' : '96px' ,							
				       'z-index' : '101'  } );						//Peach ist vor Mario
	
	$('#world').append('<div id=\'mario\'></div>');
	$('#mario').css( { 'margin' : '0' ,
		     	       'padding' : '0' ,
				       'width' : '80px' , 
				       'height' : '80px' , 
				       'background-image' : 'url(\'mario-sprites.png\')' , 
				       'background-position' : '0px -243px' , 		//nach rechts schauender, großer Mario
				       'position' : 'absolute' ,					//Positionierung der Spielfigur erfolgt relativ zum übergeordneten world-Div
				       'left' : '-280px' ,								
				       'bottom' : '96px' ,							
				       'z-index' : '100'  } );						//Peach ist vor Mario
	$('#mario').sprite( { fps: 9 , no_of_frames: 2, rewind: true } );//damit Mario läuft
	
	$('#world').append('<div id=\'speech\'></div>');
	$('#speech').css( { 'margin' : '0' ,
		                'padding' : '0' ,
				        'width' : '0px' , 
				        'height' : '37px' , 
				        'position' : 'absolute' ,					//Positionierung des Textes erfolgt relativ zum übergeordneten world-Div
				        'left' : '450px' ,								
				        'bottom' : '230px' ,
						'text-align' : 'right' ,
						'font-family' : '\'Comic Sans MS\' , \'Georgia\' , \'Arial\'' ,
						'font-size' : '22px' ,
						'font-weight' : 'bold' ,
						'white-space' : 'nowrap' ,
						'color' : 'white' ,
						'overflow' : 'hidden' ,
				        'z-index' : '102'  } );
	$('#speech').text('Mario!.');
	
	$('#mario').animate( { 'left' : '30' } , 1000 , function() 																//Mario läuft von links rein
	{
		$('#mario').destroy().css( { 'background-position' : '-81px -243px' } );											//Mario bleibt stehen
		setTimeout( function() 
		{ 
			$('#speech').animate( { 'width' : '66px' } , 400 , function() 													//Peach ruft Mario
			{
				setTimeout( function() 
				{
					$('#speech').css( { 'width' : '0px' , 'left' : '300px' } ).text('Thank you, Mario!.');					//Sprechblase verschwindet wieder
					$('#peach').css( { 'background-position' : '-138px -80px' } ).sprite( { fps: 6 , no_of_frames: 4 } ).animate( {'left':'336px'} , 2000 , function() //Peach läuft Mario entgegen
					{ 
						$('#peach').destroy().css( { 'background-position' : '0px -80px' } ); 
					} );
					setTimeout( function() 																					//Mario läuft Peach entgegen
					{
						$('#mario').css( { 'background-position' : '0px -243px' } ).sprite( { fps: 9 , no_of_frames: 2 , rewind: true } ).animate( {'left':'243px'} , 1000 , function() 
						{ 
							$('#mario').destroy().css( { 'background-position' : '-81px -243px' } ); 
							$('#speech').animate( { 'width' : '193px' } , 400 , function() 									//Thank you, Mario!
							{
								setTimeout( function() 
								{
									$('#speech').css( { 'width' : '0px' , 'left' : '200px' } ).text('Oh, Daisy!.');			//Sprechblase verschwindet wieder
									setTimeout( function() 
									{
										$('#speech').animate( { 'width' : '112px' } , 400 , function() 						//Oh, Daisy!
										{
											setTimeout( function() 
											{
												$('#speech').css( { 'width' : '0px' , 'left' : '300px' } ).text('I love you, Mario!.');	//Sprechblase verschwindet wieder
												setTimeout( function() 
												{
													$('#speech').animate( { 'width' : '194px' } , 400 , function() 			//I love you, Mario!
													{
														setTimeout( function() 
														{
															$('#speech').css( { 'width' : '0px' } );						//Sprechblase verschwindet wieder
															$('#mario').css({'background-position' : '-161px -81px'});		//Victory-Mario
															$('#peach').css({'background-position' : '-46px -2px'});		//Victory-Peach
															setTimeout( function() 
															{
																$('#credits').show();
																setTimeout( function() 
																{
																	creditMusic.currentTime = 0;
																	setTimeout( function() { creditMusic.play(); } , 1000 );
																	$('#credits').animate( { 'top' : '-2000px' } , 60000 , 'linear' , function() 
																	{
																			$('#speech').remove();
																			$('#peach').remove();
																			$('#mario').remove();
																			$('#credits').hide().css( { 'top' : '0px' } );
																			
																			$('#background').hide();
																			$('#menu').show();
																			menuMusic.currentTime = 0;
																			menuMusic.play();
																	} );
																} , 2000 );
															} , 2000 );
														} , 2000 );
													} );
												} , 700 );
											} , 1000 )
										} );
									} , 700 );
								} , 1000 );
							} );		
						} );
					} , 1200 );
				} , 1000 );
			} );					
		} , 700 );
	} );
}

function GameOver()
{	
	gameoverMusic.currentTime = 0;
	gameoverMusic.play();
	diashow = true;
	animation();
	
	document.onkeydown = NodownHandler;		//Tastenbelegung aufheben
	document.onkeyup = NodownHandler;
	
	//GameOver einblenden:
	$('#world').append('<div id=\'gameover\'></div>');
	$('#gameover').css( { 'margin' : '0' ,
						  'padding' : '20px' ,
						  'height' : '440px' ,
						  'width' : '600px' ,
							
						  'position' : 'absolute' ,		/* damit man relativ zur #world ausrichten kann */
						  'top' : '0px' ,
						  'left' : '0px' ,
						  'z-index' : '1001' ,			/* ist vor Mario und allen anderen Objekten im Spiel */
							
						  'background-color' : 'rgba(0,0,0,0.7)' ,	/* ein leicht durchsichtiges Grau */
						
						  'text-align' : 'center' ,
						  'font-family' : '\'Comic Sans MS\' , \'Georgia\' , \'Arial\'' ,
						  'font-size' : '44px' ,
						  'font-weight' : 'bold' ,
						  'text-decoration' : 'underline' ,
						  'color' : 'white' } ).html('<br><br><br>Game Over');
	
	//Zurück ins Hauptmenü und alle unnötig gewordenen divs löschen:
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
						//Mario selbst:
						mario.body.destroy().remove();
						for( var k = mario.bullets.length ; k-- ; )
							mario.bullets[k].body.remove();
						mario = null;

						$('#gameover').remove();
						$('#background').hide();
						$('#menu').show();
						menuMusic.currentTime = 0;
						menuMusic.play();
					} , 5000 );
}







