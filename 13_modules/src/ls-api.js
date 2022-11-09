import { host } from "./ls-view.js";

export let todoCounter = 0;


export function parseFromLocalStorage(owner){
  let todo = localStorage.getItem(`${owner}.todo`);
  
  if(todo != null){
    let jsonTodo = JSON.parse(todo);
    return jsonTodo;
  }
}

export function pushToLocalStorage(todo, array){
  array.push(todo);
  let jsonTodo = JSON.stringify(array);
  localStorage.setItem(`${host}.todo`, jsonTodo);

}

export function changeDoneToLocalStorage(item, array){
  for(let i = 0; i<array.length; i++){
    if(array[i].name ===  item.name){
      array.splice(i, 1, item);
    }
  }
  localStorage.removeItem(`${host}.todo`);
  let jsonTodo = JSON.stringify(array);
  localStorage.setItem(`${host}.todo`, jsonTodo);
}

export function deleteItemFromLocalStorage(array,){
  localStorage.removeItem(`${host}.todo`);
  let jsonTodo = JSON.stringify(array);
  localStorage.setItem(`${host}.todo`, jsonTodo);
}

