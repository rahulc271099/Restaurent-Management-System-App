const { createReservation, getReservationDetails, getOneReservation, updateReservation, deleteReservation } = require('../controllers/raservationControllers')
const { authRole } = require('../MiddleWares/authRole')

const reservationRouter = require('express').Router()


reservationRouter.post('/createReservation', authRole('staff','customer'), createReservation)
reservationRouter.get('/getReservations', authRole('/admin','staff'), getReservationDetails)
reservationRouter.get('/getOneReserVation', authRole('admin','staff','customer'), getOneReservation)
reservationRouter.put('/updateReservation', authRole('admin','staff','customer'), updateReservation)
reservationRouter.delete('/removeReservation', authRole('admin','staff','customer'), deleteReservation)


module.exports = reservationRouter