const calculateButton = document.querySelector("[data-calculate-button]");
let interval;

calculateButton.onclick = (event) => {
  event.preventDefault();
  clearInterval(interval)
  renderResult();
};

const renderResult = () => {
  const timeLivedElement = document.querySelector("[data-time-lived]");

  interval = setInterval(() => {
    const birthDateElement = document.querySelector("[data-birth-date]");

    if (birthDateElement.value !== "") {
      const currentDate = new Date();
      const birthDate = new Date(birthDateElement.value);

      const result = (currentDate.getTime() - birthDate.getTime()) / 1000;

      if (result >= 0) {
        const years = Math.floor(result / 31536349);
        const months = Math.floor((result / 31536349) * 12);
        const weeks = Math.floor(result / 60 / 60 / 24 / 7);
        const days = Math.floor(result / 60 / 60 / 24);
        const hours = Math.floor(result / 60 / 60);
        const minutes = Math.floor(result / 60);
        const seconds = Math.floor(result);

        timeLivedElement.innerHTML = `
            <p>O seu tempo vivido até hoje é de:</p>
            <p>${years === 1 ? years + " ano" : years + " anos"}</p>
            <p>${months === 1 ? months + " mês" : months + " meses"}</p>
            <p>${weeks === 1 ? weeks + " semana" : weeks + " semanas"}</p>
            <p>${days === 1 ? days + " dia" : days + " dias"}</p>
            <p>${hours === 1 ? hours + " hora" : hours + " horas"}</p>
            <p>${minutes === 1 ? minutes + " minuto" : minutes + " minutos"}</p>
            <p>${
              seconds === 1 ? seconds + " segundo" : seconds + " segundos"
            }</p>
          `;
      } else {
        alert("Preencha com uma data de nascimento válida!");
      }
    } else {
      alert("Preencha com a sua data de nascimento!");
    }
  }, 1000);
};
