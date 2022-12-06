// Funktion Element zeichnen
function draw_obj(c, obj, x, y) {
var img = new Image();
var fig = new Image();
var mario = new Image();
img.src = "mario-objects.png";  // Alle Bausteine
fig.src = "mario-enemies.png";  // Alle Figuren (außer Mario)
mario.src = "mario-sprites.png";  // Mario
switch(obj)
{
	case 'grass_top_1x1':
		c.drawImage(img,888,404,32,32,x,y,32,32);
		break;
	case 'grass_top_right_1x1':
		c.drawImage(img,922,404,32,32,x,y,32,32);
		break;
	case 'grass_right_1x1':
		c.drawImage(img,922,438,32,32,x,y,32,32);
		break;
	case 'grass_bottom_right_1x1':
		c.drawImage(img,922,472,32,32,x,y,32,32);
		break;
	case 'grass_bottom_1x1':
		c.drawImage(img,888,472,32,32,x,y,32,32);
		break;
	case 'grass_bottom_left_1x1':
		c.drawImage(img,854,472,32,32,x,y,32,32);
		break;
	case 'grass_left_1x1':
		c.drawImage(img,854,438,32,32,x,y,32,32);
		break;
	case 'grass_top_left_1x1':
		c.drawImage(img,854,404,32,32,x,y,32,32);
		break;
	case 'grass_top_left_rounded_1x1':
		c.drawImage(img,854,506,32,32,x,y,32,32);
		break;
	case 'grass_top_left_rounded_soil_1x1':
		c.drawImage(img,956,506,32,32,x,y,32,32);
		break;
	case 'grass_top_right_rounded_1x1':
		c.drawImage(img,922,506,32,32,x,y,32,32);
		break;
	case 'grass_top_right_rounded_soil_1x1':
		c.drawImage(img,990,506,32,32,x,y,32,32);
		break;
	case 'grass_top_right_corner_1x1':
		c.drawImage(img,612,868,32,32,x,y,32,32);
		break;
	case 'grass_top_left_corner_1x1':
		c.drawImage(img,648,868,32,32,x,y,32,32);
		break;
	case 'soil_1x1':
		c.drawImage(img,888,438,32,32,x,y,32,32);
		break;
	case 'soil_left_1x1':
		c.drawImage(img,854,540,32,32,x,y,32,32);
		break;
	case 'soil_right_1x1':
		c.drawImage(img,922,540,32,32,x,y,32,32);
		break;
	case 'bush_left_1x1':
		c.drawImage(img,178,928,32,32,x,y,32,32);
		break;
	case 'bush_middle_left_1x1':
		c.drawImage(img,212,928,32,32,x,y,32,32);
		break;
	case 'bush_middle_1x1':
		c.drawImage(img,348,928,32,32,x,y,32,32);
		break;
	case 'bush_middle_right_1x1':
		c.drawImage(img,314,928,32,32,x,y,32,32);
		break;
	case 'bush_right_1x1':
		c.drawImage(img,382,928,32,32,x,y,32,32);
		break;
	case 'planted_soil_left_1x1':
		c.drawImage(img,714,832,32,32,x,y,32,32);
		break;
	case 'planted_soil_middle_1x1':
		c.drawImage(img,748,832,32,32,x,y,32,32);
		break;
	case 'planted_soil_right_1x1':
		c.drawImage(img,782,832,32,32,x,y,32,32);
		break;
	case 'brown_block_1x1':
		c.drawImage(img,514,194,32,32,x,y,32,32);
		break;
	case 'stone_1x1':
		c.drawImage(img,550,160,32,32,x,y,32,32);
		break;
	case 'pipe_top_left_1x1':
		c.drawImage(img,2,358,32,32,x,y,32,32);
		break;
	case 'pipe_top_right_1x1':
		c.drawImage(img,36,358,32,32,x,y,32,32);
		break;
	case 'pipe_left_1x1':
		c.drawImage(img,2,390,32,32,x,y,32,32);
		break;
	case 'pipe_right_1x1':
		c.drawImage(img,36,390,32,32,x,y,32,32);
		break;
	case 'pipe_left_grass_1x1':
		c.drawImage(img,2,424,32,32,x,y,32,32);
		break;
	case 'pipe_right_grass_1x1':
		c.drawImage(img,36,424,32,32,x,y,32,32);
		break;
	case 'pipe_left_soil_1x1':
		c.drawImage(img,2,458,32,32,x,y,32,32);
		break;
	case 'pipe_right_soil_1x1':
		c.drawImage(img,36,458,32,32,x,y,32,32);
		break;
	case 'coin_1x1':
		c.drawImage(img,0,0,32,32,x,y,32,32);
		break;
	case 'multiple_coinbox_1x1':
		c.drawImage(img,956,574,32,32,x,y,32,32);
		break;
	case 'coinbox_1x1':
		c.drawImage(img,990,574,32,32,x,y,32,32);
		break;
	case 'mushroombox_1x1':
		c.drawImage(img,956,540,32,32,x,y,32,32);
		break;
	case 'starbox_1x1':
		c.drawImage(img,990,540,32,32,x,y,32,32);
		break;
	case 'fig_greenturtle_1x1':
		c.drawImage(fig,111,271,32,32,x,y,32,32);
		break;
	case 'fig_ballmonster_1x1':
		c.drawImage(fig,110,185,32,32,x,y,32,32);
		break;
	case 'fig_spikedturtle_1x1':
		c.drawImage(fig,111,102,32,32,x,y,32,32);
		break;
	case 'fig_pipeplant_1x1':
		c.drawImage(fig,106,59,64,32,x,y,64,32);
		break;
	case 'fig_staticplant_1x1':
		c.drawImage(fig,106,3,32,32,x,y,32,32);
		break;
	case 'fig_mario_1x1':
		c.drawImage(mario,269,359,32,32,x,y,32,32);
		break;
	case 'eraser_1x1':
		c.clearRect(x,y,32,32);
		break;
	case 'tool1_soil_2x2':
		c.drawImage(img,1071,3,64,64,x,y,64,64);
		break
    case 'tool1_soil_3x3':
		c.drawImage(img,1071,3,96,96,x,y,96,96);
		break
    case 'tool1_soil_4x4':
		c.drawImage(img,1071,3,128,128,x,y,128,128);
		break
    case 'tool2_grass_top_1x2':
		c.drawImage(img,1071,136,64,32,x,y,64,32);
		break
    case 'tool2_grass_top_1x4':
		c.drawImage(img,1071,136,128,32,x,y,128,32);
		break
    case 'tool2_grass_left_2x1':
		c.drawImage(img,1090,172,32,64,x,y,32,64);
		break
    case 'tool1_grass_left_4x1':
		c.drawImage(img,1090,172,32,128,x,y,32,128);
		break
    case 'tool2_grass_right_2x1':
		c.drawImage(img,1125,172,32,64,x,y,32,64);
		break
    case 'tool1_grass_right_4x1':
		c.drawImage(img,1125,172,32,128,x,y,32,128);
		break	
    case 'tool2_soil_left_2x1':
		c.drawImage(img,1160,172,32,64,x,y,32,64);
		break
    case 'tool1_soil_left_4x1':
		c.drawImage(img,1160,172,32,128,x,y,32,128);
		break
	case 'tool2_soil_right_2x1':
		c.drawImage(img,1090,303,32,64,x,y,32,64);
		break
    case 'tool1_soil_right_4x1':
		c.drawImage(img,1090,303,32,128,x,y,32,128);
		break
	case 'tool2_pipe_left_soil_2x1':
		c.drawImage(img,1125,303,32,64,x,y,32,64);
		break
    case 'tool1_pipe_left_soil_4x1':
		c.drawImage(img,1125,303,32,128,x,y,32,128);
		break
	case 'tool2_pipe_right_soil_2x1':
		c.drawImage(img,1160,303,32,64,x,y,32,64);
		break
    case 'tool1_pipe_right_soil_4x1':
		c.drawImage(img,1160,303,32,128,x,y,32,128);
		break
	case 'tool2_pipe_left_2x1':
		c.drawImage(img,1090,434,32,64,x,y,32,64);
		break
    case 'tool1_pipe_left_4x1':
		c.drawImage(img,1090,434,32,128,x,y,32,128);
		break
	case 'tool2_pipe_right_2x1':
		c.drawImage(img,1125,434,32,64,x,y,32,64);
		break
    case 'tool1_pipe_right_4x1':
		c.drawImage(img,1125,434,32,128,x,y,32,128);
		break		
}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//         Initialisierung
//
/////////////////////////////////////////////////////////////////////////////////////////////////////

var canvas = document.getElementById('edit_canvas');
var context = canvas.getContext('2d');
// Canvasgröße festlegen um Verzerrungen zu unterbinden
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
		
var count = 0;
var lvl_height, lvl_width, lvl_height_max, lvl_width_max;
// Maximale Levelgröße
lvl_width_max = parseInt($('#canvas_width').attr('max'));
lvl_height_max = 60;
// Defaultwerte für lvl_height oder lvl_width setzen falls null
if(!lvl_height) lvl_height = 15;
if(!lvl_width) lvl_width = 100;
$('#level_size').css({'width': lvl_width*32, 'height': lvl_height*32});

// temporäres Levelarray erstellen
var temp_arr = new Array(lvl_width_max);
for (var i = temp_arr.length; i--; ) {
	temp_arr[i] = new Array(lvl_height_max);
}
function init_editor() {
	// temporäres Levelarray auf Standard setzen
	for(var i=0; i<lvl_width_max; i++) {
		for(var j=0; j<lvl_height_max; j++) {
			temp_arr[i][j] = '';
		}
	}
}


// Matrix um Arbeitsschritte festzuhalten
var steps = new Array();
steps[0] = new Array(4);


/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//         Ab hier wird die Drag and Drop Steuerung beschrieben
//
/////////////////////////////////////////////////////////////////////////////////////////////////////

// Draggable
$('#objects span div').draggable( {
  containment: '#edit_world',      // nur in diesem div kann gedropped werden
  stack: '#objects span div',      // nur diese Elemente können gedragged werden
  cursor: 'move',                  // so verändert sich der Cursor beim Draggen
  cursorAt: { top: 16, left: 16 }, // der Cursor soll sich immer in der Mitte des Elements sein 
  opacity: 0.8,                    // Das Element soll beim Draggen leicht transparent sein
  distance: 50,                    // Erst nach 50px mousedown soll auch wirklich gedragged werden -> unterbindet versehentliches dragging
  revert: true	                   // Bei falschem Dropping wandert das Element automatisch an die Ausgangsposition zurück 
} );

// Dropable
$('#edit_world').droppable( {
  accept: '#objects span div',
  drop: handleDrop
} );

// DnD Steuerung
function handleDrop(event, ui) {
	var obj, prepend;
	var old_obj = new Array;
	var pos = $('#edit_world').offset();

	var x = ui.offset.left + 16 - pos.left + $('#edit_world').scrollLeft();  // Mauszeigerposition X ermitteln, auf #world Koordinaten umrechnen und scrolloffset einrechnen
	var y = ui.offset.top + 16 - pos.top + $('#edit_world').scrollTop();  // Mauszeigerposition Y ermitteln, auf #world Koordinaten umrechnen und scrolloffset einrechnen
	var x_coord = x - (x%32); // modulo 32 rechnen um Element richtig in Gitter zu platzieren
	var y_coord = y - (y%32); // modulo 32 rechnen um Element richtig in Gitter zu platzieren

	obj = ui.draggable.attr('class').replace(' ui-draggable ui-draggable-dragging',''); // Klasse des Elements
	var obj_height = obj.slice((obj.length-3),(obj.length-2)); // Höhe des Elements
	var obj_width = obj.slice((obj.length-1))// Breite des Elements

	var l = 0;
	for(var i = 0; i < obj_height; i++) {
		for(var j = 0; j < obj_width; j++) {
			old_obj[l] = ''; // standardmäßig wird auf ein leeres Feld gedropped
			if(temp_arr[(x_coord/32)+j][(y_coord/32)+i]) {  // Das Feld ist schon belegt -> überschreiben
				context.clearRect(x_coord+(j*32),y_coord+(i*32),32,32); // Feld löschen, dann erst neu belegen
				old_obj[l] = temp_arr[(x_coord/32)+j][(y_coord/32)+i]; // Elementname speichern, auf welches dedropped wurde
			}
			l++;
		}
	}
		
	ui.draggable.draggable( 'option', 'revert', false );	

	// gedropptes Element zeichnen
	draw_obj(context, obj, x_coord, y_coord);
	
	ui.draggable.remove(); // gedropptes Element wieder löschen, da ja in canvas gezeichnet
	
	// Element nachproduzieren und wieder dragable machen (außer Mario)
	if(obj != 'fig_mario_1x1') {
		// Prüfen ob Figur oder Baustein
		if(obj.slice(0,3) == 'fig') {
			prepend = '#figures';
		}
		else if(obj.slice(0,5) == 'tool1') {
			prepend = '#tool1';	
		}
		else if(obj.slice(0,5) == 'tool2') {
			prepend = '#tool2';	
		}
		else {
			prepend = '#bricks';
		}
		
		$('<div></div>').addClass(ui.draggable.attr('class').replace(' ui-draggable-dragging', '')).appendTo(prepend).draggable( {
			  containment: '#edit_world',
			  stack: '#objects span div',
			  cursor: 'move',
			  revert: true
			} );
		$('#edit_world').droppable( {
		  accept: '#objects span div',
		  hoverClass: 'hovered',
		  drop: handleDrop
		} );
	}
	
	// Arbeitsschritt abspeichern
	l = 0;
	var stat = count;
	var test='';
	for(var i = 0; i < obj_height; i++) {
		for(var j = 0; j < obj_width; j++) {
			steps[count][0] = x_coord+(j*32);
			steps[count][1] = y_coord+(i*32);
			steps[count][2] = old_obj[l]; // auf was wurde drauf gedropped
			steps[count][3] = stat;
			// Arbeitsschritt-Matrix erweitern
			steps.push(new Array(4));
			count++;
			l++;
		}
	}

	// Nach abgeschlossenem Drag & Drop Cursor wieder auf Standard setzen
	$('body').css({'cursor': 'default'});
	
	// obj bei tools auf bricks Form setzen
	if(obj.slice(0,5) === 'tool1' || obj.slice(0,5) === 'tool2') {
		obj = obj.slice(6); // Tools Präfix entfernen
		obj = obj.slice(0,(obj.length - 3)); // Suffix entfernen
		obj = obj+"1x1";
	}
	
	// gebaute Welt in Array zwischenspeichern
	if(obj == 'tools_eraser_1x1') {
		if(temp_arr[(x_coord/32)][(y_coord/32)] == 'fig_mario_1x1' || temp_arr[(x_coord/32)][(y_coord/32)] == 'mario') // Mario mit Radiergummi geloescht -> Mario nachproduzieren
		{
			$('<div></div>').attr({'class': 'fig_mario_1x1'}).appendTo('#figures').draggable( {
			  containment: '#edit_world',
			  stack: '#objects span div',
			  cursor: 'move',
			  revert: true
			} );
			$('#world').droppable( {
			  accept: '#objects span div',
			  hoverClass: 'hovered',
			  drop: handleDrop
			} );
		}
		for(var i = 0; i < obj_height; i++) {
			for(var j = 0; j < obj_width; j++) {
				temp_arr[(x_coord/32)+j][(y_coord/32)+i] = '';
			}
		}
	}
	else  {
		for(var i = 0; i < obj_height; i++) {
			for(var j = 0; j < obj_width; j++) {
				temp_arr[(x_coord/32)+j][(y_coord/32)+i] = obj;
			}
		}
	}
}