const { authRole } = require('../MiddleWares/authRole')
const { createPaymentIntent, confirmPayment, updatePaymentStatus } = require('../controllers/paymentController')

const paymentRouter = require('express').Router()


paymentRouter.post('/CreatePaymentIntent', authRole("customer","staff","admin"), createPaymentIntent)
paymentRouter.post('/confirmPayment', authRole("customer","staff","admin"), confirmPayment)
paymentRouter.put('/updatePaymentStatus', authRole("customer","staff","admin"), updatePaymentStatus)


module.exports = paymentRouter