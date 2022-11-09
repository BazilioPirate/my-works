function addList(data, details, listName = 'list'){
  Promise.all(data.map(src=>fetch(src)
  .then(res=> res.json())))
  .then(
    (data) => {

      const dataCont = document.createElement('div');
      const dataHeading = document.createElement('h2');
      const dataList = document.createElement('ul');

      dataCont.classList.add(`star-wars__${listName}-container`);
      dataHeading.classList.add(`star-wars__${listName}-heading`);
      dataList.classList.add(`star-wars__${listName}-list`);

      dataHeading.textContent = listName;

      details.append(dataCont);
      dataCont.append(dataHeading);

      for(const key of data){
        const dataItem = document.createElement('li');
        dataItem.classList.add(`star-wars__${listName}-item`);
        dataItem.textContent = key.name;
        dataList.append(dataItem);
      };
      dataCont.append(dataList);
    }
  );
};

export function render (data){

  // console.log(data);
  // console.log(data.planets);

  const container = document.createElement('div');
  const header = document.createElement('div');
  const details = document.createElement('div');
  const detailHeading = document.createElement('h1');
  const detailDescr = document.createElement('p');

  const backBtn = document.createElement('a');
  backBtn.classList.add('star-wars__back-btn');
  backBtn.textContent = 'Back to episodes';

  backBtn.addEventListener('click', async (e)=>{
    // Отменяем стандартное поведение
    e.preventDefault();
    // Получаем значение атрибута
    // const href = e.target.getAttribute('href');
    // Меняем строку, историю
    history.pushState(null, 'title 1', '/');

    // Импортируем функцию перерисовки
    const {renderPage} = await import('./main.js');
    renderPage(
      './star-wars-list.js',
      `https://swapi.dev/api/films/`,
      './sw-list-style.css'
    );

  });

  container.classList.add('container');
  header.classList.add('star-wars__detail-header');
  details.classList.add('star-wars__details');
  detailHeading.classList.add('star-wars__detail-heading');
  detailDescr.classList.add('star-wars__detail-description');



  detailHeading.textContent = `EPISODE #00${data.episode_id}: ${data.title}`;
  detailDescr.textContent = `${data.opening_crawl}`;

  container.append(backBtn);
  container.append(header);
  container.append(details);

  header.append(detailHeading);
  header.append(detailDescr);

  addList(data.characters, details, 'characters');
  addList(data.starships, details, 'starships');
  addList(data.species, details, 'species');
  addList(data.vehicles, details, 'vehicles');
  addList(data.planets, details, 'planets');

  return container;
}
