const { register } = require('../controllers/adminController')
const adminRouter = require('express').Router()


adminRouter.post('/register', register)



module.exports = adminRouter