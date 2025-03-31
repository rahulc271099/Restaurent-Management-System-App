const { getReports } = require('../controllers/reportControllers')
const { authRole } = require('../MiddleWares/authRole')

const reportRouter = require('express').Router()


reportRouter.get('/getReport', authRole("admin"), getReports)


module.exports = reportRouter