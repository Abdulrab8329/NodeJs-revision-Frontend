import React, { useState } from 'react';
import './TopicContent.css';

export default function TopicContent({
  module,
  topic,
  topicKey,
  completedTopics,
  markDone,
  activeModule,
  setActiveModule,
  activeTopic,
  setActiveTopic,
  courseData
}) {
  const [activeTab, setActiveTab] = useState("notes");
  const [showSolution, setShowSolution] = useState(false);

  const handlePrev = () => {
    if (activeTopic > 0) {
      setActiveTopic(activeTopic - 1);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      setActiveTopic(courseData[activeModule - 1].topics.length - 1);
    }
  };

  const handleNext = () => {
    if (activeTopic < module.topics.length - 1) {
      setActiveTopic(activeTopic + 1);
    } else if (activeModule < courseData.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveTopic(0);
    }
  };

  return (
    <div className="content-container">
      <div className="content-max-width">
        {/* Topic header */}
        <div className="topic-header-section">
          <div className="module-info-label" style={{ color: module.color }}>
            {module.title}
          </div>
          <h2 className="topic-main-title">{topic.name}</h2>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          {["notes", "example", "task"].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab !== "task") setShowSolution(false); }}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === "notes" ? " Notes" : tab === "example" ? " Example" : " Task"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "notes" && (
          <div className="tab-pane">
            <div className="notes-list">
              {topic.notes.map((note, i) => (
                <div key={i} className="note-card">
                  <span className="note-icon" style={{ color: module.color }}>→</span>
                  <span className="note-text">{note}</span>
                </div>
              ))}
            </div>
            <button className="primary-btn" onClick={() => setActiveTab("example")}>
              See Example →
            </button>
          </div>
        )}

        {activeTab === "example" && (
          <div className="tab-pane">
            <pre className="code-block">
              <code>{topic.example}</code>
            </pre>
            <button className="primary-btn mt-4" onClick={() => setActiveTab("task")}>
              Try the Task →
            </button>
          </div>
        )}

        {activeTab === "task" && (
          <div className="tab-pane">
            <div className="task-card">
              <div className="task-label">YOUR TASK</div>
              <p className="task-desc">{topic.task}</p>
            </div>

            <div className="action-buttons">
              <button
                className={`secondary-btn ${showSolution ? 'active' : ''}`}
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? "Hide Solution" : " Show Solution"}
              </button>
              <button
                className={`action-btn ${completedTopics.has(topicKey) ? 'completed' : ''}`}
                onClick={markDone}
              >
                {completedTopics.has(topicKey) ? "✓ Completed!" : "Mark as Done"}
              </button>
            </div>

            {showSolution && (
              <div className="solution-section">
                <div className="solution-label">// SOLUTION</div>
                <pre className="solution-code">
                  <code>{topic.solution}</code>
                </pre>
              </div>
            )}
            
          </div>
        )}
        
        {/* Navigation */}
        <div className="navigation-footer">
          <button className="nav-btn prev-btn" onClick={handlePrev}>
            ← Previous
          </button>
          <button className="nav-btn next-btn" onClick={handleNext}>
            Next Topic →
          </button>
        </div>
      </div>
    </div>
  );
}
