import React, { useState, useMemo } from 'react';
import { SAMPLE_APPLICANTS } from '../data/sampleApplicants';
import { optimizeSubsidyBudget } from '../engine/knapsackSolver';
import { PMEGP_NATIONAL_BENCHMARK, PMEGP_STATE_BENCHMARKS } from '../data/pmegpData';
import { 
  Sliders, DollarSign, Users, TrendingUp, Award, CheckCircle2, XCircle, 
  Sparkles, ShieldCheck, Scale, Zap, Info, Sprout, Landmark, Building2
} from 'lucide-react';

export default function Layer2Optimization() {
  // 1. Policy & Budget Configuration State
  const [budgetINR, setBudgetINR] = useState(25000000); // ₹2.5 Crore default budget
  const [policyWeights, setPolicyWeights] = useState({
    jobWeight: 0.5,
    revenueWeight: 0.5,
    greenBonus: 0.2
  });
  const [selectedSectorFilter, setSelectedSectorFilter] = useState("All");

  // 2. Filter Applicants & Run Knapsack Solver
  const filteredApplicants = useMemo(() => {
    if (selectedSectorFilter === "All") return SAMPLE_APPLICANTS;
    return SAMPLE_APPLICANTS.filter(a => a.sector === selectedSectorFilter);
  }, [selectedSectorFilter]);

  const optimizationResults = useMemo(() => {
    return optimizeSubsidyBudget(filteredApplicants, budgetINR, policyWeights);
  }, [filteredApplicants, budgetINR, policyWeights]);

  const { aiAllocation, baselineFCFS, gains } = optimizationResults;

  return (
    <div>
      {/* Header Banner */}
      <div className="glass-panel organic-card-1" style={{
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(93, 112, 82, 0.09) 0%, rgba(193, 140, 93, 0.08) 100%)',
        border: '1.5px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-emerald">
                <Sprout size={13} /> Layer 2 Engine
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Government Policy & Subsidy Optimization Engine
              </h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
              Multiple-Choice Knapsack (MCKP) Solver maximizing economic ROI & employment creation under finite government budget ceilings.
            </p>
          </div>

          <div style={{
            background: 'var(--muted)',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>AI Yield Multiplier vs FCFS</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)' }}>
              {gains.roiMultiplier}x Yield
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Budget & Policy Weights */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        
        {/* Card 1: Available Government Budget Slider */}
        <div className="glass-panel organic-card-2" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Available Subsidy Budget</label>
            <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 800 }}>
              ₹{(budgetINR / 10000000).toFixed(2)} Crore
            </strong>
          </div>
          <input 
            type="range" 
            min="5000000" 
            max="100000000" 
            step="2500000" 
            value={budgetINR} 
            onChange={(e) => setBudgetINR(parseFloat(e.target.value))} 
            className="slider-input" 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
            <span>₹50 Lakhs</span>
            <span>₹5 Crore</span>
            <span>₹10 Crore</span>
          </div>
        </div>

        {/* Card 2: Objective Weighting (Jobs vs Revenue) */}
        <div className="glass-panel organic-card-3" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Policy Weighting Balance</label>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700 }}>
              Jobs: {(policyWeights.jobWeight * 100).toFixed(0)}% / Rev: {(policyWeights.revenueWeight * 100).toFixed(0)}%
            </span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="0.9" 
            step="0.1" 
            value={policyWeights.jobWeight} 
            onChange={(e) => {
              const jW = parseFloat(e.target.value);
              setPolicyWeights(prev => ({ ...prev, jobWeight: jW, revenueWeight: parseFloat((1 - jW).toFixed(1)) }));
            }} 
            className="slider-input" 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
            <span>Prioritize Jobs</span>
            <span>Balanced</span>
            <span>Prioritize Revenue</span>
          </div>
        </div>

        {/* Card 3: Green Sector Incentive Bonus */}
        <div className="glass-panel organic-card-1" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Green Sector Weighting Bonus</label>
            <strong style={{ color: 'var(--primary)', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>
              +{(policyWeights.greenBonus * 100).toFixed(0)}% Boost
            </strong>
          </div>
          <select 
            value={policyWeights.greenBonus} 
            onChange={(e) => setPolicyWeights(prev => ({ ...prev, greenBonus: parseFloat(e.target.value) }))} 
            className="form-select"
          >
            <option value={0.0}>Standard Neutral Evaluation (0%)</option>
            <option value={0.15}>Clean Energy Priority (+15%)</option>
            <option value={0.30}>Aggressive Net-Zero Mandate (+30%)</option>
          </select>
        </div>

      </div>

      {/* Comparative Results Analytics Banner */}
      <div className="glass-panel organic-card-2" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={20} color="var(--secondary)" />
          Algorithm Comparative Evaluation: AI Knapsack vs First-Come-First-Served (FCFS) Baseline
        </h3>

        <div className="grid-3">
          
          {/* Card 1: Job Creation Gain */}
          <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: '1.75rem', border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total New Jobs Created</span>
              <span className="badge badge-emerald">+{gains.jobGainPercent}% Impact</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', margin: '0.3rem 0' }}>
              {aiAllocation.totalJobsCreated} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>vs {baselineFCFS.totalJobsCreated} FCFS</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              AI Knapsack creates +{aiAllocation.totalJobsCreated - baselineFCFS.totalJobsCreated} additional verified employment opportunities.
            </div>
          </div>

          {/* Card 2: Total Revenue Uplift */}
          <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: '1.75rem', border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Economic Revenue Uplift</span>
              <span className="badge badge-amber">+{gains.revenueGainPercent}% Uplift</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--secondary)', margin: '0.3rem 0' }}>
              ₹{(aiAllocation.totalRevenueUpliftINR / 10000000).toFixed(2)} Cr
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              vs ₹{(baselineFCFS.totalRevenueUpliftINR / 10000000).toFixed(2)} Cr under unoptimized FCFS disbursement.
            </div>
          </div>

          {/* Card 3: Budget Utilization Rate */}
          <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: '1.75rem', border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Budget Allocation Efficiency</span>
              <span className="badge badge-cyan">{aiAllocation.budgetUtilizationPercent}% Disbursed</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--cyan-main)', margin: '0.3rem 0' }}>
              ₹{(aiAllocation.totalBudgetSpentINR / 10000000).toFixed(2)} Cr
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Remaining Unallocated: ₹{((budgetINR - aiAllocation.totalBudgetSpentINR) / 100000).toFixed(1)} Lakhs.
            </div>
          </div>

        </div>
      </div>

      {/* PMEGP Macro Benchmark Context (Ministry of MSME / KVIC) */}
      <div className="glass-panel organic-card-1" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Landmark size={13} /> Dataset 3 • Official Macro Benchmark
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                PMEGP Macro Benchmark Context (Ministry of MSME / KVIC)
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              State-wise programme performance across 35 States/UTs (2021-22 to 2024-25) via Data.gov.in
            </p>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--muted)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
            35 States/UTs Analyzed • 175 Records
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Metric 1 */}
          <div style={{ background: 'var(--muted)', padding: '1.25rem 1.5rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Assisted Units (National)
            </div>
            <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', margin: '0.3rem 0' }}>
              {PMEGP_NATIONAL_BENCHMARK.totalProjectsAssisted.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Historical assisted micro-units (FY22–FY25)
            </div>
          </div>

          {/* Metric 2 */}
          <div style={{ background: 'var(--muted)', padding: '1.25rem 1.5rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Historical Employment Generated
            </div>
            <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--secondary)', margin: '0.3rem 0' }}>
              {PMEGP_NATIONAL_BENCHMARK.totalEmploymentEstimated.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Official estimated employment across India
            </div>
          </div>

          {/* Metric 3 */}
          <div style={{ background: 'var(--muted)', padding: '1.25rem 1.5rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Historical Employment Intensity
            </div>
            <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--cyan-main)', margin: '0.3rem 0' }}>
              ~{PMEGP_NATIONAL_BENCHMARK.nationalAvgEmploymentPerProject.toFixed(1)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>persons / unit</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Consistent reporting benchmark norm
            </div>
          </div>

          {/* Metric 4 */}
          <div style={{ background: 'var(--muted)', padding: '1.25rem 1.5rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Training & Benchmark Period
            </div>
            <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.3rem 0' }}>
              4 Years
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              FY22–FY25 (FY26 provisional excluded)
            </div>
          </div>
        </div>

        {/* Methodological Guidance Note */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '0.9rem 1.25rem',
          background: 'rgba(93, 112, 82, 0.07)',
          borderRadius: '1rem',
          border: '1px solid var(--border)',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.45'
        }}>
          <Info size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <strong>Methodological Guardrail:</strong> PMEGP data provides regional programme-level benchmarks. Individual applicant predictions are generated by XGBoost trained on enterprise operational data (ASUSE + Udyam). PMEGP figures reflect historical regional scheme performance and absorption capacity, not enterprise-level causal predictors.
          </div>
        </div>
      </div>

      {/* Applicant Allocation Queue Table */}
      <div className="glass-panel organic-card-3" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              State & District Applicant Queue & AI Subsidy Award Log
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredApplicants.length} applicants ranked by AI Marginal Value Density score.
            </p>
          </div>

          {/* Sector Filter */}
          <select 
            value={selectedSectorFilter} 
            onChange={(e) => setSelectedSectorFilter(e.target.value)} 
            className="form-select"
            style={{ width: '220px' }}
          >
            <option value="All">All Priority Sectors</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Agro-processing">Agro-processing</option>
            <option value="IT Services">IT Services</option>
            <option value="Textiles">Textiles</option>
            <option value="Green Tech">Green Tech</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        {/* Table */}
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applicant Enterprise</th>
                <th>Region & State PMEGP Context</th>
                <th>Growth Score</th>
                <th>Requested Subsidy</th>
                <th>Projected Revenue Yield</th>
                <th>Jobs Created</th>
                <th>AI Award Decision</th>
              </tr>
            </thead>
            <tbody>
              {aiAllocation.awardedList.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{app.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{app.id} • {app.requestedScheme}</div>
                  </td>
                  <td>
                    <span className="badge badge-emerald">{app.district ? `${app.district}, ${app.state}` : (app.state || "India")}</span>
                    {app.pmegpContext && app.pmegpContext.totalProjectsAssisted > 0 && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                        PMEGP: {app.pmegpContext.totalProjectsAssisted.toLocaleString('en-IN')} units (~{app.pmegpContext.historicalAvgEmploymentPerProject} jobs/unit)
                      </div>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                      {app.predictions.growthScore} / 100
                    </strong>
                  </td>
                  <td>
                    ₹{(app.cost / 100000).toFixed(1)} Lakhs
                  </td>
                  <td>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+₹{(app.projectedRevenueUpliftINR / 100000).toFixed(1)} Lakhs</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--secondary)', fontWeight: 800 }}>+{app.predictedJobs} Jobs</span>
                  </td>
                  <td>
                    <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={14} /> Awarded Subsidy
                    </span>
                  </td>
                </tr>
              ))}

              {aiAllocation.rejectedList.map((app) => (
                <tr key={app.id} style={{ opacity: 0.65 }}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{app.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{app.id} • {app.requestedScheme}</div>
                  </td>
                  <td>
                    <span className="badge badge-amber">{app.district ? `${app.district}, ${app.state}` : (app.state || "India")}</span>
                    {app.pmegpContext && app.pmegpContext.totalProjectsAssisted > 0 && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                        PMEGP: {app.pmegpContext.totalProjectsAssisted.toLocaleString('en-IN')} units (~{app.pmegpContext.historicalAvgEmploymentPerProject} jobs/unit)
                      </div>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>
                      {app.predictions.growthScore} / 100
                    </strong>
                  </td>
                  <td>
                    ₹{(app.cost / 100000).toFixed(1)} Lakhs
                  </td>
                  <td>
                    <span>+₹{(app.projectedRevenueUpliftINR / 100000).toFixed(1)} Lakhs</span>
                  </td>
                  <td>
                    <span>+{app.predictedJobs} Jobs</span>
                  </td>
                  <td>
                    <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <XCircle size={14} /> Budget Ceiling
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
