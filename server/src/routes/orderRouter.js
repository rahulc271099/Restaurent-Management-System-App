const { createOrder, updateOrder, deleteOrder, getOrders, getOneOrder, updateOrderItems, getOrderItems, deleteOrderItem, getLatestOrder, getPendingOrders } = require('../controllers/orderController')
const { authRole } = require('../MiddleWares/authRole')

const orderRouter = require('express').Router()


orderRouter.post('/createOrder', authRole('staff','customer'), createOrder)
orderRouter.get('/getOrders', authRole('customer','admin','staff'), getOrders)
orderRouter.get('/getOneOrder/:orderId', authRole('admin','staff','customer'), getOneOrder)
orderRouter.get('/getPendingOrders', authRole('admin'), getPendingOrders)
orderRouter.get('/getLatestOrder',authRole("customer"), getLatestOrder)
orderRouter.get('/getOrderItems/:orderId', authRole('customer'), getOrderItems)
orderRouter.put('/updateOrder/:orderId', authRole('admin','staff','customer'), updateOrder)
orderRouter.put('/updateOrderItems/:orderId', authRole('admin','staff','customer'), updateOrderItems)
orderRouter.delete('/removeOrderItem/:orderId/:orderItemId', authRole('customer','staff'), deleteOrderItem)
orderRouter.delete('/removeOrder/:orderId', authRole('staff','customer'), deleteOrder)


module.exports = orderRouter