import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveProgress, getProgress } from "../services/axiosConfig.js";
import LoginPage from './LoginPage.jsx';

import { courseData } from '../data/courseData';
import Header from './Header/Header.jsx';
import Sidebar from './Sidebar/Sidebar.jsx';
import TopicContent from './TopicContent/TopicContent.jsx';
import './NodeJsRevision.css';

export default function NodeRevisionCourse() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  const module = courseData[activeModule];
  const topic = module.topics[activeTopic];
  const topicKey = `${activeModule}-${activeTopic}`;

  const markDone = () => {
    setCompletedTopics(prev => new Set([...prev, topicKey]));
  };

  const totalTopics = courseData.reduce((a, m) => a + m.topics.length, 0);
  const progress = Math.round((completedTopics.size / totalTopics) * 100) || 0;

  // Load progress from backend on login
  useEffect(() => {
    if (user) {
      getProgress().then(res => {
        const { module_index, topic_index, completed_topics } = res.data;
        setActiveModule(module_index || 0);
        setActiveTopic(topic_index || 0);
        setCompletedTopics(new Set(completed_topics ? completed_topics.split(',') : []));
      }).catch(err => console.error("Error loading progress", err));
    }
  }, [user]);

  // Save progress whenever something changes
  useEffect(() => {
    if (user && completedTopics.size > 0) {
      saveProgress({
        module_index: activeModule,
        topic_index: activeTopic,
        completed_topics: [...completedTopics].join(',')
      }).catch(err => console.error("Error saving progress", err));
    }
  }, [activeModule, activeTopic, completedTopics, user]);

  // Show login page first
  if (showLogin && !user) {
    return <LoginPage onGuest={() => setShowLogin(false)} />;
  }

  return (
    <div className="node-revision-app">
      <Header
        user={user}
        logout={logout}
        setShowLogin={setShowLogin}
        completedTopicsSize={completedTopics.size}
        totalTopics={totalTopics}
        progress={progress}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="main-layout">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          completedTopics={completedTopics}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <TopicContent
          key={topicKey}
          module={module}
          topic={topic}
          topicKey={topicKey}
          completedTopics={completedTopics}
          markDone={markDone}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          courseData={courseData}
        />
      </div>
    </div>
  );
}