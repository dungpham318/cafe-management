const jwt = require('jsonwebtoken')
const jwtSecret = require('./jwtConfig')

exports.getAccountId = (req, res, next) => {
  jwt.verify(req.token, jwtSecret.secret, (err, data) => {
    if (err) {
      console.log(err)
      res.sendStatus(403)
      return null
    } else {
      return data._id
    }
  })
}

