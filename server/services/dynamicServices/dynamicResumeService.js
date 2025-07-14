const mongoose = require("mongoose");
require("dotenv").config();


const { getModelByTemplate } = require("../../models/dynamicResumeModels/getModelByTemplate");

// save resume function with multi-template support
const saveResumeData = async (templateId, data) => {
  console.log(" Template ID:", templateId);

  const ResumeModel = getModelByTemplate(templateId);
  if (!ResumeModel) {
    console.error(" Invalid template ID:", templateId);
    throw new Error("Invalid template ID");
  }

  const { _id, ...resumeData } = data;

  if (_id && mongoose.Types.ObjectId.isValid(_id)) {
    const updated = await ResumeModel.findByIdAndUpdate(_id, resumeData, {
      new: true,
    });
    if (!updated) {
      console.error(" Resume not found for update:", _id);
      throw new Error("Resume not found");
    }
    return updated;
  } else {
    console.log(" Creating new resume document...");
    const newDoc = new ResumeModel(resumeData);
    const savedDoc = await newDoc.save();
    return savedDoc;
  }
};

// Get resume by ID (with multi-template support)
const getResumeData = async (templateId, resumeId) => {
  console.log(" Get Request Template ID:", templateId, "Resume ID:", resumeId);

  const ResumeModel = getModelByTemplate(templateId);
  if (!ResumeModel) {
    console.error(" Invalid template ID:", templateId);
    throw new Error("Invalid template ID");
  }

  if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
    console.error(" Invalid resume ID:", resumeId);
    throw new Error("Invalid resume ID");
  }

  const resume = await ResumeModel.findById(resumeId);
  if (!resume) {
    console.error(" Resume not found:", resumeId);
    throw new Error("Resume not found");
  }

  console.log(" Resume Fetched Successfully");
  return resume;
};



module.exports = {
  saveResumeData,
  getResumeData
 
};
