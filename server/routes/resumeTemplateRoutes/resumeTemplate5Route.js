const express = require("express");
const router = express.Router();
const resumeController = require("../../controllers/resumeTemplateControllers/resumeTemplate5Controller");

// Updated Routes
router.post("/save", resumeController.saveResume);       
router.get("/load", resumeController.loadResume);       
router.get("/load-by-id", resumeController.loadResumeById);
router.post("/generate-pdf", resumeController.generatePDF); 
router.post("/enhanceField", resumeController.enhanceField); 
router.post("/upload-parse", resumeController.uploadAndParseResume);

module.exports = router;