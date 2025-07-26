import React, { useRef } from 'react';
import '../css/Main.css';
import useScrollAnimation from '../lib/useScrollAnimation';

const team = [
  { name: 'Rodge', role: 'Founder & CEO' },
  { name: 'ABC', role: 'Head of Product' },
  { name: 'ABC', role: 'Lead Engineer' },   
];

const About = () => {
  const heroRef = useRef();
  const missionRef = useRef();
  const teamRef = useRef();
  useScrollAnimation(heroRef);
  useScrollAnimation(missionRef);
  useScrollAnimation(teamRef);

  return (
    <div className="about-page">
      <section className="about-hero" ref={heroRef}>
        <h1 className="about-title">About TalentFlow</h1>
        <p className="about-desc">Empowering connections between top talent and leading employers. Our mission is to make hiring and job searching seamless, modern, and human-focused.</p>
      </section>
      <section className="about-section" ref={missionRef}>
        <h2>Our Mission</h2>
        <p>We believe in a world where everyone can find meaningful work and every company can build a dream team. TalentFlow leverages technology and empathy to bridge the gap between opportunity and ambition.</p>
      </section>
      <section className="about-section about-team" ref={teamRef}>
        <h2>Meet the Team</h2>
        <div className="about-team-list">
          {team.map((member, idx) => (
            <div className="about-team-card" key={idx}>
              <div className="about-team-avatar">{member.name[0]}</div>
              <div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About; 