 //Задание № 1
console.log("Задание № 1: Генератор произвольных массивов");

let arrConditons = [
  {n: 0, m: 100, count: 100},
  {n: 2, m: 5, count: 50},
  {n: 100, m: -5, count: 70},
  {n: -3, m: -10, count: 42}
];


printNewArrays(arrConditons);

function printNewArrays (array){
  for(let i = 0; i<array.length; i++){
    console.log(`Произвольный массив № ${i+1}: `);
    console.log(randomArrayCreator(array[i].n, array[i].m, array[i].count));
  }
}

function randomArrayCreator (n, m, count){
  let arr = [];
  for(let i = 0; i<count; i++){
    let range = Math.abs(m-n);
    let numberInRange = Math.round(Math.random()*range);
    let min = Math.min(n,m);
    let newNum = min + numberInRange;
    arr.push(newNum);
  }

  return arr;
}



