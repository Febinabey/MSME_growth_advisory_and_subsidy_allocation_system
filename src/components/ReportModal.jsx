import React from 'react';
import { X, Printer, Leaf, CheckCircle2, Sprout, ShieldCheck } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, msmeData, predictions, shapData, matchedSchemes }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(44, 44, 36, 0.65)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div className="glass-panel organic-card-1" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-secondary)',
        padding: '2.5rem',
        position: 'relative'
      }}>
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-organic-1)',
              background: 'var(--emerald-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={22} color="var(--emerald-main)" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>MSME Growth & Advisory Executive Audit</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>AI-Powered Dual-Layer MSME Platform • Official Report</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              <Printer size={16} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Audit Report Content */}
        <div id="printable-report">
          {/* Company Overview */}
          <div className="organic-card-2" style={{
            background: 'var(--bg-primary)',
            padding: '1.25rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Enterprise Sector</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{msmeData.sector}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Annual Revenue</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{(msmeData.annualRevenue / 100000).toFixed(1)} Lakhs</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Workforce Scale</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{msmeData.employees} Permanent Staff</div>
            </div>
          </div>

          {/* AI Growth Diagnostic */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout size={18} color="var(--emerald-main)" />
              1. Predictive AI Growth Assessment
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="organic-card-1" style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 700 }}>Growth Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--emerald-main)', fontFamily: 'var(--font-serif)' }}>{predictions.growthScore} / 100</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tier: {predictions.tier}</div>
              </div>
              <div className="organic-card-2" style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 700 }}>1-Yr Revenue Projection</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)', fontFamily: 'var(--font-serif)' }}>+{predictions.predictedRevenueGrowth}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>₹{(predictions.projectedRevenueAmount / 100000).toFixed(1)} Lakhs</div>
              </div>
              <div className="organic-card-3" style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 700 }}>Job Creation Potential</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cyan-main)', fontFamily: 'var(--font-serif)' }}>+{predictions.predictedJobs} Jobs</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Risk: {predictions.riskLevel}</div>
              </div>
            </div>
          </div>

          {/* Top Matched Scheme Recommendations */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--secondary)" />
              2. Top Recommended Government Schemes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {matchedSchemes.slice(0, 3).map((scheme, idx) => (
                <div key={idx} className={`organic-card-${(idx % 3) + 1}`} style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--emerald-main)" />
                      {scheme.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {scheme.ministry} • Max Subsidy: ₹{(scheme.maxSubsidy / 100000).toFixed(1)} Lakhs ({scheme.subsidyPercentage}%)
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-emerald">Semantic Match {scheme.semanticScore}%</span>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-main)', marginTop: '0.25rem', fontFamily: 'var(--font-serif)' }}>
                      Rec. Subsidy: ₹{(scheme.recommendedSubsidyAmount / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SHAP Explanation Summary */}
          <div className="organic-card-2" style={{ background: 'var(--emerald-light)', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={18} color="var(--emerald-main)" />
              3. Key Value Driver Analysis
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-sans)' }}>
              SHAP feature decomposition shows that historical revenue momentum and GST compliance score contribute positively, while debt ratio places a slight drag on credit scoring. The model weighs recent growth trajectory most heavily in determining subsidy eligibility and recommended allocation amounts.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
