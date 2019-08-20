const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwtConfig')
const Account = require('../models/account')
const verifyToken = require('../auth')

exports.checkRole = (req, res, next) => {
  jwt.verify(req.token, jwtSecret.secret, (err, data) => {
    if (err) {
      console.log(err)
      res.sendStatus(403)
    } else {
      Account.findOne({ _id: data.id })
        .then(account => {
          res.json({
            role: account.role,
            username: account.username
          })
        })
        .catch(err => console.log(err))
    }
  })
}

exports.getCafeId = async (req, res) => {
  var cafe_id
  var accountId

  await jwt.verify(req.token, jwtSecret.secret, (err, data) => {
    if (err) {
      console.log(err)
      res.sendStatus(403)
    } else {
      accountId = data.id
    }
  })

  //get cafe_id
  await Account.findOne({ _id: accountId })
    .then(data => {
      cafe_id = data.cafe_id
      res.json({
        cafe_id: cafe_id
      })
    })
    .catch(err => {
      console.log(err)
    })
}