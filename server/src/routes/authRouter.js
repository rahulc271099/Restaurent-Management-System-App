const { login } = require('../controllers/userController')

const authRouter = require('express').Router()


authRouter.post('/login', login)


module.exports = authRouter