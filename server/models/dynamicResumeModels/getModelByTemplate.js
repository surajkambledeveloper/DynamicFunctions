
// add your tamplate here 
const ResumeTemplate8 = require("../../models/resumeTemplatesModels/resumeTemplate8Model");
const ResumeTemplate6=require("../../models/resumeTemplatesModels/resumeTemplate6Model")
const ResumeTemplate9=require("../../models/resumeTemplatesModels/testingModel")
const ResumeTemplate14=require("../../models/resumeTemplatesModels/resumeTemplate14Model")
// Baad mein aur templates add karna ho to yaha karein

const models = {
  temp8: ResumeTemplate8,
  temp6: ResumeTemplate6,
  temp9: ResumeTemplate9,
  temp14: ResumeTemplate14,
  // temp1: ResumeTemplate1,
  // temp2: ResumeTemplate2,
};

const getModelByTemplate = (templateId) => {
  return models[templateId] || null;
};

module.exports = {
  getModelByTemplate,
};
