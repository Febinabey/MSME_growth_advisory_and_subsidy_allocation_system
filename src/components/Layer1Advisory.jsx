import React, { useState, useMemo } from 'react';
import { predictMSMEGrowth } from '../engine/xgboostPredictor';
import { computeSHAPValues } from '../engine/shapExplainer';
import { matchSchemesForMSME } from '../engine/semanticMatcher';
import SHAPWaterfall from './SHAPWaterfall';
import ReportModal from './ReportModal';
import { 
  Building2, TrendingUp, Users, DollarSign, Cpu, Award, 
  Sparkles, CheckCircle2, AlertTriangle, FileText, ArrowRight, RefreshCw, Sliders
} from 'lucide-react';

export default function Layer1Advisory() {
  // 1. MSME Input State
  const [formData, setFormData] = useState({
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

  // 2. Run Predictions & Calculations in Real-Time
  const predictions = useMemo(() => predictMSMEGrowth(formData), [formData]);
  const shapData = useMemo(() => computeSHAPValues(formData), [formData]);
  const matchedSchemes = useMemo(() => matchSchemesForMSME(formData, formData.requirementText), [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div>
      {/* Layer 1 Intro Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid var(--border-highlight)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-indigo">Layer 1 Engine</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>MSME Growth Advisory & Scheme Matcher</h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Input business metrics to generate XGBoost growth predictions, SHAP feature diagnostics, and semantic scheme recommendations.
            </p>
          </div>

          <button onClick={() => setIsReportModalOpen(true)} className="btn btn-emerald">
            <FileText size={16} /> Generate Audit Report
          </button>
        </div>
      </div>

      <div className="grid-1-2">
        
        {/* Left Column: MSME Data Entry Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} color="var(--accent-primary)" />
            Enterprise Profile Data
          </h3>

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

            {/* Annual Revenue */}
            <div className="form-group">
              <div className="form-label">
                <span>Annual Revenue (₹)</span>
                <strong style={{ color: 'var(--accent-primary)' }}>₹{(formData.annualRevenue / 100000).toFixed(1)} Lakhs</strong>
              </div>
              <input 
                type="range" 
                name="annualRevenue" 
                min="1000000" 
                max="250000000" 
                step="1000000" 
                value={formData.annualRevenue} 
                onChange={handleChange} 
                className="slider-input" 
              />
            </div>

            {/* Revenue Growth Rate & Profit Margin */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <div className="form-label">
                  <span>Revenue Growth</span>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  <span>Workforce</span>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <div className="form-label">
                  <span>Tech Level</span>
                  <strong style={{ color: 'var(--cyan-main)' }}>Level {formData.techLevel} / 5</strong>
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
                  <strong style={{ color: 'var(--emerald-main)' }}>{formData.gstScore} / 100</strong>
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

            {/* Free-text Operational Needs Requirement */}
            <div className="form-group">
              <label className="form-label">Business Requirement & Technology Need (For Semantic Matcher)</label>
              <textarea 
                name="requirementText" 
                rows="3" 
                value={formData.requirementText} 
                onChange={handleChange} 
                className="form-input"
                style={{ resize: 'none', fontSize: '0.85rem' }}
                placeholder="Describe your funding purpose, e.g., machinery purchase, solar installation, export expansion..."
              />
            </div>

          </form>
        </div>

        {/* Right Column: AI Predictions & Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Growth Prediction Score Cards */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--amber-main)" />
                XGBoost Growth Model Outputs
              </h3>
              <span className={`badge badge-${predictions.tierColor}`}>
                {predictions.tier}
              </span>
            </div>

            <div className="grid-3">
              {/* Card 1: Score */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Growth Score</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: predictions.tierColor === 'emerald' ? 'var(--emerald-main)' : predictions.tierColor === 'amber' ? 'var(--amber-main)' : 'var(--rose-main)' }}>
                  {predictions.growthScore}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Out of 100</div>
              </div>

              {/* Card 2: Projected Growth */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>1-Yr Projected Growth</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  +{predictions.predictedRevenueGrowth}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>₹{(predictions.projectedRevenueAmount / 100000).toFixed(1)} Lakhs</div>
              </div>

              {/* Card 3: Job Potential */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Jobs Potential</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--cyan-main)' }}>
                  +{predictions.predictedJobs}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Risk: {predictions.riskLevel}</div>
              </div>
            </div>
          </div>

          {/* Tab Controls for Output Views */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button 
              onClick={() => setActiveTabSection('recommendations')} 
              className={`btn ${activeTabSection === 'recommendations' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <Award size={16} /> Scheme Recommendations ({matchedSchemes.filter(s => s.isEligible).length} Eligible)
            </button>
            <button 
              onClick={() => setActiveTabSection('shap')} 
              className={`btn ${activeTabSection === 'shap' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <Cpu size={16} /> SHAP XAI Diagnostics
            </button>
            <button 
              onClick={() => setActiveTabSection('whatif')} 
              className={`btn ${activeTabSection === 'whatif' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <Sliders size={16} /> What-If Simulator
            </button>
          </div>

          {/* Section A: Scheme Recommendations */}
          {activeTabSection === 'recommendations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matchedSchemes.map((scheme) => (
                <div key={scheme.id} className="glass-panel" style={{ 
                  padding: '1.25rem', 
                  borderLeft: `4px solid ${scheme.isEligible ? 'var(--emerald-main)' : scheme.isPartiallyEligible ? 'var(--amber-main)' : 'var(--border-color)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{scheme.name}</h4>
                        {scheme.isEligible ? (
                          <span className="badge badge-emerald">Eligible ✅</span>
                        ) : scheme.isPartiallyEligible ? (
                          <span className="badge badge-amber">Partial ⚠️</span>
                        ) : (
                          <span className="badge badge-rose">Ineligible ❌</span>
                        )}
                        <span className="badge badge-indigo">Semantic Match {scheme.semanticScore}%</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {scheme.ministry} • Category: <strong>{scheme.category}</strong>
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max Scheme Subsidy</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald-main)' }}>
                        ₹{(scheme.maxSubsidy / 100000).toFixed(1)} Lakhs
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>up to {scheme.subsidyPercentage}% assistance</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                    {scheme.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem' }}>
                    <div>
                      <strong>Recommended Allocation:</strong> ₹{(scheme.recommendedSubsidyAmount / 100000).toFixed(1)} Lakhs
                    </div>
                    <div>
                      <strong>Checks Passed:</strong> {scheme.passedChecksCount}/5
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
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={18} color="var(--accent-primary)" />
                Scenario Optimization Simulator
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Test how operational improvements (e.g. boosting GST compliance or adopting Industry 4.0 tech) dynamically upgrade your growth score and scheme eligibility.
              </p>

              <div className="grid-2">
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Scenario A: Increase GST Compliance to 98%</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Improves creditworthiness and audit eligibility for top bank guarantee schemes.</p>
                  <button onClick={() => setFormData(prev => ({ ...prev, gstScore: 98 }))} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>
                    Apply Scenario (+GST Score)
                  </button>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Scenario B: Upgrade Tech Level to Industry 4.0</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Unlocks SAMERTH grants and boosts predicted 1-year revenue uplift by ~6.5%.</p>
                  <button onClick={() => setFormData(prev => ({ ...prev, techLevel: 5 }))} className="btn btn-emerald" style={{ width: '100%', fontSize: '0.8rem' }}>
                    Apply Scenario (Tech Level 5)
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
