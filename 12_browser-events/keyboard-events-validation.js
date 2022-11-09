document.addEventListener('DOMContentLoaded', event => {
  const family = document.getElementById('family');
  const name = document.getElementById('name');
  const secondName = document.getElementById('secondName');
  const form = document.getElementById('form');
  const list = document.querySelector('.list-group');

  createEventsListener({family, name, secondName});

  form.addEventListener('submit', e =>{
    e.preventDefault();
    console.log(form);
    let obj = {family: family.value,
      name: name.value,
      secondName: secondName.value
    };

    let person = createPersonItem(obj);
    list.append(person);

    family.value = '';
    name.value = '';
    secondName.value = '';
  });

  function validateKeypress(event){
    const newValue = event.key.charCodeAt();

    !(newValue >=1040 && newValue<=1103  || newValue == 32 || newValue == 45) ? event.preventDefault() : 1;
  };

  function validateInput(e){
    let value = e.target.value;
    value = value.replace(/[^а-яА-ЯЁё\s\-]/gi, ''); // находим и заменяем на пустоту все буквы которые не входят в диапазон а-яА-ЯЁё, а  также пробел, и дефис - глобальный поиск
    value = value.replace(/^[\s\-]+/g, '');
    // убираем пробелы и дефисы которые находятся в начале строки, метод многократного поиска
    value = value.replace(/[\s\-]+$/g, '');
    // убираем пробелы и дефисы которые находятся в конце строки
    value = value.replace(/\s{2,}/g, ' '); // найти и заменить  пробелы находящиеся более двух символов подряд - одним символом пробела
    value = value.replace(/\-{2,}/g, '-'); // найти и заменить  дефисы находящиеся более двух символов подряд - одним символом дефиса

    if(value === ''){
      e.target.value = '';
    }else{
      e.target.value = value[0].toUpperCase() + value.slice(1).toLowerCase();
    };
    return e.target.value;
  };

  function createPersonItem(person){
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'mb-2', 'border', 'border-2', 'border-dark', 'rounded-pill');
    item.textContent = person.family + ' ' + person.name + ' ' + person.secondName;

    return item;
  };

  function createEventsListener(obj){
    for (let item in obj){
      obj[item].addEventListener('keypress', validateKeypress);
      obj[item].addEventListener('blur', validateInput);
    }
  };



});
