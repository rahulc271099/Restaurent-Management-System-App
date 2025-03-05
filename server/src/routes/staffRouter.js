const { createStaff, updateStaff, deleteStaff, getStaff } = require('../controllers/staffController')
const { authRole } = require('../MiddleWares/authRole')

const staffRouter = require('express').Router()

staffRouter.post('/createStaff', authRole('admin'), createStaff)
staffRouter.get('/getStaff', authRole('admin'), getStaff)
staffRouter.put('/updateStaff/:staffId', authRole('admin'), updateStaff)
staffRouter.delete('/removeStaff/:staffId', authRole('admin'), deleteStaff)


module.exports = staffRouter