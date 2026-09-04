import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Award, Building2 } from 'lucide-react';

export default function OfficialHeader() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      borderBottom: '2px solid #6366f1',
      color: '#ffffff',
      padding: '0.65rem 2rem',
      fontSize: '0.78rem'
    }}>
      <div className="app-container" style={{ padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Left: Official Government Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: '#ffffff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 800,
            fontSize: '0.72rem',
            color: '#0f172a',
            letterSpacing: '0.05em'
          }}>
            GOVT OF INDIA
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
            <Building2 size={14} color="#38bdf8" />
            <span>Ministry of Micro, Small & Medium Enterprises (MSME) • Official Decision Support Portal</span>
          </div>
        </div>

        {/* Right: Real Data Integration Verification Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4ade80' }}>
            <Database size={13} />
            <span>MoSPI ASUSE 2023-24 Benchmarks Integrated</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#a78bfa' }}>
            <ShieldCheck size={13} />
            <span>myScheme & Udyam Portal Gazette Compliant</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fde047' }}>
            <Cpu size={13} />
            <span>XGBoost + SHAP + OR-Tools Active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
