require("dotenv").config();
const Temp5Resume = require("../../models/resumeTemplatesModels/resumeTemplate5Model");
const puppeteer = require("puppeteer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

// Initialize Gemini API only if API key is available
let genAI = null;
let geminiModel = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    console.warn("Failed to initialize Gemini API:", error.message);
  }
} else {
  console.warn("GEMINI_API_KEY not found in environment variables. AI features will be disabled.");
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text.trim();
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

// Helper function to extract text from DOCX
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  } catch (error) {
    console.error("Error reading DOCX:", error);
    throw new Error("Failed to extract text from DOCX");
  }
};

// AI-powered resume parsing function
const parseResumeWithAI = async (extractedText) => {
  try {
    // Check if Gemini API is available
    if (!geminiModel) {
      console.log("Gemini API not available, using fallback parsing");
      return parseResumeFallback(extractedText);
    }

    const prompt = `
      Parse the following resume text and extract structured information. Return the result as a JSON object with the following structure:
      
      {
        "header": {
          "name": "Full Name",
          "title": "Professional Title",
          "contact": {
            "phone": "Phone Number",
            "email": "Email Address",
            "location": "Location"
          }
        },
        "summary": "Professional summary",
        "experience": [
          {
            "id": 1,
            "title": "Job Title",
            "company": "Company Name",
            "period": "Start - End",
            "description": "Job description",
            "achievements": ["Achievement 1", "Achievement 2"]
          }
        ],
        "education": [
          {
            "id": 1,
            "school": "School/University Name",
            "degree": "Degree Name",
            "period": "Year - Year"
          }
        ],
        "skills": {
          "clientSide": "Client-side technologies",
          "serverSide": "Server-side technologies",
          "devOps": "DevOps and tools"
        },
        "achievements": [
          {
            "id": 1,
            "title": "Achievement Title",
            "description": "Achievement description",
            "year": "Year"
          }
        ],
        "projects": [
          {
            "id": 1,
            "title": "Project Title",
            "description": "Project description",
            "technologies": "Technologies used",
            "year": "Year"
          }
        ]
      }
      
      Resume Text:
      ${extractedText}
      
      Extract all available information and format it according to the structure above. If any section is not found, use appropriate default values or empty arrays/objects.
    `;

    const result = await geminiModel.generateContent([prompt]);
    const responseText = result.response.text().trim();
    
    // Clean up the response and parse JSON
    const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedResponse);
    
    return parsedData;
  } catch (error) {
    console.error("Error parsing resume with AI:", error);
    console.log("Falling back to basic parsing");
    return parseResumeFallback(extractedText);
  }
};

// Fallback parsing method that doesn't require AI
const parseResumeFallback = (extractedText) => {
  try {
    // Basic parsing logic that extracts common patterns
    const lines = extractedText.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract email
    const emailMatch = extractedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const email = emailMatch ? emailMatch[0] : "user@example.com";
    
    // Extract phone
    const phoneMatch = extractedText.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : "+1-555-555-5555";
    
    // Extract name (usually first line or first few words)
    const name = lines[0] || "YOUR NAME";
    
    // Extract title (usually second line or after name)
    const title = lines[1] || "Professional Title";
    
    // Basic structure
    const parsedData = {
      header: {
        name: name,
        title: title,
        contact: {
          phone: phone,
          email: email,
          location: "Location"
        }
      },
      summary: "Professional summary extracted from resume",
      experience: [{
        id: 1,
        title: "Job Title",
        company: "Company Name",
        period: "Start - End",
        description: "Job description",
        achievements: ["Achievement 1", "Achievement 2"]
      }],
      education: [{
        id: 1,
        school: "School/University Name",
        degree: "Degree Name",
        period: "Year - Year"
      }],
      skills: {
        clientSide: "Client-side technologies",
        serverSide: "Server-side technologies",
        devOps: "DevOps and tools"
      },
      achievements: [{
        id: 1,
        title: "Achievement Title",
        description: "Achievement description",
        year: "Year"
      }],
      projects: [{
        id: 1,
        title: "Project Title",
        description: "Project description",
        technologies: "Technologies used",
        year: "Year"
      }]
    };
    
    return parsedData;
  } catch (error) {
    console.error("Error in fallback parsing:", error);
    // Return default template if parsing fails
    return {
      header: {
        name: "YOUR NAME",
        title: "Professional Title",
        contact: {
          phone: "+1-555-555-5555",
          email: "user@example.com",
          location: "Location"
        }
      },
      summary: "Professional summary",
      experience: [],
      education: [],
      skills: {
        clientSide: "",
        serverSide: "",
        devOps: ""
      },
      achievements: [],
      projects: []
    };
  }
};

// Upload and parse resume function
const uploadAndParseResume = async (req, res) => {
  try {
    // Use multer to handle file upload
    upload.single('resumeFile')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error", error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        const filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        
        let extractedText = "";
        
        // Extract text based on file type
        if (fileExtension === '.pdf') {
          extractedText = await extractTextFromPDF(filePath);
        } else if (fileExtension === '.docx') {
          extractedText = await extractTextFromDOCX(filePath);
        } else {
          return res.status(400).json({ message: "Unsupported file type" });
        }

        if (!extractedText) {
          return res.status(400).json({ message: "No text could be extracted from the file" });
        }

        // Parse the extracted text using AI
        const parsedResumeData = await parseResumeWithAI(extractedText);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({ 
          message: "Resume parsed successfully", 
          data: parsedResumeData 
        });

      } catch (parseError) {
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        throw parseError;
      }
    });
  } catch (error) {
    console.error("Error in uploadAndParseResume:", error);
    res.status(500).json({ message: "Error processing resume", error: error.message });
  }
};

// Helper: Enhance a field using Gemini API with retries
const GeminiFunctionField = async (category, fieldName, userInput, retries = 3) => {
  // If Gemini API is not available, return original input
  if (!geminiModel) {
    console.log(`Gemini API not available, returning original ${fieldName}`);
    return userInput;
  }

  while (retries > 0) {
    try {
      const prompt = `
        Enhance this '${fieldName}' field for a resume:
        - Keep it ATS-optimized with industry keywords.
        - Use clear, concise, professional language.
        - Include strong action verbs and quantifiable results where applicable.
        User Input: ${JSON.stringify(userInput)}
        Return only JSON: {"${fieldName}": "Enhanced text"}
      `;
      const result = await geminiModel.generateContent([prompt]);
      const responseText = result.response.text().trim().replace(/```json|```/g, "");
      console.log("Gemini Response:", responseText); // ← Add this line
      const parsedResponse = JSON.parse(responseText);
      if (parsedResponse[fieldName]) return parsedResponse[fieldName];
      return userInput;
    } catch (error) {
      console.error(`Error enhancing ${category} field '${fieldName}':`, error.message);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 7000));
    }
  }
  return userInput;
};

// Helper: Enhance array-based sections
const enhanceExperience = async (experienceArray) => {
  if (!Array.isArray(experienceArray)) return experienceArray;
  return Promise.all(
    experienceArray.map(async (exp) => ({
      ...exp,
      description: await GeminiFunctionField("experience", "description", exp.description),
    }))
  );
};

const enhanceAchievements = async (achievementsArray) => {
  if (!Array.isArray(achievementsArray)) return achievementsArray;
  return Promise.all(
    achievementsArray.map(async (ach) => ({
      ...ach,
      description: await GeminiFunctionField("achievements", "description", ach.description),
    }))
  );
};

const enhanceProjects = async (projectsArray) => {
  if (!Array.isArray(projectsArray)) return projectsArray;
  return Promise.all(
    projectsArray.map(async (proj) => ({
      ...proj,
      description: await GeminiFunctionField("projects", "description", proj.description),
    }))
  );
};

const enhanceEducation = async (educationArray) => {
  if (!Array.isArray(educationArray)) return educationArray;
  return Promise.all(
    educationArray.map(async (edu) => ({
      ...edu,
      degree: await GeminiFunctionField("education", "degree", edu.degree),
    }))
  );
};

const enhanceSkills = async (skillsObject) => {
  if (!skillsObject || typeof skillsObject !== 'object') return skillsObject;
  
  const enhancedSkills = {};
  
  if (skillsObject.clientSide) {
    enhancedSkills.clientSide = await GeminiFunctionField("skills", "clientSide", skillsObject.clientSide);
  }
  
  if (skillsObject.serverSide) {
    enhancedSkills.serverSide = await GeminiFunctionField("skills", "serverSide", skillsObject.serverSide);
  }
  
  if (skillsObject.devOps) {
    enhancedSkills.devOps = await GeminiFunctionField("skills", "devOps", skillsObject.devOps);
  }
  
  return enhancedSkills;
};

// Create or Update Resume
const saveResume = async (req, res) => {
  try {
    const resumeData = req.body.resumeData;
    if (!resumeData) return res.status(400).json({ message: "Resume data is required" });
    let savedResume;
    if (resumeData._id) {
      savedResume = await Temp5Resume.findByIdAndUpdate(resumeData._id, resumeData, { new: true });
      if (!savedResume) return res.status(404).json({ message: "Resume not found" });
    } else {
      const newResume = new Temp5Resume(resumeData);
      savedResume = await newResume.save();
    }
    res.status(200).json({ message: "Resume saved successfully", data: savedResume });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ message: "Error saving resume", error: error.message });
  }
};

// Load Resume by Email
const loadResume = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const resume = await Temp5Resume.findOne({ "header.contact.email": email });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json({ message: "Resume loaded successfully", data: resume });
  } catch (error) {
    console.error("Error loading resume:", error);
    res.status(500).json({ message: "Error loading resume", error: error.message });
  }
};

// Load Resume by ID
const loadResumeById = async (req, res) => {
  try {
    const { resumeId } = req.query;
    if (!resumeId) return res.status(400).json({ message: "Resume ID is required" });
    const resume = await Temp5Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json({ message: "Resume loaded successfully", data: resume });
  } catch (error) {
    console.error("Error loading resume by ID:", error);
    res.status(500).json({ message: "Error loading resume", error: error.message });
  }
};

// Enhance a Specific Field
const enhanceField = async (req, res) => {
  try {
    const { resumeId, field } = req.body;
    if (!resumeId || !field) return res.status(400).json({ message: "Resume ID and field are required" });
    const resume = await Temp5Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    if (field === "summary") {
      resume.summary = await GeminiFunctionField("summary", "summary", resume.summary || "");
    } else if (field === "experience") {
      resume.experience = await enhanceExperience(resume.experience);
    } else if (field === "achievements") {
      resume.achievements = await enhanceAchievements(resume.achievements);
    } else if (field === "projects") {
      resume.projects = await enhanceProjects(resume.projects);
    } else if (field === "education") {
      resume.education = await enhanceEducation(resume.education);
    } else if (field === "skills") {
      resume.skills = await enhanceSkills(resume.skills);
    } else {
      return res.status(400).json({ message: `Field '${field}' not supported` });
    }

    const updatedResume = await resume.save();
    console.log("Updated Resume:", updatedResume); // ← Add this line
    res.json({ message: `Field ${field} enhanced successfully`, data: updatedResume });
  } catch (error) {
    console.error("Error enhancing field:", error);
    res.status(500).json({ message: "Error enhancing field", error: error.message });
  }
};

const resumeCSS = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    padding: 20px;
    width: 100%;
    height: 100%;
  }
  #resumeBody {
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
  }
  h1 {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .header-title {
    font-size: 18px;
    color: #4b5563; /* Tailwind gray-600 */
    margin-bottom: 16px;
  }
  .contact-info {
    font-size: 12px;
    color: #4b5563; /* Tailwind gray-600 */
  }
  .contact-info div {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    margin-top: 32px;
  }
  .section-border {
    border-bottom: 1px solid #d1d5db; /* Tailwind gray-300 */
    margin-bottom: 32px;
  }
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  p, li {
    font-size: 14px;
    color: #374151; /* Tailwind gray-700 */
    margin-bottom: 8px;
  }
  .experience-item, .achievement-item, .project-item, .education-item, .skills-item {
    margin-bottom: 24px;
    padding: 16px;
    border: 1px solid #e5e7eb; /* Tailwind gray-200 */
    border-radius: 8px;
  }
  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .skills-item h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  @media print {
    body {
      padding: 0;
    }
    #resumeBody {
      padding: 0;
    }
  }
  @page {
    size: A4;
    margin: 10mm;
  }
`;

// Updated HTML generation to match Temp3.jsx structure
const generateHTML = (resumeData) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Resume - ${resumeData?.header?.name || "Unknown"}</title>
    <style>${resumeCSS()}</style>
  </head>
  <body>
    <div id="resumeBody">
      ${resumeData?.header ? `
        <header>
          <div class="flex-row">
            <div>
              <h1>${resumeData.header.name}</h1>
              <p class="header-title">${resumeData.header.title}</p>
            </div>
            <div class="contact-info">
              <div>${resumeData.header.contact.phone}</div>
              <div>📧 ${resumeData.header.contact.email}</div>
              <div>📍 ${resumeData.header.contact.location}</div>
            </div>
          </div>
        </header>
      ` : ""}
      ${resumeData?.summary ? `
        <section>
          <h2>Summary</h2>
          <div class="section-border"></div>
          <p>${resumeData.summary}</p>
        </section>
      ` : ""}
      ${resumeData?.experience?.length > 0 ? `
        <section>
          <h2>Experience</h2>
          <div class="section-border"></div>
          ${resumeData.experience.map(exp => `
            <div class="experience-item">
              <div class="flex-row">
                <h3>${exp.title}</h3>
                <p>${exp.period}</p>
              </div>
              <p>${exp.company}</p>
              <p>${exp.description}</p>
              ${exp.achievements?.length > 0 ? `
                <ul>
                  ${exp.achievements.map(ach => `<li>${ach}</li>`).join("")}
                </ul>
              ` : ""}
            </div>
          `).join("")}
        </section>
      ` : ""}
      ${resumeData?.achievements?.length > 0 ? `
        <section>
          <h2>Achievements</h2>
          <div class="section-border"></div>
          ${resumeData.achievements.map(ach => `
            <div class="achievement-item">
              <div class="flex-row">
                <h3>${ach.title}</h3>
                <p>${ach.year}</p>
              </div>
              <p>${ach.description}</p>
            </div>
          `).join("")}
        </section>
      ` : ""}
      ${resumeData?.projects?.length > 0 ? `
        <section>
          <h2>Projects</h2>
          <div class="section-border"></div>
          ${resumeData.projects.map(proj => `
            <div class="project-item">
              <div class="flex-row">
                <h3>${proj.title}</h3>
                <p>${proj.year}</p>
              </div>
              <p>${proj.description}</p>
              <p><span style="font-weight: 500;">Technologies:</span> ${proj.technologies}</p>
            </div>
          `).join("")}
        </section>
      ` : ""}
      ${resumeData?.education?.length > 0 ? `
        <section>
          <h2>Education</h2>
          <div class="section-border"></div>
          ${resumeData.education.map(edu => `
            <div class="education-item">
              <div class="flex-row">
                <div>
                  <h3>${edu.school}</h3>
                  <p>${edu.degree}</p>
                </div>
                <p>${edu.period}</p>
              </div>
            </div>
          `).join("")}
        </section>
      ` : ""}
      ${resumeData?.skills ? `
        <section>
          <h2>Skills</h2>
          <div class="section-border"></div>
          <div class="skills-item">
            <div>
              <h3>Client-Side:</h3>
              <p>${resumeData.skills.clientSide}</p>
            </div>
            <div>
              <h3>Server-Side:</h3>
              <p>${resumeData.skills.serverSide}</p>
            </div>
            <div>
              <h3>Development & Operations:</h3>
              <p>${resumeData.skills.devOps}</p>
            </div>
          </div>
        </section>
      ` : ""}
    </div>
  </body>
  </html>
`;

// Generate PDF
const generatePDF = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) return res.status(400).json({ message: "Resume data is required" });
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    const htmlContent = generateHTML(resumeData);
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      scale: 0.95,
    });
    await browser.close();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};

module.exports = { saveResume, loadResume, loadResumeById, enhanceField, generatePDF, uploadAndParseResume };