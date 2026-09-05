import React from 'react';
import { Building2, Sliders, BookOpen, Sun, Moon, ShieldCheck, Database, Sprout } from 'lucide-react';
import OfficialHeader from './OfficialHeader';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Official Top Bar */}
      <OfficialHeader />

      <div className="app-container" style={{ padding: '0.9rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo with Organic Rounded Shape */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 6px 20px -3px rgba(93, 112, 82, 0.4)',
            transition: 'transform 0.4s ease'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              MSME Growth & Subsidy Engine
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Dual-Layer AI</span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Tactile Decision Support & Budget-Constrained Optimization Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Floating Pill Container) */}
        <nav style={{
          display: 'flex',
          gap: '0.4rem',
          background: 'var(--muted)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('layer1')}
            className={`btn ${activeTab === 'layer1' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', border: 'none' }}
          >
            <Building2 size={16} />
            Layer 1: Advisory
          </button>

          <button
            onClick={() => setActiveTab('layer2')}
            className={`btn ${activeTab === 'layer2' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', border: 'none' }}
          >
            <Sliders size={16} />
            Layer 2: Optimization
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`btn ${activeTab === 'benchmarks' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', border: 'none' }}
          >
            <Database size={16} />
            ASUSE Benchmarks
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`btn ${activeTab === 'schemes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', border: 'none' }}
          >
            <BookOpen size={16} />
            Scheme Catalog
          </button>
        </nav>

        {/* Actions & Theme Pill Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--primary)',
            background: 'var(--emerald-light)',
            padding: '0.4rem 0.95rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(93, 112, 82, 0.25)'
          }}>
            <ShieldCheck size={14} />
            <span>SHAP & Knapsack Live</span>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '0',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Earth Light / Forest Dark Palette"
          >
            {theme === 'dark' ? <Sun size={19} color="#DCA776" /> : <Moon size={19} color="#5D7052" />}
          </button>
        </div>

      </div>
    </header>
  );
}
