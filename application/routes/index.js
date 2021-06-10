var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var { getRecentPosts, getPostById, getCommentsByPostId } = require('../middleware/postmiddleware');
var { getAttackCardById, getMoveCardById, getAllAttacks, getAllMoves } = require('../middleware/cardmiddleware');
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

router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req, res, next) => {
      res.render('imagepost', {title:`PhotoBase ${req.params.id}`});
});

router.get('/card/attack/:id(\\d+)', getAttackCardById, (req, res, next) => {
  res.render('attackcard', {title:`Custom Card ${req.params.id}`});
});

router.get('/card/move/:id(\\d+)', getMoveCardById, (req, res, next) => {
  res.render('movecard', {title:`Custom Card ${req.params.id}`});
});

router.get('/gallery/attacks', getAllAttacks, (req, res, next) => {
  res.render('attackgallery', {title: 'All Cards'});
});

router.get('/gallery/moves', getAllMoves, (req, res, next) => {
  res.render('movegallery', {title: 'All Cards'});
});

module.exports = router;
