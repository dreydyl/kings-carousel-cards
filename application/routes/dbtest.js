const express = require('express');
const router = express.Router();
const db =require('../config/database');

router.get('/getAllUsers', (req,res,next) => {
    res.send('getting all posts');
});

module.exports = router;