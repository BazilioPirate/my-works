let user01 = {
  name: "iVaN",
  surname: "iVaNov"
};

let user02 = {
  name: "Lev",
  surname: "Gumilev"
};

let user03 = {
  name: "pEtr",
  surname: "Tolstoy"
};

print (user01.name, user01.surname);
print (user02.name, user02.surname);
print (user03.name, user03.surname);

function print(name, surname){
  console.log('----------------------------------');
  console.log("Исходное имя: ", name);
  console.log("Исходная фамилия: ", surname);
  compare (name, surname);
}

function compare(name, surname){
  let newName = validate(name);
  name.includes(newName) ? console.log('Имя осталось без изменений: ', newName) : console.log('Имя было преобразовано: ', newName);

  let newSurname = validate(surname);
  surname.includes(newSurname) ? console.log('Фамилия осталась без изменений: ', newSurname) : console.log('Фамилия была преобразована: ', newSurname);
}


function validate(name){
  let validateName = name.substr(0,1).toUpperCase() + name.substr(1).toLowerCase();
  return validateName;
}

