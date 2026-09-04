import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export default function SHAPWaterfall({ shapData }) {
  if (!shapData) return null;

  const { baseScore, shapContributions, finalCalculatedScore } = shapData;

  // Max absolute SHAP value for scaling bar widths
  const maxAbsValue = Math.max(...shapContributions.map(c => Math.abs(c.shapValue)), 1);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            SHAP Model Explainability Diagnostic
            <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>XAI Transparency</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Decomposition of feature contributions ($\phi_i$) relative to Base Baseline Score ({baseScore.toFixed(1)})
          </p>
        </div>

        <div style={{ textAlign: 'right', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', uppercase: 'true' }}>Final Growth Score</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: finalCalculatedScore >= 75 ? 'var(--emerald-main)' : finalCalculatedScore >= 50 ? 'var(--amber-main)' : 'var(--rose-main)' }}>
            {finalCalculatedScore} / 100
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {shapContributions.map((item, index) => {
          const isPositive = item.shapValue >= 0;
          const barWidthPercent = Math.min(100, (Math.abs(item.shapValue) / maxAbsValue) * 80);

          return (
            <div key={index} style={{
              background: 'var(--bg-secondary)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 3fr',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {/* Feature Name & Observed Value */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.feature}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Observed: <strong style={{ color: 'var(--text-secondary)' }}>{item.value}</strong>
                </div>
              </div>

              {/* SHAP Impact Value badge */}
              <div>
                <span className={`badge ${isPositive ? 'badge-emerald' : 'badge-rose'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {isPositive ? `+${item.shapValue}` : item.shapValue} pts
                </span>
              </div>

              {/* Visual Horizontal Bar */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{
                    height: '8px',
                    width: `${barWidthPercent}%`,
                    borderRadius: '4px',
                    background: isPositive 
                      ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                      : 'linear-gradient(90deg, #f43f5e 0%, #e11d48 100%)',
                    boxShadow: isPositive ? '0 0 8px rgba(16, 185, 129, 0.4)' : '0 0 8px rgba(244, 63, 94, 0.4)'
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'var(--accent-light)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Info size={16} color="var(--accent-primary)" />
        <span><strong>Audit Note:</strong> SHAP values explain exact mathematical deviations from the baseline score ({baseScore}), ensuring complete regulatory transparency for loans and subsidy allocations.</span>
      </div>
    </div>
  );
}
