const Table = require('../models/table')
const Account = require('../models/account')
const mongoose = require('mongoose')
const handelAccountJwt = require('../handleAccountJwt')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwtConfig')

exports.addTable = async (req, res) => {
  var cafe_id
  var name = req.body.name
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

  // create new table
  var newTable = new Table({
    _id: new mongoose.Types.ObjectId(),
    cafe_id: cafe_id,
    name: name
  })

  // save table
  await newTable.save()
    .then(table => {
      if (table) {
        res.json({
          result: true,
          message: 'New table is created'
        })
      } else {
        res.json({
          result: false,
          message: "Can't create this table"
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

exports.updateoneTable = (req, res) => {
  var name = req.body.name
  var id = req.params.tableId
  Table.findOneAndUpdate({ _id: id }, { name: name })
    .then(
      res.json({
        result: true
      }))
    .catch(err => {
      console.log(err)
      res.json({
        result: false,
        message: "Error"
      })
    })
}

exports.deleteTable = (req, res) => {
  var id = req.params.tableId
  Table.findOneAndUpdate({ _id: id }, { status: false })
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

exports.getAllTable = async (req, res) => {
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
  // function wait(timeout) {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, timeout)
  //   })
  // }

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

  await Table.find({ cafe_id: cafe_id, status: true })
    .then(async tables => {
      let data = []
      await tables.forEach(table => {
        let day = timeFormat(table.date)
        data.push({ _id: table._id, name: table.name, date: day })
      })

      // await wait(1000)
      res.json({
        result: true,
        tables: data
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}