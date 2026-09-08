import React from 'react';
import { ShieldCheck, Cpu, Database, Award, Leaf } from 'lucide-react';

export default function OfficialHeader() {
  return (
    <div style={{
      background: 'var(--muted)',
      borderBottom: '1px solid var(--border)',
      color: 'var(--text-secondary)',
      padding: '0.65rem 2rem',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease'
    }}>
      <div className="app-container" style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Left: Official Government Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--primary)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.7rem',
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            boxShadow: 'var(--shadow-sm)'
          }}>
            GOVT OF INDIA
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            <Leaf size={14} color="var(--primary)" />
            <span>Ministry of Micro, Small & Medium Enterprises • Growth Advisory & Subsidy Engine</span>
          </div>
        </div>

        {/* Right: Verified Data Seals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700 }}>
            <Database size={13} />
            <span>MoSPI ASUSE 2023-24 (5.2 Lakh Units)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)', fontWeight: 700 }}>
            <ShieldCheck size={13} />
            <span>Udyam Live Registry (70,929 Units)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-main)', fontWeight: 700 }}>
            <Cpu size={13} />
            <span>XGBoost + SHAP + Knapsack</span>
          </div>
        </div>

      </div>
    </div>
  );
}
