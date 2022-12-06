function mushroombox(i,j)				//Konstruktor einer Pilzbox
{
	this.i = i;							//damit ist die Box eindeutig identifizierbar
	this.j = j;
	this.x = 32*i;						//world-Koordinaten -> für Animation in GameLoop()
	this.y = (14-j)*32;
	
	this.mushroom_x = this.x;			//world-Koordinaten des Pilzes
	this.mushroom_y = this.y;
	this.direction = 'right';			//der Pilz wandert anfangs nach rechts
	this.onground = true;				//am Anfang sitzt der Pilz auf der Box
	this.velocity_y = 0;				//Startgeschwindigkeit des Pilzes
	
	this.activated = false;				//hat Mario die Box schon ausgelöst?
	
	$('#world').append('<div id=\'mushroombox' + i.toString() + '_' + j.toString() + '\'></div>');	//erzeuge div für die Box und setze sie in die Spielwelt ein
	this.body = $('#mushroombox'+i.toString()+'_'+j.toString());									//hiermit lässt sich das Pilzbox-div ansprechen
	this.body.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '32px' , 
		 		 	 'height' : '32px' , 
		 			 'background-image' : 'url(\'mario-objects.png\')' , 
					 'background-position' : '-96px -33px' , 	//Bild der ?-Box bevor Mario die Box aktiviert
					 'position' : 'absolute' ,					//Positionierung der Box erfolgt relativ zum übergeordneten world-Div
					 'left' : (32*i).toString() + 'px' ,
					 'bottom' : ((14-j)*32).toString() + 'px' ,
					 'z-index' : '12'  } );						//Boxen sind hinter Mario
	this.body.sprite( { fps: 8 , no_of_frames: 4 } );			//damit sich die ?-Box dreht
	
	$('#world').append('<div id=\'mushroom' + i.toString() + '_' + j.toString() + '\'></div>');	//erzeuge div für den Pilz hinter der Pilzbox und setze ihn in die Spielwelt ein
	this.mushroom = $('#mushroom'+i.toString()+'_'+j.toString());								//hiermit lässt sich das Pilz-div ansprechen
	this.mushroom.css( { 'margin' : '0' ,
						 'padding' : '0' ,
						 'width' : '32px' , 
						 'height' : '32px' , 
						 'background-image' : 'url(\'mario-objects.png\')' , 
						 'background-position' : '-582px -60px' ,	//Bild des Pilzes hinter der Box
						 'position' : 'absolute' ,					//Positionierung des Pilzes erfolgt relativ zum übergeordneten world-Div
						 'left' : (32*i).toString() + 'px' ,
						 'bottom' : ((14-j)*32).toString() + 'px' ,
						 'z-index' : '11'  } );						//Pilz ist hinter der Box
};

mushroombox.prototype.move = function()		//die Bewegung des Pilzes
{	
	//Berechnung der neuen Pilzkoordinaten mit Kollisionskontrolle: 
	var Delta_x = 0, Delta_y = 0;			//Translationen
	var i_alt, j_alt, i_neu, j_neu;			//für die Kollisionsabfrage mit dem levelarray
	
	//Horizontale Translation:
	if( this.direction==='right' )
		Delta_x = 3;				//entspricht Geschwindigkeit, mit der der Pilz wandert
	else
		Delta_x = -3;
	
	//Vertikale Translation:
	if( !this.onground )	
	{
		Delta_y = this.velocity_y;	//entspricht vertikaler Geschwindigkeit
		this.velocity_y -= 2;		//Reduzierung der Fallgeschwindigkeit aufgrund der Fallbeschleunigung
	}
	
	//Linker Levelrand:
	if( this.mushroom_x + Delta_x < 0 )
	{
		Delta_x = -this.mushroom_x;		//der Pilz läuft gegen eine unsichtbare Wand
		this.direction = 'right';
	}
	//Rechter Levelrand:
	else if( this.mushroom_x + Delta_x > levelwidth - 32 )
	{
		Delta_x = levelwidth - 32 - this.mushroom_x;	//der Pilz läuft gegen eine unsichtbare Wand
		this.direction = 'left';
	}
	
	//Undurchdringliche Objekte rechts und links:
	i_alt = Math.floor( ( this.mushroom_x + 16 ) / 32 );  		//vor move(): Pilz stand in i-ter Levelspalte im levelarray
	j_alt = 14 - Math.floor( this.mushroom_y / 32 );  			//vor move(): Pilz auf Höhe des j-ten Elements des levelarrays
	
	if( this.direction==='right' && i_alt <  levelwidth / 32 - 1 )
	{
		if(levelarray[i_alt+1][j_alt]==='grass_left'||levelarray[i_alt+1][j_alt]==='grass_top_left'||levelarray[i_alt+1][j_alt]==='brown_block'||levelarray[i_alt+1][j_alt]==='stone'||levelarray[i_alt+1][j_alt]==='coinbox'||levelarray[i_alt+1][j_alt]==='multiple_coinbox'||levelarray[i_alt+1][j_alt]==='starbox'||levelarray[i_alt+1][j_alt]==='pipe_left'||levelarray[i_alt+1][j_alt]==='pipe_top_left'||levelarray[i_alt+1][j_alt]==='pipe_left_grass'||levelarray[i_alt+1][j_alt]==='pipe_left_soil'||levelarray[i_alt+1][j_alt]==='mushroombox')
			if( this.mushroom_x + Delta_x > i_alt * 32 )
			{
				Delta_x = i_alt * 32 - this.mushroom_x;
				this.direction = 'left';
			}
	}
	else if( i_alt > 0 )			//der Fall = 0 entspricht dem linken Levelrand
	{
		if(levelarray[i_alt-1][j_alt]==='grass_right'||levelarray[i_alt-1][j_alt]==='grass_top_right'||levelarray[i_alt-1][j_alt]==='brown_block'||levelarray[i_alt-1][j_alt]==='stone'||levelarray[i_alt-1][j_alt]==='coinbox'||levelarray[i_alt-1][j_alt]==='multiple_coinbox'||levelarray[i_alt-1][j_alt]==='starbox'||levelarray[i_alt-1][j_alt]==='pipe_right'||levelarray[i_alt-1][j_alt]==='pipe_top_right'||levelarray[i_alt-1][j_alt]==='pipe_right_grass'||levelarray[i_alt-1][j_alt]==='pipe_right_soil'||levelarray[i_alt-1][j_alt]==='mushroombox')
			if( this.mushroom_x + Delta_x < i_alt * 32 )
			{
				Delta_x = i_alt * 32 - this.mushroom_x;
				this.direction = 'right';
			}
	}
	
	//Freier Fall:
	if( !this.onground )
	{
		i_neu = Math.floor( ( this.mushroom_x + Delta_x + 16 ) / 32 );  //Ziel: Pilz will in i-ter Levelspalte im levelarray landen
		j_neu = 14 - Math.floor( ( this.mushroom_y + Delta_y ) / 32 );  //Ziel: Pilz will auf Höhe des j-ten Elements des levelarrays gelangen
		if( j_neu > 14 )			//Pilz würde den unteren Rand des levelarrays überschreiten, was nicht definiert ist!!!
			j_neu = 14;
		
		if( j_neu - j_alt == 1 )	//Pilz fällt in die nächste Kachel hinein
		{
			if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
			{	
				//Fall beendet:
				Delta_y = (15 - j_neu) * 32 - this.mushroom_y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;							//hier ist der Sprung bzw. Fall beendet
			}
		}
		else if( j_neu - j_alt == 2 )	//Pilz fällt in die übernächste Kachel hinein -> die nächste muss daher auch überprüft werden!!!
		{
			if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
			{	
				//Fall endet auf nächster Kachel:
				Delta_y = (16 - j_neu) * 32 - this.mushroom_y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;							//hier ist der Sprung bzw. Fall beendet
			}
			else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
			{	
				//Pilz fällt durch nächste Kachel durch und landet auf übernächster:
				Delta_y = (15 - j_neu) * 32 - this.mushroom_y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;							//hier ist der Sprung bzw. Fall beendet
			}
		}
		else if( j_neu - j_alt == 3 )	//Pilz fällt in die überübernächste Kachel hinein -> untersuche auch die beiden darüberliegenden Kacheln!!!
		{
			if(levelarray[i_neu][j_neu-2]==='grass_top'||levelarray[i_neu][j_neu-2]==='grass_top_right'||levelarray[i_neu][j_neu-2]==='grass_top_left'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-2]==='stone'||levelarray[i_neu][j_neu-2]==='brown_block'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-2]==='coinbox'||levelarray[i_neu][j_neu-2]==='multiple_coinbox'||levelarray[i_neu][j_neu-2]==='starbox'||levelarray[i_neu][j_neu-2]==='pipe_top_right'||levelarray[i_neu][j_neu-2]==='pipe_top_left'||levelarray[i_neu][j_neu-2]==='mushroombox')
			{	
				//Fall endet auf nächster Kachel:
				Delta_y = (17 - j_neu) * 32 - this.mushroom_y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;							//hier ist der Sprung bzw. Fall beendet
			}
			else if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
			{	
				//Fall endet auf übernächster Kachel:
				Delta_y = (16 - j_neu) * 32 - this.mushroom_y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;							//hier ist der Sprung bzw. Fall beendet
			}
			else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
			{	
				//Pilz fällt durch die beiden nächsten Kacheln durch und landet auf überübernächster:
				Delta_y = (15 - j_neu) * 32 - this.mushroom_y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;							//hier ist der Sprung bzw. Fall beendet
			}
		}
	}
	
	//Hat der Pilz nach dem letzten Move noch festen Boden unter den Füßen?				//TODO: hier müssen unbedingt auch noch die Gegner rein!!!!!!
	else if(this.onground)
	{
		i_neu = Math.floor( ( this.mushroom_x + Delta_x + 16 ) / 32 ); //Pilz steht in i-ter Levelspalte im levelarray
		j_neu = 14 - Math.floor( ( this.mushroom_y + Delta_y ) / 32 ); //Pilz auf Höhe des j-ten Elements des levelarrays
		
		if( j_neu < 14 )	//anderer Fall undefiniert
			if(levelarray[i_neu][j_neu+1]===''||levelarray[i_neu][j_neu+1]==='soil'||levelarray[i_neu][j_neu+1]==='coin'||levelarray[i_neu][j_neu+1]==='soil_left'||levelarray[i_neu][j_neu+1]==='soil_right'||levelarray[i_neu][j_neu+1]==='bush_left'||levelarray[i_neu][j_neu+1]==='bush_middle_left'||levelarray[i_neu][j_neu+1]==='bush_middle'||levelarray[i_neu][j_neu+1]==='bush_middle_right'||levelarray[i_neu][j_neu+1]==='bush_right'||levelarray[i_neu][j_neu+1]==='staticplant'||levelarray[i_neu][j_neu+1]==='pipeplant'||levelarray[i_neu][j_neu+1]==='spikedturtle'||levelarray[i_neu][j_neu+1]==='ballmonster'||levelarray[i_neu][j_neu+1]==='greenturtle')
			{
				this.onground = false;		//Pilz fällt
				this.velocity_y = 0;
			}
	}
	
	this.mushroom_x += Delta_x;		//neue x-Position im Level
	this.mushroom_y += Delta_y;		//neue y-Position im Level
	
	//Erreicht Mario den Pilz?
	if( this.mushroom_x + 2 > mario.x  && this.mushroom_x < mario.x + 50 && this.mushroom_y + 32 > mario.y && this.mushroom_y < mario.y + 40 )
	{
		this.mushroom.remove();				//der Pilz wird aufgegessen
		mario.grow();						//Mario wächst
	}
	
	//der nächste Move:
	else if( this.mushroom_y > -32 && !mario.dead && !mario.finished )	//falls der Pilz noch nicht im Boden verschwunden ist
	{
		var This = this;					//Erstellen eines this-Klons für das folgende setTimeout!!!
		setTimeout( function() { This.move(); } , 20 );
	}
};

mushroombox.prototype.move2 = function()	//die Bewegung der Blume
{	
	//Erreicht Mario die Blume?
	if( this.mushroom_x + 2 > mario.x  && this.mushroom_x < mario.x + 50 && this.mushroom_y + 32 > mario.y && this.mushroom_y < mario.y + 40 )
	{
		sounds.play('grow');
		this.mushroom.remove();				//Mario pflückt die Blume
		mario.grow();						//Mario wächst (nur für den Fall, dass er klein sein sollte)
		mario.shooter = true;				//Mario kann schießen
	}
	
	//der nächste Move:
	else if( !mario.dead && !mario.finished )
	{
		var This = this;					//Erstellen eines this-Klons für das folgende setTimeout!!!
		setTimeout( function() { This.move2(); } , 20 );
	}
};