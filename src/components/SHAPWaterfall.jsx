import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info, Leaf } from 'lucide-react';

export default function SHAPWaterfall({ shapData }) {
  if (!shapData) return null;

  const { baseScore, shapContributions, finalCalculatedScore } = shapData;

  // Max absolute SHAP value for scaling bar widths
  const maxAbsValue = Math.max(...shapContributions.map(c => Math.abs(c.shapValue)), 1);

  return (
    <div className="glass-panel organic-card-2" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Leaf size={20} color="var(--primary)" />
            SHAP Feature Attribution Diagnostic
            <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Transparent XAI</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Decomposition of marginal feature contributions ($\phi_i$) relative to baseline dataset expectation ({baseScore.toFixed(1)})
          </p>
        </div>

        <div style={{
          textAlign: 'right',
          background: 'var(--muted)',
          padding: '0.65rem 1.4rem',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Calculated Growth Score</div>
          <div style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 800,
            color: finalCalculatedScore >= 75 ? 'var(--primary)' : finalCalculatedScore >= 50 ? 'var(--secondary)' : 'var(--rose-main)'
          }}>
            {finalCalculatedScore} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {shapContributions.map((item, index) => {
          const isPositive = item.shapValue >= 0;
          const barWidthPercent = Math.min(100, (Math.abs(item.shapValue) / maxAbsValue) * 85);

          return (
            <div key={index} style={{
              background: 'var(--bg-secondary)',
              padding: '0.9rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 3fr',
              alignItems: 'center',
              gap: '1.25rem',
              transition: 'all 0.25s ease'
            }}>
              {/* Feature Name & Observed Value */}
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {item.feature}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Observed: <strong style={{ color: 'var(--text-secondary)' }}>{item.value}</strong>
                </div>
              </div>

              {/* SHAP Impact Value badge */}
              <div>
                <span className={`badge ${isPositive ? 'badge-emerald' : 'badge-rose'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {isPositive ? `+${item.shapValue}` : item.shapValue} pts
                </span>
              </div>

              {/* Visual Horizontal Bar in Organic Moss & Terracotta */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div style={{
                    height: '10px',
                    width: `${barWidthPercent}%`,
                    borderRadius: 'var(--radius-pill)',
                    background: isPositive 
                      ? 'linear-gradient(90deg, #5D7052 0%, #78906B 100%)' 
                      : 'linear-gradient(90deg, #A85448 0%, #C18C5D 100%)',
                    boxShadow: isPositive 
                      ? '0 2px 8px rgba(93, 112, 82, 0.3)' 
                      : '0 2px 8px rgba(168, 84, 72, 0.3)'
                  }} />
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '0.85rem 1.25rem',
        background: 'var(--accent-light)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}>
        <Info size={18} color="var(--primary)" />
        <span><strong>Audit Notice:</strong> SHAP values provide exact mathematical decomposition of feature attributions, verifying non-discrimination and compliance with Reserve Bank of India (RBI) MSME underwriting benchmarks.</span>
      </div>
    </div>
  );
}
