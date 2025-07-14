const resumeController = require("../../controllers/resumeTemplateControllers/resumeTemplate7Controller");



const express = require("express");
const router = express.Router();

router.post("/create", resumeController.createResume);
router.post("/save", resumeController.saveResume);
router.post("/enhanceField", resumeController.enhanceField);
router.post("/generate-pdf", resumeController.generateAndDownloadPDF);
router.get("/load", resumeController.getResumeByEmail);

module.exports = router;
