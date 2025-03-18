const { createReservation, getReservationDetails, getOneReservation, updateReservation, deleteReservation } = require('../controllers/raservationControllers')
const { authRole } = require('../MiddleWares/authRole')

const reservationRouter = require('express').Router()


reservationRouter.post('/createReservation', authRole('staff','customer'), createReservation)
reservationRouter.get('/getReservations', authRole('customer','admin','staff'), getReservationDetails)
reservationRouter.get('/getOneReserVation', authRole('admin','staff','customer'), getOneReservation)
reservationRouter.put('/updateReservation/:reservationId', authRole('admin','staff','customer'), updateReservation)
reservationRouter.delete('/removeReservation/:reservationId', authRole('admin','staff','customer'), deleteReservation)


module.exports = reservationRouter