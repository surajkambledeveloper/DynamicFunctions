// // when you are not using as prop 
// const handleSaveResume = async (showToast = true) => {
//     try {
//       const payload = {
//         templateId: "temp14", //  update this dynamically if needed
//         ...resumeData,
//       };

//       console.log(" Saving Resume Payload:", payload);

//       const response = await axios.post(
//         "http://localhost:5000/api/dynamic/resume/save",
//         payload
//       );

//       if (response.status === 200) {
//         const savedData = response.data.data;
//         console.log(" Resume saved:", savedData);

//         setResumeData((prev) => ({ ...prev, _id: savedData._id }));
//         localStorage.setItem("resumeId", savedData._id);

//         if (showToast) toast.success("Resume saved successfully!");
//         await fetchResume();
//       } else {
//         toast.error("Failed to save resume.");
//       }
//     } catch (error) {
//       console.error(" Save error:", error);
//       toast.error("Error saving resume.");
//     }
//   };

//   const enhanceSingleField = async (field) => {
//     console.log(" Enhancing Field:", field);

//     if (!resumeData._id) {
//       toast.error("Please save your resume before enhancing a field.");
//       return;
//     }

//     try {
//       const loadingToastId = toast.loading(`Enhancing ${field}...`);

//       //  Save resume before enhancing (no success toast needed here)
//       await handleSaveResume(false);
//       console.log(" Resume saved before enhancement.");

//       //  Build Payload
//       const payload = {
//         resumeId: resumeData._id,
//         templateId: "temp14", // Change this if using dynamic template
//         field,
//         data:
//           field === "experience" ? resumeData.experience : resumeData[field],
//       };

//       console.log(
//         " Payload for enhancement:",
//         JSON.stringify(payload, null, 2)
//       );

//       //  API Call
//       const response = await axios.post(
//         "http://localhost:5000/api/dynamic/gemini-resume/enhance",
//         payload
//       );

//       console.log(" Gemini Enhance Full Response:", response);

//       if (response?.data?.data) {
//         const updatedData = response.data.data;

//         console.log(` Enhanced Data Received for ${field}:`, updatedData);

//         //  Update UI Dynamically
//         setResumeData((prev) => {
//           const updatedResume = {
//             ...prev,
//             ...(field === "experience" && {
//               experience: updatedData.experience,
//             }),
//             ...(field === "achievements" && {
//               achievements: updatedData.achievements,
//             }),
//             ...(field === "courses" && { courses: updatedData.courses }),
//             ...(field === "projects" && { projects: updatedData.projects }),
//             ...(field === "skills" && { skills: updatedData.skills }),
//             ...(field === "languages" && { languages: updatedData.languages }),
//             ...(field === "education" && { education: updatedData.education }),
//             ...(field === "summary" && { summary: updatedData.summary }),
//             _id: updatedData._id,
//           };

//           console.log(" Updated Resume Data (UI):", updatedResume);
//           return updatedResume;
//         });

//         console.log(` ${field} updated successfully in UI`);

//         toast.update(loadingToastId, {
//           render: `${
//             field.charAt(0).toUpperCase() + field.slice(1)
//           } enhanced successfully!`,
//           type: "success",
//           isLoading: false,
//           autoClose: 3000,
//         });

//         // ← Only refetch full resume on success
//         await fetchResume();
//       } else {
//         console.error(" No 'data' field in API response!", response);
//         toast.update(loadingToastId, {
//           render: `No data received for ${field}.`,
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       console.error(` Error enhancing ${field}:`, error);

//       if (error.response && error.response.status === 503) {
//         toast.error("AI server busy hai, thodi der baad try karo. ");
//       } else if (error.response && error.response.status === 429) {
//         toast.error("Daily AI usage limit khatam ho gaya hai.");
//       } else {
//         toast.error(`Failed to enhance ${field}. Please try again. `);
//       }
//     }
//   };
// useEffect(() => {
//   fetchResume();
// }, []);
//   const fetchResume = async () => {
//     const resumeId = localStorage.getItem("resumeId");
//     const templateId = "temp14"; // ya dynamic variable

//     try {
//       const resp = await axios.get(
//         "http://localhost:5000/api/dynamic/resume/getResume",
//         { params: { templateId, resumeId } }
//       );
//       if (resp.status === 200 && resp.data.data) {
//         setResumeData(resp.data.data);
//       }
//     } catch (err) {
//       console.error("Fetch resume error:", err);
//       toast.error("Failed to load resume.");
//     }
//   };

//   // when your using as props 
  
// const fetchResume = useCallback(async () => {
//   const resumeId = localStorage.getItem("resumeId");
//   const templateId = "temp14"; // or dynamic

//   try {
//     const resp = await axios.get(
//       "http://localhost:5000/api/dynamic/resume/getResume",
//       { params: { templateId, resumeId } }
//     );
//     if (resp.status === 200 && resp.data.data) {
//       setResumeData(resp.data.data);
//     }
//   } catch (err) {
//     console.error("Fetch resume error:", err);
//     toast.error("Failed to load resume.");
//   }
// }, []); // no dependencies, or add ones if you reference variables

//   const handleSaveResume = useCallback(
//   async (showToast = true) => {
//     try {
//       const payload = {
//         templateId: "temp14", // update this dynamically if needed
//         ...resumeData,
//       };

//       console.log(" Saving Resume Payload:", payload);

//       const response = await axios.post(
//         "http://localhost:5000/api/dynamic/resume/save",
//         payload
//       );

//       if (response.status === 200) {
//         const savedData = response.data.data;
//         console.log(" Resume saved:", savedData);

//         setResumeData((prev) => ({ ...prev, _id: savedData._id }));
//         localStorage.setItem("resumeId", savedData._id);

//         if (showToast) toast.success("Resume saved successfully!");
//         await fetchResume();
//       } else {
//         toast.error("Failed to save resume.");
//       }
//     } catch (error) {
//       console.error(" Save error:", error);
//       toast.error("Error saving resume.");
//     }
//   },
//   // Dependencies: re-create only when resumeData or fetchResume changes
//   [resumeData, fetchResume]
// );
// const enhanceSingleField = useCallback(
//   async (field) => {
//     console.log(" Enhancing Field:", field);

//     if (!resumeData._id) {
//       toast.error("Please save your resume before enhancing a field.");
//       return;
//     }

//     try {
//       const loadingToastId = toast.loading(`Enhancing ${field}...`);

//       //  Save resume before enhancing (no success toast needed here)
//       await handleSaveResume(false);
//       console.log(" Resume saved before enhancement.");

//       //  Build Payload
//       const payload = {
//         resumeId: resumeData._id,
//         templateId: "temp14", // Change this if using dynamic template
//         field,
//         data:
//           field === "experience" ? resumeData.experience : resumeData[field],
//       };

//       console.log(
//         " Payload for enhancement:",
//         JSON.stringify(payload, null, 2)
//       );

//       //  API Call
//       const response = await axios.post(
//         "http://localhost:5000/api/dynamic/gemini-resume/enhance",
//         payload
//       );

//       console.log(" Gemini Enhance Full Response:", response);

//       if (response?.data?.data) {
//         const updatedData = response.data.data;

//         console.log(` Enhanced Data Received for ${field}:`, updatedData);

//         //  Update UI Dynamically
//         setResumeData((prev) => {
//           const updatedResume = {
//             ...prev,
//             ...(field === "experience" && {
//               experience: updatedData.experience,
//             }),
//             ...(field === "achievements" && {
//               achievements: updatedData.achievements,
//             }),
//             ...(field === "courses" && { courses: updatedData.courses }),
//             ...(field === "projects" && { projects: updatedData.projects }),
//             ...(field === "skills" && { skills: updatedData.skills }),
//             ...(field === "languages" && { languages: updatedData.languages }),
//             ...(field === "education" && { education: updatedData.education }),
//             ...(field === "summary" && { summary: updatedData.summary }),
//             _id: updatedData._id,
//           };

//           console.log(" Updated Resume Data (UI):", updatedResume);
//           return updatedResume;
//         });

//         console.log(` ${field} updated successfully in UI`);

//         toast.update(loadingToastId, {
//           render: `${
//             field.charAt(0).toUpperCase() + field.slice(1)
//           } enhanced successfully!`,
//           type: "success",
//           isLoading: false,
//           autoClose: 3000,
//         });

//         // ← Only refetch full resume on success
//         await fetchResume();
//       } else {
//         console.error(" No 'data' field in API response!", response);
//         toast.update(loadingToastId, {
//           render: `No data received for ${field}.`,
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       console.error(` Error enhancing ${field}:`, error);

//       if (error.response && error.response.status === 503) {
//         toast.error("AI server busy hai, thodi der baad try karo. ");
//       } else if (error.response && error.response.status === 429) {
//         toast.error("Daily AI usage limit khatam ho gaya hai.");
//       } else {
//         toast.error(`Failed to enhance ${field}. Please try again. `);
//       }
//     }
//   },
//   [resumeData, handleSaveResume, fetchResume] // dependencies
// );

// // Then Call it in useEffect:
// useEffect(() => {
//   fetchResume();
// }, [fetchResume]);
