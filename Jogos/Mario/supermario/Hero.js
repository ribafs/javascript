function Hero(name,spritesheeturl)		//Konstruktor der Spielfigur
{
	this.name = name;			//wie heißt die Figur?? -> wird als id für das div benutzt
	this.x = 0;					//world-Koordinaten -> für Kollistionsabfrage etc.
	this.y = 0;
	this.velocity_y = 0;		//Fallgeschwindigkeit
	
	this.dead = false;			//lebendig oder tot?
	this.invulnerable = false;	//unverwundbar?
	this.deadly = false;		//ist Mario für die Gegner tödlich, d.h. hat Mario einen Stern gefangen?
	
	this.level = 1;				//in welchem Level befindet sich Mario?
	this.lives = 3;				//am Anfang hat man 3 Leben
	this.coins = 0;				//und keine Münzen
	this.state = 'small';		//großer oder kleiner Mario?
	this.shooter = false;		//kann Mario schießen?
	this.finished = false;		//fürs Levelende
	this.fast = false;			//Laufgeschwindigkeit
	
	this.direction = 'right';	//am Anfang schaut Mario nach rechts
	this.moving = false;		//allgemeine Bewegung (gehen, springen, fallen, etc.)
	this.walking = false;		//rein horizontale Bewegung (sowohl am Boden, als auch in der Luft!!!)
	this.crouching = false;		//wichtig: ducken blockiert links-/rechtsbewegung und gibt marios sprite vor (auch in der luft)!!!
	this.onground = true;		//gehen oder fallen? Bloß bei onground=false wird vertikale Bewegung ausgeführt!
	this.jumping = false;		//soll Mario bei der nächsten Landung sofort wieder abspringen?
	
	this.sprite_right = false;	//für die Sprite-Animationen: damit ich weiß, ob ich einen bestimmten Sprite ein- bzw. 
	this.sprite_left = false;	//ausschalten muss.
	
	$('#world').append('<div id=\'' + name.toString() + '\'></div>');	//erzeuge div für Spielfigur und setze sie in die Spielwelt ein
	this.body = $('#'+name.toString());									//hiermit lässt sich das Spieler-div ansprechen
	this.body.css( { 'margin' : '0' ,
		     	     'padding' : '0' ,
				     'width' : '80px' , 
				     'height' : '80px' , 
				     'background-image' : 'url(\'' + spritesheeturl.toString() + '\')' , 
				     'background-position' : '-80px 0px' , 		//nach rechts schauender, kleiner Mario
				     'position' : 'absolute' ,					//Positionierung der Spielfigur erfolgt relativ zum übergeordneten world-Div
				     'left' : '-80px' ,							//setze Mario zunächst an beliebige Stelle
				     'bottom' : '0px' ,							//exakte Position wird in LoadLevel() ermittelt
				     'z-index' : '100'  } );
	
	this.bullets = new Array();	//Mario erhält drei Feuerbälle zum Verschießen
	for( var i = 1 ; i < 4 ; i++ )
		this.bullets.push( new bullet(i) );
};

Hero.prototype.move = function()				//allgemeine Bewegung: nutzt walk() und stand() aus
{	
	//move() berechnet die Koordinaten der Spielfigur in Levelkoordinaten, nicht in absoluten Bildschirmkoordinaten
	//es werden nur die richtigen Sprites gesetzt, die Bewegungsanimation erfolgt extern in der GameLoop()-Schleife!
	
	if( this.dead || this.finished ) return;	//Tote laufen nicht!
	
	var Delta_x = 0, Delta_y = 0;				//Translationen
	var i_alt, j_alt, i_neu, j_neu;				//für die Kollisionsabfrage mit dem levelarray
	
	if(this.walking)		//berechne horizontale Translation
	{
		if( this.direction==='right' )
			Delta_x = 5;	//entspricht Geschwindigkeit, mit der Mario läuft
		else
			Delta_x = -5;
			
		if(this.fast)
			Delta_x*=2;		//sprintender Mario doppelt so schnell
	}
	
	if( !this.onground )	//berechne vertikale Translation
	{
		Delta_y = this.velocity_y;	//entspricht vertikaler Geschwindigkeit
		this.velocity_y -= 2;		//Reduzierung der Fallgeschwindigkeit aufgrund der Fallbeschleunigung
	}
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////  Berechnung der neuen Levelkoordinaten mit Kollisionskontrolle:   ////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//*********      Kann sich Mario frei nach links und rechts bewegen????   *************
	
	//Linker Levelrand:
	if( this.x + Delta_x < -20 )	
		Delta_x = -this.x - 20;		//Mario läuft gegen eine unsichtbare Wand
	//Rechter Levelrand:
	else if( this.x + Delta_x > levelwidth - 130 )
	{
		Delta_x = levelwidth - 130 - this.x;	//Mario läuft gegen eine unsichtbare Wand
		if(this.onground)
		{
			var This = this;
			setTimeout( function() { This.success(); } , 20 )		//Mario hat das Level gemeistert
			return;
		}
	}
	
	//***    Abstand zu undurchdringbaren Objekten einhalten:      ***
	
	i_alt = Math.floor( ( this.x + 40 ) / 32 );  		//vor move(): Mario stand in i-ter Levelspalte im levelarray
	j_alt = 14 - Math.floor( this.y / 32 );  			//vor move(): Marios Füße waren auf Höhe des j-ten Elements des levelarrays
	i_neu = 14 - Math.floor( ( this.y + 5 ) / 32 );		//wie j_alt: für Kopfkollisionen des kleinen Mario
	j_neu = 14 - Math.floor( ( this.y + 15 ) / 32 );  	//wie oben: für Kopfkollisionen des großen Mario  
	
	//Undurchdringliche Objekte rechts von Mario: 
	if(levelarray[i_alt+1][j_alt]==='grass_left'||levelarray[i_alt+1][j_alt]==='grass_top_left'||levelarray[i_alt+1][j_alt]==='brown_block'||levelarray[i_alt+1][j_alt]==='stone'||levelarray[i_alt+1][j_alt]==='coinbox'||levelarray[i_alt+1][j_alt]==='multiple_coinbox'||levelarray[i_alt+1][j_alt]==='starbox'||levelarray[i_alt+1][j_alt]==='pipe_left'||levelarray[i_alt+1][j_alt]==='pipe_top_left'||levelarray[i_alt+1][j_alt]==='pipe_left_grass'||levelarray[i_alt+1][j_alt]==='pipe_left_soil'||levelarray[i_alt+1][j_alt]==='mushroombox')
	{
		if( this.x + Delta_x > ( i_alt + 1 ) * 32 - 53 )
			Delta_x = ( i_alt + 1 ) * 32 - 53 - this.x;
	}
	//Undurchdringliche Objekte rechts auf Kopfhöhe des kleinen Mario:
	else if( this.state === 'small' && !this.crouching && !this.onground )	//am Boden diese Kollisionen ignorieren, damit der kleine Mario durch enge Spalte passt
	{
		if(levelarray[i_alt+1][i_neu-1]==='grass_left'||levelarray[i_alt+1][i_neu-1]==='grass_top_left'||levelarray[i_alt+1][i_neu-1]==='brown_block'||levelarray[i_alt+1][i_neu-1]==='stone'||levelarray[i_alt+1][i_neu-1]==='coinbox'||levelarray[i_alt+1][i_neu-1]==='multiple_coinbox'||levelarray[i_alt+1][i_neu-1]==='starbox'||levelarray[i_alt+1][i_neu-1]==='pipe_left'||levelarray[i_alt+1][i_neu-1]==='pipe_top_left'||levelarray[i_alt+1][i_neu-1]==='pipe_left_grass'||levelarray[i_alt+1][i_neu-1]==='pipe_left_soil'||levelarray[i_alt+1][i_neu-1]==='mushroombox')
			if( this.x + Delta_x > ( i_alt + 1 ) * 32 - 53 )
				Delta_x = ( i_alt + 1 ) * 32 - 53 - this.x;
	}
	//Undurchdringliche Objekte rechts auf Kopfhöhe des großen Mario:
	else if( this.state !== 'small' && !this.crouching )
		if(levelarray[i_alt+1][j_neu-1]==='grass_left'||levelarray[i_alt+1][j_neu-1]==='grass_top_left'||levelarray[i_alt+1][j_neu-1]==='brown_block'||levelarray[i_alt+1][j_neu-1]==='stone'||levelarray[i_alt+1][j_neu-1]==='coinbox'||levelarray[i_alt+1][j_neu-1]==='multiple_coinbox'||levelarray[i_alt+1][j_neu-1]==='starbox'||levelarray[i_alt+1][j_neu-1]==='pipe_left'||levelarray[i_alt+1][j_neu-1]==='pipe_top_left'||levelarray[i_alt+1][j_neu-1]==='pipe_left_grass'||levelarray[i_alt+1][j_neu-1]==='pipe_left_soil'||levelarray[i_alt+1][j_neu-1]==='mushroombox')
			if( this.x + Delta_x > ( i_alt + 1 ) * 32 - 53 )
				Delta_x = ( i_alt + 1 ) * 32 - 53 - this.x;
	
	
	//Undurchdringliche Objekte links von Mario:
	if( i_alt > 0 )			//der Fall = 0 entspricht dem linken Levelrand
	{
		if(levelarray[i_alt-1][j_alt]==='grass_right'||levelarray[i_alt-1][j_alt]==='grass_top_right'||levelarray[i_alt-1][j_alt]==='brown_block'||levelarray[i_alt-1][j_alt]==='stone'||levelarray[i_alt-1][j_alt]==='coinbox'||levelarray[i_alt-1][j_alt]==='multiple_coinbox'||levelarray[i_alt-1][j_alt]==='starbox'||levelarray[i_alt-1][j_alt]==='pipe_right'||levelarray[i_alt-1][j_alt]==='pipe_top_right'||levelarray[i_alt-1][j_alt]==='pipe_right_grass'||levelarray[i_alt-1][j_alt]==='pipe_right_soil'||levelarray[i_alt-1][j_alt]==='mushroombox')
		{
			if( this.x + Delta_x < i_alt * 32 - 25 )
				Delta_x = i_alt * 32 - this.x - 25;
		}
		//Undurchdringliche Objekte links auf Kopfhöhe des kleinen Mario:
		else if( this.state === 'small' && !this.crouching && !this.onground )	//am Boden diese Kollisionen ignorieren, damit der kleine Mario durch enge Spalte passt
		{
			if(levelarray[i_alt-1][i_neu-1]==='grass_right'||levelarray[i_alt-1][i_neu-1]==='grass_top_right'||levelarray[i_alt-1][i_neu-1]==='brown_block'||levelarray[i_alt-1][i_neu-1]==='stone'||levelarray[i_alt-1][i_neu-1]==='coinbox'||levelarray[i_alt-1][i_neu-1]==='multiple_coinbox'||levelarray[i_alt-1][i_neu-1]==='starbox'||levelarray[i_alt-1][i_neu-1]==='pipe_right'||levelarray[i_alt-1][i_neu-1]==='pipe_top_right'||levelarray[i_alt-1][i_neu-1]==='pipe_right_grass'||levelarray[i_alt-1][i_neu-1]==='pipe_right_soil'||levelarray[i_alt-1][i_neu-1]==='mushroombox')
				if( this.x + Delta_x < i_alt * 32 - 25 )
					Delta_x = i_alt * 32 - this.x - 25;
		}
		//Undurchdringliche Objekte links auf Kopfhöhe des großen Mario:
		else if( this.state !== 'small' && !this.crouching )
			if(levelarray[i_alt-1][j_neu-1]==='grass_right'||levelarray[i_alt-1][j_neu-1]==='grass_top_right'||levelarray[i_alt-1][j_neu-1]==='brown_block'||levelarray[i_alt-1][j_neu-1]==='stone'||levelarray[i_alt-1][j_neu-1]==='coinbox'||levelarray[i_alt-1][j_neu-1]==='multiple_coinbox'||levelarray[i_alt-1][j_neu-1]==='starbox'||levelarray[i_alt-1][j_neu-1]==='pipe_right'||levelarray[i_alt-1][j_neu-1]==='pipe_top_right'||levelarray[i_alt-1][j_neu-1]==='pipe_right_grass'||levelarray[i_alt-1][j_neu-1]==='pipe_right_soil'||levelarray[i_alt-1][j_neu-1]==='mushroombox')
				if( this.x + Delta_x < i_alt * 32 - 25 )
					Delta_x = i_alt * 32 - this.x - 25;
	}
	
	//************        Vertikale Kollisionsabfragen:        ****************
	
	//***    Kollisionsabfrage für Sprünge an die Decke:    ***
	if( !this.onground && this.velocity_y >=0 )			//Mario springt nach oben
	{
		if(this.crouching)								//der sich duckende Mario kommt weiter nach oben
		{
			i_neu = Math.floor( ( this.x + Delta_x + 40 ) / 32 );  		//Ziel: Mario will in i-ter Levelspalte im levelarray landen
			j_neu = 14 - Math.floor( ( this.y + Delta_y + 30 ) / 32 );  //Ziel: Marios Kopf will auf Höhe des j-ten Elements des levelarrays gelangen
			
			if(levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='stone')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 25;		//restliche Strecke, die der sitzende Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
			}
			else if(levelarray[i_neu][j_neu]==='coinbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 25;		//restliche Strecke, die der sitzende Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_coinbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='multiple_coinbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 25;		//restliche Strecke, die der sitzende Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_multiple_coinbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='starbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 25;		//restliche Strecke, die der sitzende Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_starbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='mushroombox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 25;		//restliche Strecke, die der sitzende Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_mushroombox(i_neu,j_neu);
			}
		}
		else if( this.state === 'small' )				//kleiner Mario
		{
			i_neu = Math.floor( ( this.x + Delta_x + 40 ) / 32 );  		//Ziel: Mario will in i-ter Levelspalte im levelarray landen
			j_neu = 14 - Math.floor( ( this.y + Delta_y + 30 ) / 32 );  //Ziel: Marios Kopf will auf Höhe des j-ten Elements des levelarrays gelangen
			
			if(levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='stone')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 50;		//restliche Strecke, die der kleine Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
			}
			else if(levelarray[i_neu][j_neu]==='coinbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 50;		//restliche Strecke, die der kleine Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_coinbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='multiple_coinbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 50;		//restliche Strecke, die der kleine Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_multiple_coinbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='starbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 50;		//restliche Strecke, die der kleine Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_starbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='mushroombox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 50;		//restliche Strecke, die der kleine Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_mushroombox(i_neu,j_neu);
			}
		}
		else											//großer Mario
		{
			i_neu = Math.floor( ( this.x + Delta_x + 40 ) / 32 );  		//Ziel: Mario will in i-ter Levelspalte im levelarray landen
			j_neu = 14 - Math.floor( ( this.y + Delta_y + 40 ) / 32 );  //Ziel: Marios Kopf will auf Höhe des j-ten Elements des levelarrays gelangen
			
			if(levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='stone')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 60;		//restliche Strecke, die der große Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
			}
			else if(levelarray[i_neu][j_neu]==='coinbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 60;		//restliche Strecke, die der große Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_coinbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='multiple_coinbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 60;		//restliche Strecke, die der große Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_multiple_coinbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='starbox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 60;		//restliche Strecke, die der große Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_starbox(i_neu,j_neu);
			}
			else if(levelarray[i_neu][j_neu]==='mushroombox')
			{	//Mario stößt sich den Kopf
				Delta_y = (14 - j_neu) * 32 - this.y - 60;		//restliche Strecke, die der große Mario steigen kann
				this.velocity_y = 0;							//Mario fällt wieder nach unten
				this.jumping = false;							//um nicht unkontrolliert weiter zu springen
				
				this.activate_mushroombox(i_neu,j_neu);
			}
		}
	}
	
	//***    Kollisionsabfrage für freien Fall nach unten:    ***
	else if( !this.onground && this.velocity_y <=0 )		 //Mario fällt nach unten
	{
		i_alt = Math.floor( ( this.x + 40 ) / 32 );  //vorher: Mario stand in i-ter Levelspalte im levelarray
		j_alt = 14 - Math.floor( this.y / 32 );  	 //vorher: Mario war auf Höhe des j-ten Elements des levelarrays
		
		i_neu = Math.floor( ( this.x + Delta_x + 40 ) / 32 );  //Ziel: Mario will in i-ter Levelspalte im levelarray landen
		j_neu = 14 - Math.floor( ( this.y + Delta_y ) / 32 );  //Ziel: Mario will auf Höhe des j-ten Elements des levelarrays gelangen
		if( j_neu > 14 )		//Mario würde den unteren Rand des levelarrays überschreiten, was nicht definiert ist!!!
			j_neu = 14;
		
		if( j_neu - j_alt == 1 )	//Mario fällt in die nächste Kachel hinein
		{
			if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
			{	
				//Fall beendet:
				Delta_y = (15 - j_neu) * 32 - this.y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;					//hier ist der Sprung bzw. Fall beendet
				this.stand();							//damit man auf den Füßen landet
			}
		}
		else if( j_neu - j_alt == 2 )	//Mario fällt in die übernächste Kachel hinein -> die nächste muss daher auch überprüft werden!!!
		{
			if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
			{	
				//Fall endet auf nächster Kachel:
				Delta_y = (16 - j_neu) * 32 - this.y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;					//hier ist der Sprung bzw. Fall beendet
				this.stand();							//damit man auf den Füßen landet
			}
			else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
			{	
				//Mario fällt durch nächste Kachel durch und landet auf übernächster:
				Delta_y = (15 - j_neu) * 32 - this.y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;					//hier ist der Sprung bzw. Fall beendet
				this.stand();							//damit man auf den Füßen landet
			}
		}
		else if( j_neu - j_alt == 3 )	//Mario fällt in die überübernächste Kachel hinein -> untersuche auch die beiden darüberliegenden Kacheln!!!
		{
			if(levelarray[i_neu][j_neu-2]==='grass_top'||levelarray[i_neu][j_neu-2]==='grass_top_right'||levelarray[i_neu][j_neu-2]==='grass_top_left'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-2]==='stone'||levelarray[i_neu][j_neu-2]==='brown_block'||levelarray[i_neu][j_neu-2]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-2]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-2]==='coinbox'||levelarray[i_neu][j_neu-2]==='multiple_coinbox'||levelarray[i_neu][j_neu-2]==='starbox'||levelarray[i_neu][j_neu-2]==='pipe_top_right'||levelarray[i_neu][j_neu-2]==='pipe_top_left'||levelarray[i_neu][j_neu-2]==='mushroombox')
			{	
				//Fall endet auf nächster Kachel:
				Delta_y = (17 - j_neu) * 32 - this.y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;					//hier ist der Sprung bzw. Fall beendet
				this.stand();							//damit man auf den Füßen landet
			}
			else if(levelarray[i_neu][j_neu-1]==='grass_top'||levelarray[i_neu][j_neu-1]==='grass_top_right'||levelarray[i_neu][j_neu-1]==='grass_top_left'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded'||levelarray[i_neu][j_neu-1]==='stone'||levelarray[i_neu][j_neu-1]==='brown_block'||levelarray[i_neu][j_neu-1]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu-1]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu-1]==='coinbox'||levelarray[i_neu][j_neu-1]==='multiple_coinbox'||levelarray[i_neu][j_neu-1]==='starbox'||levelarray[i_neu][j_neu-1]==='pipe_top_right'||levelarray[i_neu][j_neu-1]==='pipe_top_left'||levelarray[i_neu][j_neu-1]==='mushroombox')
			{	
				//Fall endet auf übernächster Kachel:
				Delta_y = (16 - j_neu) * 32 - this.y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;					//hier ist der Sprung bzw. Fall beendet
				this.stand();							//damit man auf den Füßen landet
			}
			else if(levelarray[i_neu][j_neu]==='grass_top'||levelarray[i_neu][j_neu]==='grass_top_right'||levelarray[i_neu][j_neu]==='grass_top_left'||levelarray[i_neu][j_neu]==='grass_top_right_rounded'||levelarray[i_neu][j_neu]==='grass_top_left_rounded'||levelarray[i_neu][j_neu]==='stone'||levelarray[i_neu][j_neu]==='brown_block'||levelarray[i_neu][j_neu]==='grass_top_right_rounded_soil'||levelarray[i_neu][j_neu]==='grass_top_left_rounded_soil'||levelarray[i_neu][j_neu]==='coinbox'||levelarray[i_neu][j_neu]==='multiple_coinbox'||levelarray[i_neu][j_neu]==='starbox'||levelarray[i_neu][j_neu]==='pipe_top_right'||levelarray[i_neu][j_neu]==='pipe_top_left'||levelarray[i_neu][j_neu]==='mushroombox')
			{	
				//Mario fällt durch die beiden nächsten Kacheln durch und landet auf überübernächster:
				Delta_y = (15 - j_neu) * 32 - this.y;	//restliche Fallstrecke bis zum Boden
				this.onground = true;					//hier ist der Sprung bzw. Fall beendet
				this.stand();							//damit man auf den Füßen landet
			}
		}
		
		//Absturztod:
		if( this.y + Delta_y <= 0 )		//tritt ein, falls Mario nirgendwo landen konnte (s.o.) und jetzt den unteren world-Rand erreicht
			Delta_y = -this.y;			//restliche Fallstrecke bis zum unteren Levelrand
	}
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////  Kollisionskontrolle Ende   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//Setze neue Levelkoordinaten (werden für die Animation in GameLoop() benötigt!!!):
	this.x += Delta_x;		//neue x-Position im Level
	this.y += Delta_y;		//neue y-Position im Level
	
	//Kann Mario irgendwelche Münzen einsammeln?
	i_neu = Math.floor( ( this.x + 40 ) / 32 );  		//Mitte von Mario
	j_neu = 14 - Math.floor( ( this.y + 30 ) / 32 );  	//Mitte von Mario
	if(levelarray[i_neu][j_neu]==='coin')
		this.collect_coin(i_neu,j_neu);
	i_neu = Math.floor( ( this.x + 30 ) / 32 );  		//linkes unteres Eck von Mario
	j_neu = 14 - Math.floor( ( this.y + 10 ) / 32 );  	//linkes unteres Eck von Mario
	i_alt = Math.floor( ( this.x + 50 ) / 32 );  		//rechtes oberes Eck von Mario
	j_alt = 14 - Math.floor( ( this.y + 50 ) / 32 );  	//rechtes oberes Eck von Mario
	if(levelarray[i_neu][j_neu]==='coin')
		this.collect_coin(i_neu,j_neu);
	if(levelarray[i_neu][j_alt]==='coin')
		this.collect_coin(i_neu,j_alt);
	if(levelarray[i_alt][j_neu]==='coin')
		this.collect_coin(i_alt,j_neu);
	if(levelarray[i_alt][j_alt]==='coin')
		this.collect_coin(i_alt,j_alt);
	
	//Hat Mario nach dem letzten Move noch festen Boden unter den Füßen?		//TODO: hier müssen unbedingt auch noch die Gegner rein!!!!!!
	if(this.onground)
	{
		i_neu = Math.floor( ( this.x + 40 ) / 32 );  //Mario steht in i-ter Levelspalte im levelarray
		j_neu = 14 - Math.floor( this.y / 32 );  	 //Mario ist auf Höhe des j-ten Elements des levelarrays
		
		if( j_neu < 14 )	//anderer Fall entspricht Absturztod
			if(levelarray[i_neu][j_neu+1]===''||levelarray[i_neu][j_neu+1]==='soil'||levelarray[i_neu][j_neu+1]==='coin'||levelarray[i_neu][j_neu+1]==='soil_left'||levelarray[i_neu][j_neu+1]==='soil_right'||levelarray[i_neu][j_neu+1]==='bush_left'||levelarray[i_neu][j_neu+1]==='bush_middle_left'||levelarray[i_neu][j_neu+1]==='bush_middle'||levelarray[i_neu][j_neu+1]==='bush_middle_right'||levelarray[i_neu][j_neu+1]==='bush_right'||levelarray[i_neu][j_neu+1]==='staticplant'||levelarray[i_neu][j_neu+1]==='pipeplant'||levelarray[i_neu][j_neu+1]==='spikedturtle'||levelarray[i_neu][j_neu+1]==='ballmonster'||levelarray[i_neu][j_neu+1]==='greenturtle')
			{
				this.onground = false;		//Mario fällt
				this.velocity_y = 0;
			}
	}
	
	if( this.jumping )		//soll Mario springen?
		this.jump();		//spring, wenns geht!
	
	//Wahl der richtigen Sprites (Animation der Spielfigur erfolgt extern in der GameLoop()-Fkt.):
	if( this.onground && this.walking )		//Laufen am Boden mithilfe von Spritely
		this.walk();
	else					//Falls man nicht läuft
		this.stand();		//stehen, ducken oder springen
	
	//Entscheide, ob noch ein Move notwendig ist:
	var This = this;		//Erstellen eines this-Klons für das folgende setTimeout!!!
	setTimeout( function() 
					{
						if( This.y == 0 )		//Mario ist in den Tod gestürzt
							This.die();
						else if( This.walking || !This.onground )	//weiterer Move notwendig 
							This.move();
						else
						{
							This.stand();
							This.moving = false;	//Move beendet: Mario steht (aufrecht) irgendwo auf festem Boden
						}
					} , 20 );		//move() wird alle 20ms ausgeführt
};

Hero.prototype.walk = function()					//laufen mit Spritely
{
	if( this.dead || this.finished ) return;		//Tote laufen nicht!
	
	switch(this.state)	//welcher Mario?? -> muss unterschieden werden wg. unterschiedlicher Sprites, verschiedener Kollisionsabfragen etc.
	{
		case 'small':	//kleiner Mario
			if( this.direction==='right' )
			{
				if( this.sprite_left )		//falls Links-Sprite läuft
				{
					this.body.destroy();	//beende Sprite
					this.sprite_left = false;
				}
				if( !this.sprite_right )	//starte Sprite, falls noch nicht geschehen
				{
					this.body.css({'background-position' : '0px 0px'});
					this.body.sprite( { fps: 8 , no_of_frames: 2, rewind: true } );
					this.sprite_right = true;
				}
			}
			else
			{
				if( this.sprite_right )		//falls Rechts-Sprite läuft
				{
					this.body.destroy();	//beende Sprite
					this.sprite_right = false;
				}
				if( !this.sprite_left )		//starte Sprite, falls noch nicht geschehen
				{
					this.body.css({'background-position' : '-80px -81px'});
					this.body.sprite( { fps: 8, no_of_frames: 2 } );
					this.sprite_left = true;
				}
			}
			break;
			
		case 'big':		//großer Mario
			if( this.direction==='right' )
			{
				if( this.sprite_left )		//falls Links-Sprite läuft
				{
					this.body.destroy();	//beende Sprite
					this.sprite_left = false;
				}
				if( !this.sprite_right )	//starte Sprite, falls noch nicht geschehen
				{
					this.body.css({'background-position' : '0px -243px'});
					this.body.sprite( { fps: 9 , no_of_frames: 2, rewind: true } );
					this.sprite_right = true;
				}
			}
			else
			{
				if( this.sprite_right )		//falls Rechts-Sprite läuft
				{
					this.body.destroy();	//beende Sprite
					this.sprite_right = false;
				}
				if( !this.sprite_left )		//starte Sprite, falls noch nicht geschehen
				{
					this.body.css({'background-position' : '-81px -162px'});
					this.body.sprite( { fps: 9, no_of_frames: 2 } );
					this.sprite_left = true;
				}
			}
			break;
	}
};

Hero.prototype.stand = function()				//alles außer mit Spritely laufen: ducken, stehen, springen, fallen
{
	if( this.dead || this.finished ) return;		//Tote laufen nicht!
	
	if( this.sprite_right || this.sprite_left )
	{
		this.body.destroy();	//Spritely beenden
		this.sprite_right = this.sprite_left = false;
	}
	
	switch(this.state)	//welcher Mario?? -> muss unterschieden werden wg. unterschiedlicher Sprites, verschiedener Kollisionsabfragen etc.
	{
		case 'small':	//kleiner Mario
			if(this.direction==='right')
			{	
				if(this.crouching)
					this.body.css({'background-position' : '-161px 0px'});	//nach rechts schauender, sitzender, kleiner Mario
				else if(this.onground)
					this.body.css({'background-position' : '-81px 0px'});	//nach rechts schauender, am boden stehender, kleiner Mario
				else
					this.body.css({'background-position' : '-561px -83px'});//nach rechts schauender, springender, kleiner Mario
			}
			else
			{
				if(this.crouching)
					this.body.css({'background-position' : '-241px 0px'});	//nach links schauender, sitzender, kleiner Mario
				else if(this.onground)
					this.body.css({'background-position' : '0px -81px'});	//nach links schauender, am boden stehender, kleiner Mario
				else
					this.body.css({'background-position' : '-481px -83px'});//nach links schauender, springender, kleiner Mario
			}
			break;
			
		case 'big':		//großer Mario
			if(this.direction==='right')
			{	
				if(this.crouching)
					this.body.css({'background-position' : '-241px -243px'});	//nach rechts schauender, sitzender, großer Mario
				else if(this.onground)
					this.body.css({'background-position' : '-81px -243px'});	//nach rechts schauender, am boden stehender, großer Mario
				else
					this.body.css({'background-position' : '-561px -247px'});	//nach rechts schauender, springender, großer Mario
			}
			else
			{
				if(this.crouching)
					this.body.css({'background-position' : '-241px -162px'});	//nach links schauender, sitzender, großer Mario
				else if(this.onground)
					this.body.css({'background-position' : '0px -162px'});		//nach links schauender, am boden stehender, großer Mario
				else
					this.body.css({'background-position' : '-481px -247px'});	//nach links schauender, springender, großer Mario
			}
			break;
	}
};

Hero.prototype.jump = function()			//Mario springt vom Boden ab
{	
	if( this.onground )						//Absprung nur vom Boden
	{	
		if( this.state === 'small' && !this.crouching )	
		{
			var i = Math.floor( ( this.x + 40 ) / 32 );  		//Mario steht in i-ter Levelspalte im levelarray
			var j = 14 - Math.floor( this.y / 32 );  			//Marios Füße sind auf Höhe des j-ten Elements des levelarrays
			//Falls kleiner Mario direkt unter der Decke steht (d.h. durch einen engen Spalt läuft):
			if(levelarray[i][j-1]==='brown_block'||levelarray[i][j-1]==='stone'||levelarray[i][j-1]==='coinbox'||levelarray[i][j-1]==='multiple_coinbox'||levelarray[i][j-1]==='starbox'||levelarray[i][j-1]==='mushroombox')	
				return;						//stehender Mario darf hier nicht springen
		}
		
		//Springen erlaubt:
		sounds.play('jump');
		this.velocity_y = 25;				//entspricht Geschwindigkeit, mit der Mario nach oben springt (maximal 31!!!)
		this.onground = false;				//für vertikale Bewegung in move()-Methode
		if( !this.moving )
		{
			this.moving = true;				//löse move() aus, sofern noch nicht geschehen
			this.move();
		}
	}
};

Hero.prototype.grow = function()				//Mario hat einen Pilz gefunden
{
	if( this.dead || this.finished ) return;	//zu spät ;-)
	
	if( this.state === 'small' )
	{
		sounds.play('grow');
		this.state = 'big';
		
		if( this.sprite_right || this.sprite_left )
		{
			this.body.destroy();	//Spritely mit dem kleinen Mario beenden
			this.sprite_right = this.sprite_left = false;
		}
		
		//Wahl der richtigen Sprites:
		if( this.onground && this.walking )		//Laufen am Boden mithilfe von Spritely
			this.walk();
		else					//Falls man nicht läuft
			this.stand();		//stehen, ducken oder springen
		
		//Mario 5 * blinken lassen:
		this.blink(5);			
	}
};

Hero.prototype.hurt = function()		//Mario wurde verletzt
{
	if( this.invulnerable || this.dead || this.finished )	return;		//wenn man unverwundbar oder tot ist, kann man nicht verletzt werden
	
	if( this.state === 'small' )		//kleiner Mario stirbt
		this.die();
	else								//großer Mario wird klein
	{
		sounds.play('hurt');
		this.state = 'small';
		this.shooter = false;
		
		if( this.sprite_right || this.sprite_left )
		{
			this.body.destroy();	//Spritely mit dem großen Mario beenden
			this.sprite_right = this.sprite_left = false;
		}
		
		//Wahl der richtigen Sprites:
		if( this.onground && this.walking )		//Laufen am Boden mithilfe von Spritely
			this.walk();
		else					//Falls man nicht läuft
			this.stand();		//stehen, ducken oder springen
		
		//Mario für eine Sekunde gegen weitere Angriffe immun machen:
		this.invincible(1);			
	}
};

Hero.prototype.invincible = function(duration)		//kurzzeitige Unbesiegbarkeit (für duration Sekunden)
{
	this.invulnerable = true;						//unbesiegbar
	this.blink( 5*duration );						//Mario blinkt duration Sekunden lang
	
	var n = duration;
	var This = this;
	var timer = setInterval( function() 
								{
									n--;
									if( n==0 || This.dead || This.finished )//jetzt sind die duration Sekunden vorbei oder Mario ist gestorben
									{
										This.invulnerable = false;
										clearInterval(timer);
									}
								} , 1000 );
};

Hero.prototype.blink = function(n)				//Blinkender Mario: bei Verletzungen, Unverwundbarkeit und wenn man wächst.  n = Anzahl der Blinks
{
	n*=2;
	var This = this;		//weil bei setInterval this auf das Windowobjekt verweist und nicht auf die Heroinstanz!
	var timer = setInterval( function() {
											This.body.toggle();
											n--;
											if( n==0 || This.dead || This.finished )
											{
												clearInterval(timer);
												This.body.show();
											}
										} , 100 );		//alle 100ms Mario sichtbar bzw. unsichtbar machen => einmal Blinken dauert 200ms
};

Hero.prototype.shoot = function()				//Mario verschießt einen Feuerball
{
	for( var k = this.bullets.length ; k-- ; )	//suche gerade unbenutzte Kugel
		if( !this.bullets[k].active )			//diese Kugel ist gerade frei
		{
			sounds.play('shoot');
			this.bullets[k].active = true;
			this.bullets[k].x = this.x + 31;
			this.bullets[k].y = this.y + 14;
			this.bullets[k].direction = this.direction;
			this.bullets[k].velocity_y = 0;
			var Body = this.bullets[k].body;
			setTimeout( function() { Body.show(); } , 20 );	//Kugel erscheint beim Mario
			this.bullets[k].move();							//und fliegt los...
			
			break;
		}
};

Hero.prototype.collect_coin = function(i,j)		//Mario hat eine Münze eingesammelt
{
	if( $('#coin'+i.toString()+'_'+j.toString()).length )	//existiert die betreffende Münze noch, d.h. hat sie Mario schon eingesammelt oder nicht??
	{
		for( var k = coins.length ; k-- ; )			//suche die fragliche Münze im Array
			if( coins[k].i==i && coins[k].j==j )	//genau diese Münze hat Mario eingesammelt
			{
				sounds.play('coin');
				this.coins++;
				
				coins[k].body.destroy();			//spritely beenden
				coins[k].body.remove();				//Münzen-Div vernichten
				coins.splice(k,1);					//lösche die Münze aus dem Münzarray
				break;
			}
	}
	
	if( this.coins == 100 )						//bei 100 Münzen bekommt man ein weiteres Leben
	{
		this.coins = 0;
		this.lives++;
		sounds.play('lifeupgrade');
		$('#number_of_lives').text(this.lives.toString()+'x');
	}
	$('#number_of_coins').text(this.coins.toString()+'x');
};

Hero.prototype.activate_coinbox = function(i,j)	//Mario ist mit dem Kopf an eine Münzbox geraten
{
	if( $('#coinboxcoin'+i.toString()+'_'+j.toString()).length )	//existiert die betreffende Münze noch, d.h. hat sie Mario schon eingesammelt oder nicht??
	{
		//Mario löst die Coinbox aus:
		sounds.play('coin');
		this.coins++;
		
		//Münze erscheint über der Münzbox:
		$('#coinboxcoin'+i.toString()+'_'+j.toString()).css( { 'bottom' : '+=8px' } ).animate( { 'bottom' : '+=30px' } , 150 , function() 
								{
									$('#coinboxcoin'+i.toString()+'_'+j.toString()).remove();	//entferne die Münze aus der Münzbox
								} );
		
		//Münzbox wird braun: 
		$('#coinbox'+i.toString()+'_'+j.toString()).css( { 'background-position' : '-514px -194px' } );
		$('#coinbox'+i.toString()+'_'+j.toString()).animate( { 'bottom' : '+=10px' } , 50 , function() 
								{
									$('#coinbox'+i.toString()+'_'+j.toString()).animate( { 'bottom' : '-=10px' } , 50 ); 
								} );
		
		//Befindet sich ein Gegner über der Box?
		for( var k = enemies.length ; k-- ;  )
			if( !enemies[k].dead && enemies[k].j == j-1 && Math.floor( ( enemies[k].x + 16 ) / 32 ) == i )
				enemies[k].die();		//töte den Gegner
	}
	
	if( this.coins == 100 )						//bei 100 Münzen bekommt man ein weiteres Leben
	{
		this.coins = 0;
		this.lives++;
		sounds.play('lifeupgrade');
		$('#number_of_lives').text(this.lives.toString()+'x');
	}
	$('#number_of_coins').text(this.coins.toString()+'x');
};

Hero.prototype.activate_multiple_coinbox = function(i,j)	//Mario ist mit dem Kopf an eine Vielfach_Münzbox geraten
{
	if( $('#multiple_coinboxcoin'+i.toString()+'_'+j.toString()).length )	//ex. die Münze in der Box noch, d.h. ist die Box überhaupt noch aktiv?
	{
		for( var k = multiple_coinboxes.length ; k-- ; )					//suche die entsprechende Box im Array
			if( multiple_coinboxes[k].i==i && multiple_coinboxes[k].j==j )	//genau diese Münzbox hat Mario getroffen
			{
				sounds.play('coin');
				this.coins++;								//Mario erhält eine Münze hinzu
				
				if( !multiple_coinboxes[k].activated )		//wenn die Box noch inaktiv ist, wird der Timer gestartet
				{
					multiple_coinboxes[k].activated = true;
					
					var n = 4;								//4 Sekunden
					var This = this;
					var timer = setInterval( function() 
										{
											n--;
											if(n==0)		//jetzt ist die Zeit abgelaufen
											{
												$('#multiple_coinboxcoin'+i.toString()+'_'+j.toString()).remove();					//entferne die Münze nach 4s aus der Münzbox
												$('#multiple_coinbox'+i.toString()+'_'+j.toString()).css( { 'background-position' : '-514px -194px' } );	//färbe Box braun ein
												clearInterval(timer);
											}
											else if( This.dead )
												clearInterval(timer);
										} , 1000 );
				}
				
				//Münze erscheint über der Münzbox:
				$('#multiple_coinboxcoin'+i.toString()+'_'+j.toString()).stop(false,true).css( { 'bottom' : '+=8px' } ).animate( { 'bottom' : '+=30px' } , 150 , function() 
								{
									$('#multiple_coinboxcoin'+i.toString()+'_'+j.toString()).css( { 'bottom' : '-=38px' } );	
								} );
				
				//Münzbox hebt sich leicht:
				$('#multiple_coinbox'+i.toString()+'_'+j.toString()).stop(false,true).animate( { 'bottom' : '+=10px' } , 50 , function() 
								{
									$('#multiple_coinbox'+i.toString()+'_'+j.toString()).animate( { 'bottom' : '-=10px' } , 50 ); 
								} );
				
				//Befindet sich ein Gegner über der Box?
				for( var l = enemies.length ; l-- ;  )
					if( !enemies[l].dead && enemies[l].j == j-1 && Math.floor( ( enemies[l].x + 16 ) / 32 ) == i )
						enemies[l].die();		//töte den Gegner
				
				break;
			}
	}
	
	if( this.coins == 100 )						//bei 100 Münzen bekommt man ein weiteres Leben
	{
		this.coins = 0;
		this.lives++;
		sounds.play('lifeupgrade');
		$('#number_of_lives').text(this.lives.toString()+'x');
	}
	$('#number_of_coins').text(this.coins.toString()+'x');
};

Hero.prototype.activate_starbox = function(i,j)	//Mario ist mit dem Kopf an eine Sternbox geraten
{
	for( var k = starboxes.length ; k-- ; )
		if( starboxes[k].i==i && starboxes[k].j==j )	//genau diese Box hat Mario getroffen
		{
			if( !starboxes[k].activated )				//wenn die Box noch nicht ausgelöst wurde
			{
				sounds.play('mushroom');
				starboxes[k].activated = true;
				
				//Sternbox wird braun: 
				starboxes[k].body.destroy().css( { 'background-position' : '-514px -194px' } );
				starboxes[k].body.animate( { 'bottom' : '+=10px' } , 50 , function() 
								{
									starboxes[k].body.animate( { 'bottom' : '-=10px' } , 50 ); 
								} );
				
				//der Stern wird ausgelöst:
				starboxes[k].star.sprite( { fps: 10 , no_of_frames: 2 } );	//damit der Stern blinkt
				starboxes[k].move();										//der Stern fliegt los....
				
				//Befindet sich ein Gegner über der Box?
				for( var l = enemies.length ; l-- ;  )
					if( !enemies[l].dead && enemies[l].j == j-1 && Math.floor( ( enemies[l].x + 16 ) / 32 ) == i )
						enemies[l].die();		//töte den Gegner
			}
			break;
		}
};

Hero.prototype.activate_mushroombox = function(i,j)	//Mario ist mit dem Kopf an eine Pilzbox geraten
{
	for( var k = mushroomboxes.length ; k-- ; )
		if( mushroomboxes[k].i==i && mushroomboxes[k].j==j )//genau diese Box hat Mario getroffen
		{
			if( !mushroomboxes[k].activated )				//wenn die Box noch nicht ausgelöst wurde
			{
				sounds.play('mushroom');
				mushroomboxes[k].activated = true;
				
				//Pilzbox wird braun: 
				mushroomboxes[k].body.destroy().css( { 'background-position' : '-514px -194px' } );
				mushroomboxes[k].body.animate( { 'bottom' : '+=10px' } , 50 , function() 
								{
									mushroomboxes[k].body.animate( { 'bottom' : '-=10px' } , 50 ); 
								} );
				
				if( this.state === 'small' )
				{
					//der Pilz wird ausgelöst:
					mushroomboxes[k].mushroom_y += 32;			//der Pilz erscheint auf der Box
					mushroomboxes[k].move();					//und wandert los....
				}
				else
				{
					//die Blume wird ausgelöst:
					mushroomboxes[k].mushroom.css( { 'background-position' : '-548px -60px' } );//Bild der Blume
					
					//Blume wächst aus der Box:
					var n = 0;
					var timer = setInterval( function() 
												{
													n++;
													if(n==1)
														mushroomboxes[k].mushroom_y += 8;
													else
														mushroomboxes[k].mushroom_y += 2;
													if( n == 13 )
														clearInterval(timer);
												} , 20 );
					
					setTimeout( function() { mushroomboxes[k].move2(); } , 100 );	//Blume wartet auf Mario...
				}
				
				//Befindet sich ein Gegner über der Box?
				for( var l = enemies.length ; l-- ;  )
					if( !enemies[l].dead && enemies[l].j == j-1 && Math.floor( ( enemies[l].x + 16 ) / 32 ) == i )
						enemies[l].die();		//töte den Gegner
			}
			break;
		}
};

Hero.prototype.die = function()					//sicherer Tod
{	
	if( this.dead || this.finished )	return;	//Man stirbt nur einmal ;-)
	
	this.dead = true;			//blockiert alle anderen Methoden und beendet einige laufende Timer
	music.pause();
	invincibilityMusic.pause();
	dieMusic.currentTime = 0;
	dieMusic.play();
	this.lives--;				//Mario verliert ein Leben
	$('#back_to_menu').hide();
	
	//Spritely fürs Laufen beenden:
	if( this.sprite_right || this.sprite_left )
	{
		this.body.destroy();	
		this.sprite_right = this.sprite_left = false;
	}
	
	//Todesanimation starten:
	this.body.css({'background-position' : '-81px -324px'});
	this.body.sprite( { fps: 9, no_of_frames: 2 } );
	
	//Mario fliegt hoch und wieder runter:
	var This = this;		//Erstellen eines this-Klons, weil in der complete-Fkt. der jQuery-animate()-Methode this auf this.body verweist!!!! 
	setTimeout( function() 
			{
				This.body.animate( { 'bottom' : '+=200' } , 600 , function() 
						{
							This.body.animate( { 'bottom' : '-80' } , 600 , function() 
									{
										setTimeout( function() 
												{
													if( This.lives >= 0 )
													{	
														This.body.destroy();		//Spritely beenden
														This.state = 'small';
														This.shooter = false;
														
														LoadLevel();				//Beginne aktuellen Level von vorne
													}
													else
														GameOver();					//Lösche alle Objekte im Spiel und kehre ins Hauptmenü zurück
												} , 1800 );	
									} );
						} );
			} , 700 );
};

Hero.prototype.success = function()				//Level gemeistert
{
	if( this.dead || this.finished )	return; //leider zu spät
	this.finished = true;						//dadurch wird die move()-Fkt. nicht mehr ausgeführt und GameLoop() beendet
	
	this.moving = false;
	this.walking = false;
	
	music.pause(); 
	invincibilityMusic.pause();
	successMusic.currentTime = 0;
	successMusic.play();
	$('#back_to_menu').hide();
	
	//Spritely fürs Laufen beenden:
	if( this.sprite_right || this.sprite_left )
	{
		this.body.destroy();	
		this.sprite_right = this.sprite_left = false;
	}
	
	//Siegermario:
	if( this.state==='small' )
		this.body.css({'background-position' : '-241px -81px'});
	else
		this.body.css({'background-position' : '-161px -81px'});
	
	//lade nächsten Level:
	this.level++;
	if(!custom) createCookies(30);		//speichere Spielstand für 30 Tage als Cookie ab
	if( DefaultLevel(this.level) )		//ist noch ein weiteres Level zum Laden da???
		setTimeout( function() { LoadLevel(); } , 8000 );
	else
		setTimeout( function() { Ending(); } , 8000 );
};