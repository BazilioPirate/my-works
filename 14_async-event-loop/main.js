const cssPromises = {};

function loadResource(src){
  // console.log(screen.width, screen.height);
  // console.log(screen.availWidth, screen.availHeight);

    // JavaScript module
    if (src.endsWith('.js')){
      return import(src);
    }
    // CSS файл
    if (src.endsWith('.css')){
      if(!cssPromises[src]){
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = src;
        cssPromises[src] = new Promise(resolve => {
          link.addEventListener('load', ()=> resolve());
        });
        document.head.append(link);
      }
      return cssPromises[src];
    }

    // Данные с сервера
    return fetch(src).then(res => res.json());

};

const appContainer = document.getElementById('app');
const searchParams = new URLSearchParams(location.search);

const episodeId = searchParams.get('episodeId');

export function renderPage(moduleName, apiUri, css){
  Promise.all([moduleName, apiUri, css].map(src => loadResource(src)))
  .then(([pageModule, data]) => {
    appContainer.innerHTML = '';

    appContainer.append(pageModule.render(data));
  });
};

if (episodeId){

  renderPage(
    './star-wars-details.js',
    `https://swapi.dev/api/films/${episodeId}`,
    './sw-detail-style.css'
  );
}else{
  renderPage(
    './star-wars-list.js',
    `https://swapi.dev/api/films/`,
    './sw-list-style.css'
  );
};

// Отслеживаем нажатия на стрелочки и перезагружаем контент

window.addEventListener('popstate', event => {
  const searchParams = new URLSearchParams(location.search);
  const episodeId = searchParams.get('episodeId');

  if (episodeId) {
    renderPage(
      './star-wars-details.js',
    `https://swapi.dev/api/films/${episodeId}`,
    './sw-detail-style.css'
    )
  } else {
    renderPage(
      './star-wars-list.js',
    `https://swapi.dev/api/films/`,
    './sw-list-style.css'
    )
  }
})
