import { getPostData } from "./post-get.js";

export const createPostsList = async () => {
    const posts = await getPostData();
    const postsList = document.querySelector('.posts__list');
    let postItem = '';

    function truncate(str, maxlength) {

      if (str.length > maxlength) {
          str = str.substring(0, maxlength-3);
          // итоговая длина равна maxlength
          return str + "...";
          // В кодировке Unicode существует специальный символ «троеточие»: … (HTML: &hellip;)
      }
      else
      return str;
    }

    for(let i = 0; i<posts.posts.length; i++){
      postItem += `
      <li class="posts__item">
        <div class="post__item-heading">Статья ${i+1}</div>
        <div class="post__item-content">
          <div class="post__preview">
            <h1 class="post__preview-title">${truncate(posts.posts[i].title, 40)}</h1>
            <p class="post__preview-text">${truncate(posts.posts[i].body, 150)}</p>
          </div>
          <a class="posts__item-link" href="post.html?id=${posts.posts[i].id}">
          Посмотреть полностью...
          </a>
        </div>
      </li>
      `;

      postsList.innerHTML = postItem;
    }
}
