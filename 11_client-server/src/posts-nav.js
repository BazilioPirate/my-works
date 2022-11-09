import { getPostData } from "../src/post-get.js";

export const createPostsNav = async ()=>{
  const pagination = await getPostData();
  const postsNav = document.querySelector('.nav__list');
  let postNav = '';
  for(let i = 1; i<= pagination.pagination.pages; i++){
    postNav += `
    <li class="nav__item">
      <a class="nav__item-link" href="index.html?page=${i}">
        Страница ${i}
      </a>
    </li>
    `;
    postsNav.innerHTML = postNav;
  }


}
