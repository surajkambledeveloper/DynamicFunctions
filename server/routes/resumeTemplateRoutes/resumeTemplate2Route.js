const express = require("express");
const router = express.Router();
// const resumeTemplate2Controller = require("../controllers/resumeTemplate2Controller"); // ✅ Ensure path is correct
const resumeTemplate2Controller = require("../../controllers/resumeTemplateControllers/resumeTemplate2Controller"); // ✅ Ensure path is correct

// ✅ Fix Routes
router.post("/create", resumeTemplate2Controller.createResume);
router.post("/save", resumeTemplate2Controller.saveResume);
router.post("/generate-pdf", resumeTemplate2Controller.generatePDF);
router.post("/enhanceField", resumeTemplate2Controller.enhanceField);

module.exports = router;
