const mongoose = require("mongoose");
require("dotenv").config();
const {
  getModelByTemplate,
} = require("../../models/dynamicResumeModels/getModelByTemplate");
const { geminiModel } = require("../../config/geminiSetup/gemini");

const enhanceFieldData = async ({ resumeId, templateId, field, data }) => {
  if (!resumeId || !field || !data || !templateId) {
    throw new Error("Resume ID, field, data, and templateId are required");
  }
  const freshnessKey = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}`;
  // console.log(" Using FreshnessSeed:", freshnessKey);

  // console.log(" Enhancing field data...");
  console.log(" Resume ID:", resumeId);
  console.log(" Template ID:", templateId);
  console.log(" Field:", field);
  console.log(" Input Data:", data);

  if (process.env.NODE_ENV !== "production") {
    console.dir(
      { resumeId, templateId, field, data },
      { depth: null, colors: true }
    );
  }

  const ResumeModel = getModelByTemplate(templateId);
  if (!ResumeModel) throw new Error(" Invalid template ID");

  const resume = await ResumeModel.findById(resumeId);
  if (!resume) throw new Error(" Resume not found");

  //  Defensive fallback to prevent .map() on undefined
  resume.projects = Array.isArray(resume.projects) ? resume.projects : [];
  resume.courses = Array.isArray(resume.courses) ? resume.courses : [];
  resume.experience = Array.isArray(resume.experience) ? resume.experience : [];
  resume.achievements = Array.isArray(resume.achievements)
    ? resume.achievements
    : [];

  let prompt;

  switch (field) {
    case "summary":
      prompt = `You are a professional resume writer with deep knowledge of ATS (Applicant Tracking Systems), grammar accuracy, and industry-specific tailoring.

Instructions:
- Enhance the 'summary' to make it concise, impactful, and professionally written.
- Correct all grammar, spelling, and sentence structure issues.
- Add relevant ATS-friendly keywords.
- Tailor the summary to sound relevant to the target industry.
- Do NOT add or remove major ideas, just enhance the wording.

User Input:
${JSON.stringify(data)}

Return only valid JSON:
{"summary": "enhanced summary text here"}

Important:
- Return ONLY the JSON object.
- Do not include any explanation or extra text.`;
      break;

    // inhance experience section

    case "experience":
      // check if title, companyName, date, companyLocation are missing (minimal mode)
      const isMinimalExp =
        Array.isArray(data) &&
        data.every(
          (item) =>
            (!item.title || item.title.trim() === "") &&
            (!item.companyName || item.companyName.trim() === "") &&
            (!item.date || item.date.trim() === "") &&
            (!item.companyLocation || item.companyLocation.trim() === "")
        );

      if (isMinimalExp) {
        prompt = `You are a professional resume writing expert with strong ATS (Applicant Tracking System) knowledge.

Task:
- The user has only provided a list of work accomplishments.
- Each entry is an array of short bullet points (1–5) that describe professional tasks or results.
- Your job is to enhance each bullet point to sound more impactful, results-oriented, and professional.
- Use powerful action verbs, formal tone, and include ATS-friendly keywords.
- Do NOT fabricate job titles, companies, or any extra information.

FreshnessSeed: ${freshnessKey}


Input (only bullet points):
${JSON.stringify(data)}

Output Format:
{
  "accomplishment": [
    "Enhanced bullet 1",
    "Enhanced bullet 2"
  ]
}

Important:
- Only return valid JSON.
- Do NOT add titles, companies, dates, or explanations. Just improve the bullet points.
- Preserve the number of bullet points.
- Even if user re-clicks enhance, generate fresh wording every time.`;
      } else {
        prompt = `You are a professional resume expert with deep knowledge of ATS (Applicant Tracking Systems), grammar correction, spelling, and industry-specific writing.

Each experience object includes:
- title
- companyName
- date
- companyLocation
- accomplishment: array of 1–5 short bullet points

Your task:
- Go through EACH experience object provided.
- Enhance EACH bullet point in the "accomplishment" array.
- Improve wording to sound more professional, results-oriented, and include ATS-friendly keywords.
- Correct grammar, spelling, and sentence structure.
- Preserve the total number of bullet points in each experience (do not add or remove bullet points).
- Do NOT change the title, companyName, date, or companyLocation fields.
- The order of experiences and bullet points MUST remain the same.
- Even if the same input is received again, always rephrase the accomplishments using different wording, sentence structures, and power verbs.
- Do NOT reuse previous phrasing or return the input as-is.
- Preserve and return the original _id for each experience entry.


FreshnessSeed: ${freshnessKey}

Input:
${JSON.stringify(data)}

Return only valid JSON:
[
  {
    "title": "same as input",
    "companyName": "same as input",
    "date": "same as input",
    "companyLocation": "same as input",
    "accomplishment": [
      "Enhanced bullet point 1",
      "Enhanced bullet point 2"
    ]
  }
]

Important:
- Return ONLY valid JSON.
- Do NOT add any extra explanation.`;
      }
      break;

    // skill section

    case "skills":
      prompt = `You are a professional resume writing expert with deep knowledge of ATS (Applicant Tracking Systems), grammar correction, and industry-specific language.

Your Task:
- The user has provided a simple list of skills.
- For EACH skill:
  - Improve the wording to make it sound more professional and ATS-friendly.
  - Add industry-relevant power words and common ATS keywords.
  - Correct grammar, spelling, and formatting.
  - Do NOT add, remove, or reorder any skills.
  - Even if the user clicks enhance multiple times, always provide freshly enhanced skill names.

  FreshnessSeed: ${freshnessKey}

Input:
${JSON.stringify(data)}

Output Format (strict):
{
  "skills": ["Enhanced Skill 1", "Enhanced Skill 2", "Enhanced Skill 3"]
}

Important:
- Return ONLY valid JSON.
- Do NOT return any explanation or extra text.`;
      break;

    // cours section

    case "courses":
      const isMinimalCourses =
        Array.isArray(data) &&
        data.every((item) => !item.title || item.title.trim() === "");

      if (isMinimalCourses) {
        prompt = `You are a professional resume writing expert with strong knowledge of ATS (Applicant Tracking Systems) and technical course documentation.

Task:
- The user has provided only course descriptions (no titles).
- Your job is to improve each 'description' to sound more formal, impactful, and professionally written.
- Use industry-relevant keywords and avoid overly casual language.

FreshnessSeed: ${freshnessKey}

Input:
${JSON.stringify(data)}

Output Format:
{
  "courses": [
    { "description": "Enhanced Description 1" },
    { "description": "Enhanced Description 2" }
  ]
}

Important:
- Return ONLY valid JSON.
- Do NOT add titles, explanations, or any extra text.`;
      } else {
        prompt = `You are a professional resume writing expert with strong knowledge of ATS (Applicant Tracking Systems), grammar correction, and industry-standard resume formatting.

Your Task:
- For EACH course provided:
  - Rephrase the 'title' to sound more advanced, professional, and include relevant ATS-friendly keywords.
  - Improve the 'description' to highlight valuable skills, learning outcomes, and professional benefits.
  - Correct any grammar, spelling, or sentence structure issues.
  - DO NOT copy or reuse the original input wording.
  - Make sure the enhancements sound impactful, formal, and tailored for professional resumes.
  - Each time this enhancement is requested, the AI MUST generate a **fresh and unique enhancement.**
  - The number of output courses MUST exactly match the number of input courses.
  - Do NOT remove, skip, combine, or add new courses.

  FreshnessSeed: ${freshnessKey}


Input:
${JSON.stringify(data)}

Output Format:
{
  "courses": [
    { "title": "Enhanced Title 1", "description": "Enhanced Description 1" },
    { "title": "Enhanced Title 2", "description": "Enhanced Description 2" }
  ]
}

Important:
- Return ONLY valid JSON.
- Do NOT return any explanation, extra text, or formatting.`;
      }
      break;

    // project section
    case "projects":
      const isMinimalProjects =
        Array.isArray(data) &&
        data.every(
          (item) =>
            (!item.title || item.title.trim() === "") &&
            (!item.duration || item.duration.trim() === "")
        );

      if (isMinimalProjects) {
        prompt = `You are a professional resume writer with expertise in enhancing project descriptions for job resumes.

Task:
- The user has only provided raw project descriptions.
- Your job is to rewrite each 'description' to sound more impactful, results-driven, and tailored for technical resumes.
- Use professional tone, formal structure, and include industry-relevant keywords.
- Do NOT add any titles or durations.
- Keep the number of projects the same.
- Return ONLY enhanced descriptions.

FreshnessSeed: ${freshnessKey}

Input:
${JSON.stringify(data)}

Output Format:
{
  "projects": [
    { "description": "Enhanced Project Description 1" },
    { "description": "Enhanced Project Description 2" }
  ]
}

Important:
- Return only valid JSON.
- Do not return any explanations or extra text.`;
      } else {
        prompt = `You are a professional resume writing expert with deep understanding of ATS (Applicant Tracking Systems), grammar correction, and industry-standard resume formatting.

Your Task:
- For EACH project provided:
  - Rephrase the 'title' to sound more impressive, professional, and include relevant ATS-friendly keywords.
  - Improve the 'description' to make it results-driven, action-oriented, and highlight measurable impact.
  - Correct all grammar, spelling, and sentence structure mistakes.
  - Keep the 'duration' field UNCHANGED.
  - The number of output projects MUST exactly match the number of input projects.
  - DO NOT remove, skip, add, or combine any projects.
  - Each time this enhancement is requested, the AI MUST generate a fresh, unique version of the content.

  FreshnessSeed: ${freshnessKey}


Input:
${JSON.stringify(data)}

Expected Output Format:
{
  "projects": [
    { "title": "Enhanced Title 1", "description": "Enhanced Description 1", "duration": "As Input" },
    { "title": "Enhanced Title 2", "description": "Enhanced Description 2", "duration": "As Input" }
  ]
}

Important:
- Return ONLY valid JSON.
- Do NOT return any explanation or extra text.`;
      }
      break;

    // achievements section

    case "achievements":
      prompt = `You are a professional resume writing expert with strong knowledge of ATS (Applicant Tracking Systems), grammar correction, and professional resume standards.

Your Task:
- For EACH achievement provided:
  - Improve the 'keyAchievements' to sound more impressive, professional, and include relevant ATS-friendly keywords.
  - Enhance the 'describe' field to better highlight impact, value, and measurable outcomes.
  - Correct any grammar, spelling, and sentence structure issues.
  - Do NOT copy the input. Provide significantly improved, rephrased content.
  - Make sure the enhancements sound impactful, formal, and tailored for professional resumes.
  - Each time this enhancement is requested, the AI MUST generate a **fresh and unique enhancement.**
  - The number of output achievements MUST exactly match the number of input achievements.
  - Do NOT remove, skip, combine, or add new achievements.

  FreshnessSeed: ${freshnessKey}


Input:
${JSON.stringify(data)}

Output Format (strict):
{
  "achievements": [
    { "title": "Enhanced Key Achievement 1", "description": "Enhanced Description 1" },
    { "title": "Enhanced Key Achievement 2", "description": "Enhanced Description 2" }
  ]
}

Important:
- Return ONLY valid JSON.
- Do NOT return any explanation, extra text, or formatting.`;
      break;

    // certifications section
    case "certifications":
      const isMinimalCertifications =
        Array.isArray(data) &&
        data.every(
          (item) =>
            (!item.title || item.title.trim() === "") &&
            (!item.issuedBy || item.issuedBy.trim() === "")
        );

      if (isMinimalCertifications) {
        prompt = `You are a professional resume writer with deep expertise in enhancing certification information for professional resumes.

Task:
- The user has only provided basic or blank certifications (no title or issuer).
- Improve each 'year' to sound more complete (if needed), but do NOT invent new years.
- Rewrite each entry’s 'title' to be more descriptive, formal, and relevant to the job market.
- Use correct grammar, spelling, and industry-relevant keywords.
- Each output must be fresh and unique on every request — do not repeat past phrasing.

FreshnessSeed: ${freshnessKey}


Input:
${JSON.stringify(data)}

Output Format:
{
  "certifications": [
    {
      "title": "Enhanced Title 1",
      "issuedBy": "As Input",
      "year": "As Input"
    },
    {
      "title": "Enhanced Title 2",
      "issuedBy": "As Input",
      "year": "As Input"
    }
  ]
}

Important:
- Return ONLY valid JSON.
- Do NOT include any explanation or formatting.`;
      } else {
        prompt = `You are a professional resume enhancement expert with strong knowledge of ATS (Applicant Tracking Systems), grammar correction, and professional formatting.

Task:
- For each certification:
  - Rephrase the 'title' to make it sound more impactful, professional, and ATS-friendly.
  - Preserve the 'issuedBy' and 'year' values exactly — do NOT change them.
  - Use strong industry language, power words, and proper grammar.
  - Ensure each request gives a **fresh, reworded version** — don’t copy previous outputs.

  FreshnessSeed: ${freshnessKey}


Input:
${JSON.stringify(data)}

Output Format:
{
  "certifications": [
    {
      "title": "Enhanced Title 1",
      "issuedBy": "As Input",
      "year": "As Input"
    },
    {
      "title": "Enhanced Title 2",
      "issuedBy": "As Input",
      "year": "As Input"
    }
  ]
}

Important:
- Return ONLY valid JSON.
- Do NOT return any extra text or explanation.`;
      }
      break;

    // hobbies section
    case "hobbies":
      prompt = `You are a professional resume writing expert with strong knowledge of ATS (Applicant Tracking Systems), grammar correction, and professional resume formatting.

Your Task:
- The user has provided a list of personal or professional hobbies/interests.
- Your job is to:
  - Rephrase each hobby to sound more refined, formal, and resume-appropriate.
  - Add relevant keywords where appropriate (e.g., "Creative Writing" instead of "writing").
  - Correct grammar, spelling, and formatting.
  - Maintain the exact same number of hobbies.
  - Do NOT reorder, skip, or add extra hobbies.
  - Ensure each enhancement is fresh — even if the same input is re-submitted, return new phrasing.

  FreshnessSeed: ${freshnessKey}


Input:
${JSON.stringify(data)}

Output Format (strict):
{
  "hobbies": ["Enhanced Hobby 1", "Enhanced Hobby 2", "Enhanced Hobby 3"]
}

Important:
- Return ONLY valid JSON.
- Do NOT return any explanation, heading, formatting, or extra text.`;
      break;

    // education section

    case "education":
      prompt = `You are a professional resume writing expert with deep knowledge of grammar correction, ATS optimization, and professional standards for education sections in resumes.

Your Task:
- For EACH education entry:
  - Improve the 'degree' and 'institution' to be grammatically correct, well-formatted, and professionally phrased.
  - Correct any spelling, casing, or formatting issues.
  - Preserve the 'duration' and 'location' as they are.
  - Do NOT make up fake degrees or institutions.
  - Only enhance what is already present — no hallucination.
  - Add minor enhancements for clarity and professionalism (e.g., add "Bachelor of Technology" instead of "btech").
  - Each enhancement should be unique, formal, and follow industry resume standards.

Input:
${JSON.stringify(data)}

Output Format (strict):
{
  "education": [
    {
      "degree": "Bachelor of Technology in Computer Science",
      "institution": "Government College of Engineering, Pune",
      "duration": "2019 - 2023",
      "location": "Pune, Maharashtra"
    },
    {
      "degree": "Diploma in Information Technology",
      "institution": "MSBTE Board",
      "duration": "2016 - 2019",
      "location": "Sangli, Maharashtra"
    }
  ]
}

Important:
- Output must be a valid JSON only.
- No explanation, extra notes, or formatting.`;
      break;

    // languages section

    case "languages":
      prompt = `You are a professional resume writing expert with strong knowledge of ATS (Applicant Tracking Systems), grammar correction, and resume best practices.

Your task:
- For each language provided:
  - Capitalize properly (e.g., "english" → "English").
  - Add a short tag to describe proficiency (like "Fluent", "Native", "Professional", etc.).
  - Do not invent proficiency — use general terms unless specified.
  - Avoid copying input. Make it sound resume-friendly and ATS-optimized.
  - Correct grammar/spelling if needed.
  - Always return the same number of languages as in the input.

Input:
${JSON.stringify(data)}

Output format (strict):
{
  "languages": [
    "Fluent in English",
    "Native Proficiency in Marathi",
    "Conversational Hindi"
  ]
}

Important:
- Return ONLY valid JSON.
- No explanations, no comments, no markdown, no bullet points — just plain JSON.
- Every response must be fresh and unique each time.`;
      break;
  }

  try {
    const result = await geminiModel.generateContent([prompt]);
    console.log(" Gemini Raw Response:", result.response.text());

    const responseText = result.response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);

    if (!jsonMatch) {
      console.error(" No valid JSON found in AI response:", responseText);
      throw new Error("No valid JSON found in AI response");
    }

    const enhancedData = JSON.parse(jsonMatch[0]);
    // console.log(" Parsed Enhanced Data:", enhancedData);

    if (field === "experience") {
      // Handle minimal format (only accomplishments)
      if (Array.isArray(enhancedData.accomplishment)) {
        console.log(
          " Enhancing minimal experience format (accomplishments only)"
        );
        resume.experience = resume.experience.map((exp, idx) => ({
          ...exp,
          accomplishment: Array.isArray(enhancedData.accomplishment?.[idx])
            ? enhancedData.accomplishment[idx]
                .map((item) => item.trim())
                .filter((item) => item !== "")
            : exp.accomplishment,
        }));
      }

      // Handle full structured enhancement
      else {
        const expList = Array.isArray(enhancedData)
          ? enhancedData
          : enhancedData.experience;

        if (!Array.isArray(expList)) {
          console.error(
            " Invalid format for enhanced experience:",
            enhancedData
          );
          throw new Error("Enhanced experience data must be an array");
        }

        console.log(" Enhancing full structured experience entries");

        resume.experience = resume.experience.map((exp) => {
          const enhancedExp = expList.find(
            (e) => e._id?.toString() === exp._id?.toString()
          );

          return {
            ...exp,
            accomplishment: (enhancedExp?.accomplishment || exp.accomplishment)
              .map((item) => item.trim())
              .filter((item) => item !== ""),
          };
        });
      }
    } else if (field === "achievements") {
      const transformedAchievements = (enhancedData.achievements || []).map(
        (item) => ({
          keyAchievements: item.title,
          describe: item.description,
        })
      );
      resume.achievements = transformedAchievements;
      // console.log(" Updated Achievements:", resume.achievements);
    } else if (field === "skills") {
      if (Array.isArray(enhancedData.skills)) {
        resume.skills = enhancedData.skills
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "");
      }
      // console.log(
      //   ` Final enhanced ${field}:`,
      //   JSON.stringify(resume[field], null, 2)
      // );

      // console.log(" Updated Skills:", resume.skills);
    } else if (field === "courses") {
      const isMinimalCourses =
        Array.isArray(data) &&
        data.every(
          (item) =>
            (!item.title || item.title.trim() === "") &&
            item.description &&
            item.description.trim() !== ""
        );

      if (isMinimalCourses) {
        // Only update descriptions in order
        resume.courses = resume.courses.map((course, idx) => ({
          ...course,
          description:
            enhancedData.courses?.[idx]?.description || course.description,
        }));
        console.log(" Minimal courses enhanced (descriptions only)");
      } else if (
        Array.isArray(enhancedData.courses) &&
        enhancedData.courses.length > 0
      ) {
        resume.courses = enhancedData.courses;
        console.log(" Full course enhancement applied");
      } else {
        console.log(" No valid enhanced courses found, skipping update");
      }
    }

    // console.log(" Updated Courses:", resume.courses);
    else if (field === "projects") {
      const isMinimalProjects =
        Array.isArray(data) &&
        data.every(
          (item) =>
            (!item.title || item.title.trim() === "") &&
            (!item.duration || item.duration.trim() === "")
        );

      if (isMinimalProjects) {
        if (Array.isArray(resume.projects)) {
          resume.projects = resume.projects.map((proj, idx) => ({
            ...proj,
            description:
              enhancedData.projects?.[idx]?.description || proj.description,
          }));
        } else {
          console.warn(
            "⚠️ resume.projects is not an array. Skipping enhancement."
          );
        }
      } else {
        resume.projects = enhancedData.projects || resume.projects;
      }
    } else if (field === "certifications") {
      const isMinimalCertifications =
        Array.isArray(data) &&
        data.every(
          (item) =>
            (!item.title || item.title.trim() === "") &&
            (!item.issuedBy || item.issuedBy.trim() === "")
        );

      // Minimal: Just enhance title if it's blank
      if (isMinimalCertifications) {
        resume.certifications = resume.certifications.map((cert, idx) => ({
          ...cert,
          title: enhancedData.certifications?.[idx]?.title || cert.title,
        }));
        console.log(" Minimal certifications enhanced (title only)");
      } else {
        // Full: Enhance title, keep issuedBy & year unchanged
        resume.certifications = resume.certifications.map((cert, idx) => ({
          title: enhancedData.certifications?.[idx]?.title || cert.title,
          issuedBy: cert.issuedBy,
          year: cert.year,
        }));
        console.log(
          " Full certifications enhanced (title only, issuedBy/year preserved)"
        );
      }
    } else if (field === "hobbies") {
      console.log(" Enhancing hobbies...");

      // Update hobbies from enhancedData (same array length)
      if (
        Array.isArray(enhancedData.hobbies) &&
        enhancedData.hobbies.length === data.length
      ) {
        resume.hobbies = enhancedData.hobbies;
        console.log("Hobbies enhanced successfully");
      } else {
        console.warn(
          " Unexpected hobbies enhancement format or count mismatch"
        );
      }
    } else if (field === "education") {
      resume.education = enhancedData.education || resume.education;
      console.log(" Education enhanced successfully");
    } else if (field === "languages") {
      if (Array.isArray(enhancedData.languages)) {
        resume.languages = enhancedData.languages;
        console.log(" Languages enhanced successfully");
      } else {
        throw new Error("Languages enhancement failed: Invalid format");
      }
    } else {
      resume[field] = enhancedData[field] || resume[field];
      // console.log(` Updated ${field}:`, resume[field]);
    }
    // console.log("Final updated projects:", resume.projects);

    await resume.save();
    // console.log(" Resume successfully saved in DB");
    // console.log(" Final Resume Returning to Frontend:", resume);

    return resume;
  } catch (error) {
    console.error(" Error during AI enhancement:", error.message);
    throw new Error("Failed to enhance resume field. Please try again.");
  }
};

module.exports = {
  enhanceFieldData,
};
