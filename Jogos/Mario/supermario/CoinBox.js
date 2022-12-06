function coinbox(i,j)					//Konstruktor einer Münzbox
{
	this.i = i;							//damit ist die Münzbox eindeutig identifizierbar
	this.j = j;
	this.x = 32*i;						//world-Koordinaten -> für Animation in GameLoop()
	this.y = (14-j)*32;
	
	$('#world').append('<div id=\'coinbox' + i.toString() + '_' + j.toString() + '\'></div>');		//erzeuge div für die Münzbox und setze sie in die Spielwelt ein
	this.body = $('#coinbox'+i.toString()+'_'+j.toString());										//hiermit lässt sich das Münzbox-div ansprechen
	this.body.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '32px' , 
		 		 	 'height' : '32px' , 
		 			 'background-image' : 'url(\'mario-objects.png\')' , 
					 'background-position' : '-346px -328px' , 	//Bild der Münzbox bevor Mario die Box aktiviert
					 'position' : 'absolute' ,					//Positionierung der Münzbox erfolgt relativ zum übergeordneten world-Div
					 'left' : (32*i).toString() + 'px' ,
					 'bottom' : ((14-j)*32).toString() + 'px' ,
					 'z-index' : '10'  } );						//Münzboxen sind hinter Mario
	
	$('#world').append('<div id=\'coinboxcoin' + i.toString() + '_' + j.toString() + '\'></div>');	//erzeuge div für die Münze hinter der Münzbox und setze sie in die Spielwelt ein
	this.coin = $('#coinboxcoin'+i.toString()+'_'+j.toString());									//hiermit lässt sich das Münzen-div ansprechen
	this.coin.css( { 'margin' : '0' ,
					 'padding' : '0' ,
		 		 	 'width' : '32px' , 
		 		 	 'height' : '32px' , 
		 			 'background-image' : 'url(\'mario-objects.png\')' , 
					 'background-position' : '-96px 0px' , 		//Bild der Münze hinter der Münzbox
					 'position' : 'absolute' ,					//Positionierung der Münze erfolgt relativ zum übergeordneten world-Div
					 'left' : (32*i).toString() + 'px' ,
					 'bottom' : ((14-j)*32).toString() + 'px' ,
					 'z-index' : '9'  } );						//Münze ist hinter der Münzbox
};