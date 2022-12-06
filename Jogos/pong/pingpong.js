/*
 +-------------------------------------------------------------------+
 |                         P I N G   P O N G                         |
 |                                                                   |
 | Copyright Gerd Tentler                   info@gerd-tentler.de     |
 | Created 10/07/2002                       Last Modified 28/08/2003 |
 +-------------------------------------------------------------------+
 | This program may be used and hosted free of charge by anyone for  |
 | personal purpose as long as this copyright notice remains intact. |
 |                                                                   |
 | Obtain permission before selling the code for this program or     |
 | hosting this software on a commercial website or redistributing   |
 | this software over the Internet or in any other medium. In all    |
 | cases copyright must remain intact.                               |
 +-------------------------------------------------------------------+
*/
//---------------------------------------------------------------------------------------------------------
// definition
//
// gameMode   = 1: all alone, 2: human vs. human, 3: computer vs. human, 4: computer vs. computer
// gameScore  = maximum score
// gameSpeed  = 1 - 60 (higher values = slower)
// gameSound  = true: on, false: off (doesn't work with NN6!)
// gameColor  = color of the game area
// gameMargin = 0 - 30 (% of actual window size)
// gameBorder = border width, 0 = no border
// compSkill  = 0 - 4 (computer skill level, higher values = less skilled)
// barColor   = color of the bars
// ballColor  = color of the ball
// infoColor  = color of the dialog boxes ("help" and "options")
//---------------------------------------------------------------------------------------------------------

var gameMode = 3;
var gameScore = 15;
var gameSpeed = 30;
var gameSound = true;
var gameColor = "#008800";
var gameMargin = 4;
var gameBorder = 1;

var compSkill = 2;

var barColor = "#FFFFFF";
var ballColor = "#FFFF00";
var infoColor = "#60B060";

//---------------------------------------------------------------------------------------------------------
// other variables (don't change!)
//---------------------------------------------------------------------------------------------------------

if(gameMargin > 30) gameMargin = 30;
if(gameMargin < 0) gameMargin = 0;

var winWidth = window.innerWidth ? window.innerWidth : document.body.offsetWidth;
var winHeight = window.innerHeight ? window.innerHeight : document.body.offsetHeight;
var marginX = Math.round(gameMargin * winWidth / 100);
var marginY = Math.round(gameMargin * winHeight / 100);
var gameWidth = winWidth - gameBorder*2 - marginX*2;
var gameHeight = winHeight - gameBorder*2 - marginY*2;

var barWidth = Math.round(gameWidth / 30);
var barHeight = Math.round(gameHeight / 6);
var ballSize = Math.round(barWidth / 1.5);
var ballPixel = Math.round(gameWidth / 40);

var mouseY = mousePrev = 0;
var scoreLeft = scoreRight = 0;
var barTimeout = ballTimeout = 0;
var keyPressed = 0;
var actServ = 0;
var audioOn = false;
var gameStop = gameOver = false;

var borderTop = marginY + gameBorder + 2;
var borderBottom = marginY + gameHeight - gameBorder - 2;
var borderLeft = marginX + gameBorder + 2;
var borderRight = marginX + gameWidth - gameBorder - 2;
var centerX = Math.round(marginX + gameWidth/2);
var centerY = Math.round(marginY + gameHeight/2);

var lbarX = marginX + gameBorder + 5;
var lbarY = Math.round(centerY - barHeight/2);
var lbar = new makeBar('BarLeft', lbarX, lbarY, barWidth, barHeight, 0, barColor);

var rbarX = marginX + gameWidth - gameBorder - barWidth - 5;
var rbarY = lbarY;
var rbar = new makeBar('BarRight', rbarX, rbarY, barWidth, barHeight, 0, barColor);

var ballMoveX = ballMoveY = 0;
var ballX = Math.round(centerX - ballSize/2);
var ballY = Math.round(centerY - ballSize/2);
var ball = new makeBar('Ball', ballX, ballY, ballSize, ballSize, ballPixel, ballColor);

if(ballPixel < 1) ballPixel = 1;
if(gameSpeed > 60) gameSpeed = 60;
if(gameSpeed < 1) gameSpeed = 1;
if(compSkill > 4) compSkill = 4;
if(compSkill < 0) compSkill = 0;

//---------------------------------------------------------------------------------------------------------
// bar object
//---------------------------------------------------------------------------------------------------------

function makeBar(id, x, y, width, height, pixel, color) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.pixel = pixel;
  this.color = color;

  this.setPosition = function() {
    var obj = getObj(this.id);
    if(document.all) {
      obj.pixelLeft = this.x;
      obj.pixelTop = this.y;
    }
    else {
      obj.left = this.x;
      obj.top = this.y;
    }
  }

  this.move = function() {
    if(this.y + this.pixel > borderBottom - this.height) this.y = borderBottom - this.height;
    else if(this.y + this.pixel < borderTop) this.y = borderTop;
    else this.y += this.pixel;
    this.setPosition();
    if(this.pixel > 0 && this.pixel < this.height) this.pixel++;
    else if(this.pixel < 0 && this.pixel > -this.height) this.pixel--;
  }

  this.build = function() {
    document.write('<div id="' + this.id + '">' +
                   '<table border=0 cellspacing=0 cellpadding=0' +
                   ' width=' + this.width +
                   ' height=' + this.height +
                   ' bgcolor=' + this.color +
                   '><tr><td><img src="nix.gif" width=' + this.width + ' height=' + this.height +
                   '></td></tr></table>' +
                   '</div>');
  }
}

//---------------------------------------------------------------------------------------------------------
// functions
//---------------------------------------------------------------------------------------------------------

if(document.layers) document.captureEvents(Event.MOUSEMOVE|Event.KEYDOWN|Event.KEYUP);
document.onmousemove = getMouseY;
document.onkeydown = getKeyCode;
document.onkeyup = function() { keyPressed = 0; lbar.pixel = 0; }

function getMouseY(e) {
  if(e && e.pageY) mouseY = e.pageY;
  else mouseY = event.clientY + document.body.scrollTop;
}

function getKeyCode(e) {
  if(e && e.which) keyPressed = e.which;
  else keyPressed = event.keyCode;
  if(keyPressed == 110 || keyPressed == 78) newGame();
  else if(keyPressed == 111 || keyPressed == 79) showOptions();
  else if(keyPressed == 104 || keyPressed == 72) showHelp();
  else if(keyPressed == 112 || keyPressed == 80) togglePause();
  if(gameMode == 2) {
    if((keyPressed == 81 || keyPressed == 87 ||
        keyPressed == 113 || keyPressed == 119) &&
       lbar.pixel >= 0) lbar.pixel = -2;
    else if((keyPressed == 97 || keyPressed == 115 ||
             keyPressed == 65 || keyPressed == 83) &&
            lbar.pixel <= 0) lbar.pixel = 2;
  }
}

function getObj(id) {
  var obj = 0;
  if(document.getElementById && document.getElementById(id)) obj = document.getElementById(id).style;
  else if(document.all && document.all[id]) obj = document.all[id].style;
  else if(document.layers && document.layers[id]) obj = document.layers[id];
  return obj;
}

function showHide(id, status) {
  var obj = getObj(id);
  obj.visibility = status;
}

function moveBar(obj, center) {
  var ballCenter = Math.round(ball.y + ball.height/2);
  var barCenter = Math.round(obj.y + obj.height/2);

  if(gameMode != 2) {
    if((obj.x > ball.x && ballMoveX > 0 && ball.x > centerX) ||
       (obj.x < ball.x && ballMoveX < 0 && ball.x + ball.width < centerX)) {
      if(Math.random() * 10 >= compSkill * 2) {
        if(ballCenter >= obj.y && ballCenter <= obj.y + obj.height) obj.pixel = ballMoveY;
        else if(ballCenter > barCenter && obj.pixel <= 0) obj.pixel = 2;
        else if(ballCenter < barCenter && obj.pixel >= 0) obj.pixel = -2;
      }
    }
    else {
      if(obj.y > center + 1) obj.pixel = -2;
      else if(obj.y < center - 1) obj.pixel = 2;
      else obj.pixel = 0;
    }
  }
  obj.move();
}

function setBars() {
  if(gameMode < 4) {
    if(mouseY < mousePrev) {
      if(rbar.pixel >= 0) rbar.pixel = -2;
      rbar.move();
    }
    else if(mouseY > mousePrev) {
      if(rbar.pixel <= 0) rbar.pixel = 2;
      rbar.move();
    }
  }
  if(gameMode <= 1) {
    lbar.y = rbar.y;
    lbar.setPosition();
  }
  else {
    if(gameMode >= 2) moveBar(lbar, lbarY);
    if(gameMode >= 4) moveBar(rbar, rbarY);
  }
  mousePrev = mouseY;
  if(!gameStop) barTimeout = setTimeout('setBars()', gameSpeed);
}

function initBall() {
  if(ballTimeout) clearTimeout(ballTimeout);
  if(!actServ) {
    if(Math.round(Math.random())) ballMoveX = ballPixel;
    else ballMoveX = -ball.pixel;
  }
  else ballMoveX = ball.pixel * actServ;
  ballMoveY = Math.round(Math.random()) ? 1 : -1;
  ball.x = ballX;
  ball.y = ballY;
  ball.setPosition();
}

function hitBall(obj) {
  var ballCenter = Math.round(ball.y + ball.height/2);
  var barCenter = Math.round(obj.y + obj.height/2);

  if(ball.y + ball.height + ball.pixel < borderBottom && ball.y - ball.pixel > borderTop) {
    if(ballCenter < barCenter - obj.height/4) ballMoveY = -ball.pixel;
    else if(ballCenter > barCenter + obj.height/4) ballMoveY = ball.pixel;
    else ballMoveY = ballCenter < barCenter ? -1 : 1;
  }
  if(gameSound) playSound('sndHit');
}

function moveBall() {
  var speed = gameSpeed;
  var left = lbar.x + lbar.width;
  var right = rbar.x - ball.width;
  var ballBottom = ball.y + ball.height;

  if(ball.x <= borderLeft) {
    scoreRight++;
    setScore('ScoreRight');
    speed = 1000;
  }
  else if(ball.x + ball.width >= borderRight) {
    scoreLeft++;
    setScore('ScoreLeft');
    speed = 1000;
  }
  else {
    ball.x += ballMoveX;
    ball.y += ballMoveY;
    ball.setPosition();
    if(ball.y <= borderTop || ball.y + ball.height >= borderBottom) ballMoveY *= -1;
    else if(ball.x <= left && ballBottom >= lbar.y && ball.y <= lbar.y + lbar.height) {
      ballMoveX = ball.pixel;
      hitBall(lbar);
    }
    else if(ball.x >= right && ballBottom >= rbar.y && ball.y <= rbar.y + rbar.height) {
      ballMoveX = -ball.pixel;
      hitBall(rbar);
    }
  }
  if(!gameStop) ballTimeout = setTimeout('moveBall()', speed);
}

function setScore(div) {
  if(div == 'ScoreLeft') {
    var score = scoreLeft;
    actServ = 1;
  }
  else {
    var score = scoreRight;
    actServ = -1;
  }
  var size = Math.round(gameWidth / 100);
  var inhalt = '<font face="Verdana, Arial, Helvetica" size=' + size + ' color=' + barColor +
               '><b>' + score + '</b></font>';
  if(document.getElementById) document.getElementById(div).innerHTML = inhalt;
  else if(document.all) document.all[div].innerHTML = inhalt;
  else if(document.layers) {
    document.layers[div].document.write(inhalt);
    document.layers[div].document.close();
  }
  if(gameSound && score) playSound('sndScore');
  if(score < gameScore) initBall();
  else endGame();
}

function hideInfo(id) {
  showHide(id, 'hidden');
  if(!gameOver) {
    gameStop = false;
    if(barTimeout) setBars();
    if(ballTimeout) moveBall();
  }
}

function showOptions() {
  var f = document.layers ? document.Options.document.opt : document.opt;
  gameStop = true;
  f.Mode.selectedIndex = gameMode - 1;
  f.Sound.selectedIndex = gameSound ? 0 : 1;
  f.Speed.selectedIndex = gameSpeed < 10 ? 0 : Math.round(gameSpeed/10);
  f.Skill.selectedIndex = compSkill;
  showHide('Help', 'hidden');
  showHide('Options', 'visible');
}

function setOptions() {
  var f = document.layers ? document.Options.document.opt : document.opt;
  gameMode = f.Mode.options[f.Mode.selectedIndex].value;
  gameSound = f.Sound.selectedIndex ? false : true;
  gameSpeed = f.Speed.options[f.Speed.selectedIndex].value;
  compSkill = f.Skill.options[f.Skill.selectedIndex].value;
  hideInfo('Options');
}

function showHelp() {
  gameStop = true;
  showHide('Options', 'hidden');
  showHide('Help', 'visible');
}

function togglePause() {
  if(!gameOver) {
    gameStop = gameStop ? false : true;
    if(!gameStop) {
      showHide('Options', 'hidden');
      showHide('Help', 'hidden');
      if(barTimeout) {
        clearTimeout(barTimeout);
        setBars();
      }
      if(ballTimeout) {
        clearTimeout(ballTimeout);
        moveBall();
      }
    }
  }
}

function endGame() {
  gameStop = gameOver = true;
  showHide('GameOver', 'visible');
}

function newGame() {
  if(barTimeout) clearTimeout(barTimeout);
  if(ballTimeout) clearTimeout(ballTimeout);
  scoreLeft = scoreRight = 0;
  gameStop = gameOver = false;
  showHide('GameOver', 'hidden');
  showHide('Options', 'hidden');
  showHide('Help', 'hidden');
  setScore('ScoreLeft');
  setScore('ScoreRight');
  setBars();
  initBall();
  ballTimeout = setTimeout('moveBall()', 1000);
}

function playSound(id) {
  if(audioOn) {
    var snd = eval('document.' + id);
    if(snd != null) {
      if(document.layers) snd.play();
      else {
        if(document.M == null) {
          document.M = false;
          for(var m in snd) if(m == 'ActiveMovie') {
            document.M = true;
            break;
          }
        }
        if(document.M) {
          snd.SelectionStart = 0;
          snd.play();
        }
      }
    }
  }
}

window.onload = function() { audioOn = true; }

window.onresize = function() {
  var aWidth = window.innerWidth ? window.innerWidth : document.body.offsetWidth;
  var aHeight = window.innerHeight ? window.innerHeight : document.body.offsetHeight;
  if(aWidth != winWidth || aHeight != winHeight) document.location.reload();
}

//---------------------------------------------------------------------------------------------------------
// build game
//---------------------------------------------------------------------------------------------------------

document.write('<style> ' +
               '#GameArea { position: absolute' +
               '; top: ' + marginY +
               '; left: ' + marginX +
               '; } ' +
               '#ScoreLeft { position: absolute' +
               '; top:' + borderTop +
               '; left:' + Math.round(centerX - gameWidth/4) +
               '; } ' +
               '#ScoreRight { position: absolute' +
               '; top:' + borderTop +
               '; left:' + Math.round(centerX + gameWidth/4) +
               '; } ' +
               '#Menu { position: absolute' +
               '; top:' + (borderBottom - 20) +
               '; left:' + (centerX - 96) +
               '; color:' + barColor +
               '; } ' +
               '#GameOver { position: absolute; visibility:hidden' +
               '; top:' + Math.round(centerY - gameWidth/20) +
               '; left:' + Math.round(centerX - gameWidth/3.5) +
               '; color:' + barColor +
               '; font-family:Comic Sans MS' +
               '; font-size:' + Math.round(gameWidth/15) + 'px' +
               '; } ' +
               '#Options { position: absolute; visibility:hidden' +
               '; top:' + (centerY - 58) +
               '; left:' + (centerX - 106) +
               '; z-index:1; } ' +
               '#Help { position: absolute' +
               '; top:' + (centerY - 63) +
               '; left:' + (centerX - 71) +
               '; z-index:1; } ' +
               '#BarLeft { position: absolute' +
               '; top:' + lbar.y +
               '; left:' + lbar.x +
               '; z-index:0; } ' +
               '#BarRight { position: absolute' +
               '; top:' + rbar.y +
               '; left:' + rbar.x +
               '; z-index:0; } ' +
               '#Ball { position: absolute' +
               '; top:' + ball.y +
               '; left:' + ball.x +
               '; z-index:0; } ' +
               '.A, .A:visited, .A:active, .A:hover { text-decoration: none' +
               '; font-family: MS Sans Serif, Arial, Helvetica; font-size: 12px' +
               '; color: ' + barColor +
               '; } ' +
               'TD { font-family: MS Sans Serif, Arial, Helvetica; font-size: 12px' +
               '; color: ' + barColor +
               '; } ' +
               'INPUT, SELECT { font-family: MS Sans Serif, Arial, Helvetica; font-size: 12px; } ' +
               '</style>');

document.write('<div id="GameArea">' +
               '<table cellspacing=0 cellpadding=0' +
               ' border=' + gameBorder +
               ' width=' + gameWidth +
               ' height=' + gameHeight +
               ' bgcolor=' + gameColor +
               '><tr><td align=center><table border=0 cellspacing=0 cellpadding=0>' +
               '<tr><td bgcolor=' + infoColor +
               '><img src="nix.gif" width=2 height=' + (borderBottom - borderTop) +
               '></td></tr></table></td></tr></table>' +
               '</div>');

document.write('<div id="ScoreLeft"></div>');
document.write('<div id="ScoreRight"></div>');

document.write('<div id="Menu">' +
               '[ <a href="javascript:showOptions()" class="A" onFocus="this.blur()"><u>O</u>ptions</a> | ' +
               '<a href="javascript:showHelp()" class="A" onFocus="this.blur()"><u>H</u>elp</a> | ' +
               '<a href="javascript:togglePause()" class="A" onFocus="this.blur()"><u>P</u>ause</a> | ' +
               '<a href="javascript:newGame()" class="A" onFocus="this.blur()"><u>N</u>ew Game</a> ]' +
               '</div>');

document.write('<div id="GameOver">G A M E &nbsp; O V E R</div>');

document.write('<div id="Options">' +
               '<table border=0 cellspacing=0 cellpadding=2' +
               ' bgcolor=' + infoColor +
               '><form name="opt">' +
               '<tr><td>Mode:</td><td><select name="Mode">' +
               '<option value="1">play all alone' +
               '<option value="2">human vs. human' +
               '<option value="3">computer vs. human' +
               '<option value="4">computer vs. computer' +
               '</select></td></tr>' +
               '<tr><td>Sound:</td><td><select name="Sound">' +
               '<option>on' +
               '<option>off' +
               '</select></td></tr>' +
               '<tr><td>Game Speed:</td><td><select name="Speed">' +
               '<option value="1">ultra fast' +
               '<option value="10">very fast' +
               '<option value="20">fast' +
               '<option value="30">medium' +
               '<option value="40">slow' +
               '<option value="50">very slow' +
               '<option value="60">ultra slow' +
               '</select></td></tr>' +
               '<tr><td>Computer Skill:</td><td><select name="Skill">' +
               '<option value="0">very good' +
               '<option value="1">good' +
               '<option value="2">medium' +
               '<option value="3">poor' +
               '<option value="4">very poor' +
               '</select></td></tr>' +
               '<tr><td><input type=button value="Cancel" onClick="hideInfo(\'Options\')">' +
               '<td align=right><input type=button value="&nbsp; OK &nbsp;" onClick="setOptions()">' +
               '</td></tr>' +
               '</form></table>' +
               '</div>');

document.write('<div id="Help">' +
               '<table border=0 cellspacing=0 cellpadding=2' +
               ' bgcolor=' + infoColor +
               '><form><tr><td colspan=2 align=center><b>Ping Pong</b></td></tr>' +
               '<tr><td colspan=2 align=center>(by Gerd Tentler)</td></tr>' +
               '<tr><td>right bar up:</td><td>mouse up<td></tr>' +
               '<tr><td>right bar down:</td><td>mouse down</td></tr>' +
               '<tr><td>left bar up:</td><td>Q or W<td></tr>' +
               '<tr><td>left bar down:</td><td>A or S</td></tr>' +
               '<tr><td colspan=2 align=center>' +
               '<input type=button value="&nbsp; OK &nbsp;" onClick="hideInfo(\'Help\')">' +
               '</td></tr></form></table>' +
               '</div>');

lbar.build();
rbar.build();
ball.build();

//---------------------------------------------------------------------------------------------------------
// sounds
//---------------------------------------------------------------------------------------------------------

document.write('<embed name="sndHit" src="snd_hit.wav" mastersound loop=false ' +
               'autostart=false autorewind=true hidden=true width=0 height=0>');
document.write('<embed name="sndScore" src="snd_score.wav" mastersound loop=false ' +
               'autostart=false autorewind=true hidden=true width=0 height=0>');

//---------------------------------------------------------------------------------------------------------

