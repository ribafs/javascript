export default class Soundboard {
  constructor() {
    this.themeSRC = './assets/sounds/Dr_Mario_Theme.mp3';
    this.gameSRC = './assets/sounds/Fever_music.mp3';
    this.src = this.themeSRC;
    
    this.createAudio();

    this.muteButton = document.getElementById('mute-music');
    this.startButton = document.getElementById('start-button');
    this.lostButton = document.getElementById('lost-game');
    this.wonButton = document.getElementById('won-game');

    this.muteButton.addEventListener('click', () => {
      this.toggleMute();
      this.muteButton.classList.toggle('sound-off');
    });

    this.startButton.addEventListener('click', () => {
      this.audio.src = this.gameSRC;
    });

    this.lostButton.addEventListener('click', () => {
      this.audio.src = this.themeSRC;
    });

    this.wonButton.addEventListener('click', () => {
      this.audio.src = this.themeSRC;
    });
    
    this.playMusic();
  }

  createAudio() {
    this.audio = document.createElement('audio');
    this.audio.src = this.src;
    this.audio.style.display = "none";
    this.audio.loop = "true";
    document.body.appendChild(this.audio);
  }

  playMusic () {
    document.addEventListener('click', () => {
      this.audio.play();
    });
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
  }
}