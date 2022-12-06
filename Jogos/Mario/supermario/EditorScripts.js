// Raster ein- / ausblenden
gridOn = false;
$('#grid_button').click(function() {
	var canvas = document.getElementById('edit_canvas_help');
	var context = canvas.getContext('2d');
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	// Raster in Canvas zeichnen
	if(gridOn === false) {
		// vertikale Linien zeichnen
		for(var i=32; i<canvas.width; i+=32) {
			context.moveTo(i, 0);
			context.lineTo(i, canvas.height);
		}
		// horizontale Linien zeichnen
		for(var i=32; i<canvas.height; i+=32) {
			context.moveTo(0, i);
			context.lineTo(canvas.width, i);
		}
		// Linienstaerke und -farbe
		context.lineWidth = 1;
		context.strokeStyle = '#f00';
		context.stroke();
		gridOn = true;
	}
	// Raster loeschen
	else {
		context.clearRect(0,0,canvas.width,canvas.height);
		gridOn = false;
	}
});

// Inhalt in Workbench anzeigen
function show_content(id, label) {
	$('#bricks').css({'display': 'none'}); // Elemente ausblenden
	$('#figures').css({'display': 'none'}); // Elemente ausblenden
	$('#tool1').css({'display': 'none'}); // Elemente ausblenden
	$('#tool2').css({'display': 'none'}); // Elemente ausblenden
	$('#options').css({'display': 'none'});      // Optionen ausblenden
	id = '#'+id;
	$(id).css({'display': 'block'});              // Inhalt des angeklickten Labels einblenden	
	
	$('#labels span').css({'height': 25}); // alle Label auf Standardgröße zurücksetzen
	label = '#'+label;
	$(label).css({'height': 32}); // angeklicktes Label hervorheben
}

// Klick Handler
$('#l1').click(function() {show_content('options', 'l1')});
$('#l2').click(function() {show_content('bricks', 'l2')});
$('#l3').click(function() {show_content('figures', 'l3')});
$('#l4').click(function() {show_content('tool1', 'l4')});
$('#l5').click(function() {show_content('tool2', 'l5')});


// Levelbreite bestimmen
function canvas_w(value) {
	// Validierung der Eingabe fuer Browser, die das Range Slider Element nicht kennen
	parseInt(value);
	if(isNaN(value)) {
		value = 100;
	}
	else {
		if(value > parseInt($('#canvas_width').attr('max'))) value = parseInt($('#canvas_width').attr('max'));
		if(value < parseInt($('#canvas_width').attr('min'))) value = parseInt($('#canvas_width').attr('min'));
	}
	$('#canvas_width').val(value);
	lvl_width = parseInt(value);
	value=value*32;
	$('#level_size').css({'width': value});
	$('#range_value').html(lvl_width);
}

$('#canvas_width').attr('onChange','canvas_w(document.getElementById(\'canvas_width\').value)');

// Letzten Schritt rückgängig machen
$('#cancel_button').click(function() {
	if(count > 0) { // rückgänig machen nur möglich, wenn schon was gemacht wurde. 
		var canvas = document.getElementById('edit_canvas');
		var context = canvas.getContext('2d');
		var stat = steps[(count-1)][3];
		
		// alle 32x32 Blöcke des letzten Arbeitsschritts rückgängig machen		
		while(stat == steps[(count - 1)][3]) {
		var x = steps[(count-1)][0];
		var y = steps[(count-1)][1];
		var object = steps[(count-1)][2];
		
		// Mario wurde rückgängig gemacht -> draggable Mario wieder erstellen
		if(temp_arr[(x/32)][(y/32)] === 'fig_mario_1x1') {
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
		 
		if(!object) {
			if(temp_arr[(x/32)][(y/32)] == 'fig_pipeplant_1x1') {
				context.clearRect(x,y,64,32);
			}
			else {
				context.clearRect(x,y,32,32);	
			}
			temp_arr[(x/32)][(y/32)] = '';
		}
		else {
			if(temp_arr[(x/32)][(y/32)] == 'fig_pipeplant_1x1') {
				context.clearRect(x,y,64,32);
			}
			else {
				context.clearRect(x,y,32,32);	
			}
			temp_arr[(x/32)][(y/32)] = object;
			
			// evtl. Suffixe und Präfixe wiederherstellen
			var s = temp_arr[(x/32)][(y/32)].search(/_\dx\d/); // nach Suffix suchen
			if(s == -1) temp_arr[(x/32)][(y/32)] += '_1x1'; // kein Suffix -> Suffix wieder erstellen
			if(temp_arr[(x/32)][(y/32)] == 'ballmonster_1x1' || temp_arr[(x/32)][(y/32)] == 'spikedturtle_1x1' || temp_arr[(x/32)][(y/32)] == 'greenturtle_1x1' || temp_arr[(x/32)][(y/32)] == 'pipeplant_1x1' || temp_arr[(x/32)][(y/32)] == 'staticplant_1x1' || temp_arr[(x/32)][(y/32)] == 'mario_1x1') {
				temp_arr[(x/32)][(y/32)] = 'fig_'+temp_arr[(x/32)][(y/32)]; // kein Fig-Präfix -> Fig-Präfix wieder erstellen
			}
			
			draw_obj(context,temp_arr[(x/32)][(y/32)],x,y);
		}
		
		count--; // Zähler zurücksetzen
		}
	}
});


// Hintergrund auswählen
$('#edit_backgrounds img').click(function() {
	$('#edit_backgrounds img').css({'margin': '2px 5px', 'border': '0'}); // alle Bilder in Auswahl auf Standard-Layout setzen
	$(this).css({'margin': '0 3px', 'border': '2px #f00 solid'}); // Ausgewähltes Bild hervorheben
	var value = $(this).attr('id');
	value = value.slice(value.length - 1); // Zahl extrahieren 
	var bg = 'url("mario-background_'+value+'.png")';
	$('#edit_world').css({'background-image': bg});
	
});

// Level spielen
$('#play_button').click(function() {
// Hintergrund fuer Spiel setzen
var bg = $('#edit_world').css('background-image');
$('#background').css({'background-image': bg});

for(var i=0; i<lvl_width; i++) {
	for(var j=0; j<lvl_height; j++) {
		// kleine Validierung durchführen
		validateLevel(i, j);
	}	
}

//Holzhammermethode, weil JavaScript keine normalen Arrayzuweisungen kann!!!!
levelarray = new Array();
for(var i=0; i<lvl_width; i++) {
	levelarray.push( new Array( temp_arr[i][0] ,temp_arr[i][1] ,temp_arr[i][2] ,temp_arr[i][3] ,temp_arr[i][4] ,temp_arr[i][5] ,temp_arr[i][6] ,temp_arr[i][7] ,temp_arr[i][8] ,temp_arr[i][9] ,temp_arr[i][10] ,temp_arr[i][11],temp_arr[i][12],temp_arr[i][13],temp_arr[i][14] ) );
}
custom = true;
LoadLevel();		//Zeichne Level, erzeuge Spielfigur, lade Gegner und Items gemäß levelarray....
			//startet außerdem die GameLoop()-Schleife, sobald alle animierten Objekte (Mario, Gegner, Münzen, etc.) vollständig geladen sind
$('#editor').hide();
$('#background').show();

// Musik ein, Menu-Musik aus
editorMusic.pause();
music.currentTime = 0;
music.play();
});

// Levelvalidierung
function validateLevel(i, j) {	
	// Elementnamen an Elementnamen des Spiels anpassen
	if(temp_arr[i][j].slice(0,3) === 'fig') 
	{
		temp_arr[i][j] = temp_arr[i][j].slice(4); // Figuren Präfix entfernen
	}
	var regexp = temp_arr[i][j].slice((temp_arr[i][j].length - 4),(temp_arr[i][j].length)).search(/_\dx\d/); // mit RegExp auf Suffix testen
	if(regexp != -1)
	{
		temp_arr[i][j] = temp_arr[i][j].slice(0,(temp_arr[i][j].length - 4)); // Suffix entfernen
	}	 
}

// Level in einer Datei speichern
$('#save_button').click(function() {
	// Erstmal Levelarray auslesen und in eine Variable schreiben
    var time = new Date();
    var filename = 'level_'+time.getTime()+'.txt'; // Dateinamen generieren
	var data = 'smw_level';
    var bg = $('#edit_world').css('background-image'); // Zahl des Hintergrundbilds speichern
    data += '*'+bg.slice((bg.length - 7),(bg.length - 6));
	data += '*'+lvl_width;
	data += '*'+lvl_height;
    
	for(var i=0; i<lvl_width; i++) {
		for(var j=0; j<lvl_height; j++) {
			validateLevel(i, j);
            if(temp_arr[i][j] != '') {
                data += '*'+temp_arr[i][j];
            }
            else {
                data += '* ';
            }
		}
	}
    
    //Leveldaten an PHP Skript schicken, in Datei speichern
    $.post('saveLevel.php?fname='+filename, 'data='+data);
    
    // speichern unter... Dialog oeffnen
    window.open('saveLevelDialog.php?fname='+filename);    
});


// Level aus Datei öffnen
function readFile() {
	$('.load_warning').remove(); // ggf. Warnungen loeschen
	
	// Canvas löschen
		var canvas = document.getElementById('edit_canvas');
		var context = canvas.getContext('2d');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		context.clearRect(0,0,canvas.width,canvas.height);

	
	var files = document.getElementById('files').files;
    if(!files.length) { // keine Datei gewaehlt
      $('<p></p>').attr('class','load_warning').css({'font-size': '12px'}).appendTo('#form_load_file').html('Bitte w&auml;hle eine Datei aus!');
      return;
    }
	var file = files[0];
	
	var reader = new FileReader(); 
	reader.readAsText(file, "UTF-8"); // Datei lesen
	
	reader.onload = function(e) {
		init_editor; // temp_arr leeren

		var isMario = false;
		var data = e.target.result;  // Hier sind die Daten
		var data_strings = data.split("*");
		if(data_strings[0] != 'smw_level') // Datei nicht weiterverarbeiten, falls inkompatibel
		{
		  $('<p></p>').attr('class','load_warning').css({'font-size': '12px'}).appendTo('#form_load_file').html('Keine kompatible Datei ausgew&auml;hlt!');
		  return;
		}
		
		$('<img />').attr('src', 'loading.gif').css({'width': 32, 'height': 32, 'margin': '10px auto'}).appendTo('#box_load_file'); // Ladecircle anzeigen
		
		// Eigenschaften des Levels setzen
		var bg = 'url("mario-background_'+data_strings[1]+'.png")'; // Hintergrund setzen
		$('#edit_world').css({'background-image': bg});
		lvl_width = data_strings[2]; // Levelbreite auslesen
		lvl_height = data_strings[3]; // Levelhöhe auslesen (eigentlich nicht nötig, da eh immer 15 Blocks)
		$('#level_size').css({'width': lvl_width*32, 'height': lvl_height*32});
		// Level bauen
		var a;
		var size_str = '_1x1';
		var fig_str = 'fig_';
		for(var i=0; i<lvl_width; i++) {
			for(var j=0; j<lvl_height; j++) {
				a = (i*15)+j+4;
				if(data_strings[a] === ' ') {
					temp_arr[i][j] = '';
				}
				else {
					temp_arr[i][j] = data_strings[a];
					if(data_strings[a] === 'ballmonster' || data_strings[a] === 'spikedturtle' || data_strings[a] === 'greenturtle' || data_strings[a] === 'pipeplant' || data_strings[a] === 'staticplant' || data_strings[a] === 'mario') {
						temp_arr[i][j] = fig_str.concat(temp_arr[i][j]); // kein Fig-Präfix -> Fig-Präfix erstellen
					}
					
					if(temp_arr[i][j] === 'fig_mario') // pruefen ob Mario verbaut
					{
						isMario = true;	
					}
		
					temp_arr[i][j] = temp_arr[i][j].concat(size_str);
				}
				
				draw_obj(context, temp_arr[i][j], i*32, j*32); // Level in Canvas zeichnen
				
			}
		}

		// Workbench Eintraege aktualisieren
		$('#canvas_width').val(lvl_width); // RangeSlider richtig positionieren
		$('#range_value').html(lvl_width); // Anzeige rechts vom RangeSlider aktualisieren
		if(isMario) 
		{
			$('.fig_mario_1x1').remove(); // Mario aus Workbench löschen	
		}
		$('#edit_backgrounds img').css({'margin': '2px 5px', 'border': '0'}); // alle Bilder in Auswahl auf Standard-Layout setzen
		var bg_id = '#edit_background_img'+data_strings[1];
		$(bg_id).css({'margin': '0 3px', 'border': '2px #f00 solid'}); // Ausgewähltes Bild hervorheben
		
		// MessageBox nach 1s automatisch schließen
		$('.msgBox').delay(1000).fadeOut(300, function() {
		$('.msgBox').remove(); });
	}	
}	