var fade_time = 800;  // wie lange soll ueberblendet werden? [ms]
var fade_steps = 16;  // Frames der Ueberblendung. Je mehr, desto glatter die Ueberblendung. 
var img_time = 5000;  // wie lange soll ein Bild gezeigt werden? [ms]
var img_length = 9;  // wie viele Bilder gibt es?
var img_path = 'images';  // relativer oder absoluter Pfad zum Verzeichnis in dem die Bilder liegen
var img_suffix = 'menu';  // Praefix des Dateinamens der Bilder
var img_format = 'jpg';  // Format der Bilder
var randomize = true;  // Abspielreihenfolge zufaellig?
var init=false;
var diashow = true;

var img = new Array();
var number = new Array();
var random1, random2, temp;
var f=fade_steps;
var fade_frame, opacity;
var img1dia, img2dia;
var fadein, fadeout;
var k = 0;
			
function setAlpha(element, value) {
    // Browserabhaengige Transparenz fuer Ueberblendung
    var opacity=value/100;
    if(document.images["img1dia"].style.filter!==null) {element.style.filter="Alpha(opacity="+value+")";} // IE
    if(document.images["img1dia"].style.opacity!==null) {element.style.opacity=opacity;}                // Opera, Chrome, Firefox, Safari
    if(document.images["img1dia"].style.KhtmlOpacity!==null) {element.style.KhtmlOpacity=opacity;}      // alte Safaris
    if(document.images["img1dia"].style.MozOpacity!==null) {element.style.MozOpacity=opacity;}          // alte Firefox
}

function animation() {
	if(diashow) {
		if(!init) {
			for(var i=img_length; i--;) {
				number[i]=i;  // Schreibe Array mit Zahlen 0,1,2,3, ... ,img_length-1
			}
			if(randomize===true) {
				for(var i=(img_length*3); i--;) {
					random1=Math.floor(Math.random()*img_length);
					random2=Math.floor(Math.random()*img_length);
					temp=number[random1];
					number[random1]=number[random2];  // permutiere diese Zahlen zufaellig fuer eien zufaellige Abspielreihenfolge
					number[random2]=temp;
				}
			}
			img[0]=new Image();
			img[0].src=img_path + "/" + img_suffix + number[0] + "." + img_format;  // lade das erste Bild
			img[1]=new Image();
			img[1].src=img_path + "/" + img_suffix + number[1] + "." + img_format;  // lade das zweite Bild
			img1dia=document.images["img1dia"];
			img2dia=document.images["img2dia"];
			fadein=img1dia;
			fadeout=img2dia;
			fade_frame=fade_time/fade_steps;
			opacity_frame=100/fade_steps;
			init=true;
		}

		if(img[k+1].complete===false) {
			window.setTimeout("animation()", 200); // warte mit dem Bilderwechsel bis das naechstes Bild geladen ist
		}
		else {
			if (f===fade_steps) {
				f=0;
				k++;
				img[k+1]=new Image();
				img[k+1].src=img_path + "/" + img_suffix + number[(k+1)%img_length] + "." + img_format; // uebernaechstes Bild vorladen
				fadeout.src=img[k-1].src; // aktuelles Bild ausblenden
				fadein.src=img[k].src; // naechstes Bild einblenden
				setAlpha(fadein, 0);
				setAlpha(fadeout, 100);
				window.setTimeout("animation()", img_time); // zeige Bild 'img_time' Sekunden lang
				return;
			}
			else {
				f++; // hier ist die Funktion fuer's Ueberblenden
				setAlpha(fadein, f*opacity_frame);
				setAlpha(fadeout, 100-(f*opacity_frame));
				window.setTimeout("animation()", fade_frame);
			}
		}
	}
}
