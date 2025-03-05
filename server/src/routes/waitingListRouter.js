const { addToWaitingList, getWaitingList, updateWaitingList, deleteWaitingListEntry } = require('../controllers/waitingListControllers')
const { authRole } = require('../MiddleWares/authRole')

const waitingListRouter = require('express').Router()


waitingListRouter.post('/addTowaitingList', authRole('staff','customer'), addToWaitingList)
waitingListRouter.get('/getWaitingList', authRole('admin','staff'), getWaitingList)
waitingListRouter.put('/updateWaitingList', authRole('admin','staff'), updateWaitingList)
waitingListRouter.delete('/removeWaitingList', authRole('admin','staff','customer'), deleteWaitingListEntry)


module.exports = waitingListRouter