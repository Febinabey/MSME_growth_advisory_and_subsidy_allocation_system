import React, { useState } from 'react';
import { ASUSE_UDYAM_BENCHMARKS } from '../data/asuseUdyamBenchmarks';
import { benchmarkMSME } from '../engine/benchmarkEngine';
import { Database, TrendingUp, ShieldCheck, Award, BarChart3, Users, DollarSign } from 'lucide-react';

export default function BenchmarkView() {
  const [selectedSector, setSelectedSector] = useState("Manufacturing");
  const [userMetrics, setUserMetrics] = useState({
    annualRevenue: 35000000, // ₹3.5 Cr
    profitMargin: 14.5,
    employees: 28,
    debtRatio: 0.25,
    gstScore: 85
  });

  const benchmarkResult = benchmarkMSME({ ...userMetrics, sector: selectedSector });
  const sectorBenchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks[selectedSector];

  return (
    <div>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.25rem' }}>Official Survey Data</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              MoSPI ASUSE 2023-24 & Udyam National Sector Benchmarks
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Benchmark individual enterprise performance against 6.5 Crore Indian MSME survey data points from MoSPI and Ministry of MSME.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Survey Period</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-main)' }}>
              {ASUSE_UDYAM_BENCHMARKS.metadata.asuseSurveyPeriod}
            </div>
          </div>
        </div>
      </div>

      {/* Sector Selector & Benchmark Cards */}
      <div className="grid-1-2" style={{ marginBottom: '1.5rem' }}>
        
        {/* Left: Input parameters */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--accent-primary)" />
            Enterprise Parameter Settings
          </h3>

          <div className="form-group">
            <label className="form-label">Target Industry Sector</label>
            <select 
              value={selectedSector} 
              onChange={(e) => setSelectedSector(e.target.value)} 
              className="form-select"
            >
              {Object.keys(ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks).map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Annual Turnover (₹)</span>
              <strong>₹{(userMetrics.annualRevenue / 100000).toFixed(1)} Lakhs</strong>
            </div>
            <input 
              type="range" 
              min="1000000" 
              max="150000000" 
              step="1000000" 
              value={userMetrics.annualRevenue} 
              onChange={(e) => setUserMetrics(prev => ({ ...prev, annualRevenue: parseFloat(e.target.value) }))} 
              className="slider-input" 
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Profit Margin (%)</span>
              <strong>{userMetrics.profitMargin}%</strong>
            </div>
            <input 
              type="number" 
              value={userMetrics.profitMargin} 
              onChange={(e) => setUserMetrics(prev => ({ ...prev, profitMargin: parseFloat(e.target.value) || 0 }))} 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Workforce Scale</span>
              <strong>{userMetrics.employees} Staff</strong>
            </div>
            <input 
              type="number" 
              value={userMetrics.employees} 
              onChange={(e) => setUserMetrics(prev => ({ ...prev, employees: parseInt(e.target.value) || 1 }))} 
              className="form-input" 
            />
          </div>

        </div>

        {/* Right: ASUSE Benchmark Evaluation Outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="var(--emerald-main)" />
              National ASUSE Percentile & Productivity Diagnostic
            </h3>

            <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
              
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Revenue Percentile</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-main)' }}>
                  {benchmarkResult.revenuePercentile}th
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>vs {selectedSector} sector</div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>GVA Productivity Index</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {benchmarkResult.productivityIndex}x
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>₹{(benchmarkResult.estimatedGvaPerWorker / 100000).toFixed(1)}L / worker</div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Official Classification</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cyan-main)', marginTop: '0.5rem' }}>
                  {benchmarkResult.udyamCategory}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Gazette April 2025 Rules</div>
              </div>

            </div>

            {/* Detailed comparison table */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Enterprise vs MoSPI ASUSE Benchmark Summary
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Metric</div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Your Enterprise</div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ASUSE National Avg</div>

                <div>Annual Revenue</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{(userMetrics.annualRevenue / 100000).toFixed(1)}L</div>
                <div>₹{(sectorBenchmark.avgRevenue / 100000).toFixed(1)}L</div>

                <div>Net Profit Margin</div>
                <div style={{ fontWeight: 700, color: 'var(--emerald-main)' }}>{userMetrics.profitMargin}%</div>
                <div>{sectorBenchmark.avgProfitMargin}%</div>

                <div>Labor Productivity (GVA)</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>₹{(benchmarkResult.estimatedGvaPerWorker / 100000).toFixed(1)}L</div>
                <div>₹{(sectorBenchmark.avgGvaPerWorker / 100000).toFixed(1)}L</div>

                <div>Capacity Utilization</div>
                <div style={{ fontWeight: 700, color: 'var(--cyan-main)' }}>72.5%</div>
                <div>{sectorBenchmark.avgCapacityUtilization}%</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* State-wise Distribution Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Udyam Registration State-wise Distribution Reference (Ministry of MSME)
        </h3>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>State Name</th>
                <th>Registered MSME Count</th>
                <th>National Udyam Share</th>
                <th>Dominant Industrial Sector</th>
              </tr>
            </thead>
            <tbody>
              {ASUSE_UDYAM_BENCHMARKS.nationalStateDistribution.map((row) => (
                <tr key={row.state}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.state}</td>
                  <td>{row.totalMSMEs}</td>
                  <td><span className="badge badge-indigo">{row.udyamShare}</span></td>
                  <td>{row.topSector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
