import React from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../componenets/LetterGlitch';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="nf-root">
      {/* Full-screen glitch background */}
      <div className="nf-glitch-bg">
        <LetterGlitch
          glitchColors={['#1a1a1a', '#3d3d3d', '#61dca3']}
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Overlay content */}
      <div className="nf-overlay">
        <p className="nf-eyebrow">404</p>
        <h1 className="nf-heading">You've wandered too far.</h1>
        <p className="nf-sub">This page doesn't exist in the encyclopedia.</p>
        <button className="nf-btn" onClick={() => navigate('/')}>
          ← Go back to the wikis
        </button>
      </div>
    </div>
  );
}