// Schließen-Button der MessageBoxen
function MsgBoxCloseHandler() {
	// evtl geöffnete MessageBoxen schließen
	$('.msgBox').fadeOut(300, function() {
	$('.msgBox').remove(); });
}


// Level aus Datei laden
$('#load_button').click(function() {
	// Datei auswählen
	$('.msgBox').remove();	// evtl geöffnete MessageBoxen schließen
	$('<div></div>').attr({'id': 'box_load_file', 'class': 'msgBox'}).appendTo('#editor').html('W&auml;hle das zu ladende Level aus<br /><span style="font-size: 12px">Das vorhandene Level wird dabei &uuml;berschrieben.</span><br />');
	$('<div></div>').attr('id','msgBox_close').appendTo('#box_load_file').html('X'); // Schließen-Button der MessageBox
	$('<form></form>').attr('id','form_load_file').appendTo('#box_load_file');
	$('<input />').attr({'type':'file','id':'files', 'name':'file'}).appendTo('#form_load_file');
	$('<br /><br />').appendTo('#form_load_file');
	$('<input />').attr({'type':'button','value':'Level öffnen', 'id':'open_button'}).appendTo('#form_load_file').click(function() {
		readFile();	
	});
	
	$('#msgBox_close').click(function() { MsgBoxCloseHandler(); });	
});


// Levelausgabe für Entwickler
$('#developer_button').click(function() {
	$('.msgBox').remove();	// evtl geöffnete MessageBoxen schließen
	var code = '';
	for(var i=0; i<lvl_width; i++) {
		code += "levelarray.push( new Array( ";
		for(var j=0; j<lvl_height; j++) {
			validateLevel(i, j);
			if(j) code += " , '"+temp_arr[i][j]+"'";
			else  code += "'"+temp_arr[i][j]+"'";
		}
		code += " ) );<br />";
	}
	// MessageBox erstellen
	$('<div></div>').attr('id', 'code_box').attr('class', 'msgBox').appendTo('#editor');
	$('<div></div>').attr('id','msgBox_close').appendTo('#code_box').html('X'); // Schließen-Button der MessageBox
	$('<p></p>').appendTo('#code_box').html('Level-Code f&uuml;r Entwickler:');
	$('<p></p>').css({'font-size': '12px'}).appendTo('#code_box').html(code);
	
	$('#msgBox_close').click(function() { MsgBoxCloseHandler(); });	
});


// Komplettes Canvas löschen
$('#delete_button').click(function() {
	// Bestätigungsmeldung
	$('.msgBox').remove();	// evtl geöffnete MessageBoxen schließen	
	$('<div></div>').attr('id', 'delete_confirm').attr('class', 'msgBox').appendTo('#editor');
	$('<div></div>').attr('id','msgBox_close').appendTo('#delete_confirm').html('X'); // Schließen-Button der MessageBox
	$('<p></p>').appendTo('#delete_confirm').html('Willst Du das Level wirklich l&ouml;schen?<br /><span style="font-size: 12px">Dieser Vorgang kann nicht r&uuml;ckg&auml;ngig gemacht werden.</span>');
	$('<span></span>').addClass('del_click').appendTo('#delete_confirm').html('Ja').click(function() {
		$('#delete_confirm').fadeOut(300);
		$('#delete_confirm').remove();
		var canvas = document.getElementById('edit_canvas');
		var context = canvas.getContext('2d');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		context.clearRect(0,0,canvas.width,canvas.height);
		// temporäres Levelarray auf Standard setzen
		var mario_found;
		for(var i=0; i<lvl_width_max; i++) {
			for(var j=0; j<lvl_height_max; j++) {
				mario_found = temp_arr[i][j].search(/mario/); // Mario im Level vorhanden?
				if(mario_found != -1) { // Mario vorhanden -> Mario in Workbench wiederherstellen
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
				temp_arr[i][j] = '';
			}
		}
		// Arbeitsschritte-Array auf Standard setzen
		for(var i=0; i<steps.length; i++) {
			for(var j=0; j<3; j++) {
				steps[i][j] = '';
			}
		}
		count = 0;		
	});
	$('<span></span>').addClass('del_click').appendTo('#delete_confirm').html('Nein').click(function() {
		$('#delete_confirm').fadeOut(300, function() {
		$('#delete_confirm').remove(); });
	});
	
	$('#msgBox_close').click(function() { MsgBoxCloseHandler(); });	
});