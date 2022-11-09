document.addEventListener(`DOMContentLoaded`, ()=>{
  const dropdownButton = document.querySelector('.js-dropdown');
  const dropdownBlock = document.querySelector(dropdownButton.dataset.toggle);
  const container = document.querySelector('.container');

  dropdownButton.addEventListener('click', ()=>{
    dropdownBlock.style.display = 'block';
  });

  document.querySelector('.dropdown').addEventListener('click', event => {
    event._isClickWithinModal = true;
  });

  document.addEventListener('click', event => {
    if (event._isClickWithinModal) return;
    dropdownBlock.style.display = 'none';
  });



});
