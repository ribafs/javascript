//========================================================================
//   "WebHangman"  JavaScript Hangman  
//
//   Copyright (C) 2000,2002  Jan Mulder
//
//   This program is free software; you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation; either version 2 of the License, or
//   (at your option) any later version, and as long as this notice is
//   kept unmodified at the top of the script source code.
//
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License (license.txt) for more details.
//
//   Contact: http://janmulder.com/contact/
//
//   Last updated: 19th March 2002
//
//=======================================================================

var numRight = 0;
var numWrong = 0;
var wordCount = 0;
var doneAction = '';

var thisAnswer;
var thisHint;
var lastAnswer = '';
var answerIdx;
var blankChar = '*';
var answerDisplay;
var maxAttempts = 7;
var usedLetters = '';
var wrongLetters = '';
var maxLength = 0;

var gameOver = false;
var gameStart = true;
var isHint = false;
var imgWidth;
var imgHeight;
var cellDimension;
var firstRun = true;

tempArray = new Array();
wordArray = new Array();

alphaLower = 'abcdefghijklmnopqrstuvwxyz';

doneLoading = false;
imageCount = 0;
var progressBar = '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||';

function updateProgress(ims)
{
 var cnt=0;

 for(var i = 0; i < ims.length; i++)
  if(ims[i].complete || ims[i].errored) cnt++;

 if(ims.length > 0)
    window.status='Loading ['+Math.round((cnt / imageCount)*100)+'%] ' + progressBar.substring(0, cnt);

 if(cnt < ims.length)
 {
  tempArray = ims;
  setTimeout("updateProgress(tempArray)",200);
 }
 else
  onComplete();
}

function onComplete()
{
 window.status='Done';
 doneLoading = true;
}

function preloadImages()
{
 this.length = preloadImages.arguments.length;
 imageCount = this.length;
 for (var i = 0; i < this.length; i++)
 {
  this[i] = new Image();
  this[i].errored=false;
  this[i].onerror=new Function("this["+i+"].errored=true");
  this[i].src = preloadImages.arguments[i];
 }
 updateProgress(this);
}

var pictures = new preloadImages(
 sourceDir+"newbtn.gif", sourceDir+"scores.gif", sourceDir+"hintbtn.gif", 
 sourceDir+"a.gif", sourceDir+"b.gif", sourceDir+"c.gif", sourceDir+"d.gif",
 sourceDir+"e.gif", sourceDir+"f.gif", sourceDir+"g.gif", sourceDir+"h.gif",
 sourceDir+"i.gif", sourceDir+"j.gif", sourceDir+"k.gif", sourceDir+"l.gif",
 sourceDir+"m.gif", sourceDir+"n.gif", sourceDir+"o.gif", sourceDir+"p.gif",
 sourceDir+"q.gif", sourceDir+"r.gif", sourceDir+"s.gif", sourceDir+"t.gif",
 sourceDir+"u.gif", sourceDir+"v.gif", sourceDir+"w.gif", sourceDir+"x.gif",
 sourceDir+"y.gif", sourceDir+"z.gif",
 sourceDir+"image1.gif", sourceDir+"image2.gif", sourceDir+"image3.gif", sourceDir+"image4.gif",
 sourceDir+"image5.gif", sourceDir+"image6.gif", sourceDir+"lose.gif", sourceDir+"win.gif"
);

function doFunction(aFunction)
{
 if (aFunction.indexOf('(') > -1)
   eval( aFunction );
 else
   eval(aFunction+'()');
}

function endGame()
{
  gameOver = true;
  document.control.you.value = numRight;
  document.control.me.value = numWrong;
  if (doneAction != '')
    doFunction(doneAction);
}

function showHint()
{
  if (wrongLetters.indexOf(blankChar) == -1)
    wrongLetters = wrongLetters+blankChar;

   if ( wrongLetters.length < maxAttempts )
     document.hangimage.src=sourceDir+"image"+wrongLetters.length+".gif";

  document.hintForm.hint.value=thisHint;
}

function setBrowserInfo(cd, iw, ih)
{
  cellDimension = cd;
  imgWidth = iw;
  imgHeight = ih;
}

function getBrowserInfo()
{
  isOpera = (navigator.userAgent.indexOf('Opera') != -1);

  if (isOpera)
    setBrowserInfo(0, 50, 26);
  else if (navigator.appName == 'Netscape')
    setBrowserInfo(0, 49, 26);
  else
    setBrowserInfo(1, 48, 24);
}

function updateAnswer( str )
{
  for (var i=0; i < str.length; i++)
  {
    if ((lastAnswer.charAt(i) == str.charAt(i)) && (!gameStart))
      continue;
    if (str.charAt(i) == " ")
      eval('document.ans'+i+'.src="'+sourceDir+'space.gif"');
    else if (str.charAt(i) == blankChar)
      eval('document.ans'+i+'.src="'+sourceDir+'blank.gif"');
    else
      eval('document.ans'+i+'.src="'+sourceDir+str.charAt(i)+'.gif"');
  }
  lastAnswer = str;

  if (gameStart)
    for (var i=str.length; i < maxLength; i++)
       eval('document.ans'+i+'.src="'+sourceDir+'space.gif"');

  gameStart = false;
}

function arrayDelete( arrayName, delIndex )
{
  var ar = new Array();
  for (var ii = 0; ii < arrayName.length; ii++)
  {
     if (ii != delIndex)
      ar[ar.length] = arrayName[ii];
  }
  return ar;
}

function Word(aWord,aHint)
{
  this.value=aWord;
  this.hint=aHint;
  if (aWord.length > maxLength)
    maxLength = aWord.length;
}

function loadWords( wArray )
{
  var ar = new Array();

  for (var i=0; i < wArray.length; i=i+2)
    ar[ar.length] = new Word(wArray[i], wArray[i+1]);

  wordCount = ar.length;
  return ar;
}

function newPuzzle()
{
  gameOver = false;
  gameStart = true;
  usedLetters = '';
  wrongLetters = '';
  answerDisplay= '';
  lastAnswer = '';

  for (var i=0; i < 26; i++)
    eval('document.img'+alphaLower.charAt(i)+'.src="'+sourceDir+alphaLower.charAt(i)+'.gif"');

  answerIdx = Math.floor(Math.random()*wordArray.length);
  thisAnswer = (wordArray[answerIdx].value).toLowerCase();
  thisHint = wordArray[answerIdx].hint;

  if (wordArray.length > 1)
    wordArray = arrayDelete( wordArray, answerIdx );
  else
    wordArray = loadWords(words);

  for(var i=0; i<thisAnswer.length; i++)
  {
     if ( thisAnswer.charAt(i) == " " )
       answerDisplay = answerDisplay+" ";
     else
       answerDisplay = answerDisplay+blankChar;
  }

  updateAnswer(answerDisplay);

  if (isHint)
    document.hintForm.hint.value=' ';

  document.hangimage.src=sourceDir + "image0.gif";

  if ((firstRun) && (navigator.appName == 'Netscape'))
    setTimeout('netscapeLoad()',1000);

  firstRun = false;
}

function netscapeLoad()
{
  for (var i=0; i < answerDisplay.length; i++)
    if (answerDisplay.charAt(i) == blankChar)
      eval('document.ans'+i+'.src="'+sourceDir+'blank.gif"');
}

function check(character)
{
  if (gameOver) return;
  if (usedLetters.indexOf(character) == -1)
  {
    usedLetters = usedLetters+character;
    eval('document.img'+character+'.src="'+sourceDir+'space.gif"');
  }
  else
    return;

  var wrongLetter = true;
  for( i = 0; i < thisAnswer.length; i++ )
  {
    if ( thisAnswer.indexOf(character, i) == -1 ) break;

    if ( thisAnswer.charAt(i) == character )
    {
       wrongLetter = false;
       if( i == 0 )
         answerDisplay = character + answerDisplay.substring(i+1,thisAnswer.length);
       else if ( i == thisAnswer.length-1 )
         answerDisplay = answerDisplay.substring(0,i)+character;
       else
         answerDisplay = answerDisplay.substring(0,i)+character+answerDisplay.substring(i+1,thisAnswer.length);
     }
  }

  if (wrongLetter)
  {
    if (wrongLetters.indexOf(character) == -1)
      wrongLetters = wrongLetters+character;

     if ( wrongLetters.length < maxAttempts )
       document.hangimage.src=sourceDir+"image"+wrongLetters.length+".gif";
     else
     {
        updateAnswer(thisAnswer);
        document.hangimage.src = sourceDir+"lose.gif";
        numWrong++;
        endGame();
     }
  }
  else
  {
    updateAnswer(answerDisplay);

    if( answerDisplay.indexOf(blankChar) == -1 )
    {
      document.hangimage.src=sourceDir+"win.gif";
      numRight++;
      endGame();
    }
  }
}

function drawAnswer()
{
  wordArray = loadWords(words);
  for (var i=0; i < maxLength; i++)
  {
    document.writeln(
    '<img border=0 SRC=\''
    + sourceDir + 'space.gif\' name="ans'
    + i
    +'">'
    );
  }
  newPuzzle();
}

function drawControl()
{
document.writeln('<FORM name="control">');

document.writeln(
  '<TABLE border="1" bgcolor="#CCCCCC" cellspacing="'+cellDimension+'" cellpadding="'+cellDimension+'"><TR>'
  +'<TD background="'+sourceDir+'newbtn.gif" width="'+imgWidth+'" height="'+imgHeight+'"><A href="javascript:void(newPuzzle())"><IMG border=0 SRC="'+sourceDir+'space.gif" width="42" height="22" alt="new puzzle"></A></TD>'
  +'<TD background="'+sourceDir+'scores.gif" >'
  +'<IMG border=0 SRC="'+sourceDir+'space.gif" width="90" height="10"><input type="text" size="5" name="you" value="0">'
  +'<IMG border=0 SRC="'+sourceDir+'space.gif" width="90" height="10"><input type="text" size="5" name="me" value="0"></B></TD>'
  +'</TR><TR><TD colspan=3 bgcolor="#FFFFFF" align="center">'
);

document.writeln('<table border="0" bgcolor="#FFFFFF" cellpadding="3"><tr>');
for (var i=0; i < 13; i++)
{
  document.writeln('<td align="center">');

  if (navigator.appName == 'Netscape')
    document.writeln(
    '<A href=\'javascript:void(check("'
    + alphaLower.charAt(i)
    + '"))\'>'
    );
  document.writeln(
  '<img width=16 height=16 border=0 SRC=\''
  + sourceDir + alphaLower.charAt(i)
  + '.gif\' onClick=\'check("'
  + alphaLower.charAt(i)
  + '")\' name="img'
  + alphaLower.charAt(i)
  + '"></A></td>'
  );
}

document.writeln('</tr><tr>');

for (var i=13; i < 26; i++)
{
  document.writeln('<td align="center">');

  if (navigator.appName == 'Netscape')
    document.writeln(
    '<A href=\'javascript:void(check("'
    + alphaLower.charAt(i)
    + '"))\'>'
    );
  document.writeln(
  '<img border=0 width=16 height=16 SRC=\''
  + sourceDir + alphaLower.charAt(i)
  + '.gif\' onClick=\'check("'
  + alphaLower.charAt(i)
  + '")\' name="img'
  + alphaLower.charAt(i)
  + '"></A></td>'
  );
}

document.writeln('</tr></table></td></tr></TABLE>');
document.writeln('</FORM>');
}

function drawHangman()
{
  document.writeln('<img name="hangimage" src="'+sourceDir+'image0.gif" width=140 height=180>');
}

function drawHint()
{
  isHint = true;

  document.writeln('<FORM name="hintForm">');
  document.writeln(
  '<TABLE border="1" bgcolor="#CCCCCC" cellspacing="'+cellDimension+'" cellpadding="'+cellDimension+'"><TR>'
  +'<TD background="'+sourceDir+'hintbtn.gif" width="'+imgWidth+'" height="'+imgHeight+'"><A href="javascript:void(showHint())"><IMG border=0 SRC="'+sourceDir+'space.gif" width="42" height="22" alt="show hint"></A></TD>'
  +'<TD><input type="text" size="35" name="hint" value=""></TD>'
  +'</TR></TABLE></FORM>'
  );

}

getBrowserInfo();