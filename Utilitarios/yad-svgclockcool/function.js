// Code By Webdevtrick ( https://webdevtrick.com )
(() => { 

  const secondline = document.querySelector('.line-second');
  const minuteline = document.querySelector('.line-minute');
  const hourline = document.querySelector('.line-hour');

  let rotations = [0, 0, 0] // [second, minutes, hours]
  
  function setTime() {
    const now = new Date();

    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    if (seconds === 0) {
      rotations[0]++;
    }

    if (minutes === 0 && seconds === 0) {
      rotations[1]++;
    }

    if (hours === 0 && minutes === 0 && seconds === 0) {
      rotations[2]++;
    }

    const secondsDeg = (seconds / 60 * 360) + (rotations[0] * 360);
    const minutesDeg = (minutes / 60 * 360) + (rotations[1] * 360);
    const hoursDeg = (hours / 12 * 360) + (minutes / 60 * 30) + (rotations[2] * 360);

    secondline.style.transform = `rotate(${secondsDeg}deg)`;
    minuteline.style.transform = `rotate(${minutesDeg}deg)`;
    hourline.style.transform = `rotate(${hoursDeg}deg)`;
  }

  setTime();
  setInterval(setTime, 1000);
})();
