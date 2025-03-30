const { createMenuItem, updateMenuItem, deleteMenuItem, getMenuItems, getPopularItems, updateChefSpecial } = require('../controllers/menuItemController')
const { authRole } = require('../MiddleWares/authRole')
const upload = require('../MiddleWares/multer')

const menuItemRouter = require('express').Router()


menuItemRouter.post('/createMenuItem', authRole('admin','staff'), upload.single("image"), createMenuItem)
menuItemRouter.get('/getMenuItems' , authRole('customer','admin','staff'), getMenuItems)
menuItemRouter.get('/chefSpecial', authRole('customer','staff','admin'), getPopularItems)
menuItemRouter.put('/updateChefSpecial', authRole('staff','admin'), updateChefSpecial)
menuItemRouter.put('/updateMenuItem/:menuItemId', authRole('admin','staff'), updateMenuItem)
menuItemRouter.delete('/deleteMenuItem/:menuItemId', authRole('admin','staff'), deleteMenuItem)


module.exports = menuItemRouter