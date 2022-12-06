function bullet(i)						//Konstruktor eines Feuerballs für Mario als Schützen
{
	this.i = i;							//damit ist die Kugel eindeutig identifizierbar
	this.x = 0;							//world-Koordinaten -> für Animation in GameLoop()
	this.y = 0;							//werden beim Abschuss auf mario.x und mario.y gesetzt
	
	this.direction = 'right';			//wird beim Abschuss auf mario.direction gesetzt
	this.velocity_y = 0;				//Fallgeschwindigkeit des Feuerballs
	
	this.active = false;				//ist der Feuerball gerade in Gebrauch?
	
	$('#world').append('<div id=\'bullet' + i.toString() + '\'></div>');//erzeuge div für die Kugel und setze sie in die Spielwelt ein
	this.body = $('#bullet'+i.toString());								//hiermit lässt sich das div ansprechen
	
	this.body.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '16px' , 
		 		 	 'height' : '16px' , 
		 			 'background-image' : 'url(\'mario-sprites.png\')' , 
					 'background-position' : '-191px -366px' ,	//Bild des Feuerballs
					 'position' : 'absolute' ,					//Positionierung des Balls erfolgt relativ zum übergeordneten world-Div
					 'left' : '0px' ,							//zunächst mal irgendwo
					 'bottom' : '0px' ,
					 'display' : 'none' ,						//unbenutzte Kugeln sind unsichtbar
					 'z-index' : '99'  } );						//Kugeln sind hinter Mario
};

bullet.prototype.move = function()		//der Feuerball fliegt los...
{	
	if( this.x - mario.x > screenwidth || mario.x - this.x > screenwidth )
	{
		this.body.hide();				//verstecke Ball
		this.active = false;
		return;							//und beende move()
	}
	
	//Berechnung der neuen Koordinaten mit Kollisionskontrolle: 
	var Delta_x = 0, Delta_y = 0;		//Translationen
	var i_alt, j_alt, i_neu, j_neu;		//für die Kollisionsabfrage mit dem levelarray
	
	//Horizontale Translation:
	if( this.direction==='right' )
		Delta_x = 12;					//entspricht Geschwindigkeit, mit der der Ball fliegt
	else
		Delta_x = -12;
	
	//Vertikale Translation:
	Delta_y = this.velocity_y;			//entspricht vertikaler Geschwindigkeit
	this.velocity_y -= 2;				//Reduzierung der Fallgeschwindigkeit aufgrund der Fallbeschleunigung
	
	//Linker oder rechter Levelrand:
	if( this.x + Delta_x < 0 || this.x + Delta_x > levelwidth - 16 )
	{
		var This = this;				//verstecke Ball
		setTimeout( function() { This.body.hide(); } , 20 );
		this.active = false;
		return;							//und beende move()
	}
	
	//Undurchdringliche Objekte rechts und links:
	i_alt = Math.floor( ( this.x + 8 ) / 32 );  //vor move(): Ball war in i-ter Levelspalte im levelarray
	j_alt = 14 - Math.floor( this.y / 32 );  	//vor move(): Ball auf Höhe des j-ten Elements des levelarrays
	
	if( this.direction==='right' && i_alt <  levelwidth / 32 - 1 )
	{
		if(levelarray[i_alt+1][j_alt]==='grass_left'||levelarray[i_alt+1][j_alt]==='grass_top_left'||levelarray[i_alt+1][j_alt]==='brown_block'||levelarray[i_alt+1][j_alt]==='stone'||levelarray[i_alt+1][j_alt]==='coinbox'||levelarray[i_alt+1][j_alt]==='multiple_coinbox'||levelarray[i_alt+1][j_alt]==='starbox'||levelarray[i_alt+1][j_alt]==='pipe_left'||levelarray[i_alt+1][j_alt]==='pipe_top_left'||levelarray[i_alt+1][j_alt]==='pipe_left_grass'||levelarray[i_alt+1][j_alt]==='pipe_left_soil'||levelarray[i_alt+1][j_alt]==='mushroombox')
			if( this.x + Delta_x > i_alt * 32 )
			{
				var This = this;				//verstecke Ball
				setTimeout( function() { This.body.hide(); } , 20 );
				this.active = false;
				return;							//und beende move()
			}
	}
	else if( i_alt > 0 )			//der Fall = 0 entspricht dem linken Levelrand
	{
		if(levelarray[i_alt-1][j_alt]==='grass_right'||levelarray[i_alt-1][j_alt]==='grass_top_right'||levelarray[i_alt-1][j_alt]==='brown_block'||levelarray[i_alt-1][j_alt]==='stone'||levelarray[i_alt-1][j_alt]==='coinbox'||levelarray[i_alt-1][j_alt]==='multiple_coinbox'||levelarray[i_alt-1][j_alt]==='starbox'||levelarray[i_alt-1][j_alt]==='pipe_right'||levelarray[i_alt-1][j_alt]==='pipe_top_right'||levelarray[i_alt-1][j_alt]==='pipe_right_grass'||levelarray[i_alt-1][j_alt]==='pipe_right_soil'||levelarray[i_alt-1][j_alt]==='mushroombox')
			if( this.x + Delta_x < i_alt * 32 )
			{
				var This = this;				//verstecke Ball
				setTimeout( function() { This.body.hide(); } , 20 );
				this.active = false;
				return;							//und beende move()
			}
	}
	
	//Freier Fall:
	i_neu = Math.floor( ( this.x + Delta_x + 8 ) / 32 );  //Ziel: Ball will in i-ter Levelspalte im levelarray landen
	j_neu = 14 - Math.floor( ( this.y + Delta_y ) / 32 ); //Ziel: Ball will auf Höhe des j-ten Elements des levelarrays gelangen
	if( j_neu > 14 )			//Ball würde den unteren Rand des levelarrays überschreiten, was nicht definiert ist!!!
		j_neu = 14;
	
	if( j_neu - j_alt == 1 )	//Ball fällt in die nächste Kachel hinein
	{
		if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
		{	
			//Fall beendet:
			Delta_y = (15 - j_neu) * 32 - this.y;		//restliche Fallstrecke bis zum Boden
			this.velocity_y = 13;						//der Ball hoppst sofort weiter
		}
	}
	else if( j_neu - j_alt == 2 )	//Ball fällt in die übernächste Kachel hinein -> die nächste muss daher auch überprüft werden!!!
	{
		if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
		{	
			//Fall endet auf nächster Kachel:
			Delta_y = (16 - j_neu) * 32 - this.y;		//restliche Fallstrecke bis zum Boden
			this.velocity_y = 13;						//der Ball hoppst sofort weiter
		}
		else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
		{	
			//Ball fällt durch nächste Kachel durch und landet auf übernächster:
			Delta_y = (15 - j_neu) * 32 - this.y;		//restliche Fallstrecke bis zum Boden
			this.velocity_y = 13;						//der Ball hoppst sofort weiter
		}
	}
	else if( j_neu - j_alt == 3 )	//Ball fällt in die überübernächste Kachel hinein -> untersuche auch die beiden darüberliegenden Kacheln!!!
	{
		if(levelarray[i_neu][j_neu-2]==='grass_top'||levelarray[i_neu][j_neu-2]==='grass_top_right'||levelarray[i_neu][j_neu-2]==='grass_top_left'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-2]==='stone'||levelarray[i_neu][j_neu-2]==='brown_block'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-2]==='coinbox'||levelarray[i_neu][j_neu-2]==='multiple_coinbox'||levelarray[i_neu][j_neu-2]==='starbox'||levelarray[i_neu][j_neu-2]==='pipe_top_right'||levelarray[i_neu][j_neu-2]==='pipe_top_left'||levelarray[i_neu][j_neu-2]==='mushroombox')
		{	
			//Fall endet auf nächster Kachel:
			Delta_y = (17 - j_neu) * 32 - this.y;		//restliche Fallstrecke bis zum Boden
			this.velocity_y = 13;						//der Ball hoppst sofort weiter
		}
		else if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
		{	
			//Fall endet auf übernächster Kachel:
			Delta_y = (16 - j_neu) * 32 - this.y;		//restliche Fallstrecke bis zum Boden
			this.velocity_y = 13;						//der Ball hoppst sofort weiter
		}
		else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
		{	
			//Ball fällt durch die beiden nächsten Kacheln durch und landet auf überübernächster:
			Delta_y = (15 - j_neu) * 32 - this.y;		//restliche Fallstrecke bis zum Boden
			this.velocity_y = 13;						//der Ball hoppst sofort weiter
		}
	}
	
	this.x += Delta_x;		//neue x-Position im Level
	this.y += Delta_y;		//neue y-Position im Level
	
	
	//Erwischt der Feuerball irgendwelche Gegner?
	for( var k = enemies.length ; k-- ; )
		if( this.x + 16 > enemies[k].x  && this.x < enemies[k].x + 32 && this.y + 16 > enemies[k].y && this.y < enemies[k].y + 35 )	//Wechselwirkungsbereich
			if( !enemies[k].dead )
			{
				enemies[k].die();
				var This = this;				//verstecke Ball
				setTimeout( function() { This.body.hide(); } , 20 );
				this.active = false;
				return;							//und beende move()
			}
			
	//Erwischt der Feuerball irgendwelche Pflanzen?
	for( var k = plants.length ; k-- ; )
		if( plants[k].frame )	//Röhrenpflanzen
		{
			if( this.x + 16 > plants[k].x  && this.x < plants[k].x + 32 && this.y + 16 > plants[k].y + plants[k].Delta_y && this.y < plants[k].y + plants[k].Delta_y + 42 )	//Wechselwirkungsbereich
				if( !plants[k].dead )
				{
					plants[k].die();
					var This = this;				//verstecke Ball
					setTimeout( function() { This.body.hide(); } , 20 );
					this.active = false;
					return;							//und beende move()
				}
		}
		else					//statische Pflanzen
		{
			if( this.x + 16 > plants[k].x  && this.x < plants[k].x + 32 && this.y + 16 > plants[k].y && this.y < plants[k].y + 42 )	//Wechselwirkungsbereich
				if( !plants[k].dead )
				{
					plants[k].die();
					var This = this;				//verstecke Ball
					setTimeout( function() { This.body.hide(); } , 20 );
					this.active = false;
					return;							//und beende move()
				}
		}
	
	
	//der nächste Move:
	if( this.y < -15 || mario.dead || mario.finished )	//falls die Kugel im Boden verschwunden ist
	{
		var This = this;			//verstecke Ball und beende move()
		setTimeout( function() { This.body.hide(); } , 20 );
		this.active = false;
	}
	else
	{
		var This = this;			//Erstellen eines this-Klons für das folgende setTimeout!!!
		setTimeout( function() { This.move(); } , 20 );
	}
};