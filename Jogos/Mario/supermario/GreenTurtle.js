function greenturtle(i,j)				//Konstruktor einer grünen Schildkröte
{
	this.i = i;							//damit ist der Gegner eindeutig identifizierbar
	this.j = j;
	this.x = 32*i - 1;					//world-Koordinaten -> für Animation in GameLoop()
	this.y = (14-j)*32;
	this.shell_x = this.x;
	this.shell_y = this.y;
	
	this.direction = 'left';			//der Gegner läuft Mario anfangs entgegen
	this.state = 'big';					//Schildkröte mit ('big') oder ohne ('small') Panzer?
	this.dead = false;					//lebt die Schildkröte noch?
	this.sprite_big_right = false;		//für die Sprite-Animationen: damit ich weiß, ob ich einen bestimmten Sprite ein- bzw. 
	this.sprite_big_left = true;		//ausschalten muss.
	this.sprite_small_right = false;
	this.sprite_small_left = false;
	
	this.sliding = false;				//bewegt sich der Panzer schon?
	this.shell_direction = 'right';
	this.onground = true;				//am Anfang sitzt der Schildkrötenpanzer auf dem Boden
	this.velocity_y = 0;				//Fallgeschwindigkeit des Panzers
	this.allowed_to_take_back = false;	//wann darf die Schildkröte ihren Panzer zurückholen?
	this.deadly = false;				//der Panzer wird erst nach 200ms tödlich, um Mario nicht sofort zu verletzen
	
	$('#world').append('<div id=\'greenturtle' + i.toString() + '_' + j.toString() + '\'></div>');	//erzeuge div für die Schildkröte und setze sie in die Spielwelt ein
	this.body = $('#greenturtle'+i.toString()+'_'+j.toString());									//hiermit lässt sich das div ansprechen
	
	this.body.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '34px' , 
		 		 	 'height' : '54px' , 
		 			 'background-image' : 'url(\'mario-enemies.png\')' , 
					 'background-position' : '-34px -266px' ,	//Bild einer nach links schauenden Schildkröte
					 'position' : 'absolute' ,					//Positionierung des Gegners erfolgt relativ zum übergeordneten world-Div
					 'left' : (32*i-1).toString() + 'px' ,
					 'bottom' : ((14-j)*32).toString() + 'px' ,
					 'z-index' : '99'  } );						//Gegner sind hinter Mario
	
	this.body.sprite( { fps: 6 , no_of_frames: 2 , rewind: true } );//damit die Schildkröte läuft
	
	$('#world').append('<div id=\'greenturtleshell' + i.toString() + '_' + j.toString() + '\'></div>');	//erzeuge div für den Schildkrötenpanzer und setze ihn in die Spielwelt ein
	this.shell = $('#greenturtleshell'+i.toString()+'_'+j.toString());									//hiermit lässt sich das div ansprechen
	
	this.shell.css( { 'margin' : '0' ,
					  'padding' : '0' ,
		 		 	  'width' : '34px' , 
		 		 	  'height' : '32px' , 
		 			  'background-image' : 'url(\'mario-enemies.png\')' , 
					  'background-position' : '0px -494px' ,	//Bild des Schildkrötenpanzers
					  'position' : 'absolute' ,					//Positionierung des Panzers erfolgt relativ zum übergeordneten world-Div
					  'left' : (32*i-1).toString() + 'px' ,
					  'bottom' : ((14-j)*32).toString() + 'px' ,
					  'display' : 'none' ,						//der Panzer ist zunächst nicht sichtbar
					  'z-index' : '99'  } );					//Gegner sind hinter Mario
};

greenturtle.prototype.move = function()	//die Schildkröte bewegt sich
{
	if( this.dead )	return;		//beende move() nach Tod
	
	//Berechnung der neuen Koordinaten mit Kollisionskontrolle: 
	var Delta_x = 0;						//Translation
	var i_alt;								//für die Kollisionsabfrage mit dem levelarray
	
	//Horizontale Translation:
	switch(this.state)
	{
		case 'small':		//Schildkröte ohne Panzer
			if( this.direction==='right' )
				Delta_x = 3;						//ohne Panzer ist die Schildkröte schneller
			else
				Delta_x = -3;
			break;
			
		case 'big':			//Schildkröte mit Panzer
			if( this.direction==='right' )
				Delta_x = 2;						//mit Panzer ist die Schildkröte langsamer
			else
				Delta_x = -2;
			break;
	}
	
	//Linker Levelrand:
	if( this.x + Delta_x < 0 )
	{
		Delta_x = -this.x;					//läuft gegen eine unsichtbare Wand
		this.direction = 'right';
	}
	//Rechter Levelrand:
	else if( this.x + Delta_x > levelwidth - 32 )
	{
		Delta_x = levelwidth - 32 - this.x;	//läuft gegen eine unsichtbare Wand
		this.direction = 'left';
	}
	
	//Trifft der Gegner auf eine Wand oder einen Abgrund?
	i_alt = Math.floor( ( this.x + 16 ) / 32 );//vor move(): Gegner stand in i-ter Levelspalte im levelarray
	
	if( this.direction==='right' && i_alt <  levelwidth / 32 - 1 )						//TODO: hier Kollisionen mit weiteren Gegnern einbauen!!!!!!!!!!!!!!!!!!!!!!!!!!!
	{
		if(levelarray[i_alt+1][this.j]==='grass_left'||levelarray[i_alt+1][this.j]==='grass_top_left'||levelarray[i_alt+1][this.j]==='brown_block'||levelarray[i_alt+1][this.j]==='stone'||levelarray[i_alt+1][this.j]==='coinbox'||levelarray[i_alt+1][this.j]==='multiple_coinbox'||levelarray[i_alt+1][this.j]==='starbox'||levelarray[i_alt+1][this.j]==='pipe_left'||levelarray[i_alt+1][this.j]==='pipe_top_left'||levelarray[i_alt+1][this.j]==='pipe_left_grass'||levelarray[i_alt+1][this.j]==='pipe_left_soil'||levelarray[i_alt+1][this.j]==='mushroombox'||levelarray[i_alt+1][this.j+1]===''||levelarray[i_alt+1][this.j+1]==='soil'||levelarray[i_alt+1][this.j+1]==='coin'||levelarray[i_alt+1][this.j+1]==='soil_left'||levelarray[i_alt+1][this.j+1]==='soil_right'||levelarray[i_alt+1][this.j+1]==='bush_left'||levelarray[i_alt+1][this.j+1]==='bush_middle_left'||levelarray[i_alt+1][this.j+1]==='bush_middle'||levelarray[i_alt+1][this.j+1]==='bush_middle_right'||levelarray[i_alt+1][this.j+1]==='bush_right'||levelarray[i_alt+1][this.j+1]==='staticplant'||levelarray[i_alt+1][this.j+1]==='pipeplant'||levelarray[i_alt+1][this.j+1]==='spikedturtle'||levelarray[i_alt+1][this.j+1]==='ballmonster'||levelarray[i_alt+1][this.j+1]==='greenturtle')
			if( this.x + Delta_x > i_alt * 32 )
			{
				Delta_x = i_alt * 32 - this.x;
				this.direction = 'left';
			}
	}
	else if( i_alt > 0 )			//der Fall = 0 entspricht dem linken Levelrand
	{
		if(levelarray[i_alt-1][this.j]==='grass_right'||levelarray[i_alt-1][this.j]==='grass_top_right'||levelarray[i_alt-1][this.j]==='brown_block'||levelarray[i_alt-1][this.j]==='stone'||levelarray[i_alt-1][this.j]==='coinbox'||levelarray[i_alt-1][this.j]==='multiple_coinbox'||levelarray[i_alt-1][this.j]==='starbox'||levelarray[i_alt-1][this.j]==='pipe_right'||levelarray[i_alt-1][this.j]==='pipe_top_right'||levelarray[i_alt-1][this.j]==='pipe_right_grass'||levelarray[i_alt-1][this.j]==='pipe_right_soil'||levelarray[i_alt-1][this.j]==='mushroombox'||levelarray[i_alt-1][this.j+1]===''||levelarray[i_alt-1][this.j+1]==='soil'||levelarray[i_alt-1][this.j+1]==='coin'||levelarray[i_alt-1][this.j+1]==='soil_left'||levelarray[i_alt-1][this.j+1]==='soil_right'||levelarray[i_alt-1][this.j+1]==='bush_left'||levelarray[i_alt-1][this.j+1]==='bush_middle_left'||levelarray[i_alt-1][this.j+1]==='bush_middle'||levelarray[i_alt-1][this.j+1]==='bush_middle_right'||levelarray[i_alt-1][this.j+1]==='bush_right'||levelarray[i_alt-1][this.j+1]==='staticplant'||levelarray[i_alt-1][this.j+1]==='pipeplant'||levelarray[i_alt-1][this.j+1]==='spikedturtle'||levelarray[i_alt-1][this.j+1]==='ballmonster'||levelarray[i_alt-1][this.j+1]==='greenturtle')
			if( this.x + Delta_x < i_alt * 32 )
			{
				Delta_x = i_alt * 32 - this.x;
				this.direction = 'right';
			}
	}
	
	this.x += Delta_x;						//neue x-Position im Level
	
	//Sprites wählen:
	this.walk();
	
	//Erwischt die Schildkröte den Mario?
	switch(this.state)
	{
		case 'small':		//Schildkröte ohne Panzer
			if( this.x + 2 > mario.x  && this.x < mario.x + 50 && this.y + 32 > mario.y && this.y < mario.y + 40 )	//Wechselwirkungsbereich
				if( mario.deadly )
					this.die2();
				else if( !mario.onground && mario.velocity_y < 0 )	//Mario springt auf den Gegner
					this.hurt();
				else
					mario.hurt();
			break;
			
		case 'big':			//Schildkröte mit Panzer
			if( this.x + 2 > mario.x  && this.x < mario.x + 50 && this.y + 54 > mario.y && this.y < mario.y + 40 )	//Wechselwirkungsbereich
				if( mario.deadly )
					this.die2();
				else if( !mario.onground && mario.velocity_y < 0 )	//Mario springt auf den Gegner
					this.hurt();
				else
					mario.hurt();
			break;
	}
	
	//Falls Mario lebendig und noch nicht fertig ist, kommt der nächste Move:
	if( !mario.dead && !mario.finished )
	{
		var This = this;
		setTimeout( function() { This.move(); } , 20 );
	}
};

greenturtle.prototype.walk = function()				//laufen mit Spritely
{
	if( this.state === 'small' )
	{
		if( this.direction === 'right' )
		{
			if( this.sprite_big_left || this.sprite_big_right || this.sprite_small_left )		//falls falsches Sprite läuft
			{
				this.body.destroy();	//beende Sprite
				this.sprite_big_left = this.sprite_big_right = this.sprite_small_left = false;
			}
			if( !this.sprite_small_right )	//starte Sprite, falls noch nicht geschehen
			{
				this.body.css( { 'background-position' : '0px -437px' } );		//Bild eines nach rechts schauenden Wurms
				this.body.sprite( { fps: 6 , no_of_frames: 2 , rewind: true } );//damit der Wurm läuft
				this.sprite_small_right = true;
			}
		}
		else
		{
			if( this.sprite_big_left || this.sprite_big_right || this.sprite_small_right )		//falls falsches Sprite läuft
			{
				this.body.destroy();	//beende Sprite
				this.sprite_big_left = this.sprite_big_right = this.sprite_small_right = false;
			}
			if( !this.sprite_small_left )		//starte Sprite, falls noch nicht geschehen
			{
				this.body.css( { 'background-position' : '-34px -382px' } );	//Bild eines nach links schauenden Wurms
				this.body.sprite( { fps: 6 , no_of_frames: 2 } );				//damit der Wurm läuft
				this.sprite_small_left = true;
			}
		}
	}
	else
	{	
		if( this.direction === 'right' )
		{
			if( this.sprite_small_left || this.sprite_small_right || this.sprite_big_left )		//falls falsches Sprite läuft
			{
				this.body.destroy();	//beende Sprite
				this.sprite_small_left = this.sprite_small_right = this.sprite_big_left = false;
			}
			if( !this.sprite_big_right )	//starte Sprite, falls noch nicht geschehen
			{
				this.body.css( { 'background-position' : '0px -325px' } );		//Bild einer nach rechts schauenden Schildkröte
				this.body.sprite( { fps: 6 , no_of_frames: 2 , rewind: true } );//damit die Kröte läuft
				this.sprite_big_right = true;
			}
		}
		else
		{
			if( this.sprite_small_left || this.sprite_small_right || this.sprite_big_right )		//falls falsches Sprite läuft
			{
				this.body.destroy();	//beende Sprite
				this.sprite_small_left = this.sprite_small_right = this.sprite_big_right = false;
			}
			if( !this.sprite_big_left )		//starte Sprite, falls noch nicht geschehen
			{
				this.body.css( { 'background-position' : '-34px -266px' } );	//Bild einer nach links schauenden Schildkröte
				this.body.sprite( { fps: 6 , no_of_frames: 2 } );				//damit die Kröte läuft
				this.sprite_big_left = true;
			}
		}			
	}
};

greenturtle.prototype.die = function()	//Mario hat eine Box unter der Schildkröte ausgelöst
{
	switch(this.state)
	{
		case 'small':		//Schildkröte ohne Panzer stirbt
			this.die2();
			break;
		
		case 'big':			//Schildkröte mit Panzer verliert ihren Panzer
			sounds.play('enemy_die');
			this.state = 'small';
			
			var This = this;	//die Schildkröte darf ihren Panzer nicht sofort wieder anziehen!!
			setTimeout( function() { This.allowed_to_take_back = true; } , 500 );
			
			//Schildkrötenpanzer erscheint:
			this.shell_x = this.x;
			this.shell_y = this.y;
			var This = this;
			setTimeout( function() { This.shell.show(); } , 20 );
			
			//Starte Move des Panzers:
			this.slide();
			break;
	}
};

greenturtle.prototype.die2 = function()	//die Schildkröte stirbt, weil Mario gerade unbesiegbar ist
{
	if( this.dead )	return;
	sounds.play('shell');
	this.dead = true;
	
	switch(this.state)
	{
		case 'small':		//Schildkröte ohne Panzer
			if( this.direction === 'right' )
				this.body.destroy().css( { 'background-position' : '-68px -437px' } );	//Bild eines umgedrehten, nach rechts schauenden Wurms
			else
				this.body.destroy().css( { 'background-position' : '-68px -382px' } );	//Bild eines umgedrehten, nach links schauenden Wurms
			break;
		
		case 'big':			//Schildkröte mit Panzer
			this.body.destroy().css( { 'background-position' : '-68px -325px' } );		//Bild eines umgedrehten Schildkrötenpanzers
			break;
	}
	
	//Schildkröte fliegt hoch und wieder runter:
	var This = this;		//Erstellen eines this-Klons, weil in der complete-Fkt. der jQuery-animate()-Methode this auf this.body verweist!!!! 
	this.body.animate( { 'bottom' : '+=150' } , 250 , function() 
			{
				This.body.animate( { 'bottom' : '-=182' } , 250 , function() 
						{
							This.body.remove();
						} );
			} );
};

greenturtle.prototype.hurt = function()	//Mario ist auf die Schildkröte gesprungen
{	
	switch(this.state)
	{
		case 'small':		//Schildkröte ohne Panzer stirbt
			sounds.play('enemy_die');
			this.dead = true;
			
			//Mario springt nach oben:
			mario.velocity_y = 15;
			
			//Schildkröte wird zerquetscht:
			this.body.destroy().css( { 'background-position' : '-102px -437px' } );	//Bild eines platten Wurms
			var This = this;
			setTimeout( function() { This.body.remove() } , 600 );

			break;
		
		case 'big':			//Schildkröte mit Panzer verliert ihren Panzer
			sounds.play('enemy_die');
			this.state = 'small';
			
			var This = this;	//die Schildkröte darf ihren Panzer nicht sofort wieder anziehen!!
			setTimeout( function() { This.allowed_to_take_back = true; } , 500 );
			
			//Mario springt nach oben:
			mario.velocity_y = 15;
			
			//Schildkrötenpanzer erscheint:
			this.shell_x = this.x;
			this.shell_y = this.y;
			var This = this;
			setTimeout( function() { This.shell.show(); } , 20 );
			
			//Starte Move des Panzers:
			this.slide();
			break;
	}
};

greenturtle.prototype.slide = function()	//was der Schildkrötenpanzer so alles treibt...
{
	if( !this.sliding )						//der Panzer liegt noch regungslos rum
	{
		//Erreicht die Schildkröte ihren Panzer?
		if( this.allowed_to_take_back && !this.dead )
			if( this.shell_x + 32 > this.x  && this.shell_x < this.x + 32 ) //Wechselwirkungsbereich
			{
				this.state = 'big';		//die Schildkröte schlüpft wieder in ihren Panzer
				
				this.allowed_to_take_back = false;
				
				this.shell.hide();		//Panzer wieder verstecken
				return;					//slide() vorerst wieder abbrechen
			}
		
		//Berührt Mario den Panzer?
		if( this.shell_x + 2 > mario.x  && this.shell_x < mario.x + 50 && this.shell_y + 32 > mario.y && this.shell_y < mario.y + 40 ) //Wechselwirkungsbereich
		{
			sounds.play('shell');
			if( mario.x + 24 < this.shell_x )	//Mario links vom Panzer
				this.shell_direction = 'right';
			else								//Mario rechts vom Panzer
				this.shell_direction = 'left';
			this.sliding = true;								//der Panzer flitzt los
			this.shell.sprite( { fps: 6 , no_of_frames: 4 } );	//und dreht sich
			
			var This = this;
			setTimeout( function() { This.deadly = true; } , 200 );		//der Panzer soll nach 200ms gefährlich für Mario sein...
		}
	}
	else									//der Panzer flitzt durch die Gegend
	{
		//Berechnung der neuen Panzerkoordinaten mit Kollisionskontrolle: 
		var Delta_x = 0, Delta_y = 0;		//Translationen
		var i_alt, j_alt, i_neu, j_neu;		//für die Kollisionsabfrage mit dem levelarray
		
		//Horizontale Translation:
		if( this.shell_direction==='right' )
			Delta_x = 10;					//entspricht Geschwindigkeit, mit der der Panzer flitzt
		else
			Delta_x = -10;
		
		//Vertikale Translation:
		if( !this.onground )	
		{
			Delta_y = this.velocity_y;		//entspricht vertikaler Geschwindigkeit
			this.velocity_y -= 2;			//Reduzierung der Fallgeschwindigkeit aufgrund der Fallbeschleunigung
		}
		
		//Linker Levelrand:
		if( this.shell_x + Delta_x < 0 )
		{
			Delta_x = -this.shell_x;		//der Panzer läuft gegen eine unsichtbare Wand
			this.shell_direction = 'right';
		}
		//Rechter Levelrand:
		else if( this.shell_x + Delta_x > levelwidth - 32 )
		{
			Delta_x = levelwidth - 32 - this.shell_x;	//der Panzer läuft gegen eine unsichtbare Wand
			this.shell_direction = 'left';
		}
		
		//Undurchdringliche Objekte rechts und links:
		i_alt = Math.floor( ( this.shell_x + 16 ) / 32 );  		//vor move(): Panzer stand in i-ter Levelspalte im levelarray
		j_alt = 14 - Math.floor( this.shell_y / 32 );  			//vor move(): Panzer auf Höhe des j-ten Elements des levelarrays
		
		if( this.shell_direction==='right' && i_alt <  levelwidth / 32 - 1 )
		{
			if(levelarray[i_alt+1][j_alt]==='grass_left'||levelarray[i_alt+1][j_alt]==='grass_top_left'||levelarray[i_alt+1][j_alt]==='brown_block'||levelarray[i_alt+1][j_alt]==='stone'||levelarray[i_alt+1][j_alt]==='coinbox'||levelarray[i_alt+1][j_alt]==='multiple_coinbox'||levelarray[i_alt+1][j_alt]==='starbox'||levelarray[i_alt+1][j_alt]==='pipe_left'||levelarray[i_alt+1][j_alt]==='pipe_top_left'||levelarray[i_alt+1][j_alt]==='pipe_left_grass'||levelarray[i_alt+1][j_alt]==='pipe_left_soil'||levelarray[i_alt+1][j_alt]==='mushroombox')
				if( this.shell_x + Delta_x > i_alt * 32 )
				{
					Delta_x = i_alt * 32 - this.shell_x;
					this.shell_direction = 'left';
				}
		}
		else if( i_alt > 0 )			//der Fall = 0 entspricht dem linken Levelrand
		{
			if(levelarray[i_alt-1][j_alt]==='grass_right'||levelarray[i_alt-1][j_alt]==='grass_top_right'||levelarray[i_alt-1][j_alt]==='brown_block'||levelarray[i_alt-1][j_alt]==='stone'||levelarray[i_alt-1][j_alt]==='coinbox'||levelarray[i_alt-1][j_alt]==='multiple_coinbox'||levelarray[i_alt-1][j_alt]==='starbox'||levelarray[i_alt-1][j_alt]==='pipe_right'||levelarray[i_alt-1][j_alt]==='pipe_top_right'||levelarray[i_alt-1][j_alt]==='pipe_right_grass'||levelarray[i_alt-1][j_alt]==='pipe_right_soil'||levelarray[i_alt-1][j_alt]==='mushroombox')
				if( this.shell_x + Delta_x < i_alt * 32 )
				{
					Delta_x = i_alt * 32 - this.shell_x;
					this.shell_direction = 'right';
				}
		}
		
		//Freier Fall:
		if( !this.onground )
		{
			i_neu = Math.floor( ( this.shell_x + Delta_x + 16 ) / 32 );  //Ziel: Panzer will in i-ter Levelspalte im levelarray landen
			j_neu = 14 - Math.floor( ( this.shell_y + Delta_y ) / 32 );  //Ziel: Panzer will auf Höhe des j-ten Elements des levelarrays gelangen
			if( j_neu > 14 )			//Panzer würde den unteren Rand des levelarrays überschreiten, was nicht definiert ist!!!
				j_neu = 14;
			
			if( j_neu - j_alt == 1 )	//Panzer fällt in die nächste Kachel hinein
			{
				if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
				{	
					//Fall beendet:
					Delta_y = (15 - j_neu) * 32 - this.shell_y;		//restliche Fallstrecke bis zum Boden
					this.onground = true;							//hier ist der Sprung bzw. Fall beendet
				}
			}
			else if( j_neu - j_alt == 2 )	//Panzer fällt in die übernächste Kachel hinein -> die nächste muss daher auch überprüft werden!!!
			{
				if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
				{	
					//Fall endet auf nächster Kachel:
					Delta_y = (16 - j_neu) * 32 - this.shell_y;		//restliche Fallstrecke bis zum Boden
					this.onground = true;							//hier ist der Sprung bzw. Fall beendet
				}
				else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
				{	
					//Panzer fällt durch nächste Kachel durch und landet auf übernächster:
					Delta_y = (15 - j_neu) * 32 - this.shell_y;		//restliche Fallstrecke bis zum Boden
					this.onground = true;							//hier ist der Sprung bzw. Fall beendet
				}
			}
			else if( j_neu - j_alt == 3 )	//Panzer fällt in die überübernächste Kachel hinein -> untersuche auch die beiden darüberliegenden Kacheln!!!
			{
				if(levelarray[i_neu][j_neu-2]==='grass_top'||levelarray[i_neu][j_neu-2]==='grass_top_right'||levelarray[i_neu][j_neu-2]==='grass_top_left'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-2]==='stone'||levelarray[i_neu][j_neu-2]==='brown_block'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-2]==='coinbox'||levelarray[i_neu][j_neu-2]==='multiple_coinbox'||levelarray[i_neu][j_neu-2]==='starbox'||levelarray[i_neu][j_neu-2]==='pipe_top_right'||levelarray[i_neu][j_neu-2]==='pipe_top_left'||levelarray[i_neu][j_neu-2]==='mushroombox')
				{	
					//Fall endet auf nächster Kachel:
					Delta_y = (17 - j_neu) * 32 - this.shell_y;		//restliche Fallstrecke bis zum Boden
					this.onground = true;							//hier ist der Sprung bzw. Fall beendet
				}
				else if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
				{	
					//Fall endet auf übernächster Kachel:
					Delta_y = (16 - j_neu) * 32 - this.shell_y;		//restliche Fallstrecke bis zum Boden
					this.onground = true;							//hier ist der Sprung bzw. Fall beendet
				}
				else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
				{	
					//Panzer fällt durch die beiden nächsten Kacheln durch und landet auf überübernächster:
					Delta_y = (15 - j_neu) * 32 - this.shell_y;		//restliche Fallstrecke bis zum Boden
					this.onground = true;							//hier ist der Sprung bzw. Fall beendet
				}
			}
		}
		
		//Hat der Panzer nach dem letzten Move noch festen Boden unter den Füßen?				//TODO: hier müssen unbedingt auch noch die Gegner rein!!!!!!
		else if(this.onground)
		{
			i_neu = Math.floor( ( this.shell_x + Delta_x + 16 ) / 32 ); //Panzer steht in i-ter Levelspalte im levelarray
			j_neu = 14 - Math.floor( ( this.shell_y + Delta_y ) / 32 ); //Panzer auf Höhe des j-ten Elements des levelarrays
			
			if( j_neu < 14 )	//anderer Fall undefiniert
				if(levelarray[i_neu][j_neu+1]===''||levelarray[i_neu][j_neu+1]==='soil'||levelarray[i_neu][j_neu+1]==='coin'||levelarray[i_neu][j_neu+1]==='soil_left'||levelarray[i_neu][j_neu+1]==='soil_right'||levelarray[i_neu][j_neu+1]==='bush_left'||levelarray[i_neu][j_neu+1]==='bush_middle_left'||levelarray[i_neu][j_neu+1]==='bush_middle'||levelarray[i_neu][j_neu+1]==='bush_middle_right'||levelarray[i_neu][j_neu+1]==='bush_right'||levelarray[i_neu][j_neu+1]==='staticplant'||levelarray[i_neu][j_neu+1]==='pipeplant'||levelarray[i_neu][j_neu+1]==='spikedturtle'||levelarray[i_neu][j_neu+1]==='ballmonster'||levelarray[i_neu][j_neu+1]==='greenturtle')
				{
					this.onground = false;		//Panzer fällt
					this.velocity_y = 0;
				}
		}
		
		this.shell_x += Delta_x;		//neue x-Position im Level
		this.shell_y += Delta_y;		//neue y-Position im Level
		
		
		//Erwischt der Panzer den Mario?
		if( this.deadly )
			if( this.shell_x + 2 > mario.x  && this.shell_x < mario.x + 50 && this.shell_y + 32 > mario.y && this.shell_y < mario.y + 40 )	//Wechselwirkungsbereich
				mario.hurt();
		
		//Erwischt der Panzer irgendwelche anderen Gegner?
		for( var k = enemies.length ; k-- ; )
			if( this.shell_x + 32 > enemies[k].x  && this.shell_x < enemies[k].x + 32 && this.shell_y + 32 > enemies[k].y && this.shell_y < enemies[k].y + 35 )	//Wechselwirkungsbereich
				if( !enemies[k].dead )	//TODO: stimmt das?????
					enemies[k].die();
				
		//Erwischt der Panzer irgendwelche Pflanzen?
		for( var k = plants.length ; k-- ; )
			if( plants[k].frame )	//Röhrenpflanzen
			{
				if( this.shell_x + 32 > plants[k].x  && this.shell_x < plants[k].x + 32 && this.shell_y + 32 > plants[k].y + plants[k].Delta_y && this.shell_y < plants[k].y + plants[k].Delta_y + 42 )	//Wechselwirkungsbereich
					plants[k].die();
			}
			else					//statische Pflanzen
			{
				if( this.shell_x + 32 > plants[k].x  && this.shell_x < plants[k].x + 32 && this.shell_y + 32 > plants[k].y && this.shell_y < plants[k].y + 42 )	//Wechselwirkungsbereich
					plants[k].die();
			}
	}
	
	//der nächste Move:
	if( this.shell_y > -32 && !mario.dead && !mario.finished )	//falls der Panzer noch nicht im Boden verschwunden ist
	{
		var This = this;					//Erstellen eines this-Klons für das folgende setTimeout!!!
		setTimeout( function() { This.slide(); } , 20 );
	}
};