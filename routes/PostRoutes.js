
const {
  GET_posts,
  POST_posts,
  GET_addPost,
  GET_userId_posts,
  GET_posts_postId,
  GET_posts_postId_comments,
  POST_posts_postId_comments,
  GET_posts_postId_comments_commentId,
  PARAM_postId
} = require("../controllers/PostController");
const { requireLogin } = require("../middleware");

module.exports = app => {
  console.log(app.param);
  app.param("postId", PARAM_postId);
  app.get("/posts", requireLogin, GET_posts);
  app.post("/posts", requireLogin, POST_posts); 
  app.get('/addPost', requireLogin, GET_addPost);
  app.get("/:userId/posts", requireLogin, GET_userId_posts); 
  app.get("/posts/:postId", requireLogin, GET_posts_postId);
  app.get("/posts/:postId/comments", requireLogin, GET_posts_postId_comments);
  app.post("/posts/:postId/comments", requireLogin, POST_posts_postId_comments); 
  app.get(
    "/posts/:postId/comments/:commentId",
    requireLogin,
    GET_posts_postId_comments_commentId
  );  
};
