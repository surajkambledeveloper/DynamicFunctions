// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home.jsx';
import LoginSignup from '../pages/auth/LoginSignup.jsx';
import TemplatePage from '../pages/TemplatePage.jsx';

// Resume Templates
import ResumeTemplate1 from '../components/ai-resume-templates/resumeTemplate1/ResumeTemplate1.jsx';
import ResumeTemplate2 from '../components/ai-resume-templates/resumeTemplate2/ResumeTemplate2.jsx';
import ResumeTemplate3 from '../components/ai-resume-templates/resumeTemplate3/ResumeTemplate3.jsx';
import ResumeTemplate4 from '../components/ai-resume-templates/resumeTemplate4/ResumeTemplate4.jsx';
import ResumeTemplate5 from '../components/ai-resume-templates/resumeTemplate5/ResumeTemplate5.jsx';
import ResumeTemplate6 from '../components/ai-resume-templates/resumeTemplate6/ResumeTemplate6.jsx';
import ResumeTemplate7 from '../components/ai-resume-templates/resumeTemplate7/ResumeTemplate7.jsx';
import ResumeTemplate8 from '../components/ai-resume-templates/resumeTemplate8/ResumeTemplate8.jsx';
import ResumeTemplate9 from '../components/ai-resume-templates/resumeTemplate9/ResumeTemplate9.jsx';

import Trytemp from '../components/Trytemp.jsx';

// Not Found
import NotFound from "../pages/NotFound.jsx"



const AppRoutes = () => {
  return (
    <Routes>
  {/* Public Routes */}
  <Route path='/' element={<Home />} />
  <Route path='/templatepage' element={<TemplatePage />} />

  {/* Resume Template Routes */}
  <Route path='/resume-template1' element={<ResumeTemplate1 />} />
  <Route path='/resume-template2' element={<ResumeTemplate2 />} />
  <Route path='/resume-template3' element={<ResumeTemplate3 />} />
  <Route path='/resume-template4' element={<ResumeTemplate4 />} />
  <Route path='/resume-template5' element={<ResumeTemplate5 />} />
  <Route path='/resume-template6' element={<ResumeTemplate6 />} />
  <Route path='/resume-template7' element={<ResumeTemplate7 />} />
  <Route path='/resume-template8' element={<ResumeTemplate8 />} />
  <Route path='/resume-template9' element={<ResumeTemplate9 />} />
  <Route path='/try' element={<Trytemp />} />

  {/* Auth Routes */}
  <Route path='/login' element={<LoginSignup />} />
  <Route path='/Signup' element={<LoginSignup />} />

  {/*  404 Not Found Route  */}
  <Route path='*' element={<NotFound />} />
</Routes>
  );
};

export default AppRoutes;
