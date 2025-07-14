
const { saveResumeData } = require("../../services/dynamicServices/dynamicResumeService");
const { getResumeData } = require("../../services/dynamicServices/dynamicResumeService");

const saveResume = async (req, res) => {
  try {
    const { templateId, ...data } = req.body;
    const saved = await saveResumeData(templateId, data);
    res.status(200).json({ message: "Resume saved", data: saved });
  } catch (err) {
    res.status(500).json({ message: "Save error", error: err.message });
  }
};

const getResume = async (req, res) => {
  try {
    const { templateId, resumeId } = req.query; //  Make sure frontend sends these as query params

    const resume = await getResumeData(templateId, resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error(" Error fetching resume:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching resume",
      error: error.message,
    });
  }
};


module.exports = {
  saveResume,
  getResume
};
