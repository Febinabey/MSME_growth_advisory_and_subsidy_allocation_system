import React from 'react';
import { Building2, Sliders, BookOpen, Sun, Moon, ShieldCheck, Cpu, Database } from 'lucide-react';
import OfficialHeader from './OfficialHeader';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)'
    }}>
      {/* Official Government Identification Top Bar */}
      <OfficialHeader />

      <div className="app-container" style={{ padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              MSME Growth & Subsidy Engine
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Dual-Layer AI Portal</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              National Decision Support & Budget-Constrained Optimization Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-primary)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('layer1')}
            className={`btn ${activeTab === 'layer1' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', border: 'none' }}
          >
            <Building2 size={15} />
            Layer 1: Advisory
          </button>

          <button
            onClick={() => setActiveTab('layer2')}
            className={`btn ${activeTab === 'layer2' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', border: 'none' }}
          >
            <Sliders size={15} />
            Layer 2: Optimization
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`btn ${activeTab === 'benchmarks' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', border: 'none' }}
          >
            <Database size={15} />
            ASUSE Benchmarks
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`btn ${activeTab === 'schemes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', border: 'none' }}
          >
            <BookOpen size={15} />
            Scheme Repository
          </button>
        </nav>

        {/* Actions & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--emerald-main)', background: 'var(--emerald-light)', padding: '0.35rem 0.75rem', borderRadius: '9999px' }}>
            <ShieldCheck size={14} />
            <span>SHAP & OR-Tools Active</span>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%', width: '38px', height: '38px' }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>
        </div>

      </div>
    </header>
  );
}
