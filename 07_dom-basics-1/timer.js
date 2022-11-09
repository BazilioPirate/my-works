const timerInput = document.getElementById('timerInput');
const timerBtn = document.getElementById('timerBtn');
const timerDisplay = document.getElementById('timerDisplay');
let timerValue;
let timerId;


timerBtn.addEventListener('click', ()=>{
  clearInterval(timerId);
  timer = timerInput.value < 0 ? 0: Number(timerInput.value);
  timerInput.value = '';
  timerDisplay.textContent = timer;
  timerId = setInterval(() =>{
    if (timer > 0){
      timerDisplay.textContent = timer-1;
      timer--;
    } else{
      clearInterval(timerId);
      timer = 0;
      timerDisplay.textContent = 0;
    }
  }, 1000);
});
