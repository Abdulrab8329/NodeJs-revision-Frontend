import React from 'react';
import './Sidebar.css';
import { courseData } from '../../data/courseData';

export default function Sidebar({
  activeModule,
  setActiveModule,
  activeTopic,
  setActiveTopic,
  completedTopics,
  sidebarOpen,
  setSidebarOpen
}) {
  return (
    <>
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        {courseData.map((mod, mIdx) => (
          <div key={mIdx}>
            <div
              className={`module-header ${activeModule === mIdx ? 'active' : ''}`}
              style={{ borderLeftColor: activeModule === mIdx ? mod.color : 'transparent' }}
              onClick={() => { 
                setActiveModule(mIdx); 
                setActiveTopic(0); 
                if(window.innerWidth <= 768) setSidebarOpen(false);
              }}
            >
              <div className="module-title" style={{ color: activeModule === mIdx ? '#fff' : '#94a3b8' }}>
                {mod.title}
              </div>
              <div className="module-topics-count">
                {mod.topics.length} topics
              </div>
            </div>
            {activeModule === mIdx && mod.topics.map((t, tIdx) => (
              <div
                key={tIdx}
                className={`topic-item ${activeTopic === tIdx ? 'active' : ''}`}
                onClick={() => { 
                  setActiveTopic(tIdx); 
                  if(window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                <div 
                  className="topic-indicator" 
                  style={{ background: completedTopics.has(`${mIdx}-${tIdx}`) ? "#4ade80" : (activeTopic === tIdx ? mod.color : "#334155") }} 
                />
                <span className="topic-name" style={{ color: activeTopic === tIdx ? "#e2e8f0" : "#64748b" }}>{t.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
