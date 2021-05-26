const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');

const routesProtectors = {};

routesProtectors.userIsLoggedIn = function(req, res, next) {
    if(req.session.username) {
        successPrint("user is logged in");
        next();
    } else {
        errorPrint("user is not logged in");
        req.flash('error', 'You must be logged in to create a post');
        res.redirect('/login');
    }
}

module.exports = routesProtectors;