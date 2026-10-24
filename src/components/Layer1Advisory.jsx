import React, { useState, useMemo } from 'react';
import { predictMSMEGrowth } from '../engine/xgboostPredictor';
import { computeSHAPValues } from '../engine/shapExplainer';
import { matchSchemesForMSME } from '../engine/semanticMatcher';
import { REAL_UDYAM_DIRECTORY } from '../data/realUdyamDirectory';
import SHAPWaterfall from './SHAPWaterfall';
import ReportModal from './ReportModal';
import { formatINR, getMSMETier } from '../utils/formatCurrency';
import { Building2, Award, Sparkles, FileText, Leaf, ShieldAlert } from 'lucide-react';

export default function Layer1Advisory() {
  const [selectedUdyamId, setSelectedUdyamId] = useState('');

  // 1. MSME Input State (Statutory Composite Profile)
  const [formData, setFormData] = useState({
    enterpriseName: "Shri Salasar Balaji Contractor",
    state: "Uttar Pradesh",
    district: "Shahjahanpur",
    sector: "Manufacturing",
    annualRevenue: 35000000,       // ₹3.5 Crore Turnover
    machineryInvestment: 8500000, // ₹85 Lakhs Investment in Plant & Machinery (WDV)
    revenueGrowthRate: 18,         // 18% YoY
    employees: 28,
    debtRatio: 0.25,               // 25% debt/revenue
    profitMargin: 13.5,            // 13.5% net margin
    techLevel: 3,                  // 1-5 level
    gstScore: 85,                  // 85/100 compliance
    exportShare: 12,               // 12% exports
    requirementText: "Need funding to purchase automated CNC machinery and install solar panels for manufacturing facility."
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState('recommendations'); // recommendations | shap

  // Current Statutory MSME Tier under Gazette Composite Criteria (Turnover + Investment)
  const currentTier = useMemo(
    () => getMSMETier(formData.annualRevenue, formData.machineryInvestment),
    [formData.annualRevenue, formData.machineryInvestment]
  );

  // 2. Run Predictions & Calculations in Real-Time
  const predictions = useMemo(() => predictMSMEGrowth(formData), [formData]);
  const shapData = useMemo(() => computeSHAPValues(formData), [formData]);
  const matchedSchemes = useMemo(() => matchSchemesForMSME(formData, formData.requirementText), [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      let parsed = parseFloat(value) || 0;
      if (name === 'employees') parsed = Math.max(1, Math.min(10000, Math.round(parsed)));
      else if (name === 'annualRevenue' || name === 'machineryInvestment') parsed = Math.max(0, parsed);
      else if (name === 'debtRatio') parsed = Math.max(0, Math.min(1.0, parsed));
      else if (name === 'gstScore' || name === 'exportShare') parsed = Math.max(0, Math.min(100, parsed));
      setFormData(prev => ({ ...prev, [name]: parsed }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUdyamSelect = (unitId) => {
    const unit = REAL_UDYAM_DIRECTORY.find(u => u.id === unitId);
    if (!unit) return;
    setSelectedUdyamId(unitId);

    // Map sector to standard options
    let mappedSec = "Manufacturing";
    if (unit.sector.includes("Agro") || unit.sector.includes("Food")) mappedSec = "Agro-processing";
    else if (unit.sector.includes("Textil")) mappedSec = "Textiles";
    else if (unit.sector.includes("IT")) mappedSec = "IT Services";
    else if (unit.sector.includes("Chemical")) mappedSec = "Manufacturing";

    setFormData({
      enterpriseName: unit.enterpriseName,
      state: unit.state,
      district: unit.district,
      pincode: unit.pincode,
      registrationDate: unit.registrationDate,
      nicActivity: unit.nicActivity,
      sector: mappedSec,
      annualRevenue: unit.annualRevenue,
      machineryInvestment: unit.machineryInvestment || 8500000,
      revenueGrowthRate: unit.revenueGrowthRate,
      employees: unit.employees,
      debtRatio: unit.debtRatio,
      profitMargin: unit.profitMargin,
      techLevel: unit.techLevel,
      gstScore: unit.gstScore,
      exportShare: unit.exportShare,
      requirementText: `Official registered MSME unit in ${unit.district}, ${unit.state} seeking modernization subsidy under ${unit.requestedScheme} for expansion of: ${unit.nicActivity}.`
    });
  };

  return (
    <div>
      <div className="no-print">
        <div className="grid-1-2">
        
        {/* Left Column: MSME Data Entry Form */}
        <div className="glass-panel organic-card-3" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Building2 size={20} color="var(--primary)" />
              Enterprise Profile & Statutory Filing
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              MSMED Act 2006 • Gazette S.O. 2119(E)
            </span>
          </div>

          {/* Quick-Import from Registered MSME Directory */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Preload Registered Enterprise Profile (Official Registry)</label>
            <select 
              className="form-select"
              value={selectedUdyamId}
              onChange={(e) => handleUdyamSelect(e.target.value)}
            >
              <option value="">-- Custom Profile (or choose registered MSME) --</option>
              {REAL_UDYAM_DIRECTORY.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.enterpriseName} ({unit.state} • {unit.district})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* Enterprise Name */}
            <div className="form-group">
              <label className="form-label">Enterprise Legal Entity Name</label>
              <input 
                type="text" 
                name="enterpriseName" 
                value={formData.enterpriseName} 
                onChange={handleChange} 
                className="form-input" 
                placeholder="Enterprise Name"
              />
            </div>

            {/* Sector */}
            <div className="form-group">
              <label className="form-label">Enterprise Operational Sector</label>
              <select name="sector" value={formData.sector} onChange={handleChange} className="form-select">
                <option value="Manufacturing">Manufacturing</option>
                <option value="Electronics">Electronics</option>
                <option value="Agro-processing">Agro-processing</option>
                <option value="Textiles">Textiles</option>
                <option value="IT Services">IT Services</option>
                <option value="Green Tech">Green Tech</option>
              </select>
            </div>

            {/* Statutory Composite Criteria 1: Annual Turnover */}
            <div className="form-group">
              <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Annual Turnover</span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                    background: currentTier.bgColor,
                    color: currentTier.color,
                    border: `1px solid ${currentTier.borderColor}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em'
                  }}>
                    {currentTier.label}
                  </span>
                </span>
                <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                  {formatINR(formData.annualRevenue, { showBoth: true })}
                </strong>
              </div>
              <input 
                type="range" 
                name="annualRevenue" 
                min="1000000" 
                max="2500000000" 
                step="1000000" 
                value={formData.annualRevenue} 
                onChange={handleChange} 
                className="slider-input" 
              />
              {/* Quick turnover tier presets */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Micro (₹1 Cr)', val: 10000000 },
                  { label: 'Small (₹25 Cr)', val: 250000000 },
                  { label: 'Medium (₹100 Cr)', val: 1000000000 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, annualRevenue: preset.val }))}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.annualRevenue === preset.val ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      background: formData.annualRevenue === preset.val ? 'rgba(20, 83, 45, 0.12)' : 'var(--muted)',
                      color: formData.annualRevenue === preset.val ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: formData.annualRevenue === preset.val ? 700 : 500
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Statutory Composite Criteria 2: Investment in Plant & Machinery (WDV) */}
            <div className="form-group">
              <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Investment in Plant & Machinery (WDV)</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Written Down Value</span>
                </span>
                <strong style={{ color: 'var(--secondary)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                  {formatINR(formData.machineryInvestment, { showBoth: true })}
                </strong>
              </div>
              <input 
                type="range" 
                name="machineryInvestment" 
                min="500000" 
                max="1250000000" 
                step="500000" 
                value={formData.machineryInvestment} 
                onChange={handleChange} 
                className="slider-input" 
              />
              {/* Quick investment presets */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Micro (₹50 L)', val: 5000000 },
                  { label: 'Small (₹10 Cr)', val: 100000000 },
                  { label: 'Medium (₹50 Cr)', val: 500000000 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, machineryInvestment: preset.val }))}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.machineryInvestment === preset.val ? '1.5px solid var(--secondary)' : '1px solid var(--border)',
                      background: formData.machineryInvestment === preset.val ? 'rgba(193, 140, 93, 0.15)' : 'var(--muted)',
                      color: formData.machineryInvestment === preset.val ? 'var(--secondary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: formData.machineryInvestment === preset.val ? 700 : 500
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              {!currentTier.isMSME && (
                <div style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldAlert size={14} /> {currentTier.description}
                </div>
              )}
            </div>

            {/* Revenue Growth Rate & Profit Margin */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <div className="form-label">
                  <span>YoY Revenue Growth</span>
                  <strong>{formData.revenueGrowthRate}%</strong>
                </div>
                <input 
                  type="number" 
                  name="revenueGrowthRate" 
                  value={formData.revenueGrowthRate} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>Net Profit Margin</span>
                  <strong>{formData.profitMargin}%</strong>
                </div>
                <input 
                  type="number" 
                  name="profitMargin" 
                  step="0.5" 
                  value={formData.profitMargin} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>
            </div>

            {/* Debt Ratio & Employees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <div className="form-label">
                  <span>Debt / Revenue</span>
                  <strong>{(formData.debtRatio * 100).toFixed(0)}%</strong>
                </div>
                <input 
                  type="number" 
                  name="debtRatio" 
                  step="0.05" 
                  min="0" 
                  max="0.9" 
                  value={formData.debtRatio} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>Workforce Scale</span>
                  <strong>{formData.employees} Staff</strong>
                </div>
                <input 
                  type="number" 
                  name="employees" 
                  min="1" 
                  max="500" 
                  value={formData.employees} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>
            </div>

            {/* Tech Level & GST Score */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <div className="form-label">
                  <span>Technology Level</span>
                  <strong style={{ color: 'var(--primary)' }}>Level {formData.techLevel} / 5</strong>
                </div>
                <select name="techLevel" value={formData.techLevel} onChange={handleChange} className="form-select">
                  <option value={1}>Level 1 (Basic / Manual)</option>
                  <option value={2}>Level 2 (Semi-Digital)</option>
                  <option value={3}>Level 3 (Digitalized)</option>
                  <option value={4}>Level 4 (Automated / CNC)</option>
                  <option value={5}>Level 5 (Industry 4.0 / AI)</option>
                </select>
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>GST Compliance</span>
                  <strong style={{ color: 'var(--secondary)' }}>{formData.gstScore} / 100</strong>
                </div>
                <input 
                  type="number" 
                  name="gstScore" 
                  min="0" 
                  max="100" 
                  value={formData.gstScore} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>
            </div>

            {/* Export Revenue Share */}
            <div className="form-group">
              <div className="form-label">
                <span>Export Revenue Share</span>
                <strong style={{ color: 'var(--cyan-main)' }}>{formData.exportShare}%</strong>
              </div>
              <input 
                type="number" 
                name="exportShare" 
                min="0" 
                max="100" 
                value={formData.exportShare} 
                onChange={handleChange} 
                className="form-input" 
                placeholder="0"
              />
            </div>

            {/* Operational Needs Text */}
            <div className="form-group">
              <label className="form-label">Business Needs & Technology Modernization Intent</label>
              <textarea 
                name="requirementText" 
                rows="3" 
                value={formData.requirementText} 
                onChange={handleChange} 
                className="form-input"
                placeholder="Describe your funding requirements, machinery modernization, solar installation, export ambition..."
              />
            </div>

          </form>
        </div>

        {/* Right Column: AI Predictions & Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Growth Prediction Score Cards */}
          <div className="glass-panel organic-card-2" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={20} color="var(--secondary)" />
                  Predictive Growth Indicators
                </h3>
                <span className={`badge badge-${predictions.tierColor}`}>
                  {predictions.tier}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  title="Generate & print official executive audit dossier"
                >
                  <FileText size={15} color="var(--primary)" /> Executive Audit Dossier
                </button>
              </div>
            </div>

            <div className="grid-3">
              {/* Card 1: Score */}
              <div style={{ background: 'var(--muted)', padding: '1.25rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Growth Score</div>
                <div style={{
                  fontSize: '2.4rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 800,
                  color: predictions.tierColor === 'emerald' ? 'var(--primary)' : predictions.tierColor === 'amber' ? 'var(--secondary)' : 'var(--rose-main)',
                  margin: '0.2rem 0'
                }}>
                  {predictions.growthScore}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Out of 100 Index</div>
              </div>

              {/* Card 2: Projected Growth */}
              <div style={{ background: 'var(--muted)', padding: '1.25rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>1-Yr Projected Growth</div>
                <div style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>
                  +{predictions.predictedRevenueGrowth}%
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{formatINR(predictions.projectedRevenueAmount)} Est.</div>
              </div>

              {/* Card 3: Job Potential */}
              <div style={{ background: 'var(--muted)', padding: '1.25rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>New Jobs Potential</div>
                <div style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--secondary)', margin: '0.2rem 0' }}>
                  +{predictions.predictedJobs}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Risk: <strong>{predictions.riskLevel}</strong></div>
              </div>
            </div>
          </div>

          {/* Section Selector Tab Pills */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'var(--muted)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)',
            width: 'fit-content',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => setActiveTabSection('recommendations')} 
              className={`btn ${activeTabSection === 'recommendations' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem', border: 'none' }}
            >
              <Award size={16} /> Scheme Recommendations ({matchedSchemes.filter(s => s.isEligible).length} Eligible)
            </button>
            <button 
              onClick={() => setActiveTabSection('shap')} 
              className={`btn ${activeTabSection === 'shap' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem', border: 'none' }}
            >
              <Leaf size={16} /> SHAP Feature Diagnostics
            </button>
          </div>

          {/* Section A: Scheme Recommendations */}
          {activeTabSection === 'recommendations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {matchedSchemes.map((scheme, idx) => (
                <div key={scheme.id} className="glass-panel" style={{ 
                  padding: '1.75rem',
                  borderRadius: idx % 2 === 0 ? '2.5rem 1.5rem 2rem 1.75rem' : '1.5rem 2.5rem 1.75rem 2.25rem',
                  borderLeft: `5px solid ${scheme.isEligible ? 'var(--primary)' : scheme.isPartiallyEligible ? 'var(--secondary)' : 'var(--border)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{scheme.name}</h4>
                        {scheme.isEligible ? (
                          <span className="badge badge-emerald">Eligible ✅</span>
                        ) : scheme.isPartiallyEligible ? (
                          <span className="badge badge-amber">Partial ⚠️</span>
                        ) : (
                          <span className="badge badge-rose">Ineligible ❌</span>
                        )}
                        <span className="badge badge-indigo">Semantic Match {scheme.semanticScore}%</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {scheme.ministry} • Category: <strong style={{ color: 'var(--text-secondary)' }}>{scheme.category}</strong>
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Max Scheme Assistance</div>
                      <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)' }}>
                        {formatINR(scheme.maxSubsidy)}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>up to {scheme.subsidyPercentage}% subsidy</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {scheme.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--muted)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-pill)', fontSize: '0.82rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong>Recommended Allocation:</strong> {formatINR(scheme.recommendedSubsidyAmount)}
                    </div>
                    <div>
                      <strong>Eligibility Checks Met:</strong> {scheme.passedChecksCount}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section B: SHAP Diagnostics */}
          {activeTabSection === 'shap' && (
            <SHAPWaterfall shapData={shapData} />
          )}

        </div>

      </div>
      </div>

      {/* Printable Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        msmeData={formData}
        predictions={predictions}
        shapData={shapData}
        matchedSchemes={matchedSchemes}
      />
    </div>
  );
}
