var passport = require('passport')
var Account = require('../models/account')
var jwt = require('jsonwebtoken')
var jwtSecret = require('../jwtConfig')

exports.login = (req, res, next) => {
  passport.authenticate('login', (err, account, info) => {
    if (err) {
      console.log(err)
    }
    if (info != undefined) {
      res.json(info.message)
    } else {
      req.logIn(account, err => {
        if (err) {
          console.log(err)
        }
        Account.findOne({
          id: account.id,
        }).then(id => {
          const token = jwt.sign({ id: account.id }, jwtSecret.secret);
          res.status(200).send({
            token: token
          });
        });
      });
    }
  })(req, res, next);
}