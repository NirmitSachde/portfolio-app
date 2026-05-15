import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Hero from '../sections/Hero';
import AboutMe from '../sections/AboutMe';
import Projects from '../sections/Projects';
import Skills from '../sections/Skills';
import Resume from '../sections/Resume';

const HomePage = () => {
  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <AboutMe />
      <Projects />
      <Skills />
      <Resume />
      <Footer />
    </div>
  );
};

export default HomePage;
