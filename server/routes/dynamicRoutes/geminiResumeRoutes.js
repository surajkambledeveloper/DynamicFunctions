const express = require("express");
const router = express.Router();

// const { saveResume,enhanceField } = require("../controllers/resumeTemplateController");
const { saveResume,enhanceField } = require("../../controllers/dynamicController/geminiResumeController");

//  POST: Save or update resume for any template
router.post("/save", saveResume);
router.post("/enhance", enhanceField);

module.exports = router;
