const TODO_PAGE_TITLE = 'Minha Lista de Tarefas';
const TODO_PAGE_DESCRIPTION_SELECTOR = '#funcionamento';
const TODO_PAGE_DESCRIPTION = 'Clique duas vezes em um item para marcá-lo como completo';
const TODO_ADD_INPUT_SELECTOR = 'input#texto-tarefa';
const TODO_LIST_SELECTOR = 'ol#lista-tarefas';
const TODO_LIST_LINE_SELECTOR = 'ol#lista-tarefas>li';
const TODO_ADD_BUTTON_SELECTOR = 'button#criar-tarefa';
const TODO_REMOVE_ALL_BUTTON_SELECTOR = 'button#apaga-tudo';
const TODO_REMOVE_DONE_BUTTON_SELECTOR = 'button#remover-finalizados';
const TODO_SAVE_LIST_BUTTON_SELECTOR = 'button#salvar-tarefas';
const TODO_MOVE_UP_BUTTON_SELECTOR = 'button#mover-cima';
const TODO_MOVE_DOWN_BUTTON_SELECTOR = 'button#mover-baixo';
const TODO_REMOVE_SELECTED_BUTTON_SELECTOR = 'button#remover-selecionado';

const addTodo = (todo) => {
  cy.get(TODO_ADD_INPUT_SELECTOR).type(todo.content);
  cy.get(TODO_ADD_BUTTON_SELECTOR).click();
};

const addTodos = (todos = []) => todos.map(addTodo);

const checkTodoList = (todos = []) => {
  if (todos.length === 0) {
    cy.get(TODO_LIST_LINE_SELECTOR).should('not.exist');
  } else {
    cy.get(TODO_LIST_LINE_SELECTOR).each(($li, index) => {
      const todo = todos[index];
      expect($li).to.have.text(todo.content);
      if (todo.done) expect($li).to.have.class('completed');
    });
  }
};


describe('1 - Adicone à sua lista o título "Minha Lista de Tarefas" em uma tag <header>', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });
  
  it('Será verificado se sua página possui uma tag `header` com o conteúdo `Minha Lista de Tarefas`', () => {
    cy.get('header').contains(TODO_PAGE_TITLE);
  });
});

describe('2 - Adicione abaixo do título um pequeno e discreto parágrafo com id="funcionamento" e com o texto "Clique duas vezes em um item para marcá-lo como completo"', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificado que existe na sua página um elemento com o id `funcionamento` com o conteúdo `Clique duas vezes em um item para marcá-lo como completo`', () => {
    cy.get(TODO_PAGE_DESCRIPTION_SELECTOR).contains(TODO_PAGE_DESCRIPTION);
  });
});

describe('3 - Adicione um input com o id="texto-tarefa" onde o usuário poderá digitar o nome do item que deseja adicionar à lista', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificada a existência de um elemento do tipo `input` com o id `texto-tarefa`', () => {
    cy.get(TODO_ADD_INPUT_SELECTOR).should('exist');
  });
});

describe('4 - Adicione uma lista ordenada de tarefas com o id="lista-tarefas"', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificada a existência de um elemento `ol` com o id `lista-tarefas`', () => {
    cy.get(TODO_LIST_SELECTOR).should('exist');
  });
});

describe('5 - Adicione um botão com id="criar-tarefa" e, ao clicar nesse botão, um novo item deverá ser criado ao final da lista e o texto do input deve ser limpo', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificada a existência de um elemento do tipo `button` com o id `criar-tarefa', () => {
    cy.get(TODO_ADD_BUTTON_SELECTOR).should('exist');
  });

  it('No campo de input será digitado o texto de uma tarefa qualquer e, em seguida, clicar-se-á no botão de criar tarefa. Será verificado que, após o clique, o texto digitado aparece na lista e desaparece do input', () => {
    const todo1 = {
      content: 'minha primeira tarefa',
    };

    addTodo(todo1);
    checkTodoList([todo1]);
    cy.get(TODO_ADD_INPUT_SELECTOR).should('have.value', '');
  });

  it('A adição de elementos na lista será feita algumas vezes, e será checado se todos os itens criados permanecem na lista na medida em que novos são adicionados', () => {
    const todo1 = {
      content: 'minha primeira tarefa',
    };

    const todo2 = {
      content: 'minha segunda tarefa',
    };

    addTodo(todo1);
    checkTodoList([todo1]);
    addTodo(todo2);
    checkTodoList([todo1, todo2]);
    cy.get(TODO_ADD_INPUT_SELECTOR).should('have.value', '');
  });
});

describe('6 - Ordene os itens da lista de tarefas por ordem de criação', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Três itens serão criados na lista e será checado se eles estão ordenados por ordem de criação - ou seja, primeiro o primeiro item criado, depois o segundo, e assim por diante', () => {
    const todo1 = {
      content: 'minha tarefa',
    };

    const todo2 = {
      content: 'minha outra tarefa',
    };

    const todo3 = {
      content: 'minha terceira tarefa',
    };

    addTodo(todo1);
    checkTodoList([todo1]);
    addTodo(todo2);
    checkTodoList([todo1, todo2]);
    addTodo(todo3);
    checkTodoList([todo1, todo2, todo3]);
  });
});

describe('7 - Clicar em um item da lista deve alterar a cor de fundo do item para cinza rgb(128,128,128)', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificado que, ao se carregar a página, os itens da lista **não tem** o estilo CSS `background-color: rgb(128, 128, 128)`', () => {
    const todos = [
      {
        content: 'uma tarefa qualquer',
      },
      {
        content: 'uma outra tarefa atoa',
      },
    ];

    addTodos(todos);
    checkTodoList(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .should('not.have.css', 'background-color', 'rgb(128, 128, 128)');
  });

  it('Será verificado que, ao se clicar em um item da lista, ele passa a ter o estilo CSS `background-color: rgb(128, 128, 128)`', () => {
    const todos = [
      {
        content: 'uma tarefa qualquer',
      },
      {
        content: 'uma outra tarefa atoa',
      },
    ];

    addTodos(todos);
    checkTodoList(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .click()
      .then(($li) => {
        expect($li).to.have.css('background-color', 'rgb(128, 128, 128)');
      });
  });
});

describe('8 - Não deve ser possível selecionar mais de um elemento da lista ao mesmo tempo', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificado que, quando um elemento da lista é selecionado, o elemento selecionado previamente deixa de sê-lo. Isso é verificado através da presença ou não do estilo `background-color: rgb(128, 128, 128)` no elemento', () => {
    const todos = [
      {
        content: 'uma tarefa qualquer',
      },
      {
        content: 'uma outra tarefa atoa',
      },
    ];

    addTodos(todos);
    checkTodoList(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .should('not.have.css', 'background-color', 'rgb(128, 128, 128)');

    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .click()
      .then(($li) => {
        expect($li).to.have.css('background-color', 'rgb(128, 128, 128)');
      });

    cy.get(TODO_LIST_LINE_SELECTOR)
      .last()
      .click()
      .then(($li) => {
        expect($li).to.have.css('background-color', 'rgb(128, 128, 128)');
      });

    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .should('not.have.css', 'background-color', 'rgb(128, 128, 128)');
  });
});

describe('9 - Clicar duas vezes em um item, faz com que ele seja riscado, indicando que foi completo. Deve ser possível desfazer essa ação clicando novamente duas vezes no item', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificado que, antes da ação ser disparada, o elemento adicionado à lista não tem nem a classe `completed` nem o estilo `line-through solid rgb(0, 0, 0)`', () => {
    const todos = [
      {
        content: 'já terminei essa tarefa',
      },
      {
        content: 'está eu ainda não terminei',
      },
    ];

    addTodos(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .should('not.have.class', 'completed');

    cy.get(TODO_LIST_LINE_SELECTOR).should(
      'not.have.css',
      'text-decoration',
      'line-through solid rgb(0, 0, 0)',
    );
  });

  it('Será verificado que a ação pedida é disparada mediante duplo clique no elemento da lista e que os elementos da lista completos tem em si a classe `completed` e a propriedade `text-decoration` com o valor `line-through solid rgb(0, 0, 0)`', () => {
    const todos = [
      {
        content: 'já terminei essa tarefa',
      },
      {
        content: 'está eu ainda não terminei',
      },
    ];

    addTodos(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .dblclick();

    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .should('have.class', 'completed');

    cy.get('.completed').should(
      'have.css',
      'text-decoration',
      'line-through solid rgb(0, 0, 0)',
    );
  });

  it('Será verificado que, com um segundo duplo clique, um elemento completo deixa de sê-lo', () => {
    const todos = [
      {
        content: 'já terminei essa tarefa',
      },
      {
        content: 'está eu ainda não terminei',
      },
    ];

    addTodos(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .dblclick()
      .dblclick();

    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .should('not.have.class', 'completed');

    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .should('not.have.css', 'text-decoration', 'line-through solid rgb(0, 0, 0)');
  });
});

describe('10 - Adicione um botão com id="apaga-tudo" que quando clicado deve apagar todos os itens da lista', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificado que existe um elemento `button` com o id `apaga-tudo`', () => {
    cy.get(TODO_REMOVE_ALL_BUTTON_SELECTOR).should('exist');
  });

  it('Será verificado que, dado que uma lista possui tarefas, um clique no botão a deixa vazia', () => {
    const todos = [
      {
        content: 'blablabla',
      },
      {
        content: 'hahahahaha',
      },
    ];

    addTodos(todos);
    cy.get(TODO_REMOVE_ALL_BUTTON_SELECTOR).click();
    checkTodoList();
  });
});

describe('11 - Adicione um botão com id="remover-finalizados" que quando clicado remove **somente** os elementos finalizados da sua lista', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificado que existe um elemento `button` com o id `remover-finalizados`', () => {
    cy.get(TODO_REMOVE_DONE_BUTTON_SELECTOR).should('exist');
  });

  it('Será verificado que, ao clicar no botão, todos os elementos marcados como feitos são removidos da lista', () => {
    const todo1 = {
      content: 'vou terminar essa tarefa logo',
    };

    const todo2 = {
      content: 'essa tarefa eu vou demorar para finalizar',
    };

    const todo3 = {
      content: 'essa tarefa tbm vai demorar...',
    };

    const todos = [todo1, todo2, todo3];
    addTodos(todos);
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(2)`).dblclick();
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(3)`).dblclick();
    cy.get(TODO_REMOVE_DONE_BUTTON_SELECTOR).click();
    checkTodoList([todo1]);
  });
});

describe('12 - Adicione um botão com id="salvar-tarefas" que salve o conteúdo da lista. Se você fechar e reabrir a página, a lista deve continuar no estado em que estava', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificado que existe um elemento `button` com o id `salvar-tarefas`', () => {
    cy.get(TODO_SAVE_LIST_BUTTON_SELECTOR).should('exist');
  });

  it('Será verificado que, quando a lista tem vários elementos, alguns dos quais marcados como finalizados, um recarregamento da página mantém a lista exatamente como está.', () => {
    const todo1 = {
      content: 'primeira tarefa a ser salva',
    };

    const todo2 = {
      content: 'esta tarefa será salva também',
    };

    const todo3 = {
      content: 'mais uma para salvar',
    };

    const todos = [todo1, todo2, todo3];
    addTodos(todos);
    checkTodoList(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .first()
      .dblclick();

    cy.get(TODO_SAVE_LIST_BUTTON_SELECTOR).click();
    cy.reload();
    const newTodosState = [
      {
        ...todo1,
        done: true,
      },
      todo2,
      todo3,
    ];
    checkTodoList(newTodosState);
  });
});

describe('13 - Adicione dois botões, um com id="mover-cima" e outro com id="mover-baixo", que permitam mover o item selecionado para cima ou para baixo na lista de tarefas', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificada a existência de dois elementos `button`, um com o id `mover-cima` e o outro com o id `mover-baixo`', () => {
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).should('exist');
    cy.get(TODO_MOVE_DOWN_BUTTON_SELECTOR).should('exist');
  });

  it('Será verificado que, dado que diversos elementos foram acrescentados à lista, movimentá-los de formas diversas os deixa nas posições esperadas', () => {
    const todos = [
      {
        content: 'primeira tarefa',
      },
      {
        content: 'segunda tarefa',
      },
      {
        content: 'terceira tarefa',
      },
      {
        content: 'quarta tarefa',
      },
    ];

    const newTodosState = [todos[3], todos[2], todos[1], todos[0]];
    addTodos(todos);
    checkTodoList(todos);
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(2)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(4)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(3)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(1)`).click();
    cy.get(TODO_MOVE_DOWN_BUTTON_SELECTOR).click();
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(4)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(3)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    checkTodoList(newTodosState);
  });

  it('Será verificado que, caso algum elemento esteja finalizado, este status deve persistir ainda que se mova o elemento', () => {
    const todos = [
      {
        content: 'primeira tarefa',
        done: true,
      },
      {
        content: 'segunda tarefa',
      },
    ];

    addTodos(todos);
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(1)`)
      .click()
      .dblclick();
    cy.get(TODO_MOVE_DOWN_BUTTON_SELECTOR).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    checkTodoList(todos);
  });

  it('Será verificado que, caso nenhum elemento esteja selecionado, clicar nos botões não altera a lista', () => {
    const todos = [
      {
        content: 'primeira tarefa',
      },
      {
        content: 'segunda tarefa',
      },
      {
        content: 'terceira tarefa',
      },
      {
        content: 'quarta tarefa',
      },
    ];

    addTodos(todos);
    checkTodoList(todos);
    cy.get(TODO_MOVE_DOWN_BUTTON_SELECTOR).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    checkTodoList(todos);
  });

  it('Será verificado que um elemento que esteja selecionado deve se manter selecionado mesmo depois de movido', () => {
    const todos = [
      {
        content: 'primeira tarefa',
      },
      {
        content: 'segunda tarefa',
      },
    ];

    addTodos(todos);
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(1)`).click();
    cy.get(TODO_MOVE_DOWN_BUTTON_SELECTOR).click();
    const newTodos = [
      {
        content: 'segunda tarefa',
      },
      {
        content: 'primeira tarefa',
      },
    ];

    checkTodoList(newTodos);
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    checkTodoList(todos);
  });

  it('_Caso especial!_ Será verificado que, caso se tente subir o elemento no topo da lista ou, caso se tente descer o último elemento da lista, esta não deve ser alterada', () => {
    const todos = [
      {
        content: 'primeira tarefa',
      },
      {
        content: 'segunda tarefa',
      },
    ];

    addTodos(todos);
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(1)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();
    checkTodoList(todos);
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(2)`).click();
    cy.get(TODO_MOVE_DOWN_BUTTON_SELECTOR).click();
    checkTodoList(todos);
  });
});

describe('14 - Adicione um botão com id="remover-selecionado" que, quando clicado, remove o item selecionado', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('./index.html');
  });

  it('Será verificada a presença de um elemento `button` com um id `remover-selecionado`', () => {
    cy.get(TODO_REMOVE_SELECTED_BUTTON_SELECTOR).should('exist');
  });

  it('Será verificado que, no clicar no botão, somente o elemento selecionado é removido', () => {
    const todo1 = {
      content: 'não posso remover essa tarefa',
    };
    const todo2 = {
      content: 'essa tarefa aqui eu posso remover',
    };

    const todos = [todo1, todo2];
    addTodos(todos);
    checkTodoList(todos);
    cy.get(TODO_LIST_LINE_SELECTOR)
      .last()
      .click();
    cy.get(TODO_REMOVE_SELECTED_BUTTON_SELECTOR).click();
    checkTodoList([todo1]);
  });
});
