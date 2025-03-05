const { createOrder, updateOrder, deleteOrder, getOrders, getOneOrder, updateOrderItems } = require('../controllers/orderController')
const { authRole } = require('../MiddleWares/authRole')

const orderRouter = require('express').Router()


orderRouter.post('/create', authRole('staff','customer'), createOrder)
orderRouter.get('/getOrders', authRole('admin','staff'), getOrders)
orderRouter.get('/getOneOrder/:orderId', authRole('admin','staff','customer'), getOneOrder)
orderRouter.put('/updateOrder/:orderId', authRole('staff','customer'), updateOrder)
orderRouter.put('/updateOrderItem', authRole('staff','customer'), updateOrderItems)
orderRouter.delete('/removeOrder/:orderId', authRole('staff','customer'), deleteOrder)


module.exports = orderRouter