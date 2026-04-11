const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()


/**
 * @routes POST /api/interview/
 * @description Generate an interview report for a candidate based on their resume pdf, self description and the job description 
 * @access Private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @routes GET/api/interview/report/:interviewId
 * @description Get interview report by interviewid.
 * @access Private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET/api/interview/
 * @description Get all interview reports of the logged in user.
 * @access Private
 */

interviewRouter.get("/", authMiddleware.authUser,interviewController.getAllInterviewReportController)

module.exports = interviewRouter