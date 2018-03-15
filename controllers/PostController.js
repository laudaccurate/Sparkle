const mongoose = require("mongoose");
const axios = require("axios");
const {
  africasTalkingURL,
  username,
  africasTalkingApiKey
} = require("../config/keys");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");
const Relationship = mongoose.model("Relationship");
const Util = require("../Util");

const request = require("request");
const querystring = require("querystring");

module.exports.PARAM_postId = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id).populate('_author');

    if(!post) {
      return Util.error("Post not found", next, 404);
    }

    req.post = post;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports.GET_addPost = (req, res, next) => { 
  return res.render('post/addPost', {title: 'Post'});
};

module.exports.GET_posts = async (req, res, next) => {
  const posts = await Post.find({}).populate("_author");
  
  return res.render('post/posts', { posts, title: 'Posts'});
};

module.exports.POST_posts = async (req, res, next) => {
  const options = {
    method: "POST",
    url: africasTalkingURL,
    data: {
      username: username,
      to: "+233265286342",
      // from: "+233245691529"
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      apikey: africasTalkingApiKey
    },
    // json: true
  };
  const { title, body, imageUrl } = req.body;

  if (!title.trim() || !body.trim()) {
    return Util.error("Title and Body are required fields", next);
  }

  try {
    const post = await Post.create({
      ...req.body,
      _author: req.session.userId
    });

    const followers = await Relationship.find({ followee: req.session.userId });

    // try {
    //   const response = await axios(options);
    // } catch (error) {
    //   console.log(error);
    //   return res.json(error);
    // }

    return res.redirect("/posts");
  } catch (error) {
    return next(error);
  }
};

module.exports.GET_userId_posts = async (req, res, next) => {
  try {
    const posts = await Post.find({ _author: req.params.userId });

    return res.json(posts);
  } catch (error) {
    return next(error);
  }
};

module.exports.GET_posts_postId = (req, res, next) => {
  return res.render('post/readPost', {title: 'Post', post: req.post});
};

module.exports.GET_posts_postId_comments = async (req, res, next) => {
  try {
    const comments = await Comment.findOne({ _postId: req.post._id });

    return res.json(comments);
  } catch (error) {
    return next(error);
  }
};

module.exports.POST_posts_postId_comments = async (req, res, next) => {
  const incoming_text = req.body.body;

  if (!incoming_text.trim()) return Util.error("Text field is required", next);

  const comment = await Comment.create({
    body: incoming_text,
    _postId: req.post._id,
    _author: req.session.userId
  });

  let message = "Your post received a comment";
  let body = querystring.stringify({
    username: username,
    to: "+233265286342",
    message: message
  });

  let options = {
    url: africasTalkingURL,
    method: "POST",
    rejectUnauthorized: false,
    requestCert: true,
    agent: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": body.length,
      Accept: "application/json",
      apikey: africasTalkingApiKey
    },
    body: body
  };

  request(options, function(error, response, body) {
    if (!error) {
      var info = JSON.parse(body);
      var recipients = info.SMSMessageData.Recipients;
      if (recipients.length > 0) {
        return res.json({
          status: true,
          comment
        });
      } else {
        return res.json({
          status: false
        });
      }
    } else {
      return res.json({
        status: false
      });
    }
  });
};

module.exports.GET_posts_postId_comments_commentId = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return Util.error("Comment not found", next, 404);

    return res.json(comment);
  } catch (error) {
    return next(error);
  }
};
