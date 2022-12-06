//######################################################################
//
//            			   FSTOOLTIPS.JS   V1.1
//                         FUSIONSCRIPTZ   2006
//                       support@fusionscriptz.com
//
//                    Call script using similar tags
//
//  for links use:  <a href="index.html" onmouseover="tooltip('Tooltip Title','Tooltip Heading','Tooltip Content');" onmouseout="exit();"> 
//  for images use: <img src="image.jpg" onmouseover="tooltip('Tooltip Title','Tooltip Heading','Tooltip Content');" onmouseout="exit();">                      
//
//######################################################################




//########################  START CONFIG  ##############################

var offsetx = 15;
var offsety = 10;
var ie5 = (document.getElementById && document.all); 
var ns6 = (document.getElementById && !document.all); 
var ua = navigator.userAgent.toLowerCase();
var isapple = (ua.indexOf('applewebkit') != -1 ? 1 : 0);

//########################   END CONFIG   ##############################

function newelement(newid){ 

    if(document.createElement){ 
        var el = document.createElement('div'); 
        el.id = newid;     
        with(el.style)
        { 
            display = 'none';
            position = 'absolute';
        } 
        el.innerHTML = '&nbsp;'; 
        document.body.appendChild(el); 
    } 
} 

//######################################################################

function getmouseposition(e){

    if(document.getElementById){

        var iebody=(document.compatMode && document.compatMode != 'BackCompat') ? 
        		document.documentElement : document.body;
        pagex = (isapple == 1 ? 0:(ie5)?iebody.scrollLeft:window.pageXOffset);
        pagey = (isapple == 1 ? 0:(ie5)?iebody.scrollTop:window.pageYOffset);
        mousex = (ie5)?event.x:(ns6)?clientX = e.clientX:false;
        mousey = (ie5)?event.y:(ns6)?clientY = e.clientY:false;

        var fstooltip = document.getElementById('tooltip');

if ((mousex+offsetx+fstooltip.clientWidth+5) > document.body.clientWidth) {
fstooltip.style.left = ((document.body.scrollLeft+document.body.clientWidth) - (fstooltip.clientWidth*2));
}

else { fstooltip.style.left = (mousex+pagex+offsetx); }


if ((mousey+offsety+fstooltip.clientHeight+5) > document.body.clientHeight) {
fstooltip.style.top = ((document.body.scrollTop+document.body.clientHeight) - (fstooltip.clientHeight*2));
}

else { fstooltip.style.top = (mousey+pagey+offsety); }


    }
}

//######################################################################

function tooltip(tiptitle,tipbold,tipnormal){

    if(!document.getElementById('tooltip')) newelement('tooltip');
    var fstooltip = document.getElementById('tooltip');
    fstooltip.innerHTML = '<table class="fstooltips" cellpadding="2" cellspacing="0"><tr><td class="tipheader"><img src="fstooltips.png" height="14" width="14" align="right">' + tiptitle + '</td></tr><tr><td class="tipcontent"><b>' + tipbold + '</b><br>' + tipnormal + '</td></tr></table>';
    fstooltip.style.display = 'block';
    fstooltip.style.position = 'absolute';
    fstooltip.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=70) progid:DXImageTransform.Microsoft.dropshadow(OffX=5, OffY=5, Color=gray, Positive=true)';
    document.onmousemove = getmouseposition;

}

//######################################################################

function exit(){

    document.getElementById('tooltip').style.display = 'none';

}

//######################################################################