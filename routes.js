const router = require('express').Router()
const verifyToken = require('./auth')

// check api worked
router.get('/', (req, res, next) => {
  res.json({
    status: 'api working done',
    message: 'Successfully'
  })
})

// register
var registerController = require('./api/registerController')
router.route('/signup')
  .post(registerController.newAccount)
router.route('/create_new_staff_account')
  .post(verifyToken, registerController.createNewStaffAccount)
router.route('/update_one_account/:accountId')
  .patch(registerController.updateAccount)
router.route('/delete_one_account/:accountId')
  .get(registerController.deleteOneAccount)
router.route('/get_all_staff_account')
  .get(verifyToken, registerController.getAllStaffAccount)

// login
var loginController = require('./api/loginController')
router.route('/login')
  .post(loginController.login)

//dashboard
var dashboardController = require('./api/dashboardController')
router.route('/dashboard')
  .get(verifyToken, dashboardController.checkRole)
router.route('/getCafeId')
  .get(verifyToken, dashboardController.getCafeId)

//category
var categoryController = require('./api/categoryController')
router.route('/add_new_category')
  .post(verifyToken, categoryController.addCategory)
router.route('/delete_one_category/:categoryId')
  .get(categoryController.deleteOneCategory)
router.route('/update_one_category/:categoryId')
  .patch(categoryController.updateCategory)
router.route('/get_all_category')
  .get(verifyToken, categoryController.getAllCategory)


// drink
var drinkController = require('./api/drinkController')
router.route('/add_new_drink')
  .post(drinkController.addDrink)
router.route('/delete_one_drink/:drinkId')
  .get(drinkController.deleteOneDrink)
router.route('/update_one_drink/:drinkId')
  .put(drinkController.updateDrink)
router.route('/get_all_drink')
  .get(verifyToken, drinkController.getAllDrink)

// table
var tableController = require('./api/tableController')
router.route('/add_new_table')
  .post(verifyToken, tableController.addTable)
router.route('/delete_one_table/:tableId')
  .get(tableController.deleteTable)
router.route('/update_one_table/:tableId')
  .patch(tableController.updateoneTable)
router.route('/get_all_table')
  .get(verifyToken, tableController.getAllTable)

// bill
var billController = require('./api/billController')
router.route('/add_new_bill')
  .post(verifyToken, billController.addBill)
router.route('/pay_a_bill/:billId')
  .patch(billController.payABill)
router.route('/update_one_bill/:billId')
  .patch(billController.updateOneBill)
router.route('/get_price_by_hour/:cafeId')
  .get(billController.getTotalBillPriceByHour)
router.route('/get_total_revenue_by_day/:cafeId')
  .get(billController.getTotalRevenueByDay)
router.route('/get_total_bill_by_day/:cafeId')
  .get(billController.getTotalBillByDay)
router.route('/get_total_drink_by_day/:cafeId')
  .get(billController.getTotalDrinkByDay)
router.route('/get_quantity_drink_by_day/:cafeId')
  .get(billController.getQuantityOfEachDrinkByDay)
router.route('/get_all_bill')
  .get(verifyToken, billController.getAllBill)
module.exports = router