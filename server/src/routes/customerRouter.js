const { getCustomers, updateCustomer } = require('../controllers/customerController')
const { authRole } = require('../MiddleWares/authRole')

const customerRouter = require('express').Router()

customerRouter.get('/getCustomers', authRole('admin','staff'), getCustomers)
customerRouter.put('/updateCustomer', authRole('customer'), updateCustomer)

module.exports = customerRouter