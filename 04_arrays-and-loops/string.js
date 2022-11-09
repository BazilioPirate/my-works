//Задание № 2

let stringArray = [
  'Привет, мир!', '!тилур tpircSavaJ', '1', ''
]

stringArray.forEach(function(item){
  console.log(createNewArray(item));
});


function createNewArray (array){
  let newString = '';
  for(let i = array.length-1; i>=0; i--){
    newString += array[i];
  }
  return newString;
}




