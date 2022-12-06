function GameLoop()			//Führt alle CSS-Änderungen gesammelt aus, damit alles synchron abläuft...
			{
				if( mario.dead || mario.finished )	
					return;				//Wenn Mario stirbt oder das Level meistert, endet die Spielschleife.
				else
				{
					if( mario.x < width04 )		//Mario am linken Levelrand
					{
						screenpos_x = mario_x = mario.x;
						
						mario.body.css( { 'left' : screenpos_x , 'bottom' : mario.y } );
						$('#world').css( { 'background-position' : '0px 0px' } );
						$('#background').css( { 'background-position' : '0px -380px' } );
						for( var k = mario.bullets.length ; k-- ; )
							mario.bullets[k].body.css( { 'left' : mario.bullets[k].x , 'bottom' : mario.bullets[k].y } );
						for( var k = coins.length ; k-- ; )
							coins[k].body.css( { 'left' : coins[k].x } );
						for( var k = coinboxes.length ; k-- ; )
						{
							coinboxes[k].body.css( { 'left' : coinboxes[k].x } );
							coinboxes[k].coin.css( { 'left' : coinboxes[k].x } );
						}
						for( var k = multiple_coinboxes.length ; k-- ; )
						{
							multiple_coinboxes[k].body.css( { 'left' : multiple_coinboxes[k].x } );
							multiple_coinboxes[k].coin.css( { 'left' : multiple_coinboxes[k].x } );
						}
						for( var k = starboxes.length ; k-- ; )
						{
							starboxes[k].body.css( { 'left' : starboxes[k].x } );
							starboxes[k].star.css( { 'left' : starboxes[k].star_x , 'bottom' : starboxes[k].star_y } );	
						}
						for( var k = mushroomboxes.length ; k-- ; )
						{
							mushroomboxes[k].body.css( { 'left' : mushroomboxes[k].x } );
							mushroomboxes[k].mushroom.css( { 'left' : mushroomboxes[k].mushroom_x , 'bottom' : mushroomboxes[k].mushroom_y } );	
						}
						for( var k = plants.length ; k-- ; )
							if( plants[k].frame )
							{
								plants[k].frame.css( { 'left' : plants[k].x } );
								plants[k].body.css( { 'bottom' : plants[k].Delta_y } );
							}
							else
								plants[k].body.css( { 'left' : plants[k].x } );
						for( var k = enemies.length ; k-- ; )
						{
							enemies[k].body.css( { 'left' : enemies[k].x } );
							if( enemies[k].shell )
								enemies[k].shell.css( { 'left' : enemies[k].shell_x , 'bottom' : enemies[k].shell_y } );
						}
					}
					else if( mario.x > levelwidth - screenwidth + width06 )		//Mario am rechten Levelrand
					{
						mario_x = mario.x;
						screenpos_x = screenwidth - levelwidth + mario.x;
						
						mario.body.css( { 'left' : screenpos_x , 'bottom' : mario.y } );
						$('#world').css( { 'background-position' : (screenwidth-levelwidth).toString() + 'px 0px' } );
						$('#background').css( { 'background-position' : Math.floor((screenwidth-levelwidth)/3).toString() + 'px -380px' } );
						for( var k = mario.bullets.length ; k-- ; )
							mario.bullets[k].body.css( { 'left' : mario.bullets[k].x-levelwidth+screenwidth , 'bottom' : mario.bullets[k].y } );
						for( var k = coins.length ; k-- ; )
							coins[k].body.css( { 'left' : coins[k].x-levelwidth+screenwidth } );
						for( var k = coinboxes.length ; k-- ; )
						{
							coinboxes[k].body.css( { 'left' : coinboxes[k].x-levelwidth+screenwidth } );
							coinboxes[k].coin.css( { 'left' : coinboxes[k].x-levelwidth+screenwidth } );
						}
						for( var k = multiple_coinboxes.length ; k-- ; )
						{
							multiple_coinboxes[k].body.css( { 'left' : multiple_coinboxes[k].x-levelwidth+screenwidth } );
							multiple_coinboxes[k].coin.css( { 'left' : multiple_coinboxes[k].x-levelwidth+screenwidth } );
						}
						for( var k = starboxes.length ; k-- ; )
						{
							starboxes[k].body.css( { 'left' : starboxes[k].x-levelwidth+screenwidth } );
							starboxes[k].star.css( { 'left' : starboxes[k].star_x-levelwidth+screenwidth , 'bottom' : starboxes[k].star_y } );
						}
						for( var k = mushroomboxes.length ; k-- ; )
						{
							mushroomboxes[k].body.css( { 'left' : mushroomboxes[k].x-levelwidth+screenwidth } );
							mushroomboxes[k].mushroom.css( { 'left' : mushroomboxes[k].mushroom_x-levelwidth+screenwidth , 'bottom' : mushroomboxes[k].mushroom_y } );
						}
						for( var k = plants.length ; k-- ; )
							if( plants[k].frame )
							{
								plants[k].frame.css( { 'left' : plants[k].x-levelwidth+screenwidth } );
								plants[k].body.css( { 'bottom' : plants[k].Delta_y } );
							}
							else
								plants[k].body.css( { 'left' : plants[k].x-levelwidth+screenwidth } );
						for( var k = enemies.length ; k-- ; )
						{
							enemies[k].body.css( { 'left' : enemies[k].x-levelwidth+screenwidth } );
							if( enemies[k].shell )
								enemies[k].shell.css( { 'left' : enemies[k].shell_x-levelwidth+screenwidth , 'bottom' : enemies[k].shell_y } );
						}
					}
					else		//Mario irgendwo in Levelmitte
					{
						//Berechne neue Bildschirmposition von Mario: 
						screenpos_x += mario.x - mario_x;
						if( screenpos_x < width04 )
							screenpos_x = width04;
						else if( screenpos_x > width06 )
							screenpos_x = width06;
						mario_x = mario.x;
						
						mario.body.css( { 'left' : screenpos_x , 'bottom' : mario.y } );
						$('#world').css( { 'background-position' : (screenpos_x-mario_x).toString() + 'px 0px' } );
						$('#background').css( { 'background-position' : Math.floor((screenpos_x-mario_x)/3).toString() + 'px -380px' } );
						for( var k = mario.bullets.length ; k-- ; )
							mario.bullets[k].body.css( { 'left' : mario.bullets[k].x+screenpos_x-mario_x , 'bottom' : mario.bullets[k].y } );
						for( var k = coins.length ; k-- ; )
							coins[k].body.css( { 'left' : coins[k].x+screenpos_x-mario_x } );
						for( var k = coinboxes.length ; k-- ; )
						{
							coinboxes[k].body.css( { 'left' : coinboxes[k].x+screenpos_x-mario_x } );
							coinboxes[k].coin.css( { 'left' : coinboxes[k].x+screenpos_x-mario_x } );
						}
						for( var k = multiple_coinboxes.length ; k-- ; )
						{
							multiple_coinboxes[k].body.css( { 'left' : multiple_coinboxes[k].x+screenpos_x-mario_x } );
							multiple_coinboxes[k].coin.css( { 'left' : multiple_coinboxes[k].x+screenpos_x-mario_x } );
						}
						for( var k = starboxes.length ; k-- ; )
						{
							starboxes[k].body.css( { 'left' : starboxes[k].x+screenpos_x-mario_x } );
							starboxes[k].star.css( { 'left' : starboxes[k].star_x+screenpos_x-mario_x , 'bottom' : starboxes[k].star_y } );
						}
						for( var k = mushroomboxes.length ; k-- ; )
						{
							mushroomboxes[k].body.css( { 'left' : mushroomboxes[k].x+screenpos_x-mario_x } );
							mushroomboxes[k].mushroom.css( { 'left' : mushroomboxes[k].mushroom_x+screenpos_x-mario_x , 'bottom' : mushroomboxes[k].mushroom_y } );
						}
						for( var k = plants.length ; k-- ; )
							if( plants[k].frame )
							{
								plants[k].frame.css( { 'left' : plants[k].x+screenpos_x-mario_x } );
								plants[k].body.css( { 'bottom' : plants[k].Delta_y } );
							}
							else
								plants[k].body.css( { 'left' : plants[k].x+screenpos_x-mario_x } );
						for( var k = enemies.length ; k-- ; )
						{
							enemies[k].body.css( { 'left' : enemies[k].x+screenpos_x-mario_x } );
							if( enemies[k].shell )
								enemies[k].shell.css( { 'left' : enemies[k].shell_x+screenpos_x-mario_x , 'bottom' : enemies[k].shell_y } );
						}
					}
					
					setTimeout( function() { GameLoop(); } , 20 );				//nach 20ms das Spielgeschehen wieder neu zeichnen
				}
			}
			
