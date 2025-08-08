import React from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ThemeToggle from './components/ThemeToggle';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobseekers from './pages/Jobseekers';
import Employers from './pages/Employers';
import About from './pages/About';
import Contact from './pages/Contact';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobPortal from './pages/JobPortal';
import JobDetails from './components/jobseeker/JobDetails';
import ViewResume from './pages/ViewResume';
import ViewApplications from './components/employer/ViewApplications';
import ApplicationStatus from './pages/ApplicationStatus';
import NotFound from './pages/NotFound';
import './App.css';
import './css/Modal.css';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <Header />
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobseekers" element={<Jobseekers />} />
            <Route path="/employers" element={<Employers />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobPortal />} />
            <Route path="/job/:jobId" element={<JobDetails />} />
            <Route path="/view-resume" element={<ViewResume />} />
            <Route path="/employer/dashboard/applications/:jobId" element={<ViewApplications />} />
            <Route path="/application-status/:id" element={<ApplicationStatus />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
