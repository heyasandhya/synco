const mongoose = require('mongoose');

/**
 * job description schema  : String
 * resume text  : String
 * self description  : String
 * 
 * matchscore: Number
 * 
 * Techincal questions :[{
 * questions: "",
 * intension: "",
 * answer :"",
 * }]
 * 
 * 
 * behvioural question : [
 * {
 * questions: "",
 * intension: "",
 * answer :""
 * }]
 * 
 * skills gap :[{
 * skill :"",
 * severity: {
 * types: string,
 * enum: ["low", "medium", "high"]}
 * }]
 * 
 * preparation plan :[{
 * 	day: Number,
 * 	focus: String,
 * tasks: [String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
	question: {
		type: String,
		required: [true, "Technical question is required"]
	},
	intention: {
		type: String,
		required: [true, "Intention is required"]
	},
	answer: {
		type: String,
		required: [true, "Answer is required"]
	}
}, {
	_id: false,
})

const behavioralQuestionSchema = new mongoose.Schema({
	question: {
		type: String,
		required: [true, "Technical question is required"]
	},
	intention: {
		type: String,
		required: [true, "Intention is required"]
	},
	answer: {
		type: String,
		required: [true, "Answer is required"]
	}
}, {
	_id: false,
})

const skillGapSchema = new mongoose.Schema({
	skill: {
		type: String,
		enum: ["low", "medium", "high"],
		required: [true, "Severity is required"]
	}
}, {
	_id: false,
})

const preparationPlanSchema = new mongoose({
	day: {
		type: Number,
		required: [true, "Day is required"]
	},
	focus: {
		type: String,
		required: [true, "Focus is required"]
	},
	tasks: [{
		type: String,
		required: [true, "Task is required"]
	}]
})

const interviewReportSchema = new mongoose.Schema({
	jobDescription: {
		type: String,
		required: true,
	},
	resumeText: {
		type: String,
	},
	selfDescription: {
		type: String,
	},
	matchScore: {
		type: Number,
		min: 0,
		max: 100,
	},
	technicalQuestion: [technicalQuestionSchema],
	behavioralQuestion: [behavioralQuestionSchema],
	skillGap: [skillGapSchema],
	preparationPlan: [preparationPlanSchema]
}, {
	timestamps: true
})




const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;
