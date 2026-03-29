const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY
})


const interviewReportSchema = z.object({
	matchscore: z.number().describe("The match score between the candidate and the job describe, on a scale of 0 to 100, where 100 means a perfect match and 0 means no match at all"),
	technicalQuestions: z.array(z.object({
		question: z.string().describe("The technical question can be asked in the interview"),
		intention: z.string().describe("The intention of the interview behind asking this question"),
		answer: z.string().describe("How to answer this question, what points to be cover, what approaches to take etc.")
	})).describe("Technical questions that can be asked in the interview along with the intention behind asking this question and how to answer it"),
	ByteLengthQueuing: z.array(z.object({
		question: z.string().describe("The technical question can be asked in the interview"),
		intention: z.string().describe("The intention of the interview behind asking this question"),
		answer: z.string().describe("How to answer this question, what points to be cover, what approaches to take etc.")
	})).describe("Behavioural questions that can be asked in the interview along with the intention behind asking this question and how to answer it"),
	skillGap: z.array(z.object({
		skill: z.string().describe("The skill that the candidate is lacking"),
		severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, i.e., how important is it for the candidate to have this skill for the job they are applying for"),
	})).describe("List of skills that the candidate is lacking along with the severity"),
	preparationPlan: z.array(z.object({
		day: z.number().describe("The day of the preparation plan, e.g., day 1, day 2, etc."),
		focus: z.string().describe("The focus of the preparation for that day, e.g., data structures, system design, etc."),
		tasks: z.array(z.string()).describe("The tasks to be done on that day for preparation, e.g., solve 5 coding problems, read a chapter of a book, etc.")
	})).describe("A preparation plan for the candidate to follow in order to prepare for the interview effectively.")

})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

	const prompt = `Generate an interview report for a candidate with the following information:
	Resume: ${resume}
	Self Description: ${selfDescription}
	Job Description: ${jobDescription}`	

	const response = await ai.models.generateContent({
		model: "gemini-3-flash-preview",
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			responseSchema: zodToJsonSchema(interviewReportSchema)
		}
	})
	return JSON.parse(response.text)
	
}


module.exports = generateInterviewReport 