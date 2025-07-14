const express = require("express");
const router = express.Router();
const resumeController = require("../../controllers/resumeTemplateControllers/resumeTemplate1Controller"); // ✅ Ensure path is correct

// ✅ Fix Routes
router.post("/create", resumeController.createResume);
router.post("/save", resumeController.saveResume);
router.post("/generate-pdf", resumeController.generatePDF);
router.post("/enhanceField", resumeController.enhanceField);
router.get("/load", resumeController.getResumeByEmail);


module.exports = router;
