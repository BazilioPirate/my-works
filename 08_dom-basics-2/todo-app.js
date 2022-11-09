(function(){
  function createAppTitle(title){
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm(){
    const form = document.createElement('form');
    const input = document.createElement('input');

    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group—append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    verificationInputField(input, button);

    return {
      form,
      input,
      button
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList(){
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem({name, done}){
    const item = document.createElement('li');
    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex','justify-content-between', 'align-items-center');
    item.textContent = name;
    if (done === true){
      item.classList.toggle('list-group-item-success');
    }

    item.setAttribute('data-num', dataCounter++);
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  };

  function verificationInputField(input, button){
    button.disabled = true;
    input.addEventListener('input', ()=>{
      if(input.value){
        return button.disabled = false;
      }else{
        return button.disabled = true;
      }
    });
  }

  function addNewTodos(item, array, id){
    let newObj = {
      name: item,
      done: false,
    }
    array.push(newObj);
    pushToLocalStorage(newObj, id);
    return array;
  }

  function changeDone(item, array){
    const checked = item.classList.contains("list-group-item-success");
    let index = parseInt(item.getAttribute('data-num'));
    for (let i = 0; i<array.length; i++){
      if(index === i){
        array[i].done = checked;
      }
    }
  }

  function changeDataNum(){
    const liList = document.querySelectorAll('li');
    let newDataNum = 0;
    for(let i = 0, length = liList.length; i<length; i++){
      liList[i].setAttribute('data-num', newDataNum++)
    }
    dataCounter = newDataNum;
  }

  function pushToLocalStorage(todo, id){
    let jsonTodo = JSON.stringify(todo);
    localStorage.setItem(`${id}.todo-${todoCounter++}`, jsonTodo);
  }

  function changeDoneToLocalStorage(array, id){
    for(let i = 0; i<array.length; i++){
      let jsonTodo = JSON.stringify(array[i]);
      localStorage.setItem(`${id}.todo-${i}`, jsonTodo);
      todoCounter = i+1;
    }
  }

  function changeLocalStorage(array, id){
    for(let i = 0; i<=array.length; i++){
      localStorage.removeItem(`${id}.todo-${i}`);
    }
    for(let i = 0; i<array.length; i++){
      let jsonTodo = JSON.stringify(array[i]);
      localStorage.setItem(`${id}.todo-${i}`, jsonTodo);
      todoCounter = i+1;
    }
    if(array.length < 1){
      todoCounter = 0;
      return todoCounter;
    }
  }

  function parseFromLocalStorage(array, id){
    for(let i = 0; i<localStorage.length; i++){
      let todo = localStorage.getItem(`${id}.todo-${i}`);
      if(todo != null){
        let jsonTodo = JSON.parse(todo);
        array.push(jsonTodo);
      }
    }
    return array;
  }

  function createTodosFromArray(list, array, id){
    for(let i = 0; i<array.length; i++){
      let newTodo = createTodoItem(array[i]);
      list.append(newTodo.item);
      todoCounter = array.length;
      newTodo.doneButton.addEventListener('click', function(){
        newTodo.item.classList.toggle('list-group-item-success');
        changeDone(newTodo.item, array);
        changeDataNum();
        changeDoneToLocalStorage(array, id);
      });
      newTodo.deleteButton.addEventListener('click', function(){
        let index = parseInt(newTodo.item.getAttribute('data-num'));
        if (confirm('Вы уверены?')){
          newTodo.item.remove();
          for(let i = 0; i<array.length; i++){
            if(index === i){
              array.splice(i, 1);
              changeLocalStorage(array, id);
              changeDataNum();
            }
          }
        }
      });
    }
  }

  function createTodoApp(container, title = 'Список дел', array = [],id){
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    parseFromLocalStorage(array, id);

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    createTodosFromArray(todoList, array, id);

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let obj = {name: todoItemForm.input.value, done: false}
      let todoItem = createTodoItem(obj);
      addNewTodos(todoItemForm.input.value, array, id);

      todoItem.doneButton.addEventListener('click', function(){
        todoItem.item.classList.toggle('list-group-item-success');
        changeDone(todoItem.item, array);
        changeDataNum();
        changeDoneToLocalStorage(array, id);
      });
      todoItem.deleteButton.addEventListener('click', function(){
        let index = parseInt(todoItem.item.getAttribute('data-num'));
        if (confirm('Вы уверены?')){
          todoItem.item.remove();
          for(let i = 0; i<array.length; i++){
            if(index === i){
              array.splice(i, 1);
              changeLocalStorage(array, id);
              changeDataNum();
            }
          }
        }
      });

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      verificationInputField(todoItemForm.input, todoItemForm.button);
    });
  }
  window.createTodoApp = createTodoApp;

})();

