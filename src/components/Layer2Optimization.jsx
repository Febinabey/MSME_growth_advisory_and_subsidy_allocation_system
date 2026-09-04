import React, { useState, useMemo } from 'react';
import { SAMPLE_APPLICANTS } from '../data/sampleApplicants';
import { optimizeSubsidyBudget } from '../engine/knapsackSolver';
import { 
  Sliders, DollarSign, Users, TrendingUp, Award, CheckCircle2, XCircle, 
  Sparkles, ShieldCheck, Scale, Zap, Info
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
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid var(--border-highlight)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-emerald">Layer 2 Engine</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>Government Policy & Subsidy Optimization Engine</h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Multiple-Choice Knapsack (MCKP) Solver maximizing economic ROI & employment creation under budget constraints.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI ROI Multiplier vs FCFS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-main)' }}>
              {gains.roiMultiplier}x Yield
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Budget & Policy Weights */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        
        {/* Card 1: Available Government Budget Slider */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Available Government Budget</label>
            <strong style={{ color: 'var(--emerald-main)', fontSize: '1.1rem', fontWeight: 800 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            <span>₹50 Lakhs</span>
            <span>₹5 Crore</span>
            <span>₹10 Crore</span>
          </div>
        </div>

        {/* Card 2: Objective Weighting (Jobs vs Revenue) */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Optimization Weighting</label>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            <span>Prioritize Jobs</span>
            <span>Balanced</span>
            <span>Prioritize Revenue</span>
          </div>
        </div>

        {/* Card 3: Green Sector Incentive Bonus */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Green Tech Priority Bonus</label>
            <strong style={{ color: 'var(--cyan-main)', fontSize: '1rem' }}>+{(policyWeights.greenBonus * 100).toFixed(0)}% Boost</strong>
          </div>
          <select 
            value={policyWeights.greenBonus} 
            onChange={(e) => setPolicyWeights(prev => ({ ...prev, greenBonus: parseFloat(e.target.value) }))} 
            className="form-select"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value={0.0}>No Priority Bonus (0%)</option>
            <option value={0.15}>Standard Green Bonus (+15%)</option>
            <option value={0.30}>Aggressive Sustainability (+30%)</option>
          </select>
        </div>

      </div>

      {/* Comparative Results Analytics Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="var(--amber-main)" />
          Algorithm Performance: AI Knapsack vs First-Come-First-Served (FCFS) Baseline
        </h3>

        <div className="grid-3">
          
          {/* Card 1: Job Creation Gain */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total New Jobs Created</span>
              <span className="badge badge-emerald">+{gains.jobGainPercent}% Jobs</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-main)', margin: '0.2rem 0' }}>
              {aiAllocation.totalJobsCreated} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>vs {baselineFCFS.totalJobsCreated} FCFS</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              AI Knapsack generates +{aiAllocation.totalJobsCreated - baselineFCFS.totalJobsCreated} additional employment opportunities.
            </div>
          </div>

          {/* Card 2: Total Revenue Uplift */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Economic Revenue Impact</span>
              <span className="badge badge-indigo">+{gains.revenueGainPercent}% Uplift</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0.2rem 0' }}>
              ₹{(aiAllocation.totalRevenueUpliftINR / 10000000).toFixed(2)} Cr
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              vs ₹{(baselineFCFS.totalRevenueUpliftINR / 10000000).toFixed(2)} Cr Baseline FCFS.
            </div>
          </div>

          {/* Card 3: Budget Utilization Rate */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Budget Efficiency</span>
              <span className="badge badge-cyan">{aiAllocation.budgetUtilizationPercent}% Spent</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--cyan-main)', margin: '0.2rem 0' }}>
              ₹{(aiAllocation.totalBudgetSpentINR / 10000000).toFixed(2)} Cr
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Remaining Unallocated: ₹{((budgetINR - aiAllocation.totalBudgetSpentINR) / 100000).toFixed(1)} Lakhs.
            </div>
          </div>

        </div>
      </div>

      {/* Applicant Allocation Queue Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Applicant Queue & AI Subsidy Award Decision Log
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Showing {filteredApplicants.length} applicants sorted by AI Value Density score.
            </p>
          </div>

          {/* Sector Filter */}
          <select 
            value={selectedSectorFilter} 
            onChange={(e) => setSelectedSectorFilter(e.target.value)} 
            className="form-select"
            style={{ width: '200px', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
          >
            <option value="All">All Sectors</option>
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
                <th>Sector</th>
                <th>Growth Score</th>
                <th>Requested Subsidy</th>
                <th>Predicted Revenue Impact</th>
                <th>Jobs Created</th>
                <th>AI Award Status</th>
              </tr>
            </thead>
            <tbody>
              {aiAllocation.awardedList.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{app.id} • {app.requestedScheme}</div>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{app.sector}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--emerald-main)' }}>{app.predictions.growthScore} / 100</strong>
                  </td>
                  <td>
                    ₹{(app.cost / 100000).toFixed(1)} Lakhs
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>+₹{(app.projectedRevenueUpliftINR / 100000).toFixed(1)} Lakhs</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--cyan-main)', fontWeight: 700 }}>+{app.predictedJobs} Jobs</span>
                  </td>
                  <td>
                    <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle2 size={13} /> Awarded Subsidy
                    </span>
                  </td>
                </tr>
              ))}

              {aiAllocation.rejectedList.map((app) => (
                <tr key={app.id} style={{ opacity: 0.7 }}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{app.id} • {app.requestedScheme}</div>
                  </td>
                  <td>
                    <span className="badge badge-amber">{app.sector}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--amber-main)' }}>{app.predictions.growthScore} / 100</strong>
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
                    <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <XCircle size={13} /> Budget Exhausted
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
