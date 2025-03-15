const { createCartItem, getCart, updateCartItem, deleteCartItem, clearCart } = require('../controllers/cartControllers')
const { authRole } = require('../MiddleWares/authRole')

const cartRouter = require('express').Router()


cartRouter.post('/createCart', authRole('customer'), createCartItem)
cartRouter.get('/getCart', authRole('customer'), getCart)
cartRouter.put('/updateCart', authRole('customer'), updateCartItem)
cartRouter.delete('/removeCart', authRole('customer'), deleteCartItem)
cartRouter.delete('/clearCart', authRole('customer'), clearCart)


module.exports = cartRouter