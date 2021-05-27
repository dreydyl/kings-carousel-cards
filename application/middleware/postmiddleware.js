var PostModel = require('../models/Posts');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');

const postMiddleware = {};

postMiddleware.getRecentPosts = async function(req, res, next) {
    try {
        let results = await PostModel.getNRecentPosts(12);
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error', 'There are no posts created yet');
        }
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = postMiddleware;