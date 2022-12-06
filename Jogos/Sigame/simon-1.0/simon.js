//position of board & peices
 var size=170;
 var baseX=150;
 var baseY=100;
 var marg=100;
 var inmarg=28;

//length of press
var toneLength=1000;

var score=0;
var presses=new Array();
var pressCnt=0;
var pressPlayed=0;
var running;
var timerId=0;
var commands=new Array();
var cmd_cnt=0;
var cmd_pos=0;
var pattern=new Array();
var patternCnt=0;
var patternPos=0;

var NSsound = navigator.plugins && navigator.plugins["LiveAudio"] && navigator.javaEnabled();
var IEsound = navigator.plugins && document.all;
var audioEnabled = NSsound || IEsound;
var docRoot='';

function find_by_id(id) {
  if (!document.getElementById) {
 	return document.images[id]
 } else {
   return document.getElementById(id);
 }
}

function change_text(id,text) {
  if (!document.getElementById) {
 	document.all[id].innerHTML = text
 } else {
   var obj = document.getElementById(id);
	   obj.innerHTML=text;
 }
}
function add_text(id,text) {
  if (!document.getElementById) {
 	document.all[id].innerHTML += text
 } else {
   var obj = document.getElementById(id);
   obj.innerHTML+=text;
 }
}
function updateScore()
{
 change_text('score','Pontos : '+ score);
}

rnd.today=new Date();
rnd.seed=rnd.today.getTime();

function rnd() {
        rnd.seed = (rnd.seed*9301+49297) % 233280;
        return rnd.seed/(233280.0);
};

function rand(number) {
        return Math.ceil(rnd()*number);
};

function showPatternDone()
{
 turn=true; 
 change_text('status','Agora siga-me, repitindo');
 callback='';
}
function showPattern()
{
 change_text('status','Escute');

 pattern[++patternCnt]=rand(4);
 if (pattern[patternCnt]==1)
  { pattern[patternCnt]="red"; }
 if (pattern[patternCnt]==2)
  { pattern[patternCnt]="green"; }
 if (pattern[patternCnt]==3)
  { pattern[patternCnt]="yellow"; }
 if (pattern[patternCnt]==4)
  { pattern[patternCnt]="blue"; }

 for (i=1; i<=patternCnt; i++)
 {
  showPress(pattern[i]);
 } 
 turn=true;
 callback='showPatternDone()';
}

function wrongPress(which)
{
 if (playing)
 {
  presses[++pressCnt]='wrongPress("'+which+'");';
 } else {
 playing=true;
 obj=find_by_id(which);
 obj.src=docRoot+'img/'+which+'on.gif';
 playSound('wrongsound');
 setTimeout('endPress("'+which+'");',200);
 }
 turn=false;
 change_text('status','Acabou o Jogo<br>Tecle F5 para recomeçar');
//reload to start over !!!
}

function rightPress(which)
{
 showPress(which);
}

function playSound(snd) { 
if (audioEnabled)
 {
 var obj=find_by_id(snd);
 if (!audioEnabled) return;
  if (IEsound) obj.play()
  else if (NSsound) obj.play(true);
 }
}

function stopSound(snd) {
if (audioEnabled) { var obj=find_by_id(snd); obj.stop(); }
}

var playing=false;
function endPress(which)
{
//stop sound
 obj=find_by_id(which);
 obj.src=docRoot+'img/'+which+'.gif';
 stopSound(which+'sound'); 
 if (pressCnt>pressPlayed)
  { playing=false; setTimeout(presses[++pressPlayed],toneLength/2); }
 else
  {  playing=false; pressCnt=0; pressPlayed=0; eval(callback); }
}

function showPress(which)
{
//play sound
 if (playing)
 {
  presses[++pressCnt]='showPress("'+which+'");';
 } else {
 playing=true;
 obj=find_by_id(which);
 obj.src=docRoot+'img/'+which+'on.gif';
 playSound(which+'sound');
 setTimeout('endPress("'+which+'");',toneLength);
 }
}

function patternDone()
{
  patternPos=0; 
  turn=false;
  if (toneLength > 100){ toneLength-=50; } else 
  { if (toneLength > 25) { toneLength-=5; } }
  setTimeout('showPattern()',toneLength);
}

function press(which)
{
 if (!turn) { return false; }
 if (pattern[++patternPos]==which)
 {
 rightPress(which);
 updateScore(++score);

 } 
 else 
 { wrongPress(which); turn=false; patternCnt=0;}

 if (patternPos==patternCnt)
 {
  if (playing)
  {
   presses[++pressCnt]='patternDone()';
  } else {  patternDone(); }
 }
}

function start()
{
showPattern();
}

function tclear()
{
 if (timerId) { 
   clearTimeout(timerId); 
   timerId=0; 
 } 
}

function move_item(obj,x,y) 
{ 
  var units="px";
  obj.style.position = "absolute";
  obj.style.left = x + units; 
  obj.style.top = y + units; 
} 

function moveto(obj,x,y)
{
  if (obj.id==running) { tclear(); }
  var cx,cy;
  cx=parseInt(obj.style.left.replace(/px/g,""));
  cy=parseInt(obj.style.top.replace(/px/g,""));
  if (!cx)
	{
	cx=obj.style.pixelLeft;
	cy=obj.style.pixelTop;
	}

  nx=Math.round((parseInt(cx)+parseInt(x))/2);
  ny=Math.round((parseInt(cy)+parseInt(y))/2);
  if ((Math.abs(cx-nx)>5)&&(Math.abs(ny-cy)>5))
  {
   if (timerId!=0)
   { 
   commands[cmd_cnt++]='setTimeout(\'moveto(find_by_id(\\\''+obj.id+'\\\'),\\\''+x+'\\\',\\\''+y+'\\\')\',50);'; 
   }
   else {
   move_item(obj,nx,ny);
   timerId=setTimeout('moveto(find_by_id("'+obj.id+'"),'+x+','+y+')',50);
   running=obj.id;
   }
  } else { 
    if (cmd_pos<cmd_cnt)
     {
     eval(commands[cmd_pos++]);
     } else { cmd_pos=cmd_cnt=0; start(); }
  }
}



function placeButtons() {
 move_item(find_by_id('back'),baseX,baseY);
 move_item(find_by_id('red'),baseX-marg,baseY-marg);
 move_item(find_by_id('green'),baseX-marg,baseY+marg+size);
 move_item(find_by_id('yellow'),baseX+size+marg,baseY-marg);
 move_item(find_by_id('blue'),baseX+size+marg,baseY+size+marg);

running="";timerId=0;
 moveto(find_by_id('red'),baseX+inmarg,baseY+inmarg)
 moveto(find_by_id('green'),baseX+inmarg,baseY+size+4);
 moveto(find_by_id('yellow'),baseX+size,baseY+inmarg+5);
 moveto(find_by_id('blue'),baseX+size,baseY+size);

}

function addTags(root) {
docRoot=root;
 tags='<img id="back" src="'+docRoot+'img/simon.gif">\
 <img id="red" src="'+docRoot+'img/red.gif" onClick="press(\'red\');">\
 <img id="yellow" src="'+docRoot+'img/yellow.gif" onClick="press(\'yellow\');">\
 <img id="green" src="'+docRoot+'img/green.gif" onClick="press(\'green\');">\
 <img id="blue" src="'+docRoot+'img/blue.gif" onClick="press(\'blue\');">\
 <embed name="redsound" id="redsound" src="'+docRoot+'audio/1.wav" hidden=true autostart=false loop=false>\
 <embed name="yellowsound" id="yellowsound" src="'+docRoot+'audio/2.wav" hidden=true autostart=false loop=false>\
 <embed name="greensound" id="greensound" src="'+docRoot+'audio/3.wav" hidden=true autostart=false loop=false>\
 <embed name="bluesound" id="bluesound" src="'+docRoot+'audio/4.wav" hidden=true autostart=false loop=false>\
 <embed name="wrongsound" id="wrongsound" src="'+docRoot+'audio/5.wav" hidden=true autostart=false loop=false>';
document.write(tags);
}

function placeBoard(x,y,margin)
{
 baseX=x;
 baseY=y;
 marg=margin;
}

function init() {
placeButtons();
}