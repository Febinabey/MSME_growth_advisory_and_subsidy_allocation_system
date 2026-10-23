import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Layer1Advisory from './components/Layer1Advisory';
import Layer2Optimization from './components/Layer2Optimization';

export default function App() {
  const [activeTab, setActiveTab] = useState('layer1'); // layer1 | layer2
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      <main className="app-container" style={{ flex: 1 }}>
        {activeTab === 'layer1' && <Layer1Advisory />}
        {activeTab === 'layer2' && <Layer2Optimization />}
      </main>

      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '1.25rem 0', 
        textAlign: 'center', 
        background: 'var(--muted)'
      }}>
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span>MSME Growth Advisory & Subsidy Optimization Platform</span>
          <span>•</span>
          <span>Capstone Phase 2</span>
        </div>
      </footer>
    </div>
  );
}
