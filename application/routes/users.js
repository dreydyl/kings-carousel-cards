var express = require('express');
var router = express.Router();
var db = require('../config/database');
const UserError = require('../helpers/error/UserError');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var bcrypt = require('bcrypt');

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

  /**
   * TODO server side validation
   */
  serverErr = new UserError(
    "Registration Failed: Failed to meet requirements",
    "/registration",
    200
  );
  var good = true;
  if (password != cpassword
      || !((username.charCodeAt() >= 65 && username.charCodeAt() <= 90)
      || (username.charCodeAt() >= 97 && username.charCodeAt() <= 122))
      || username.length < 3) {
      good = false;
  }
  var hasUpper = false;
  var hasNum = false;
  var hasSpec = false;
  for (var i = 0; i < password.length; i++) {
      if (password.charAt(i) === password.charAt(i).toUpperCase()
          && password.charAt(i) !== password.charAt(i).toLowerCase()) {
          hasUpper = true;
      }
      if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
          hasNum = true;
      }
      if (password.charCodeAt(i) >= 33 && password.charCodeAt(i) <= 43
          && password.charCodeAt(i) != 34 && password.charCodeAt(i) != 39
          || password.charAt(i) == '-' || password.charAt(i) == '/'
          || password.charAt(i) == '@') {
          hasSpec = true;
      }
  }
  if (password.length < 8
      || !(hasUpper && hasNum && hasSpec)) {
      good = false;
  }

  if(good) {
    successPrint("passed server side validation");
  } else {
    errorPrint(serverErr.getMessage());
    req.flash('error', serverErr.getMessage());
    res.status(serverErr.getStatus());
    res.redirect(serverErr.getRedirectURL());
    return;
  }

  db.execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results, fields]) => {
      if (results && results.length == 0) {
        return db.execute("SELECT * FROM users WHERE email=?", [email]);
      } else {
        throw new UserError(
          "Registration Failed: Username already exists",
          "/registration",
          200
        );
      }
    })
    .then(([results, fields]) => {
      if (results && results.length == 0) {
        return bcrypt.hash(password, 15);
      } else {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200
        );
      }
    })
    .then((hashedPassword) => {
      let baseSql = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());";
      return db.execute(baseSql, [username, email, hashedPassword]);
    })
    .then(([results, fields]) => {
      if (results && results.affectedRows) {
        successPrint("User.js --> user was created!");
        req.flash('success', 'User account has been made');
        res.redirect('/login');
      } else {
        throw new UserError(
          "Server Error: User could not be created",
          "/registration",
          500
        );
      }
    })
    .catch((err) => {
      errorPrint("user could not be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  /**
   * TODO validation
   */

  let baseSql = "SELECT id, username, password FROM users WHERE username=?;";
  let userId;
  db.execute(baseSql, [username])
    .then(([results, fields]) => {
      if (results && results.length == 1) {
        let hashedPassword = results[0].password;
        userId = results[0].id;
        return bcrypt.compare(password, hashedPassword);
      } else {
        throw new UserError("Invalid username and/or password", "/login", 200);
      }
    })
    .then((passwordsMatched) => {
      if (passwordsMatched) {
        successPrint(`user ${username} is logged in`);
        req.session.username = username;
        req.session.userId = userId;
        res.locals.logged = true;
        req.flash('success', 'You have been successfully logged in');
        res.redirect("/");
      } else {
        throw new UserError("invalid username and/or password", "/login", 200);
      }
    })
    .catch((err) => {
      errorPrint("user login failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect('/login');
      } else {
        next(err);
      }
    })
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if(err) {
      errorPrint("session could not be destroyed");
      next(err);
    } else {
      successPrint("session was destroyed");
      res.clearCookie('csid');
      res.json({status:"OK", message:"user is logged out"});
    }
  });
});

module.exports = router;
