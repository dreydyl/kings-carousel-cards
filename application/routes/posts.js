var express = require('express');
var router = express.Router();
var getRecentPosts = require('../middleware/postmiddleware').getRecentPosts;
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError');
var PostModel = require('../models/Posts');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/upload");
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({ storage: storage });

router.post('/createPost', uploader.single("uploadImage"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let userid = req.session.userId;

    serverErr = new PostError(
        "Upload Failed: Missing fields",
        "/registration",
        200
    );
    if (title.length == 0 || description.length == 0 || userid == 0) {
        errorPrint(serverErr.getMessage());
        req.flash('error', serverErr.getMessage());
        res.status(serverErr.getStatus());
        res.redirect(serverErr.getRedirectURL());
    } else {
        successPrint('passed server side validation');
    }

    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create(title, description, fileUploaded, destinationOfThumbnail, userid);
        })
        .then((results) => {
            if (results && results.affectedRows) {
                req.flash('success', 'Your post was created successfully');
                res.redirect('/post/' + results.insertId); //destination of new post
            } else {
                throw new PostError('Post could not be created', 'postImage', 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        })
});

router.get('/search', async (req, res, next) => {
    let searchTerm = req.query.search;
    if (!searchTerm) {
        res.send({
            resultsStatus: "info",
            message: "No search term given",
            results: []
        });
    } else {
        let results = await PostModel.search(searchTerm);
        if (results.length) {
            req.flash('success', `${results.length} result${results.length == 1 ? `` : `s`} found`);
            res.locals.results = results;
            results.forEach(row => {
                row.thumbnail = "../" + row.thumbnail;
            });
            res.render('index', { title: "PhotoBase " + searchTerm, header: "Results" });
        } else {
            errorPrint('no results');
            req.flash('error', 'No results were found for your search');
            res.redirect('/');
        }
        // db.execute(baseSql, [sqlReadySearchTerm])
        // .then(([results, fields]) => {
        //     if(results && results.length) {
        //         res.send({
        //             resultsStatus: "info",
        //             message: `${results.length} result${results.length == 1 ? "": "s"} found`,
        //             results: results
        //         });
        //     } else {
        //         errorPrint('no results');
        //         db.query('SELECT id, title, description, thumbnail CREATED FROM posts ORDER BY created LIMIT 12;', [])
        //         .then(([results, fields]) => {
        //             res.send({
        //                 resultsStatus: "info",
        //                 message: "No results were found for your search but here are the 8 most recent posts",
        //                 results: results
        //             });
        //         });
        //     }
        // })
        // .catch((err) => next(err));
    }
});

module.exports = router;