// let roadMines = [true, true, true, true, true, true, true, true, true, true];
// let damageCount = 0;

// for(let i = 0; i < roadMines.length; i++){
//   console.log(`танк переместился на ${i+1}`);
//   if(roadMines[i] === true){
//     damageCount++;
//     if(damageCount === 3){
//       console.log('танк уничтожен');
//       break;
//     }
//     console.log('танк повреждён');
//     continue;
//   }
// }


let roadMinesArray = [
  [true, true, true, true, true, true, true, true, true, true],
  [true, false, false, false, false, false, false, false, false, true],
  [false, false, false, true, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
]

roadMinesArray.forEach(function(item, i){
  console.log(`Пример ${i+1}`);
  tankMoves(item, i);
})

function tankMoves (array){
  let damageCount = 0;
  for(let i = 0; i < array.length; i++){
    tankDisplayMoves (i);
    if(array[i] === true){
      damageCount++;
      if(damageCount === 3){
        tankDestroyMessage();
        break;
      }
      tankDamageMessage();
      continue;
    };
  }
}

function tankDisplayMoves (i){
  console.log(`танк переместился на ${i+1}`);
}

function tankDestroyMessage(){
  console.log('танк уничтожен');
}

function tankDamageMessage(){
  console.log('танк повреждён');
}

