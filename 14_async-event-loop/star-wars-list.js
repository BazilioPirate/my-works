export function render(data){
  // console.log(data);
  // console.log(data.results);

  let episodesArr = data.results;
  let count = 1;

  const container = document.createElement('div');
  const header = document.createElement('div');
  const img = document.createElement('img');
  const heading = document.createElement('h1');
  const episodeList = document.createElement('ul');

  header.classList.add('star-wars__header');
  img.classList.add('star-wars__logo-img');
  heading.classList.add('star-wars__heading');
  container.classList.add('container');
  episodeList.classList.add('star-wars__episodes-list');

  img.src = "img/star_wars_logo_PNG36.png";
  img.alt = 'logo';
  heading.textContent = "EPISODES";


  for(const film of episodesArr){

    const episodeItem = document.createElement('li');
    const episodeLink = document.createElement('a');

    episodeItem.classList.add('star-wars__item');
    episodeLink.classList.add('star-wars__item-link');
    episodeLink.textContent = `#00${film.episode_id} ${film.title}`;
    episodeLink.href = `?episodeId=${count}`;

    episodeLink.addEventListener('click', async (e)=>{
      // Отменяем стандартное поведение
      e.preventDefault();
      // Получаем значение атрибута
      const href = e.target.getAttribute('href');
      // Меняем строку, историю
      history.pushState(null, 'title 1', window.location.href + href);
      const searchParams = new URLSearchParams(href);

      const episodeId = searchParams.get('episodeId');
      // Импортируем функцию перерисовки
      const {renderPage} = await import('./main.js');
      renderPage(
        './star-wars-details.js',
        `https://swapi.dev/api/films/${episodeId}`,
        './sw-detail-style.css'
      );

    });
    count++;

    episodeItem.append(episodeLink);
    episodeList.append(episodeItem);

    episodeLink.onmouseover = function(event) {
      let target = event.target;
      target.style.fontSize = '54px';
      target.style.color = '#fff';
      target.style.textShadow = `
      0 0 7px rgb(219, 150, 20),
      0 0 10px rgb(219, 150, 20),
      0 0 21px rgb(219, 150, 20),
      0 0 42px rgb(233, 205, 205),
      0 0 82px rgb(233, 205, 205),
      0 0 92px rgb(233, 205, 205),
      0 0 102px rgb(233, 205, 205),
      0 0 151px rgb(233, 205, 205)`;
    };

    episodeLink.onmouseout = function(event) {
      let target = event.target;
      target.style.fontSize = '48px';
      target.style.color = '#fff';
      target.style.textShadow = `
      0 0 7px rgb(219, 150, 20),
      0 0 10px rgb(219, 150, 20),
      0 0 21px rgb(219, 150, 20),
      0 0 42px rgb(151, 52, 52),
      0 0 82px rgb(151, 52, 52),
      0 0 92px rgb(151, 52, 52),
      0 0 102px rgb(32, 32, 32),
      0 0 151px rgb(151, 52, 52)`;
    };
  }

  header.append(img);
  header.append(heading);
  container.append(header);
  container.append(episodeList);


  return container;
}

