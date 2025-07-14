
// add your tamplate here 
const ResumeTemplate14=require("../../models/resumeTemplatesModels/resumeTemplate14Model")
// Baad mein aur templates add karna ho to yaha karein

const models = {
  
  temp14: ResumeTemplate14,
  
};

const getModelByTemplate = (templateId) => {
  return models[templateId] || null;
};

module.exports = {
  getModelByTemplate,
};
