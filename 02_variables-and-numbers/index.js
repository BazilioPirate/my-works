// Задание № 1

console.log("Вариант № 1");
// Прямоуголник № 1

let x1 = 2;
let y1 = 3;

let x2 = 10;
let y2 = 5;

let side1 = Math.abs(x1 - x2);
let side2 = Math.abs(y1 - y2);

console.log("Площадь прямоугольника № 1:", side1*side2);

// Прямоуголник № 2
x1 = 10;
y1 = 5;
x2 = 2;
y2 = 3;

side1 = Math.abs(x1 - x2);
side2 = Math.abs(y1 - y2);

console.log("Площадь прямоугольника № 2:", side1*side2);

// Прямоуголник № 3
x1 = -5;
y1 = 8;
x2 = 10;
y2 = 5;

side1 = Math.abs(x1 - x2);
side2 = Math.abs(y1 - y2);

console.log("Площадь прямоугольника № 3:", side1*side2);

// Прямоуголник № 4
x1 = 5;
y1 = 8;
x2 = 5;
y2 = 5;

side1 = Math.abs(x1 - x2);
side2 = Math.abs(y1 - y2);

console.log("Площадь прямоугольника № 4:", side1*side2);

// Прямоуголник № 5
x1 = 8;
y1 = 1;
x2 = 5;
y2 = 1;

side1 = Math.abs(x1 - x2);
side2 = Math.abs(y1 - y2);

console.log("Площадь прямоугольника № 5:", side1*side2);

console.log("Вариант № 2. С помощью вызова функции");

function square(x1, y1, x2, y2){
  let side1 = Math.abs(x1 - x2);
  let side2 = Math.abs(y1 - y2);
  return side1*side2;
}

console.log("Площадь прямоугольника № 1:", square(2,3,10,5));
console.log("Площадь прямоугольника № 2:", square(10,5,2,3));
console.log("Площадь прямоугольника № 3:", square(-5,8,10,5));
console.log("Площадь прямоугольника № 4:", square(5,8,5,5));
console.log("Площадь прямоугольника № 5:", square(8,1,5,1));

