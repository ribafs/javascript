function staticplant(i,j)				//Konstruktor einer statischen Pflanze
{
	this.i = i;							//damit ist die Pflanze eindeutig identifizierbar
	this.j = j;
	this.x = 32*i - 1;					//world-Koordinaten -> für Animation in GameLoop()
	this.y = (14-j)*32 - 2;
	
	this.dead = false;
	
	$('#world').append('<div id=\'staticplant' + i.toString() + '_' + j.toString() + '\'></div>');	//erzeuge div für die Pflanze und setze sie in die Spielwelt ein
	this.body = $('#staticplant'+i.toString()+'_'+j.toString());									//hiermit lässt sich das Pflanzen-div ansprechen
	
	this.body.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '34px' , 
		 		 	 'height' : '42px' , 
		 			 'background-image' : 'url(\'mario-enemies.png\')' , 
					 'background-position' : '0px -3px' ,	 	//Bild der Pflanze
					 'position' : 'absolute' ,					//Positionierung der Pflanze erfolgt relativ zum übergeordneten world-Div
					 'left' : (32*i-1).toString() + 'px' ,
					 'bottom' : ((14-j)*32-2).toString() + 'px' ,
					 'z-index' : '99'  } );						//Pflanzen sind hinter Mario
	
	this.body.sprite( { fps: 5 , no_of_frames: 2 } );			//damit die Pflanze schnappt
};

staticplant.prototype.bite = function()		//die Pflanze beisst zu
{	
	if( this.dead )	  return;
	
	//Erwischt die Planze den Mario?
	if( this.x + 2 > mario.x  && this.x < mario.x + 50 && this.y + 42 > mario.y && this.y < mario.y + 40 )	//Wechselwirkungsbereich
		if( mario.deadly )
			this.die();
		else
			mario.hurt();
	
	//Falls Mario lebendig und noch nicht fertig ist, kommt der nächste Move:
	if( !mario.dead && !mario.finished )
	{
		var This = this;
		setTimeout( function() { This.bite(); } , 20 );
	}
};

staticplant.prototype.die = function()	//die Pflanze stirbt, weil Mario gerade unbesiegbar ist
{
	if( this.dead )	return;
	sounds.play('shell');
	this.dead = true;
	
	this.body.destroy().css( { 'background-position' : '-68px -3px' } );	//Bild der umgedrehten Pflanze
	
	var This = this;		//Erstellen eines this-Klons, weil in der complete-Fkt. der jQuery-animate()-Methode this auf this.body verweist!!!! 
	this.body.animate( { 'bottom' : '+=100' } , 250 , function() 
			{
				This.body.animate( { 'bottom' : '-=132' } , 250 , function() 
						{
							This.body.remove();
						} );
			} );
};