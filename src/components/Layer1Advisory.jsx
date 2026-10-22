import React, { useState, useMemo } from 'react';
import { predictMSMEGrowth } from '../engine/xgboostPredictor';
import { computeSHAPValues } from '../engine/shapExplainer';
import { matchSchemesForMSME } from '../engine/semanticMatcher';
import { REAL_UDYAM_DIRECTORY } from '../data/realUdyamDirectory';
import SHAPWaterfall from './SHAPWaterfall';
import ReportModal from './ReportModal';
import { formatINR, getMSMETier } from '../utils/formatCurrency';
import { 
  Building2, TrendingUp, Users, DollarSign, Cpu, Award, 
  Sparkles, CheckCircle2, AlertTriangle, FileText, ArrowRight, RefreshCw, Sliders, Sprout, Leaf, ShieldCheck, MapPin, Send
} from 'lucide-react';

export default function Layer1Advisory() {
  const [selectedUdyamId, setSelectedUdyamId] = useState('');

  // 1. MSME Input State
  const [formData, setFormData] = useState({
    enterpriseName: "Shri Salasar Balaji Contractor",
    state: "Uttar Pradesh",
    district: "Shahjahanpur",
    sector: "Manufacturing",
    annualRevenue: 35000000, // ₹3.5 Crore
    revenueGrowthRate: 18,   // 18% YoY
    employees: 28,
    debtRatio: 0.25,         // 25% debt/revenue
    profitMargin: 13.5,      // 13.5%
    techLevel: 3,            // 1-5 level
    gstScore: 85,            // 85/100
    exportShare: 12,         // 12% exports
    requirementText: "Need funding to purchase automated CNC machinery and install solar panels for manufacturing facility."
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState('recommendations'); // recommendations | shap | whatif
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | { loading, success, app, error }

  // Current Statutory MSME Tier under Gazette Notification S.O. 1364(E)
  const currentTier = useMemo(() => getMSMETier(formData.annualRevenue), [formData.annualRevenue]);

  // 2. Run Predictions & Calculations in Real-Time
  const predictions = useMemo(() => predictMSMEGrowth(formData), [formData]);
  const shapData = useMemo(() => computeSHAPValues(formData), [formData]);
  const matchedSchemes = useMemo(() => matchSchemesForMSME(formData, formData.requirementText), [formData]);

  const handleOfficialSubmit = async () => {
    try {
      setSubmissionStatus({ loading: true, success: false, app: null, error: null });
      const topScheme = matchedSchemes.find(s => s.isEligible) || matchedSchemes[0];
      const payload = {
        name: formData.enterpriseName,
        enterpriseName: formData.enterpriseName,
        state: formData.state,
        district: formData.district,
        pincode: formData.pincode || '',
        sector: formData.sector,
        annualRevenue: formData.annualRevenue,
        revenueGrowthRate: formData.revenueGrowthRate,
        employees: formData.employees,
        debtRatio: formData.debtRatio,
        profitMargin: formData.profitMargin,
        techLevel: formData.techLevel,
        gstScore: formData.gstScore,
        exportShare: formData.exportShare,
        requestedScheme: topScheme ? topScheme.name : 'PMEGP Subsidy',
        requestedSubsidy: topScheme ? topScheme.recommendedSubsidyAmount : 1000000,
        growthScore: predictions.growthScore,
        growthTier: predictions.tier,
        predictedJobs: predictions.predictedJobs,
        projectedRevenue: predictions.projectedRevenueAmount
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }
      setSubmissionStatus({ loading: false, success: true, app: data.data, error: null });
    } catch (err) {
      setSubmissionStatus({ loading: false, success: false, app: null, error: err.message });
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
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

  const currentUnit = REAL_UDYAM_DIRECTORY.find(u => u.id === selectedUdyamId);

  return (
    <div>
      <div className="grid-1-2">
        
        {/* Left Column: MSME Data Entry Form */}
        <div className="glass-panel organic-card-3" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Building2 size={20} color="var(--primary)" />
            Enterprise Profile Data
          </h3>

          {/* Quick-Import from Real Udyam Registry */}
          <div style={{
            background: 'var(--muted)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1.5px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="var(--primary)" />
                Load Real Udyam Unit (70k Dataset)
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Live Udyam Data</span>
            </div>
            <select 
              className="form-select"
              value={selectedUdyamId}
              onChange={(e) => handleUdyamSelect(e.target.value)}
            >
              <option value="">-- Choose a Registered MSME Across India --</option>
              {REAL_UDYAM_DIRECTORY.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.enterpriseName} ({unit.state} • {unit.district})
                </option>
              ))}
            </select>
            {currentUnit && (
              <div style={{ marginTop: '0.65rem', fontSize: '0.74rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.6)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>NIC Activity ({currentUnit.nicCode}):</div>
                <div>{currentUnit.nicActivity}</div>
                <div style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>Reg Date: {currentUnit.registrationDate} • Pincode: {currentUnit.pincode}</div>
              </div>
            )}
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* Sector */}
            <div className="form-group">
              <label className="form-label">Enterprise Sector</label>
              <select name="sector" value={formData.sector} onChange={handleChange} className="form-select">
                <option value="Manufacturing">Manufacturing</option>
                <option value="Electronics">Electronics</option>
                <option value="Agro-processing">Agro-processing</option>
                <option value="Textiles">Textiles</option>
                <option value="IT Services">IT Services</option>
                <option value="Green Tech">Green Tech</option>
              </select>
            </div>

            {/* Annual Revenue (Turnover) */}
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
                    {currentTier.label} ({currentTier.range})
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
              {/* Quick tier presets tailored exclusively to Micro, Small, and Medium MSMEs */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                {[
                  { label: '₹25L Micro', val: 2500000 },
                  { label: '₹1Cr Micro', val: 10000000 },
                  { label: '₹5Cr Micro', val: 50000000 },
                  { label: '₹10Cr Micro Max', val: 100000000 },
                  { label: '₹25Cr Small', val: 250000000 },
                  { label: '₹50Cr Small', val: 500000000 },
                  { label: '₹100Cr Small Max', val: 1000000000 },
                  { label: '₹250Cr Medium Max', val: 2500000000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, annualRevenue: preset.val }))}
                    style={{
                      fontSize: '0.67rem',
                      padding: '0.18rem 0.45rem',
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
              {!currentTier.isMSME && (
                <div style={{ color: '#dc2626', fontSize: '0.74rem', marginTop: '0.4rem', fontWeight: 600 }}>
                  ⚠️ {currentTier.description}
                </div>
              )}
            </div>

            {/* Revenue Growth Rate & Profit Margin */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <div className="form-label">
                  <span>YoY Growth</span>
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
                  <span>Profit Margin</span>
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
                  <option value={1}>Level 1 (Basic/Manual)</option>
                  <option value={2}>Level 2 (Semi-Digital)</option>
                  <option value={3}>Level 3 (Digitalized)</option>
                  <option value={4}>Level 4 (Automated/CNC)</option>
                  <option value={5}>Level 5 (Industry 4.0/AI)</option>
                </select>
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>GST Score</span>
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

            {/* Operational Needs Text */}
            <div className="form-group">
              <label className="form-label">Business Needs & Technology Upgradation Intent</label>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={20} color="var(--secondary)" />
                Predictive Growth Indicators
              </h3>
              <span className={`badge badge-${predictions.tierColor}`}>
                {predictions.tier}
              </span>
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
            <button 
              onClick={() => setActiveTabSection('whatif')} 
              className={`btn ${activeTabSection === 'whatif' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem', border: 'none' }}
            >
              <Sliders size={16} /> What-If Simulator
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

          {/* Section C: What-If Simulator */}
          {activeTabSection === 'whatif' && (
            <div className="glass-panel organic-card-1" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sliders size={20} color="var(--secondary)" />
                Scenario Optimization Simulator
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Simulate how strategic operational and technological upgrades immediately enhance enterprise creditworthiness and unlock targeted government grants.
              </p>

              <div className="grid-3">
                <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: '2rem', border: '1.5px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Scenario A: Boost GST Compliance to 98%
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Improves formal compliance rating, unlocks CGTMSE credit guarantee limits, and lowers credit risk penalty.
                  </p>
                  <button onClick={() => setFormData(prev => ({ ...prev, gstScore: 98 }))} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
                    Apply (+GST 98%)
                  </button>
                </div>

                <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: '2rem', border: '1.5px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Scenario B: Adopt Industry 4.0
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Unlocks SAMERTH technology co-funding grants and expands projected 1-year revenue yield by ~6.5%.
                  </p>
                  <button onClick={() => setFormData(prev => ({ ...prev, techLevel: 5 }))} className="btn btn-emerald" style={{ width: '100%', fontSize: '0.85rem' }}>
                    Apply (Tech Level 5)
                  </button>
                </div>

                <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: '2rem', border: '1.5px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Scenario C: Reset to Baseline
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Restores standard operating parameters (GST Score 85, Tech Level 3, Debt Ratio 25%).
                  </p>
                  <button onClick={() => setFormData(prev => ({ ...prev, gstScore: 85, techLevel: 3, debtRatio: 0.25 }))} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
                    <RefreshCw size={14} style={{ marginRight: '6px' }} /> Reset Parameters
                  </button>
                </div>
              </div>
            </div>
          )}

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
