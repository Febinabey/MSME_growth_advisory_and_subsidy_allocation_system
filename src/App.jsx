import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import Navbar from './components/Navbar';
import Layer1Advisory from './components/Layer1Advisory';
import Layer2Optimization from './components/Layer2Optimization';
import BenchmarkView from './components/BenchmarkView';
import SchemeDirectory from './components/SchemeDirectory';

export default function App() {
  const [activeTab, setActiveTab] = useState('layer1'); // layer1 | layer2 | benchmarks | schemes
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
        {activeTab === 'benchmarks' && <BenchmarkView />}
        {activeTab === 'schemes' && <SchemeDirectory />}
      </main>

      <footer style={{ 
        borderTop: '1.5px solid var(--border-color)', 
        padding: '1.5rem 0', 
        textAlign: 'center', 
        background: 'var(--muted)'
      }}>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            <Leaf size={14} color="var(--emerald-main)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>MSME Growth Advisory & Subsidy Optimization Platform</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            XGBoost + SHAP + Multiple-Choice Knapsack Solver • MoSPI ASUSE 2023-24 Benchmarks • Government of India
          </div>
        </div>
      </footer>
    </div>
  );
}
