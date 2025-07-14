require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model instance
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = { geminiModel };
