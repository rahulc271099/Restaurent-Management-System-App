const { getReports, getLatestReport } = require('../controllers/reportControllers')
const { authRole } = require('../MiddleWares/authRole')

const reportRouter = require('express').Router()


reportRouter.get('/getReport', authRole("admin"), getReports)
reportRouter.get('/getLatestReport', authRole("admin"), getLatestReport)


module.exports = reportRouter