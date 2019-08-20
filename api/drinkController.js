const Drink = require('../models/drink')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwtConfig')
const Category = require('../models/category')
const Account = require('../models/account')

exports.addDrink = async (req, res) => {
  var categoryId = req.body.categoryId
  var name = req.body.name
  var price = req.body.price

  var newDrink = new Drink({
    _id: new mongoose.Types.ObjectId(),
    category_id: categoryId,
    name: name,
    price: price
  })

  await newDrink.save()
    .then(drink => {
      if (drink) {
        res.json({
          result: true,
          message: 'New drink is created'
        })
      } else {
        res.json({
          result: false,
          message: "Can't create this drink"
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

exports.updateDrink = (req, res) => {
  var name = req.body.name
  var price = req.body.price
  var categoryId = req.body.categoryId
  var id = req.params.drinkId

  Drink.findOneAndUpdate({ _id: id }, { $set: { name: name, price: price, category_id: categoryId } })
    .then((data) => {
      console.log(data)
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

exports.deleteOneDrink = (req, res) => {
  var id = req.params.drinkId
  Drink.findOneAndUpdate({ _id: id }, { status: false })
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

exports.getAllDrink = async (req, res) => {
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
        await Drink.find({ category_id: category._id, status: true })
          .then(drinks => {
            drinks.forEach(drink => {
              let day = timeFormat(drink.date)
              data.push({ _id: drink._id, name: drink.name, price: drink.price, categoryId: category._id, date: day })
            })
          })
          .catch(err => console.log(err))
      })
      await wait(1000)
      res.json({
        result: true,
        drinks: data
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}