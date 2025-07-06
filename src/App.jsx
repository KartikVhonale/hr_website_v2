import React from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
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
import './App.css';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
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
        </Routes>
      <Footer />
    </div>
    </ThemeProvider>
  );
}

export default App;
