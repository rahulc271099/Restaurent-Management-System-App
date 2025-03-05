const { createTable, getTables, updateTable, deleteTable } = require('../controllers/tableController')
const { authRole } = require('../MiddleWares/authRole')

const tableRouter = require('express').Router()


tableRouter.post('/createTable', authRole('admin'), createTable)
tableRouter.get('/getTables', authRole('admin','staff'), getTables) 
tableRouter.put('/updateTable/:tableId', authRole('admin','staff'), updateTable)
tableRouter.delete('/removeTable/:tableId', authRole('admin'), deleteTable)

module.exports = tableRouter