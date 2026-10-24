import React, { useState, useEffect, useMemo } from 'react';
import { SAMPLE_APPLICANTS } from '../data/sampleApplicants';
import { optimizeSubsidyBudget } from '../engine/knapsackSolver';
import { 
  CheckCircle2, XCircle, Zap, AlertCircle
} from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

export default function Layer2Optimization() {
  // 1. Policy & Budget Configuration State
  const [budgetINR, setBudgetINR] = useState(25000000); // ₹2.5 Crore default budget
  const [policyWeights, setPolicyWeights] = useState({
    jobWeight: 0.5,
    revenueWeight: 0.5,
    greenBonus: 0.0
  });
  const [selectedSectorFilter, setSelectedSectorFilter] = useState("All");

  // Live Database Applicants State (Syncs with backend SQLite database)
  const [dbApplicants, setDbApplicants] = useState(SAMPLE_APPLICANTS);

  const fetchLiveApplications = () => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map(app => ({
            id: app.id,
            name: app.name || app.enterprise_name,
            enterpriseName: app.enterprise_name || app.name,
            state: app.state,
            district: app.district,
            pincode: app.pincode,
            sector: app.sector,
            annualRevenue: Number(app.annual_revenue) || 0,
            revenueGrowthRate: Number(app.revenue_growth_rate) || 15,
            employees: Number(app.employees) || 10,
            debtRatio: Number(app.debt_ratio) || 0.25,
            profitMargin: Number(app.profit_margin) || 12,
            techLevel: Number(app.tech_level) || 3,
            gstScore: Number(app.gst_score) || 75,
            exportShare: Number(app.export_share) || 0,
            requestedScheme: app.requested_scheme || 'PMEGP Subsidy',
            requestedSubsidy: Number(app.requested_subsidy) || 1000000,
            status: app.status
          }));
          setDbApplicants(mapped);
        }
      })
      .catch(() => {
        // Fallback to SAMPLE_APPLICANTS if offline
      });
  };

  useEffect(() => {
    fetchLiveApplications();
  }, []);

  // Dynamic priority sectors aggregated from applicants
  const availableSectors = useMemo(() => {
    const set = new Set();
    dbApplicants.forEach(a => {
      if (a.sector && a.sector.trim()) {
        set.add(a.sector.trim());
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [dbApplicants]);

  // 2. Filter Applicants & Run Knapsack Solver
  const filteredApplicants = useMemo(() => {
    if (selectedSectorFilter === "All") return dbApplicants;
    return dbApplicants.filter(a => {
      if (!a.sector) return false;
      return a.sector === selectedSectorFilter || a.sector.toLowerCase().includes(selectedSectorFilter.toLowerCase());
    });
  }, [dbApplicants, selectedSectorFilter]);

  const totalRequestedSubsidy = useMemo(() => {
    return filteredApplicants.reduce((sum, a) => sum + (Number(a.requestedSubsidy) || 0), 0);
  }, [filteredApplicants]);

  const maxBudgetBound = useMemo(() => {
    return Math.max(100000000, Math.ceil(totalRequestedSubsidy / 10000000) * 10000000);
  }, [totalRequestedSubsidy]);

  const optimizationResults = useMemo(() => {
    return optimizeSubsidyBudget(filteredApplicants, budgetINR, policyWeights);
  }, [filteredApplicants, budgetINR, policyWeights]);

  const { aiAllocation, baselineFCFS, gains } = optimizationResults;

  return (
    <div>
      {/* Control Panel: Budget & Policy Weights */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        
        {/* Card 1: Available Government Budget Slider */}
        <div className="glass-panel organic-card-2" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Available Subsidy Fiscal Envelope</label>
            <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 800 }}>
              ₹{(budgetINR / 10000000).toFixed(2)} Crore
            </strong>
          </div>
          <input 
            type="range" 
            min="5000000" 
            max={maxBudgetBound} 
            step="2500000" 
            value={budgetINR} 
            onChange={(e) => setBudgetINR(parseFloat(e.target.value))} 
            className="slider-input" 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
            <span>₹50 Lakhs</span>
            <span>₹5 Crore</span>
            <span>₹{(maxBudgetBound / 10000000).toFixed(0)} Crore</span>
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
            value={policyWeights.revenueWeight} 
            onChange={(e) => {
              const rW = parseFloat(e.target.value);
              setPolicyWeights(prev => ({ ...prev, revenueWeight: rW, jobWeight: parseFloat((1 - rW).toFixed(1)) }));
            }} 
            className="slider-input" 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
            <span>Prioritize Employment (90/10)</span>
            <span>Balanced Policy (50/50)</span>
            <span>Prioritize Revenue (10/90)</span>
          </div>
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
              {formatINR(aiAllocation.totalBudgetSpentINR)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Remaining Unallocated: {formatINR(budgetINR - aiAllocation.totalBudgetSpentINR)}.
            </div>
          </div>

        </div>

        {budgetINR >= totalRequestedSubsidy && totalRequestedSubsidy > 0 && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.9rem 1.25rem',
            background: 'rgba(193, 140, 93, 0.12)',
            borderRadius: '1rem',
            border: '1.5px solid rgba(193, 140, 93, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <AlertCircle size={17} color="var(--secondary)" style={{ flexShrink: 0 }} />
            <div>
              <strong>Applicant Pool Saturation Reached:</strong> Total subsidy requested across all {filteredApplicants.length} enterprises in this queue is {formatINR(totalRequestedSubsidy)}. At or above this threshold, 100% of applicants receive funding under both algorithms. The AI Knapsack solver exhibits maximum algorithmic impact under fiscal scarcity (&lt; {formatINR(totalRequestedSubsidy)}), optimizing marginal value density and creating additional verified jobs.
            </div>
          </div>
        )}
      </div>

      {/* Applicant Allocation Queue Table */}
      <div className="glass-panel organic-card-3" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              State & District Applicant Queue & AI Subsidy Award Log
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredApplicants.length} verified registered MSME units ranked by AI Marginal Value Density score.
            </p>
          </div>

          {/* Sector Filter */}
          <select 
            value={selectedSectorFilter} 
            onChange={(e) => setSelectedSectorFilter(e.target.value)} 
            className="form-select"
            style={{ width: '280px' }}
          >
            <option value="All">All Priority Sectors ({dbApplicants.length})</option>
            {availableSectors.filter(s => s !== "All").map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applicant Enterprise</th>
                <th>Location</th>
                <th>Growth Score</th>
                <th>Requested Subsidy</th>
                <th>Projected Revenue Yield</th>
                <th>Jobs Created</th>
                <th>AI Award Decision</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <AlertCircle size={32} color="var(--secondary)" />
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        No applicant units found in "{selectedSectorFilter}"
                      </div>
                      <div style={{ fontSize: '0.82rem', maxWidth: '440px', lineHeight: 1.5 }}>
                        There are currently no registered MSME units in the queue matching this specific sector filter. You can select another sector or reset to view all units.
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedSectorFilter("All")}
                        className="btn btn-secondary"
                        style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 1.1rem' }}
                      >
                        Reset to All Priority Sectors
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {aiAllocation.awardedList.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{app.name}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{app.id} • {app.requestedScheme}</div>
                      </td>
                      <td>
                        <span className="badge badge-emerald">{app.district ? `${app.district}, ${app.state}` : (app.state || "India")}</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                          {app.predictions.growthScore} / 100
                        </strong>
                      </td>
                      <td>
                        {formatINR(app.cost)}
                      </td>
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+{formatINR(app.projectedRevenueUpliftINR)}</span>
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
                    <tr key={app.id} style={{ opacity: 0.75 }}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{app.name}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{app.id} • {app.requestedScheme}</div>
                      </td>
                      <td>
                        <span className="badge badge-amber">{app.district ? `${app.district}, ${app.state}` : (app.state || "India")}</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>
                          {app.predictions.growthScore} / 100
                        </strong>
                      </td>
                      <td>
                        {formatINR(app.cost)}
                      </td>
                      <td>
                        <span>+{formatINR(app.projectedRevenueUpliftINR)}</span>
                      </td>
                      <td>
                        <span>+{app.predictedJobs} Jobs</span>
                      </td>
                      <td>
                        <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <XCircle size={14} /> Waitlisted (Budget Scarcity)
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
