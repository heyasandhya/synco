const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")

const ai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY
})


async function generateInterviewReport({ resume, selfDescription, jobDescription}) {
	
}


module.exports = invokeGeminiAi