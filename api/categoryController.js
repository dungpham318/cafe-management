const Category = require('../models/category')
const Account = require('../models/account')
const mongoose = require('mongoose')
const handelAccountJwt = require('../handleAccountJwt')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwtConfig')
const Drink = require('../models/drink')

exports.addCategory = async (req, res) => {
  var name = req.body.name
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
    })
    .catch(err => {
      console.log(err)
    })

  // create new category
  var newCategory = new Category({
    _id: new mongoose.Types.ObjectId(),
    cafe_id: cafe_id,
    name: name
  })

  // save category
  await newCategory.save()
    .then(category => {
      if (category) {
        res.json({
          result: true,
          message: 'New category is created'
        })
      } else {
        res.json({
          result: false,
          message: "Can't create this category"
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false,
        message: "Error"
      })
    })
}

exports.updateCategory = (req, res) => {
  var name = req.body.name
  var id = req.params.categoryId
  Category.findOneAndUpdate({ _id: id }, { name: name })
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

exports.deleteOneCategory = (req, res) => {
  var id = req.params.categoryId
  Category.findOneAndUpdate({ _id: id }, { status: false })
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

exports.getAllCategory = async (req, res) => {
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
  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, timeout)
    })
  }

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

  await Category.find({ cafe_id: cafe_id, status: true })
    .then(async categorys => {
      let data = []
      await categorys.forEach(async category => {
        let quantity = 0
        let day = timeFormat(category.date)
        await Drink.find({ category_id: category._id })
          .then(drink => {
            quantity += drink.length
            // Object.assign(category, { quantity: quantity })
            data.push({ _id: category._id, name: category.name, quantity: quantity, date: day })
          })
          .catch(err => console.log(err))
      })
      await wait(1000)
      res.json({
        result: true,
        categorys: data
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}