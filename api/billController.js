const Bill = require('../models/bill')
const Drink = require('../models/drink')
const Category = require('../models/category')
const Table = require('../models/table')
const handelAccountJwt = require('../handleAccountJwt')
const Account = require('../models/account')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwtConfig')

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

exports.addBill = async (req, res) => {
  var accountId
  var cafe_id
  var table_id = req.body.tableId
  var billInformation = req.body.billInformation
  var totalPrice = 0

  await jwt.verify(req.token, jwtSecret.secret, (err, data) => {
    if (err) {
      console.log(err)
      res.sendStatus(403)
    } else {
      accountId = data.id
    }
  })
  await billInformation.forEach(info => {
    Drink.findOne({ _id: info.drink_id })
      .then(data => {
        totalPrice += data.price * info.quantity
      })
      .catch(err => { console.log(err) })
  })

  await Account.findOne({ _id: accountId })
    .then(data => {
      cafe_id = data.cafe_id
    })
    .catch(err => {
      console.log(err)
    })

  let newBill = new Bill({
    cafe_id: cafe_id,
    table_id: table_id,
    billInformation: billInformation,
    totalPrice: totalPrice
  })

  await wait(2000)

  await newBill.save()
    .then(bill => {
      if (bill) {
        res.json({
          bill: bill,
          result: true,
          message: 'New bill is created'
        })
      } else {
        res.json({
          result: false,
          message: "Can't create this bill"
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.payABill = (req, res) => {
  let id = req.params.billId

  Bill.findOneAndUpdate({ _id: id }, { $set: { endedTime: new Date(), status: true } })
    .then(() => {
      res.json({
        result: true
      })
    }
    )
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.updateOneBill = async (req, res) => {
  var id = req.params.billId
  var billInformation = req.body.billInformation
  var totalPrice = 0

  await billInformation.forEach(info => {
    Drink.findOne({ _id: info.drink_id })
      .then(data => {
        totalPrice += data.price * info.quantity
        console.log(totalPrice)
      })
      .catch(err => { console.log(err) })
  })

  await wait(1000)

  await Bill.findOneAndUpdate({ _id: id }, { $set: { billInformation: billInformation, totalPrice: totalPrice } })
    .then((data) => {
      res.json({
        result: true
      })
    }
    )
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.getTotalBillPriceByHour = async (req, res) => {
  // let accountId
  let cafe_id = req.params.cafeId
  let date = new Date()

  let time
  let dd = date.getDate()
  let returnPrice = []
  if (dd < 10) {
    dd = '0' + dd
  }
  let mm = date.getMonth() + 1
  if (mm < 10) {
    mm = '0' + mm
  }
  let yyyy = date.getFullYear()
  let day = yyyy + '-' + mm + '-' + dd

  // await jwt.verify(req.token, jwtSecret.secret, (err, data) => {
  //   if (err) {
  //     console.log(err)
  //     res.sendStatus(403)
  //   } else {
  //     accountId = data.id
  //   }
  // })

  // await Account.findOne({ _id: accountId })
  //   .then(data => {
  //     cafe_id = data.cafe_id
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })

  for (time = 1; time <= 15; time = time + 2) {
    let endTime = time + 2
    if (time < 10) {
      time = '0' + time
    }
    if (endTime < 10) {
      endTime = '0' + endTime
    }
    time = time.toString()
    endTime = endTime.toString()
    await Bill.find({ cafe_id: cafe_id, endedTime: { $gt: `${day}T${time}:00:00.000Z`, $lt: `${day}T${endTime}:00:00.000Z` } })
      .then((bill) => {
        let price = 0
        bill.forEach(element => {
          price += element.totalPrice
        })
        returnPrice.push(price)
      })
      .catch(err => {
        console.log(err)
        res.json({
          result: false
        })
      })
    time = parseInt(time)
  }
  res.json({
    revenue: returnPrice,
    result: true
  })
}

exports.getTotalRevenueByDay = async (req, res) => {
  // let accountId
  let cafe_id = req.params.cafeId
  let date = new Date()

  let dd = date.getDate()
  if (dd < 10) {
    dd = '0' + dd
  }
  let mm = date.getMonth() + 1
  if (mm < 10) {
    mm = '0' + mm
  }
  let yyyy = date.getFullYear()
  let day = yyyy + '-' + mm + '-' + dd
  let revenue = 0

  // await jwt.verify(req.token, jwtSecret.secret, (err, data) => {
  //   if (err) {
  //     console.log(err)
  //     res.sendStatus(403)
  //   } else {
  //     accountId = data.id
  //   }
  // })

  // await Account.findOne({ _id: accountId })
  //   .then(data => {
  //     cafe_id = data.cafe_id
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })

  await Bill.find({ cafe_id: cafe_id, endedTime: { $gt: `${day}T01:00:00.000Z`, $lt: `${day}T15:00:00.000Z` } })
    .then(data => {
      data.forEach(bill => {
        revenue += bill.totalPrice
      })
      res.json({
        result: true,
        revenue: revenue
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.getTotalBillByDay = async (req, res) => {
  let cafe_id = req.params.cafeId
  let date = new Date()

  let dd = date.getDate()
  if (dd < 10) {
    dd = '0' + dd
  }
  let mm = date.getMonth() + 1
  if (mm < 10) {
    mm = '0' + mm
  }
  let yyyy = date.getFullYear()
  let day = yyyy + '-' + mm + '-' + dd
  let totalBill = 0

  await Bill.find({ cafe_id: cafe_id, endedTime: { $gt: `${day}T01:00:00.000Z`, $lt: `${day}T15:00:00.000Z` } })
    .then(data => {
      data.forEach(bill => {
        totalBill++
      })
      res.json({
        result: true,
        totalBill: totalBill
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.getTotalDrinkByDay = async (req, res) => {
  let cafe_id = req.params.cafeId
  let date = new Date()

  let dd = date.getDate()
  if (dd < 10) {
    dd = '0' + dd
  }
  let mm = date.getMonth() + 1
  if (mm < 10) {
    mm = '0' + mm
  }
  let yyyy = date.getFullYear()
  let day = yyyy + '-' + mm + '-' + dd
  let totalDrink = 0

  await Bill.find({ cafe_id: cafe_id, endedTime: { $gt: `${day}T01:00:00.000Z`, $lt: `${day}T15:00:00.000Z` } })
    .then(data => {
      data.forEach(bill => {
        // console.log(bill.billInformation)
        bill.billInformation.forEach(info => {
          totalDrink += info.quantity
        })
      })
      res.json({
        result: true,
        totalDrink: totalDrink
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.getQuantityDrinkByDay = async (req, res) => {
  let accountId
  let cafe_id
  let date = new Date()

  let dd = date.getDate()
  if (dd < 10) {
    dd = '0' + dd
  }
  let mm = date.getMonth() + 1
  if (mm < 10) {
    mm = '0' + mm
  }
  let yyyy = date.getFullYear()
  let day = yyyy + '-' + mm + '-' + dd
  let totalDrink = 0

  await jwt.verify(req.token, jwtSecret.secret, (err, data) => {
    if (err) {
      console.log(err)
      res.sendStatus(403)
    } else {
      accountId = data.id
    }
  })

  await Account.findOne({ _id: accountId })
    .then(data => {
      cafe_id = data.cafe_id
    })
    .catch(err => {
      console.log(err)
    })

  await Bill.find({ cafe_id: cafe_id, endedTime: { $gt: `${day}T01:00:00.000Z`, $lt: `${day}T15:00:00.000Z` } })
    .then(data => {
      data.forEach(bill => {
        bill.billInformation.forEach(info => {
          totalDrink += info.quantity
        })
      })
      res.json({
        result: true,
        totalDrink: totalDrink
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.getQuantityOfEachDrinkByDay = async (req, res) => {
  let cafe_id = req.params.cafeId
  let categoryId = []
  let date = new Date()

  let dd = date.getDate()
  if (dd < 10) {
    dd = '0' + dd
  }
  let mm = date.getMonth() + 1
  if (mm < 10) {
    mm = '0' + mm
  }
  let yyyy = date.getFullYear()
  let day = yyyy + '-' + mm + '-' + dd
  let quantiyOfDrink = []

  await Category.find({ cafe_id: cafe_id })
    .then(data => {
      data.forEach(category => {
        categoryId.push(category._id)
      })
    })
    .catch(err => console.log(err))

  await categoryId.forEach(id => {
    Drink.find({ category_id: id, status: true })
      .then(data => {
        data.forEach(drink => {
          quantiyOfDrink.push({
            drink_id: drink._id,
            name: drink.name,
            quantity: 0
          })
        })
      })
      .catch(err => console.log(err))
  })
  await wait(500)

  await Bill.find({ cafe_id: cafe_id, endedTime: { $gt: `${day}T01:00:00.000Z`, $lt: `${day}T15:00:00.000Z` } })
    .then(async data => {
      await data.forEach(async bill => {
        await bill.billInformation.forEach(async info => {
          await quantiyOfDrink.forEach(drink => {
            if (info.drink_id.toString() == drink.drink_id.toString()) {
              drink.quantity = drink.quantity + info.quantity
            }
          })
        })
      })
      await wait(1000)
      res.json({
        result: true,
        drink: quantiyOfDrink
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
}

exports.getAllBill = async (req, res) => {
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

  let getTime = (time) => {
    if (time === null || time === undefined) {
      return null
    }
    let hh = time.getHours()
    if (hh < 10) {
      hh = '0' + hh
    }
    let mm = time.getMinutes()
    if (mm < 10) {
      mm = '0' + mm
    }
    let ss = time.getSeconds()
    if (ss < 10) {
      ss = '0' + ss
    }
    let returnedTime = hh + ':' + mm + ':' + ss
    return returnedTime
  }

  await Bill.find({ cafe_id: cafe_id })
    .then(async bills => {
      let data = []
      await bills.forEach(async bill => {
        let quantity = 0
        let billInfo = []
        bill.billInformation.forEach(info => {
          quantity += info.quantity
          Drink.findOne({ _id: info.drink_id })
            .then(drink => {
              Object.assign(info, { name: drink.name, price: drink.price })
              billInfo.push({ _id: info.drink_id, name: drink.name, quantity: info.quantity, price: drink.price, total: info.quantity * drink.price })
            })
        })
        let tableName = ''
        let day = timeFormat(bill.startedTime)
        let startedTime = getTime(bill.startedTime)
        let endedTime = getTime(bill.endedTime)
        await Table.findOne({ _id: bill.table_id, status: true })
          .then(table => {
            tableName = table.name
          })
        data.push({ _id: bill._id, tableName: tableName, date: day, startedTime: startedTime, endedTime: endedTime, billInformation: billInfo, quantity: quantity, total: bill.totalPrice, status: bill.status })
      })
      await wait(1000)
      res.json({
        result: true,
        bills: data
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        result: false
      })
    })
} 