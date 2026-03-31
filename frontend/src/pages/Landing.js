import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const features = [
  {
    emoji: '💬',
    title: 'AI Chat Companion',
    desc: 'Talk through your feelings with a warm, empathetic AI trained to support your mental health.',
  },
  {
    emoji: '📖',
    title: 'Guided Journaling',
    desc: 'Write freely — Sahai analyzes your mood and responds with compassion and insight.',
  },
  {
    emoji: '📊',
    title: 'Mood Tracking',
    desc: 'Visualise your emotional patterns over time and celebrate your growth.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <header className="landing-header">
        <span className="landing-logo">Sahai</span>
        <div className="landing-nav-actions">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Get started</button>
        </div>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">YOUR COMPASSIONATE COMPANION</p>
        <h1 className="hero-title">
          A safe space to feel,<br />
          <em>reflect &amp; grow.</em>
        </h1>
        <p className="hero-sub">
          Sahai listens without judgment. Track your mood, journal your thoughts,<br />
          and get thoughtful AI support — whenever you need it.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => navigate('/register')}>Start for free</button>
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
        </div>
      </section>

      <section className="features">
        {features.map((f) => (
          <div className="feature-card card" key={f.title}>
            <span className="feature-emoji">{f.emoji}</span>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
