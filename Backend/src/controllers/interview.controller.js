const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {

	const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
	const { selfDescription, jobDescription } = req.body

	const interviewReportByAi = await generateInterviewReport({
		resume: resumeContent.text,
		selfDescription,
		jobDescription
	})

	console.log("AI RESPONSE:", interviewReportByAi)

	// ✅ technicalQuestions fix
	const fixedTechnical = (interviewReportByAi.technicalQuestions || []).reduce((acc, curr, i, arr) => {
		if (curr === "question") {
			acc.push({
				question: arr[i + 1] || "",
				intention: arr[i + 3] || "",
				answer: arr[i + 5] || ""
			})
		}
		return acc
	}, [])

	// ✅ behavioralQuestions fix
	const fixedBehavioral = (interviewReportByAi.behavioralQuestions || []).reduce((acc, curr, i, arr) => {
		if (curr === "question") {
			acc.push({
				question: arr[i + 1] || "",
				intention: arr[i + 3] || "",
				answer: arr[i + 5] || ""
			})
		}
		return acc
	}, [])

	// ✅ skillGap fix
	const fixedSkillGap = (interviewReportByAi.skillGap || []).reduce((acc, curr, i, arr) => {
		if (curr === "skill") {
			acc.push({
				skill: "low",
				severity: arr[i + 3] || "low"
			})
		}
		return acc
	}, [])

	// ✅ preparationPlan fix
	const fixedPlan = (interviewReportByAi.preparationPlan || []).reduce((acc, curr, i, arr) => {
		if (curr === "day") {
			acc.push({
				day: arr[i + 1] || 1,
				focus: arr[i + 3] || "",
				tasks: [arr[i + 5] || ""]
			})
		}
		return acc
	}, [])

	const interviewReport = await interviewReportModel.create({
		user: req.user.id,
		resumeText: resumeContent.text,
		selfDescription,
		jobDescription,
		matchscore: interviewReportByAi.matchscore || 0,

		technicalQuestions: fixedTechnical,
		behavioralQuestions: fixedBehavioral,
		skillGap: fixedSkillGap,
		preparationPlan: fixedPlan
	})

	res.status(201).json({
		message: "Inerview report generated successfully",
		interviewReport
	})
}


/**
 * 
 * @description Get interview report by interviewId.
 */

async function getInterviewReportByIdController(req, res) {
	const { interviewId } = req.params

	const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

	if (!interviewReport) {
		return res.status(404).json({
			message: "Interview report not found."
		})
	}

	res.status(200).json({
		message: "Interview report fetched successfully.",
		interviewReport
	})
}


/**
 * 
 * @description Get all interview reports of the logged in user. 
 */
async function getAllInterviewReportController(req, res) {
	const interviewReport = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationPlan")

	res.status(200).json({
		message: "Interview reports fetched successfully.",
		interviewReport
	})
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportController }