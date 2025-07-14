const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    name: { type: String },
    role: { type: String },
    phone: { type: String },
    email: { type: String },
    linkedin: { type: String },
    location: { type: String },

    summary: { type: String },

    experience: {
      type: [
        {
          title: { type: String },
          companyName: { type: String },
          date: { type: String },
          companyLocation: { type: String },
          accomplishment: { type: [String], default: [] },
        },
      ],
      default: [],
    },

    education: {
      type: [
        {
          degree: { type: String },
          institution: { type: String },
          duration: { type: String },
          location: { type: String },
        },
      ],
      default: [],
    },

    achievements: {
      type: [
        {
          keyAchievements: { type: String },
          describe: { type: String },
        },
      ],
      default: [],
    },

    skills: { type: [String], default: [] },

    languages: { type: [String], default: [] },

    projects: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          duration: { type: String },
        },
      ],
      default: [],
    },

    courses: {
      type: [
        {
          title: { type: String },
          description: { type: String },
        },
      ],
      default: [],
    },

    certifications: {
      type: [
        {
          title: { type: String },
          issuedBy: { type: String },
          year: { type: String },
        },
      ],
      default: [],
    },

    hobbies: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeTemplate14", resumeSchema);
