const { createMenuItem, updateMenuItem, deleteMenuItem, getMenuItems } = require('../controllers/menuItemController')
const { authRole } = require('../MiddleWares/authRole')

const menuItemRouter = require('express').Router()


menuItemRouter.post('/createMenuItem', authRole('admin','staff'), createMenuItem)
menuItemRouter.get('/getMenuItems' , authRole('customer','admin','staff'), getMenuItems)
menuItemRouter.put('/updateMenuItem/:menuItemId', authRole('admin','staff'), updateMenuItem)
menuItemRouter.delete('/deleteMenuItem/:menuItemId', authRole('admin','staff'), deleteMenuItem)


module.exports = menuItemRouter