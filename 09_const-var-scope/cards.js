(()=>{
  let cardsArray = [];
  let cardsCounter = 0;
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let disableCardsCounter = 0;
  let numbersOfCards = 0;

  function createStartForm(){
    let form = document.createElement('form');
    let descriptionCont = document.createElement('div');
    let startHeading = document.createElement('h2');
    let description = document.createElement('div');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let startBtn = document.createElement('button');

    startBtn.textContent = 'Начать игру';
    startHeading.textContent = 'Сыграем в игру?'
    description.textContent = `Введите количество карточек по вертикали/горизонтали. Это должно быть четное число в интервале от 2 до 10`;

    form.classList.add('cards__start-form');
    descriptionCont.classList.add('cards__start-description-cont');
    startHeading.classList.add('cards__start-description-heading');
    description.classList.add('cards__start-description');
    input.classList.add('cards__start-input');
    input.placeholder = 'введите число';
    buttonWrapper.classList.add('cards__start-wrapper');
    startBtn.classList.add('cards__start-button');

    buttonWrapper.append(startBtn);
    descriptionCont.append(startHeading);
    descriptionCont.append(description);
    form.append(descriptionCont);
    form.append(input);
    form.append(buttonWrapper);
    verificationInputField(input, startBtn);

    return {
      form,
      descriptionCont,
      input,
      startBtn
    };
  };

  function createAppTitle(title){
    const appTitle = document.createElement('h2');
    appTitle.classList = 'title-cont__heading';
    appTitle.innerHTML = title;
    return appTitle;
  };

  function createAppDescription(title){
    const appDescription = document.createElement('p');
    appDescription.classList.add('game-description');
    appDescription.textContent = ' Открывай карты в произвольном порядке, найди пары одинаковых карточек. Открывай сначала одну карточку, затем вторую. Если обе открытые карточки одинаковы, они остаются открытыми до конца партии. В противном случае они переворачиваются обратно';
    return appDescription;
  };

  function createCard(){
    const card = document.createElement('div');
    const cardFaceFront = document.createElement('img');
    const cardFaceBack = document.createElement('div');
    let cardPoint = cardsArray[cardsCounter];
    let cardData = cardsArray[cardsCounter] - cardsArray.length/2;

    card.classList.add('card');
    cardFaceFront.classList.add('card__face', 'card__face--front');
    cardFaceBack.classList.add('card__face', 'card__face--back');

    cardFaceFront.src = "./img/png-transparent-magna-carta.png";

    card.setAttribute('data-number',cardPoint);
    cardFaceBack.textContent = cardPoint;
    if(cardPoint>cardsArray.length/2){
      cardFaceBack.textContent = cardData;
      card.setAttribute('data-number', cardData);
    }

    card.append(cardFaceFront);
    card.append(cardFaceBack);

    card.addEventListener( 'click', flipCard);
    cardsCounter++;

    return card;
  };

  function flipCard(){
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('is-flipped');
    if(!hasFlippedCard){
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;

    checkForMatch();
    checkDisabledCards(disableCardsCounter, numbersOfCards);
  };

  function checkForMatch(){
    let isMatch = firstCard.dataset.number === secondCard.dataset.number;
    isMatch ? disableCards() : unflipCards();
    if(isMatch === true){
      disableCardsCounter++;
      console.log(disableCardsCounter);
      console.log(typeof(disableCardsCounter));
    }
  };

  function disableCards(){
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  };

  function checkDisabledCards(counter, number){
    console.log(counter == number);

    if(counter == number){
      showHidden('Поздравляю! Вы победили!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  function unflipCards(){
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');
      resetBoard();
    }, 1500);
  };

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function verificationInputField(input, button){
    button.disabled = true;
    input.addEventListener('input', ()=>{
      input.value ? button.disabled = false : button.disabled = true;
    })
  }

  function verificationNumber(number){
    if(number>0 && number <= 10 && number%2 === 0){
      return number
    }else{
      return 4;
    };
  };

  function closeStartForm() {
    document.querySelector(".cards__start-form").style.display = "none";
  };

  function showHidden(message) {
    let alert = document.querySelector(".alert");
    alert.style.display = 'flex';
    alert.textContent = message;
  };

  function createArray(array, number){
    let elements = number*number;
    for(let i = 0, j = elements; i<elements; i++, j--){
      if(i >= elements/2){
        array.push(j);
      }else{
        array.push(i+1);
      };
    };
    return array;
  };

  function resizeCards(container, card, number){
    switch(number){
      case '2':
        card.style.width = 'calc(50% - 10px)';
        card.style.height = 'calc(65% - 10px)';
        break;
      case '4':
        break;
      case '6':
        container.style.width = '1000px';
        card.style.width = 'calc(16% - 10px)';
        break;
      case '8':
        container.style.width = '1200px';
        card.style.width = 'calc(12% - 10px)';
        break;
      case '10':
        container.style.width = '1400px';
        card.style.width = 'calc(10% - 10px)';
        break;
    };
  };

  function shuffleArray(arr){
    let j, temp;
    for(let i = arr.length - 1; i > 0; i--){
      j = Math.floor(Math.random()*(i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  function createTimer(){
    const timerDisplay = document.createElement('div');
    let timerValue = 10;

    timerDisplay.classList.add('timer-display');
    timerDisplay.textContent = timerValue;
    startTimer(timerValue, timerDisplay);

    return timerDisplay;
  }

  function startTimer(value, display){
    let timerId = setInterval(() =>{
      if (value > 0){
        display.textContent = value-1;
        value--;
      } else{
        clearInterval(timerId);
        value = 0;
        display.textContent = 0;
        showHidden('Время вышло! Попробуй еще...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }, 1000);
  }

  function showGameOverMessage(){
    let alert = document.createElement('div');
    alert.classList.add('alert');
    return alert;
  }

  function createCardsApp(container, title = 'Игра в пары'){
    let startForm = createStartForm();
    container.append(startForm.form);
    startForm.form.addEventListener('submit', function(e){
      e.preventDefault();
      closeStartForm();
      const titleCont = document.createElement('div');
      const cardsCont = document.createElement('div');

      let number = verificationNumber(startForm.input.value);
      let cardsAppTitle = createAppTitle(title);
      let cardsAppDescription = createAppDescription();
      let timerOnDisplay = createTimer();
      let gameOverMessage = showGameOverMessage();

      numbersOfCards = Number(number);

      createArray(cardsArray, number);
      shuffleArray(cardsArray);


      cardsCont.classList.add('cards-cont');
      titleCont.classList.add('title-cont');

      container.append(gameOverMessage);
      container.append(titleCont);
      titleCont.append(cardsAppTitle);
      titleCont.append(cardsAppDescription);
      container.append(timerOnDisplay);
      container.append(cardsCont);

      for(let i = 0; i<cardsArray.length; i++){
        let newCard = createCard();
        resizeCards(cardsCont, newCard, number);
        cardsCont.append(newCard);
      };

      checkDisabledCards(disableCardsCounter, number);
    });

  };

  window.createCardsApp = createCardsApp;

})();


