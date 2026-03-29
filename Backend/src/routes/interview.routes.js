const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")

const interviewRouter = express.Router()


/**
 * @routes POST /api/interview/
 * @description Generate an interview report for a candidate based on their resume pdf, self description and the job description 
 * @access Private
 */

interviewRouter.post("/", authMiddleware.authUser,interviewController.generateInterviewReportController)

module.exports = interviewRouter