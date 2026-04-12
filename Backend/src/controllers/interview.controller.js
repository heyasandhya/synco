const pdfParse = require("pdf-parse")
const { generateInterviewReport,generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {

	let resumeContent = { text: "" }

	// ✅ ONLY FIX: avoid crash when no file
	if (req.file) {
		const resume = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
		resumeContent = resume
	}

	const { selfDescription, jobDescription } = req.body
	//console.log("BODY:", req.body)// final remove

	const interviewReportByAi = await generateInterviewReport({
		resume: resumeContent.text,
		selfDescription,
		jobDescription
	})


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

	const fixedSkillGap = (interviewReportByAi.skillGap || []).reduce((acc, curr, i, arr) => {
		if (curr === "skill") {
			acc.push({
				skill: "low",
				severity: arr[i + 3] || "low"
			})
		}
		return acc
	}, [])

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
		title: jobDescription.slice(0, 50),
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

async function getAllInterviewReportController(req, res) {
	const interviewReport = await interviewReportModel
		.find({ user: req.user.id })
		.sort({ createdAt: -1 })
		.select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationPlan")

	res.status(200).json({
		message: "Interview reports fetched successfully.",
		interviewReport
	})
}

/**
 * @description This controller generates a resume pdf based on user self description and the job description.
 */

async function generateResumePdfController(req, res) {
	const { interviewReportId } = req.params
	
	const interviewReport = await interviewReportModel.findById(interviewReportId)

	if (!interviewReport) {
		return res.status(404).json({
			message: "Interview report not found."
		})
	}

	const { resume, jobDescription, selfDescription } = interviewReport

	const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

	res.set({
		"Content-Type": "application/pdf",
		"Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
	})

	res.send(pdfBuffer)
}

module.exports = {
	generateInterviewReportController,
	getInterviewReportByIdController,
	getAllInterviewReportController,
	generateResumePdfController,
}