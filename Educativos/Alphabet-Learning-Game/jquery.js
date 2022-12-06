$(document).ready(function(){
  var alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //var audioFile = document.getElementById('audiotune');
    
  $(document).keypress(function(e){
    var letter = $('#Alphabet').text();
    var audioFile = document.getElementById(letter);
    var characterkeyCode = letter.charCodeAt();
    if(e.which === characterkeyCode){
      //audioFile.pause();                                                        
      audioFile.load();                          // LOAD THE AUDIO      
   
      $('#Alphabet').hide();
      $('#Alphabet').show(3000);
      $('#image').attr('src', 'img/'+letter+'.png');       
      audioFile.play();                               // PLAY THE AUDIO
      var randomIndex = Math.floor(Math.random() * alphabets.length);
      var randomCharacter = alphabets[randomIndex];

      //audioFile.play();

      var delayMillis = 0.500; //1 second

setTimeout(function() {
  //your code to be executed after 1 second

  var randomColorChange = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    $('.random-background').css('background-color', randomColorChange);
      $('html').toggleClass('random-background');
      $('#Alphabet').html(randomCharacter);
}, delayMillis);
      
      
    }
  });
});
