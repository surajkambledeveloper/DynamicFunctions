const express = require("express");
const router = express.Router();

const { saveResume,getResume } = require("../../controllers/dynamicController/dynamicResumeController");

router.post("/save", saveResume);
router.get("/getResume", getResume);


module.exports = router;
