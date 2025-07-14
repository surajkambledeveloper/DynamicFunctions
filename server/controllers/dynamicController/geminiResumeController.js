// const { saveResumeData } = require("../services/geminiResumeService");
const { saveResumeData } = require("../../services/dynamicServices/dynamicGeminiResume");
// const { enhanceFieldData } = require("../services/geminiResumeService");
const { enhanceFieldData } = require("../../services/dynamicServices/dynamicGeminiResume");

const saveResume = async (req, res) => {
  try {
    const { templateId, ...data } = req.body;
    const saved = await saveResumeData(templateId, data);
    res.status(200).json({ message: "Resume saved", data: saved });
  } catch (err) {
    res.status(500).json({ message: "Save error", error: err.message });
  }
};

// inhance each field using gimini api 
const enhanceField = async (req, res) => {
  try {
    const updatedResume = await enhanceFieldData(req.body);
    res.status(200).json({
      message: `${req.body.field} enhanced successfully`,
      data: updatedResume,
    });
  } catch (error) {
    console.error("Error enhancing field:", error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
};

module.exports = {
  saveResume,enhanceField
};
