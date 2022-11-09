document.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.querySelector('.js-scroll-btn')
  window.addEventListener('scroll', e =>{
    console.log(window.pageYOffset);
  }),{passive: true};

  scrollBtn.addEventListener('click', e => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

