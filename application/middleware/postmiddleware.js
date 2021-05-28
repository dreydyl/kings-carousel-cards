const { getNRecentPosts, getPostById } = require('../models/Posts');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const { getCommentsForPostId } = require('../models/Comments');
const postMiddleware = {};

postMiddleware.getRecentPosts = async function(req, res, next) {
    try {
        let results = await getNRecentPosts(12);
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error', 'There are no posts created yet');
        }
        next();
    } catch(err) {
        next(err);
    }
}

postMiddleware.getPostById = async function(req, res, next) {
    try {
        let results = await getPostById(req.params.id);
        if(results && results.length) {
            res.locals.currentPost = results[0];
            next();
        } else {
            req.flash('error', 'This is not the post you are looking for');
            res.redirect('/');
        }
    } catch(err) {
        next(err);
    }
}

postMiddleware.getCommentsByPostId = async (req, res, next) => {
    let postId = req.params.id;
    try {
        let results = await getCommentsForPostId(postId);
        res.locals.currentPost.comments = results;
        console.log('HEREHRHERHEHRE');
        console.log(results);
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = postMiddleware;