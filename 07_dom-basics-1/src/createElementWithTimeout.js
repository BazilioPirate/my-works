let timeoutId;
let root = document.getElementById('root');
let inputCont = document.createElement('input');
let headCont = document.createElement('h2');
root.append(inputCont);
root.append(headCont);

headCont.textContent = 'Здесь будет ваш персональный заголовок';

document.addEventListener('input', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    headCont.textContent = inputCont.value;
  }, 300);
});

