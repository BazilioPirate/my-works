//Задание № 4

//Вариант 1
console.log('Вариант 1:');
let numberDaysArray = [];

let weekDaysName = [
  'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'
]

for(let i = 0, j = 1; i<=30; i++, j++){
  if(j>6){
    j = 0;
  }
  numberDaysArray.push(i+1);
  console.log(`${numberDaysArray[i]} января, ${weekDaysName[j]}`)
}

//Вариант 2
console.log('Вариант 2:');
let numberDaysArray2 = [];

let weekDaysName2 = [
  'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'
]

let dayPosition = 2;

for(let i = 0; i<=30; i++){
  numberDaysArray2.push(i+1);
  console.log(`${numberDaysArray2[i]} января, ${weekDaysName2[(dayPosition + i) % 7]}`)
}


