import React from 'react';
import './Header.css';
import { FiLogOut } from "react-icons/fi";

export default function Header({
  user,
  logout,
  setShowLogin,
  completedTopicsSize,
  totalTopics,
  progress,
  toggleSidebar
}) {
  return (
    <div className="header-container">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="title-wrapper">
          <div className="subtitle hide-mobile">
            Instructor: Abdul Rab
          </div>
          <div className="main-title">
            <span className="hide-mobile">Node.js, Express & PostgreSQL Revision</span>
            <span className="show-mobile" style={{ display: 'none' }}>Node Revision</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="progress-section hide-mobile">
          <div className="progress-text">{completedTopicsSize}/{totalTopics} topics done</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-percentage">{progress}% complete</div>
        </div>

        {user ? (
          <div className="auth-section">
            <div className="user-chip" title={user?.username || 'User'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span className="username hide-mobile">{user?.username || 'User'}</span>
            </div>
            <button className="logout-btn" onClick={logout}>Logout <FiLogOut /> </button>
          </div>
        ) : (
          <div className="auth-section">
            <div className="guest-chip hide-mobile">Guest Mode</div>
            <button className="header-btn" onClick={() => setShowLogin(true)}>Login </button>
          </div>
        )}
      </div>
    </div>
  );
}
