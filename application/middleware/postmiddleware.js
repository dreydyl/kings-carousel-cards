const { post } = require('../app');
var db = require('../config/database');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');

const postMiddleware = {};

postMiddleware.getRecentPosts = function(req, res, next) {
    let baseSql = 'SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 12';
    db.execute(baseSql,[])
    .then(([results, fields]) => {
        res.locals.results = results;
        if(results && results.length == 0) {
            req.flash('error', 'There are no posts created yet');
        }
        next();
    })
    .catch((err) => next(err));
}

module.exports = postMiddleware;