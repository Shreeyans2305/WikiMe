import React, { useState, useEffect } from 'react';
import CardSwap, { Card } from '../componenets/CardSwap';
import WikiPreviewCard from '../componenets/WikiPreviewCard';
import { useNavigate } from 'react-router-dom';
import './Home.css';


// Reactive card dimensions based on viewport width
function useCardSize() {
  const [size, setSize] = useState({ width: 320, height: 420 });
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw <= 360)       setSize({ width: vw - 48, height: 340 });
      else if (vw <= 480)  setSize({ width: Math.min(vw - 48, 300), height: 370 });
      else if (vw <= 900)  setSize({ width: 300, height: 390 });
      else                 setSize({ width: 320, height: 420 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

export const Home = () => {
  const navigate = useNavigate();
  const cardSize = useCardSize();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const previousBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = darkMode ? '#0b1020' : '#f7f5f0';
    return () => {
      document.body.style.backgroundColor = previousBackground;
    };
  }, [darkMode]);

  return (
    <>
    <h1 className={`heading ${darkMode ? 'heading--dark' : ''}`}>WikiMe</h1>
    <div className={`home-root ${darkMode ? 'home-root--dark' : ''}`}>

      <div className="home-left">
        <div className="home-topbar">
          <div className="home-eyebrow">Free · Instant · Yours</div>
          <button
            type="button"
            className="home-theme-toggle"
            onClick={() => setDarkMode((value) => !value)}
            aria-pressed={darkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
        <h1 className="home-title">
          Your wiki,<br />
          <span className="home-title-accent">written for you.</span>
        </h1>

        <p className="home-desc">
          Generate a Wikipedia-style page about anyone — yourself, a friend, a
          character — in seconds. Share it with a single link.
        </p>

        <div className="home-actions">
          <button className="home-btn-primary" onClick={() => navigate('/create')}>
            Create your wiki
          </button>
          <span className="home-hint">No account needed</span>
        </div>

        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat-num">AI</span>
            <span className="home-stat-label">generated</span>
          </div>
          <div className="home-stat-div" />
          <div className="home-stat">
            <span className="home-stat-num">1‑click</span>
            <span className="home-stat-label">sharing</span>
          </div>
          <div className="home-stat-div" />
          <div className="home-stat">
            <span className="home-stat-num">∞</span>
            <span className="home-stat-label">wikis</span>
          </div>
        </div>
      </div>

      <div className="home-right" style={{ width: cardSize.width, height: cardSize.height }}>
        <CardSwap
          width={cardSize.width}
          height={cardSize.height}
          cardDistance={Math.round(cardSize.width * 0.14)}
          verticalDistance={Math.round(cardSize.height * 0.12)}
          delay={3000}
          pauseOnHover={true}
          skewAmount={3}
        >
          {[0, 1, 2, 3].map((i) => (
            <Card
              key={i}
              style={{
                border: '1px solid #a2a9b1',
                borderRadius: 8,
                overflow: 'hidden',
                background: darkMode ? '#111827' : '#fff',
                boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.45)' : '0 2px 16px rgba(0,0,0,0.10)',
              }}
            >
              <WikiPreviewCard index={i} darkMode={darkMode} />
            </Card>
          ))}
        </CardSwap>
      </div>
    </div>
    </>
  );
};

export default Home;