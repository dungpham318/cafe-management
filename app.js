const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').load()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const jwtSecret = require('./jwtConfig')
const Account = require('./models/account')
const fetch = require('node-fetch')

app.use(cors())

var server = require('http').createServer(app)
var io = require('socket.io')(server)
io.origins("http://localhost:3000")

// bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Passport middleware
require('./passport')

//Session
// app.use(
//   session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true,
//   })
// )

// init passport
app.use(passport.initialize());
app.use(passport.session());

//route
let routes = require('./routes')

// routes(app)
app.use('/api', routes)

// connect database
mongoose.connect('mongodb://localhost:27017/cafe-management-system', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connect successfully!')
  }
})

io.on('connection', async (socket) => {
  socket.auth = false;
  let accountId
  let cafe_id
  await socket.on('authenticate', async (data) => {
    await jwt.verify(data.token, jwtSecret.secret, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log("Authenticated socket ", socket.id);
        socket.auth = true;
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

    setInterval(async () => {
      await fetch(`http://localhost:5000/api/get_total_revenue_by_day/${cafe_id}`, {
        method: 'GET',
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          socket.emit("TodayRevenue", { 'revenue': data.revenue })
        })
        .catch(err => console.log(err))
      await fetch(`http://localhost:5000/api/get_total_bill_by_day/${cafe_id}`, {
        method: 'GET',
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          socket.emit("TodayOrders", { 'totalBill': data.totalBill })
        })
        .catch(err => console.log(err))
      await fetch(`http://localhost:5000/api/get_total_drink_by_day/${cafe_id}`, {
        method: 'GET',
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          socket.emit("TodayDrinks", { 'totalDrink': data.totalDrink })
        })
        .catch(err => console.log(err))
      await fetch(`http://localhost:5000/api/get_price_by_hour/${cafe_id}`, {
        method: 'GET',
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          socket.emit("RevenueByHour", { 'revenueByHour': data.revenue })
        })
        .catch(err => console.log(err))
      await fetch(`http://localhost:5000/api/get_quantity_drink_by_day/${cafe_id}`, {
        method: 'GET',
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          socket.emit("QuantityDrink", { 'quantityDrink': data.drink })
        })
        .catch(err => console.log(err))
    }, 5000)

    await socket.join(cafe_id)

    let d
    await socket.on('OrderData', data => {
      d = data
    })

    await setInterval(() => {
      socket.in(cafe_id).emit('GetOrderData', { orderDatas: d })
    }, 5000)
  })

  setTimeout(function () {
    if (!socket.auth) {
      console.log("Disconnecting socket ", socket.id);
      socket.disconnect('unauthorized');
    }
  }, 1000);
})

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' })
})

server.listen(port)

console.log(`server started on: ${port}`)