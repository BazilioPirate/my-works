 //Задание № 3
console.log();
console.log("Задание № 3");

// Пример № 1
console.log("Пример № 1");
let n = 0;
let m = 100;

let range = Math.abs(m-n);
// округленное число от 0 до range
let numberInRange = Math.round(Math.random()*range);
let min = Math.min(n,m)
let newNum = min + numberInRange;
if(newNum%2 === 0){
newNum += 1;
}
console.log(newNum);

 // Пример № 2
console.log("Пример № 2");
n = 2;
m = 5;

range = Math.abs(m-n);
numberInRange = Math.round(Math.random()*range);
min = Math.min(n,m)
newNum = min + numberInRange;
if(newNum%2 === 0){
 newNum += 1;
}
console.log(newNum);

// Пример № 3
console.log("Пример № 3");
n = 100;
m = -5;

range = Math.abs(m-n);
numberInRange = Math.round(Math.random()*range);
min = Math.min(n,m)
newNum = min + numberInRange;
if(newNum%2 === 0){
newNum += 1;
}
console.log(newNum);

// Пример № 4
console.log("Пример № 4");
n = -3;
m = -10;

range = Math.abs(m-n);
numberInRange = Math.round(Math.random()*range);
min = Math.min(n,m)
newNum = min + numberInRange;
if(newNum%2 === 0){
  newNum += 1;
}
console.log(newNum);
