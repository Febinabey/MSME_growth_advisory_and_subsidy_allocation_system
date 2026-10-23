import React from 'react';
import { Building2, Sliders, Sun, Moon, Sprout } from 'lucide-react';

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
      <div className="app-container" style={{ padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(93, 112, 82, 0.35)'
          }}>
            <Sprout size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              MSME Growth & Subsidy Engine
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              AI Growth Advisory & Knapsack Subsidy Allocation
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
          border: '1px solid var(--border)'
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
        </nav>

        {/* Theme Pill Toggle */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '0',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun size={18} color="#DCA776" /> : <Moon size={18} color="#5D7052" />}
          </button>
        </div>

      </div>
    </header>
  );
}
