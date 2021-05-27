var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postmiddleware').getRecentPosts;
var db = require('../config/database');

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index',{title:"PhotoBase", header:"Recent Posts"});
});

router.get('/gallery', function(req, res, next) {
  res.render('gallery',{title:"PhotoBase Gallery"});
});

router.get('/login',(req, res, next) => {
  res.render('login',{title:"PhotoBase Login"});
});

router.get('/registration',(req, res, next) => {
  res.render('registration',{title:"PhotoBase Register"});
});

router.use('/postimage', isLoggedIn);
router.get('/postimage',(req, res, next) => {
  res.render('postimage',{title:"PhotoBase Create a Post"});
});

router.get('/post/:id(\\d+)', (req, res, next) => {
  let baseSql = "SELECT u.username, p.title, p.description, p.photopath, p.created \
  FROM users u \
  JOIN posts p \
  ON u.id=userid \
  WHERE p.id=?;";

  let postId = req.params.id;

  db.execute(baseSql, [postId])
  .then(([results, fields]) => {
    if(results && results.length) {
      let post = results[0];
      res.render('imagepost', {currentPost: post});
    } else {
      req.flash('error', 'This is not the post you are looking for');
      res.redirect('/');
    }
  })
});

module.exports = router;
