const { getAttackCardById, getMoveCardById, getAllAttacks, getAllMoves } = require('../models/Cards');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const cardMiddleware = {};

cardMiddleware.getAttackCardById = async function(req, res, next) {
    try {
        let results = await getAttackCardById(req.params.id);
        console.log(results);
        if(results) {
            res.locals.currentCard = results;
            next();
        } else {
            req.flash('error', 'This is not the card you are looking for');
            res.redirect('/');
        }
    } catch(err) {
        next(err);
    }
}

cardMiddleware.getAllAttacks = async function(req, res, next) {
    try {
        let results = await getAllAttacks();
        console.log(results);
        if(results) {
            res.locals.results = results;
            next();
        } else {
            req.flash('error', 'Uh oh');
            res.redirect('/');
        }
    } catch(err) {
        next(err);
    }
}

cardMiddleware.getAllMoves = async function(req, res, next) {
    try {
        let results = await getAllMoves();
        console.log(results);
        if(results) {
            res.locals.results = results;
            next();
        } else {
            req.flash('error', 'Uh oh');
            res.redirect('/');
        }
    } catch(err) {
        next(err);
    }
}

cardMiddleware.getMoveCardById = async function(req, res, next) {
    try {
        let results = await getMoveCardById(req.params.id);
        console.log(results);
        if(results) {
            res.locals.currentCard = results;
            next();
        } else {
            req.flash('error', 'This is not the card you are looking for');
            res.redirect('/');
        }
    } catch(err) {
        next(err);
    }
}

module.exports = cardMiddleware;