  // создаем и вовзращаем заголовок приложения
  function createAppTitle(title){
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm(){
    let form = document.createElement('form');
    let input = document.createElement('input');

    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

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
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItemElement(todoItem, {onDone, onDelete}){
    const doneClass = 'list-group-item-success';

    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
   
    item.classList.add('list-group-item', 'd-flex','justify-content-between', 'align-items-center');
    item.textContent = todoItem.name;
    if (todoItem.done){
      item.classList.add(doneClass);
    }

    // item.setAttribute('data-num');
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    
    deleteButton.textContent = 'Удалить';

    doneButton.addEventListener('click', () =>{
      onDone({todoItem, element: item});
      item.classList.toggle(doneClass, todoItem.done);
    });
    deleteButton.addEventListener('click', () =>{
      onDelete({todoItem, element: item});
      // if (confirm('Вы уверены?')){
      //   item.remove();
      // }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
  
    return item;
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

  async function createTodoApp(container, {
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

    // Отправляем запрос на список всех дел

    todoItemList.forEach(todoItem => {
      const todoItemElement = createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement);
    })

    todoItemForm.form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      };

      const todoItem = await onCreateFormSubmit({
        owner,
        name: todoItemForm.input.value.trim(),
      })

      const todoItemElement = createTodoItemElement(todoItem, handlers);
      console.log(todoItemElement);
      console.log(todoItem.name);
      // addNewTodos(todoItemForm.input.value, array, id);

      todoList.append(todoItemElement);
      todoItemForm.input.value = '';

      verificationInputField(todoItemForm.input, todoItemForm.button);
    });
  }
  

  export {createTodoApp};