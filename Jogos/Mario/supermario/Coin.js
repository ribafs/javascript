function coin(i,j)						//Konstruktor einer Münze
{
	this.i = i;							//damit ist die Münze eindeutig identifizierbar
	this.j = j;
	this.x = 32*i;						//world-Koordinaten -> für Animation in GameLoop()
	this.y = (14-j)*32;
	
	$('#world').append('<div id=\'coin' + i.toString() + '_' + j.toString() + '\'></div>');		//erzeuge div für die Münze und setze sie in die Spielwelt ein
	this.body = $('#coin'+i.toString()+'_'+j.toString());										//hiermit lässt sich das Münzen-div ansprechen
	
	this.body.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '32px' , 
		 		 	 'height' : '32px' , 
		 			 'background-image' : 'url(\'mario-objects.png\')' , 
					 'background-position' : '0px 0px' ,	 	//Bild der Münze
					 'position' : 'absolute' ,					//Positionierung der Münze erfolgt relativ zum übergeordneten world-Div
					 'left' : (32*i).toString() + 'px' ,
					 'bottom' : ((14-j)*32).toString() + 'px' ,
					 'z-index' : '10'  } );						//Münzen sind hinter Mario
	
	this.body.sprite( { fps: 10 , no_of_frames: 4 } );			//damit sich die Münze dreht
};