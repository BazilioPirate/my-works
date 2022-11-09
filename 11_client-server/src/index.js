// import { getPostData } from "../src/post-get.js";
import { createPostsNav} from "../src/posts-nav.js";
import { createPostsList} from "../src/posts-list.js";
import {createPostPage} from "../src/post-page.js";
import {createPostComment} from "../src/post-comment.js";

// getPostData();

(async function(){
  const postNav = document.querySelector('.nav__list');
  const postPage = document.querySelector('.comments-container');

  if(postNav){
    createPostsNav();
    createPostsList();
  };

  if(postPage){
    createPostPage();
    createPostComment();
  }
}());
