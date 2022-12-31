function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.key}"]`)
  const key = document.querySelector(`.key[data-key="${e.key}"]`)
  let code

  if (e.key) {
    // it was a keypress, get the key as usual
    code = e.key
  } else {
    // it was a click.  Read the key from the div that was clicked
    code = this.dataset.key
  }

  if (!audio) return
  audio.currentTime = 0
  audio.play()
  key.classList.add('playing')
}


function removeTransition(e) {
  if (e.propertyName !== 'transform') return
  this.classList.remove('playing')
}


const allKeys = document.querySelectorAll('.key').length

for (let i = 0; i < allKeys; i++) {
  document.querySelectorAll('.key')[i].addEventListener('click', function (e) {
    let code = this.dataset.key
    const audio = document.querySelector(`audio[data-key="${code}"]`)
    const key = document.querySelector(`.key[data-key="${code}"]`)

    if (e.keyCode) {
      // it was a keypress, get the keycode as usual
      code = e.keyCode
    } else {
      // it was a click.  Read the keycode from the div that was clicked
      code = this.dataset.key
    }

    if (!audio) return
    audio.currentTime = 0
    audio.play()
    key.classList.add('playing')
  })
}

const keys = document.querySelectorAll('.key')

keys.forEach(key => key.addEventListener('transitionend', removeTransition))


window.addEventListener('keydown', (e) => {
  if (e.repeat) return   //The return on repeat property will block the constant key press on holding a key. 
  playSound(e)
})