const adminRouter = require('./adminRouter')
const staffRouter = require('./staffRouter')
const customerRouter = require('./customerRouter')
const authRouter = require('./authRouter')
const { authRole, verifyToken, verifyUser } = require('../MiddleWares/authRole')
const { register } = require('../controllers/adminController')
const { logOut } = require('../controllers/userController')
const tableRouter = require('./tableRouter')
const reservationRouter = require('./reservationRouter')
const waitingListRouter = require('./waitingListRouter')
const menuItemRouter = require('./menuItemRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')

const apiRouter = require('express').Router()


apiRouter.use('/customer', verifyToken, customerRouter)
apiRouter.use('/admin', adminRouter)
apiRouter.use('/staff', verifyToken, staffRouter)
apiRouter.use('/table', verifyToken, tableRouter)
apiRouter.use('/menuItem', verifyToken, menuItemRouter)
apiRouter.use('/cart', verifyToken, cartRouter)
apiRouter.use('/order', verifyToken, orderRouter)
apiRouter.use('/reservation', verifyToken, reservationRouter)
apiRouter.use('/waitingList', verifyToken, waitingListRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/auth/verify', verifyUser)
apiRouter.use('/register', register)
apiRouter.use('/logOut', logOut)


module.exports = apiRouter