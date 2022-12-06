/* eslint-disable no-shadow */
/* eslint-disable sonarjs/no-duplicate-string */

// requisito 8

function removeBg() {
  const myLi = document.querySelectorAll('.list');
  for (let i = 0; i < myLi.length; i += 1) {
    myLi[i].classList.remove('gray');
  }
}

// requisito 7

function changeBgList() {
  const myLi = document.querySelectorAll('.list');

  for (let i = 0; i < myLi.length; i += 1) {
    myLi[i].addEventListener('click', () => {
      removeBg();
      myLi[i].classList.add('gray');
    });
  }
}

// requisito 5

function addTask() {
  const input = document.getElementById('texto-tarefa');
  const buttom = document.getElementById('criar-tarefa');
  const myOl = document.getElementById('lista-tarefas');

  buttom.addEventListener('click', () => {
    if (input.value === '') {
      alert('Você precisa escrever uma tarefa para ser adicionada.');
    } else {
      const myLi = document.createElement('li');
      myLi.innerHTML = input.value;
      myLi.className = 'list';
      myOl.appendChild(myLi);
      input.value = '';
    }
    changeBgList();
  });
}

function addTaskEnter() {
  const input = document.getElementById('texto-tarefa');
  const myOl = document.getElementById('lista-tarefas');

  input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && input.value.length > 0) {
      const newLi = document.createElement('li');
      newLi.innerHTML = input.value;
      newLi.className = 'list';
      myOl.appendChild(newLi);
      input.value = '';
    }
    changeBgList();
  });
}

// requisito 9

function addRisk() {
  const myUl = document.getElementById('lista-tarefas');

  myUl.addEventListener('dblclick', (event) => {
    if (event.target.classList.contains('completed')) {
      event.target.classList.remove('completed');
      return;
    } // se o if for atendido, ele pula fora da função e não faz a linha 72 por causa do return
    event.target.classList.add('completed');
  });
}

// requisito 10

function clearButton() {
  const button = document.getElementById('apaga-tudo');
  const myUl = document.getElementById('lista-tarefas');

  button.addEventListener('click', () => {
    myUl.textContent = '';
  });
}

clearButton();

// requisito 11

function clearCompleted() {
  const button = document.getElementById('remover-finalizados');
  const myOl = document.getElementById('lista-tarefas');

  button.addEventListener('click', () => {
    const completeds = document.querySelectorAll('.completed');
    for (let i = 0; i < completeds.length; i += 1) {
      myOl.removeChild(completeds[i]);
    }
  });
}

clearCompleted();

// requisito 12

function saveList() {
  const button = document.getElementById('salvar-tarefas');

  button.addEventListener('click', () => {
    const myLi = document.querySelectorAll('.list');
    const array = [];
    for (let i = 0; i < myLi.length; i += 1) {
      const objeto = {
        tarefa: myLi[i].innerText,
        classes: myLi[i].className,
      };
      array.push(objeto);
      localStorage.setItem('myLi', JSON.stringify(array));
    }
  });
}

saveList();

function recuperateItens() {
  const myOl = document.getElementById('lista-tarefas');
  const localLi = JSON.parse(localStorage.getItem('myLi'));

  if (localLi) {
    for (let i = 0; i < localLi.length; i += 1) {
      const newLi = document.createElement('li');
      newLi.innerText = localLi[i].tarefa;
      newLi.className = localLi[i].classes;
      myOl.appendChild(newLi);
    }
  }
}

// requisito 13

function moveUp() {
  const myOl = document.getElementById('lista-tarefas');
  const greyList = document.querySelector('.gray');
  if (greyList && greyList.previousSibling) {
    myOl.insertBefore(greyList, greyList.previousSibling);
  }
}

const button = document.getElementById('mover-cima');
button.addEventListener('click', moveUp);

function moveDown() {
  const myOl = document.getElementById('lista-tarefas');
  const greyList = document.querySelector('.gray');
  if (greyList && greyList.nextSibling) {
    myOl.insertBefore(greyList.nextSibling, greyList);
  }
}

const button2 = document.getElementById('mover-baixo');
button2.addEventListener('click', moveDown);

// requisito 14

function clearSelected() {
  const button = document.getElementById('remover-selecionado');
  const myOl = document.getElementById('lista-tarefas');

  button.addEventListener('click', () => {
    const selected = document.querySelector('.gray');
    myOl.removeChild(selected);
  });
}

clearSelected();

window.onload = () => {
  recuperateItens();
  addTask();
  addTaskEnter();
  changeBgList();
  addRisk();
};
