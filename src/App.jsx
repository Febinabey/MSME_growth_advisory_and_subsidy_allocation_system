import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Layer1Advisory from './components/Layer1Advisory';
import Layer2Optimization from './components/Layer2Optimization';
import BenchmarkView from './components/BenchmarkView';
import SchemeDirectory from './components/SchemeDirectory';

export default function App() {
  const [activeTab, setActiveTab] = useState('layer1'); // layer1 | layer2 | benchmarks | schemes
  const [theme, setTheme] = useState('dark');

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
        {activeTab === 'benchmarks' && <BenchmarkView />}
        {activeTab === 'schemes' && <SchemeDirectory />}
      </main>

      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '1.5rem 0', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)',
        background: 'var(--bg-secondary)'
      }}>
        <div className="app-container">
          Official Government MSME Growth Advisory & Subsidy Optimization Platform • XGBoost + SHAP + Multiple-Choice Knapsack (OR-Tools) • Integrated with MoSPI ASUSE 2023-24 Survey Benchmarks
        </div>
      </footer>
    </div>
  );
}
