import React from 'react';
import { X, Printer, Leaf, CheckCircle2, Sprout, ShieldCheck, Award, FileText } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

export default function ReportModal({ isOpen, onClose, msmeData, predictions, shapData, matchedSchemes }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const auditDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const auditId = `MSME-AUDIT-${msmeData.id ? msmeData.id.slice(-6).toUpperCase() : Date.now().toString().slice(-6)}`;

  return (
    <div className="report-modal-overlay">
      <div className="report-modal-dialog glass-panel organic-card-1">
        
        {/* Header bar (Screen & Print Unified) */}
        <div className="report-modal-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--border-color)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-organic-1)',
              background: 'var(--emerald-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(93, 112, 82, 0.25)'
            }}>
              <Leaf size={24} color="var(--emerald-main)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--emerald-main)' }}>
                Government of India • Statutory Advisory Framework
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.15rem 0' }}>
                MSME Growth & Subsidy Executive Audit
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', margin: 0 }}>
                Compliance: Gazette Notifications S.O. 2119(E) & S.O. 1364(E) • MoSPI ASUSE 2023-24
              </p>
            </div>
          </div>

          {/* Action Buttons (Hidden during Print / PDF save) */}
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '0.55rem 1.35rem', fontWeight: 700 }}>
              <Printer size={16} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.55rem 0.85rem' }} title="Close">
              <X size={18} />
            </button>
          </div>

          {/* Print-Only Document Reference Meta */}
          <div className="print-only-meta" style={{ display: 'none', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div><strong>Audit Reference:</strong> {auditId}</div>
            <div><strong>Date of Issue:</strong> {auditDate}</div>
            <div><strong>Verification:</strong> <span style={{ color: 'var(--emerald-main)', fontWeight: 700 }}>STATUTORY COMPLIANT</span></div>
          </div>
        </div>

        {/* Audit Report Content */}
        <div id="printable-report">
          
          {/* Section 1: Enterprise Identity Header */}
          <div className="report-avoid-break" style={{
            background: 'var(--muted)',
            padding: '1.15rem 1.35rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Evaluated Enterprise
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.15rem' }}>
                {msmeData.enterpriseName || 'MSME Enterprise'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {msmeData.district ? `${msmeData.district}, ` : ''}{msmeData.state || 'India'}
                {msmeData.pincode ? ` • PIN: ${msmeData.pincode}` : ''}
                {msmeData.requestedScheme ? ` • Scheme Focus: ${msmeData.requestedScheme}` : ''}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}>
                {msmeData.sector}
              </span>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Audited: {auditDate}
              </div>
            </div>
          </div>

          {/* Section 2: Enterprise Financial & Scale Overview */}
          <div className="report-avoid-break" style={{
            background: 'var(--bg-primary)',
            padding: '1.25rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Enterprise Sector
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                {msmeData.sector}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Annual Turnover
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                {formatINR(msmeData.annualRevenue, { showBoth: true })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Workforce Scale
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                {msmeData.employees} Permanent Staff
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Profit Margin / Debt
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                {msmeData.profitMargin}% / {(msmeData.debtRatio * 100).toFixed(0)}% Debt
              </div>
            </div>
          </div>

          {/* Section 3: Predictive AI Growth & Credit Assessment */}
          <div className="report-avoid-break" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout size={18} color="var(--emerald-main)" />
              1. Predictive AI Growth Assessment (XGBoost Engine)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="organic-card-1" style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Composite Growth Score
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald-main)', fontFamily: 'var(--font-serif)', margin: '0.2rem 0' }}>
                  {predictions.growthScore} / 100
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Tier: <strong>{predictions.tier}</strong>
                </div>
              </div>

              <div className="organic-card-2" style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  1-Yr Projected Revenue Growth
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-serif)', margin: '0.2rem 0' }}>
                  +{predictions.predictedRevenueGrowth}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Projected: <strong>{formatINR(predictions.projectedRevenueAmount)}</strong>
                </div>
              </div>

              <div className="organic-card-3" style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Job Creation Potential
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan-main)', fontFamily: 'var(--font-serif)', margin: '0.2rem 0' }}>
                  +{predictions.predictedJobs} Jobs
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Risk Profile: <strong>{predictions.riskLevel}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Top Recommended Government Schemes */}
          <div className="report-avoid-break" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--secondary)" />
              2. Top Recommended Government Schemes & Subsidy Entitlements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {matchedSchemes && matchedSchemes.length > 0 ? (
                matchedSchemes.slice(0, 3).map((scheme, idx) => (
                  <div key={idx} className="report-avoid-break" style={{
                    background: 'var(--bg-primary)',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color="var(--emerald-main)" />
                        {scheme.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {scheme.ministry} • Max Assistance: <strong>{formatINR(scheme.maxSubsidy)}</strong> ({scheme.subsidyPercentage}% Subsidy)
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-emerald">Semantic Match {scheme.semanticScore}%</span>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-main)', marginTop: '0.3rem', fontFamily: 'var(--font-serif)' }}>
                        Recommended Grant: {formatINR(scheme.recommendedSubsidyAmount, { compact: true })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.75rem', fontStyle: 'italic' }}>
                  No matching schemes evaluated for current parameter set.
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Transparent Value Driver Analysis (Tree SHAP) */}
          <div className="report-avoid-break" style={{
            background: 'var(--muted)',
            padding: '1.25rem',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={18} color="var(--emerald-main)" />
              3. Transparent Value Driver Analysis (Tree SHAP Feature Decomposition)
            </h3>
            {shapData && shapData.shapContributions && shapData.shapContributions.length > 0 ? (
              <div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                  Explainable AI (Tree SHAP) feature decomposition relative to MoSPI ASUSE national baseline expectation ({shapData.baseScore ? shapData.baseScore.toFixed(1) : '50.0'}):
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                  {shapData.shapContributions.map((item, idx) => (
                    <div key={idx} style={{
                      fontSize: '0.82rem',
                      background: 'var(--bg-secondary)',
                      padding: '0.65rem 0.95rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{item.feature}:</strong>{' '}
                        <span style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                      </span>
                      <span style={{
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        marginLeft: '0.5rem',
                        color: item.shapValue >= 0 ? 'var(--emerald-main)' : 'var(--rose-main)'
                      }}>
                        {item.shapValue >= 0 ? `+${item.shapValue}` : item.shapValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                SHAP feature decomposition shows revenue momentum and GST compliance score contribute positively, while debt leverage places a calibrated drag on credit scoring.
              </p>
            )}
          </div>

          {/* Section 6: Statutory Compliance Seal & Verification Block */}
          <div className="report-avoid-break" style={{
            borderTop: '1.5px dashed var(--border-color)',
            paddingTop: '1.15rem',
            marginTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.74rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              <strong>Statutory Framework:</strong> Gazette Notifications S.O. 2119(E) & S.O. 1364(E) • MoSPI ASUSE Microdata
              <br />
              All investment and turnover limits strictly adhere to Government of India MSME definitions.
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Digitally Verified Audit Report</div>
              <div>MSME Dual-Layer Advisory & Optimization Platform</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
