const date = new Date();
const hours = date.getHours();
const minutes =
  date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
const time = hours + ':' + minutes;

document.querySelector('.time').innerHTML = time;

const inputScreen = document.querySelector('.screen');

function handleSubmit(e) {
  e.preventDefault();
}

function insertValue(value) {
  inputScreen.value += value;
}

function deleteValue() {
  inputScreen.value = inputScreen.value.slice(0, -1);
}

function clean() {
  inputScreen.value = '';
}

function result() {
  if (inputScreen.value.length > 0) {
    inputScreen.value = eval(inputScreen.value);
  }
}
