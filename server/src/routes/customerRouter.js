const { getCustomers } = require('../controllers/customerController')
const { authRole } = require('../MiddleWares/authRole')

const customerRouter = require('express').Router()


customerRouter.get('/getCustomers', authRole('admin','staff'), getCustomers)


module.exports = customerRouter