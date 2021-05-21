var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // next(new Error('test'));
  res.render('index',{title:"Photo App"});
});

router.get('/gallery', function(req, res, next) {
  res.render('gallery',{title:"Gallery"});
});

router.get('/login',(req, res, next) => {
  res.render('login',{title:"Login"});
});

router.get('/registration',(req, res, next) => {
  res.render('registration',{title:"Register"});
});

router.get('/postimage',(req, res, next) => {
  res.render('postimage',{title:"Create a Post"});
});

module.exports = router;
