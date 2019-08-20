const Account = require('../models/account')
const Cafe = require('../models/cafe')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwtConfig')

exports.newAccount = async (req, res) => {
  var errors = []
  var username = req.body.username
  var password = req.body.password
  var email = req.body.email
  var cafeName = req.body.cafeName

  // Check Cafe info
  await Cafe.findOne({ 'cafeName': cafeName })
    .then((cafeName) => {
      if (cafeName) {
        errors.push('cafeName')
      }
    })
  // Check username
  await Account.findOne({ 'username': username })
    .then((username) => {
      if (username) {
        errors.push('username')
      }
    })
  // Check email
  await Account.findOne({ 'email': email })
    .then((email) => {
      if (email) {
        errors.push('email')
      }
    })

  // return errors

  if (errors.length > 0) {
    res.json(errors)
    return
  }

  // Create new Cafe Obj
  var newCafe = new Cafe({
    _id: new mongoose.Types.ObjectId(),
    cafeName: cafeName
  })

  // Create new Account Obj
  var newAccount = new Account({
    _id: new mongoose.Types.ObjectId(),
    username: username,
    password: password,
    email: email,
    cafeName: cafeName,
    role: 'admin',
    cafe_id: newCafe._id
  })

  // Save new account
  await newCafe.save((err) => {
    if (err) {
      res.json({
        result: 'failed',
        data: {},
        message: err
      })
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAccount.password, salt, (err, hash) => {
          if (err) {
            throw err
          }
          newAccount.password = hash
          newAccount
            .save()
            .then(acc => {
              if (acc) {
                res.json({
                  result: 'ok',
                  data: acc,
                })
              } else {
                res.json({
                  errors,
                  result: 'failed',
                  data: {}
                })
              }
            })
            .catch(err => console.log(err))
        })
      })
    }
  })
    .catch(err => console.log(err))
}

exports.createNewStaffAccount = async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let errors = []
  let cafe_id
  let accountId

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
    })
    .catch(err => {
      console.log(err)
    })

  // Check username
  await Account.findOne({ 'username': username })
    .then((username) => {
      if (username) {
        errors.push('username')
      }
    })

  let newAccount = new Account({
    _id: new mongoose.Types.ObjectId(),
    username: username,
    password: password,
    role: 'staff',
    cafe_id: cafe_id
  })

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newAccount.password, salt, (err, hash) => {
      if (err) {
        throw err
      }
      newAccount.password = hash
      newAccount
        .save()
        .then(acc => {
          if (acc) {
            res.json({
              result: 'ok',
              data: acc,
            })
          } else {
            res.json({
              errors,
              result: 'failed',
              data: {}
            })
          }
        })
        .catch(err => console.log(err))
    })
  })
}

exports.getAllStaffAccount = async (req, res) => {
  let cafe_id
  let accountId

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
    })
    .catch(err => {
      console.log(err)
    })

  let timeFormat = (date) => {
    let dd = date.getDate()
    if (dd < 10) {
      dd = '0' + dd
    }
    let mm = date.getMonth() + 1
    if (mm < 10) {
      mm = '0' + mm
    }
    let yyyy = date.getFullYear()
    let day = dd + '/' + mm + '/' + yyyy
    return day
  }

  await Account.find({ cafe_id: cafe_id, status: true, role: 'staff' })
    .then(accounts => {
      let data = []
      accounts.forEach(account => {
        let day = timeFormat(account.date)
        data.push({ _id: account._id, username: account.username, password: account.password, role: account.role, date: day })
      })
      res.json({
        result: true,
        accounts: data
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.updateAccount = (req, res) => {
  let id = req.params.accountId
  let password = req.body.password

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        throw err
      }
      password = hash
      Account.findOneAndUpdate({ _id: id }, { password: password })
        .then(() => {
          res.json({
            result: true
          })
        })
        .catch(err => {
          console.log(err)
          res.json({
            result: false,
            message: "Error"
          })
        })
    })
  })
}

exports.deleteOneAccount = (req, res) => {
  var id = req.params.accountId
  Account.findOneAndUpdate({ _id: id }, { status: false })
    .then(() => {
      res.json({
        result: true
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false,
        message: "Error"
      })
    })
}