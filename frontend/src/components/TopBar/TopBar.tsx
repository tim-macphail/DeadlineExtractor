import React from 'react';
import './TopBar.css';
import LogoIcon from '../../icons/Logo';

export const TopBar: React.FC = () => {
  return (
    <header className="top-bar">
      <div className="top-bar-content">
        <LogoIcon />
        <h1 className="top-bar-title" style={{ marginLeft: '12px' }}>Deadline Extractor</h1>
        <nav className="top-bar-nav">
          <a
            href="mailto:feedback@deadlineextractor.com?subject=Feedback for Deadline Extractor"
            className="feedback-link"
          >
            Feedback
          </a>
        </nav>
      </div>
    </header>
  );
};
