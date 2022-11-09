export let host = '';
let dataCounter = 0;

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

function createTodoItemElement(todoItem, array, {onDone, onDelete}){
  const doneClass = 'list-group-item-success';
  const item = document.createElement('li');
  const buttonGroup = document.createElement('div');
  const doneButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  item.classList.add('list-group-item', 'd-flex','justify-content-between', 'align-items-center');
  item.textContent = todoItem.name;
  if (todoItem.done){
    item.classList.toggle(doneClass);
  }

  item.setAttribute('data-num', dataCounter++);

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');

  deleteButton.textContent = 'Удалить';

  doneButton.addEventListener('click', () =>{
    item.classList.toggle(doneClass);
    todoItem.done = !todoItem.done;
    changeDataNum(dataCounter);
    onDone(todoItem, array);
  });
  deleteButton.addEventListener('click', () =>{
    let index = parseInt(item.getAttribute('data-num'));
    if (confirm('Вы уверены?')){
      item.remove();
      for(let i = 0; i<array.length; i++){
        if(index === i){
          array.splice(i, 1);
          onDelete(array);
          changeDataNum(dataCounter);
        };
      };
    };
  });

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

function changeDataNum(){
  const liList = document.querySelectorAll('li');
  let newDataNum = 0;
  for(let i = 0, length = liList.length; i<length; i++){
    liList[i].setAttribute('data-num', newDataNum++)
  }

  return newDataNum;
}

function createTodosFromArray(list, array, handlers){
  for(let i = 0; i<array.length; i++){
    let newTodo = createTodoItemElement(array[i], array, handlers);
    list.append(newTodo.item);
  }
}

function createTodoApp(container,{
  title,
  owner,
  todoItemList = [],
  onCreateFormSubmit,
  onDoneClick,
  onDeleteClick,
 }){

  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();
  const handlers = {onDone: onDoneClick, onDelete: onDeleteClick};

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  host = owner;

  createTodosFromArray(todoList, todoItemList, handlers);

  todoItemForm.form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!todoItemForm.input.value) {
      return;
    }

    let obj = {name: todoItemForm.input.value, done: false}

    onCreateFormSubmit(
      obj, todoItemList, owner
    );

    const todoItemElement = createTodoItemElement(obj, todoItemList, handlers);

    todoList.append(todoItemElement.item);
    todoItemForm.input.value = '';
    verificationInputField(todoItemForm.input, todoItemForm.button);
  });
}
export {createTodoApp};
