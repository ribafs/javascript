const startButton = document.querySelector("[data-start]");
const pauseButton = document.querySelector("[data-pause]");
const stopButton = document.querySelector("[data-stop]");
const timeElement = document.querySelector("[data-time]");
let seconds = 0,
  minutes = 0,
  hours = 0;
let interval;

const renderTime = (seconds, minutes, hours) => {
  const hoursValue = hours < 10 ? "0" + hours : hours;
  const minutesValue = minutes < 10 ? "0" + minutes : minutes;
  const secondsValue = seconds < 10 ? "0" + seconds : seconds;

  timeElement.innerHTML = hoursValue + ":" + minutesValue + ":" + secondsValue;
};

const startTime = (startValue) => {
  startButton.setAttribute("disabled", "true");
  pauseButton.removeAttribute("disabled");
  stopButton.removeAttribute("disabled");

  if (startValue === "start" || startValue === "restart") {
    (seconds = seconds != 0 ? -1 : 0), (minutes = 0), (hours = 0);
    interval = setInterval(() => {
      seconds++;
      while (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      while (minutes === 60) {
        minutes = 0;
        hours++;
      }
      renderTime(seconds, minutes, hours);
    }, 1000);
  } else if (startValue === "continue") {
    interval = setInterval(() => {
      seconds++;
      while (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      while (minutes === 60) {
        minutes = 0;
        hours++;
      }
      renderTime(seconds, minutes, hours);
    }, 1000);
  }
};

const pauseTime = () => {
  startButton.removeAttribute("disabled");
  startButton.setAttribute("data-start", "continue");
  startButton.innerHTML = "Continuar";
  pauseButton.setAttribute("disabled", "true");

  clearInterval(interval);
};

const stopTime = () => {
  startButton.removeAttribute("disabled");
  startButton.setAttribute("data-start", "restart");
  pauseButton.setAttribute("disabled", "true");
  stopButton.setAttribute("disabled", "true");
  startButton.innerHTML = "Reiniciar";

  clearInterval(interval);
};

startButton.onclick = () => {
  const startValue = startButton.getAttribute("data-start");
  startTime(startValue);
};

pauseButton.onclick = () => {
  pauseTime();
};

stopButton.onclick = () => {
  stopTime();
};
