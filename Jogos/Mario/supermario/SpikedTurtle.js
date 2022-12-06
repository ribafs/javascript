function spikedturtle(i,j)				//Konstruktor einer Stachelschildkröte
{
	this.i = i;							//damit ist die Schildkröte eindeutig identifizierbar
	this.j = j;
	this.x = 32*i - 1;					//world-Koordinaten -> für Animation in GameLoop()
	this.y = (14-j)*32;
	
	this.direction = 'left';			//der Gegner läuft Mario anfangs entgegen
	this.sprite_right = false;			//für die Sprite-Animationen: damit ich weiß, ob ich einen bestimmten Sprite ein- bzw. 
	this.sprite_left = true;			//ausschalten muss.
	
	this.dead = false; 
	
	$('#world').append('<div id=\'spikedturtle' + i.toString() + '_' + j.toString() + '\'></div>');	//erzeuge div für die Schildkröte und setze sie in die Spielwelt ein
	this.body = $('#spikedturtle'+i.toString()+'_'+j.toString());									//hiermit lässt sich das Schildkröten-div ansprechen
	
	this.body.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '34px' , 
		 		 	 'height' : '32px' , 
		 			 'background-image' : 'url(\'mario-enemies.png\')' , 
					 'background-position' : '0px -106px' ,	 	//Bild einer nach links schauenden Stachelschildkröte
					 'position' : 'absolute' ,					//Positionierung des Gegners erfolgt relativ zum übergeordneten world-Div
					 'left' : (32*i-1).toString() + 'px' ,
					 'bottom' : ((14-j)*32).toString() + 'px' ,
					 'z-index' : '99'  } );						//Gegner sind hinter Mario
	
	this.body.sprite( { fps: 4 , no_of_frames: 2 } );			//damit die Schildkröte läuft
};

spikedturtle.prototype.move = function()	//die Schildkröte bewegt sich
{	
	if( this.dead )	return;		//beende move() nach Tod
	
	//Berechnung der neuen Koordinaten mit Kollisionskontrolle: 
	var Delta_x = 0;						//Translation
	var i_alt;								//für die Kollisionsabfrage mit dem levelarray
	
	//Horizontale Translation:
	if( this.direction==='right' )
		Delta_x = 1.5;						//entspricht Geschwindigkeit, mit der die Schildkröte läuft
	else
		Delta_x = -1.5;
	
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
	if( this.sprite_left && this.direction === 'right' )
	{
		this.body.destroy().css( { 'background-position' : '-34px -147px' } );	//Bild einer nach rechts schauenden Stachelschildkröte
		this.body.sprite( { fps: 4 , no_of_frames: 2 } );						//damit die Schildkröte läuft
		this.sprite_left = false;
		this.sprite_right = true;
	}
	else if( this.sprite_right && this.direction === 'left' )
	{
		this.body.destroy().css( { 'background-position' : '0px -106px' } );	//Bild einer nach links schauenden Stachelschildkröte
		this.body.sprite( { fps: 4 , no_of_frames: 2 , rewind: true } );		//damit die Schildkröte läuft
		this.sprite_right = false;
		this.sprite_left = true;
	}
	
	
	//Erwischt die Schildkröte Mario?
	if( this.x + 2 > mario.x  && this.x < mario.x + 50 && this.y + 32 > mario.y && this.y < mario.y + 40 )	//Wechselwirkungsbereich
		if( mario.deadly )
			this.die();
		else
			mario.hurt();
	
	//Falls Mario lebendig und noch nicht fertig ist, kommt der nächste Move:
	if( !mario.dead && !mario.finished )
	{
		var This = this;
		setTimeout( function() { This.move(); } , 20 );
	}
};

spikedturtle.prototype.die = function()	//die Stachelschildkröte stirbt, weil Mario gerade unbesiegbar ist
{
	if( this.dead )	return;
	sounds.play('shell');
	this.dead = true;
	
	//Schildkröte fliegt hoch und wieder runter:
	if( this.direction === 'right' )
	{	
		this.body.destroy().css( { 'background-position' : '-68px -147px' } );	//Bild einer umgedrehten, nach rechts schauenden Kröte
		
		var This = this;		//Erstellen eines this-Klons, weil in der complete-Fkt. der jQuery-animate()-Methode this auf this.body verweist!!!! 
		this.body.animate( { 'bottom' : '+=150' } , 250 , function() 
				{
					This.body.animate( { 'bottom' : '-=182' } , 250 , function() 
							{
								This.body.remove();
							} );
				} );
	}
	else
	{
		this.body.destroy().css( { 'background-position' : '-68px -106px' } );	//Bild einer umgedrehten, nach links schauenden Kröte
		
		var This = this;		//Erstellen eines this-Klons, weil in der complete-Fkt. der jQuery-animate()-Methode this auf this.body verweist!!!! 
		this.body.animate( { 'bottom' : '+=150' } , 250 , function() 
				{
					This.body.animate( { 'bottom' : '-=182' } , 250 , function() 
							{
								This.body.remove();
							} );
				} );
	}
};