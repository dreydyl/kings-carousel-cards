var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');

var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');

// const request = require('request');
// const fs = require('fs');

// request({
//     url: "https://api.apiflash.com/v1/urltoimage",
//     encoding: "binary",
//     qs: {
//         access_key: "1541ee6eb5c347d2bae830729e02ebd2",
//         url: "https://example.com"
//     }
// }, (error, response, body) => {
//     if (error) {
//         console.log(error);
//     } else {
//         fs.writeFile("screenshot.jpeg", body, "binary", error => {
//             console.log(error);
//         });
//     }
// });

var app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname,"views/layouts"),
        partialsDir: path.join(__dirname,"views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: {
            emptyObject: (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0);
            },
            strong: (defaultDamage) => {
                return (defaultDamage == "strong" || defaultDamage == "strong+");
            },
            weak: (defaultDamage) => {
                return (defaultDamage == "weak" || defaultDamage == "weak+");
            },
            attackOrHeal: (defaultDamage) => {
                if(defaultDamage == "strong" || defaultDamage == "weak") return "background-color: #ff00005f; border-color: red;";
                else if(defaultDamage == "strong+" || defaultDamage == "weak+") return "background-color: #00ff005f; border-color: green;";
                else return "background-color: #00000055;";
            },
            distanceMatches: (dis1, dis2) => {
                return (dis1 == dis2);
            },
            greaterThan: (dis1, dis2) => {
                return (dis1 > dis2);
            },
            getFamilyFilter: (family) => {
                if(family == "royal") return "#8e7cc347";
                if(family == "common") return "#4c11304b";
                if(family == "domesticated") return "#64212c65";
                if(family == "pirate") return "#1155cc47";
                if(family == "religious") return "#c9b6373b";
                if(family == "spiritual") return "#ff99003b";
                if(family == "wild") return "#7a1d0073";
                if(family == "ninja") return "#0000003b";
            }
            /**
             * if you need more helpers, add them here
             * key, value
             * value is a function
             */
        }
    })
);

var mysqlSessionStore = new mysqlSession({/* using default options */},require("./config/database"));
app.use(sessions({
    key: "csid",
    secret: "this is a secret from csc317",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

app.use((req, res, next) => {
    if(req.session.username) {
        res.locals.logged = true;
    }
    next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.render('error', {err_message: err});
});

module.exports = app;
