const { authRole } = require('../MiddleWares/authRole')
const { createPaymentIntent, confirmPayment, updatePayment } = require('../controllers/paymentController')

const paymentRouter = require('express').Router()


paymentRouter.post('/CreatePaymentIntent', authRole("customer","staff","admin"), createPaymentIntent)
paymentRouter.post('/confirmPayment', authRole("customer","staff","admin"), confirmPayment)
paymentRouter.put('/updatePayment/:orderId', authRole("customer","staff","admin"), updatePayment)


module.exports = paymentRouter