import React, { useState } from 'react';
import { ASUSE_UDYAM_BENCHMARKS } from '../data/asuseUdyamBenchmarks';
import { benchmarkMSME } from '../engine/benchmarkEngine';
import { Database, TrendingUp, ShieldCheck, Award, BarChart3, Users, DollarSign, Sprout } from 'lucide-react';

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
      <div className="glass-panel organic-card-1" style={{
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(93, 112, 82, 0.09) 0%, rgba(74, 107, 108, 0.08) 100%)',
        border: '1.5px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
              <Sprout size={13} /> Official Survey Intelligence
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              MoSPI ASUSE 2023-24 & Udyam National Sector Benchmarks
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
              Benchmarking individual enterprise indicators against 6.5 Crore Indian MSME survey observations published by MoSPI and Ministry of MSME.
            </p>
          </div>

          <div style={{
            background: 'var(--muted)',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Survey Period</div>
            <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--primary)' }}>
              {ASUSE_UDYAM_BENCHMARKS.metadata.asuseSurveyPeriod}
            </div>
          </div>
        </div>
      </div>

      {/* Sector Selector & Benchmark Cards */}
      <div className="grid-1-2" style={{ marginBottom: '2rem' }}>
        
        {/* Left: Input parameters */}
        <div className="glass-panel organic-card-3" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <BarChart3 size={20} color="var(--primary)" />
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
              <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                ₹{(userMetrics.annualRevenue / 100000).toFixed(1)} Lakhs
              </strong>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          <div className="glass-panel organic-card-2" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Award size={20} color="var(--primary)" />
              National ASUSE Percentile & Productivity Diagnostic
            </h3>

            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              
              <div style={{ background: 'var(--muted)', padding: '1.25rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Revenue Percentile</div>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>
                  {benchmarkResult.revenuePercentile}th
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>vs {selectedSector} sector</div>
              </div>

              <div style={{ background: 'var(--muted)', padding: '1.25rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>GVA Productivity</div>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--secondary)', margin: '0.2rem 0' }}>
                  {benchmarkResult.productivityIndex}x
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>₹{(benchmarkResult.estimatedGvaPerWorker / 100000).toFixed(1)}L / worker</div>
              </div>

              <div style={{ background: 'var(--muted)', padding: '1.25rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Official Category</div>
                <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--cyan-main)', margin: '0.6rem 0 0.2rem 0' }}>
                  {benchmarkResult.udyamCategory}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Gazette April 2025 Rules</div>
              </div>

            </div>

            {/* Detailed comparison table */}
            <div style={{ background: 'var(--muted)', padding: '1.25rem 1.5rem', borderRadius: '1.5rem', border: '1.5px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Enterprise vs MoSPI ASUSE Benchmark Summary
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Metric</div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Your Enterprise</div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>ASUSE National Avg</div>

                <div>Annual Revenue</div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{(userMetrics.annualRevenue / 100000).toFixed(1)}L</div>
                <div>₹{(sectorBenchmark.avgRevenue / 100000).toFixed(1)}L</div>

                <div>Net Profit Margin</div>
                <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{userMetrics.profitMargin}%</div>
                <div>{sectorBenchmark.avgProfitMargin}%</div>

                <div>Labor Productivity (GVA)</div>
                <div style={{ fontWeight: 800, color: 'var(--secondary)' }}>₹{(benchmarkResult.estimatedGvaPerWorker / 100000).toFixed(1)}L</div>
                <div>₹{(sectorBenchmark.avgGvaPerWorker / 100000).toFixed(1)}L</div>

                <div>Capacity Utilization</div>
                <div style={{ fontWeight: 800, color: 'var(--cyan-main)' }}>72.5%</div>
                <div>{sectorBenchmark.avgCapacityUtilization}%</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* State-wise Distribution Table */}
      <div className="glass-panel organic-card-1" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
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
                  <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{row.state}</td>
                  <td style={{ fontWeight: 700 }}>
                    {row.udyamCount ? `${row.udyamCount.toLocaleString('en-IN')} Units` : row.totalMSMEs}
                  </td>
                  <td><span className="badge badge-emerald">{row.udyamShare}</span></td>
                  <td>{row.topSector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '0.85rem 1.25rem', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          <div>
            <strong>MoSPI ASUSE Survey Provenance:</strong> {ASUSE_UDYAM_BENCHMARKS.metadata.totalSurveyUnits} • 16 Microdata Survey Levels
          </div>
          <div>
            <strong>Udyam OGD Provenance:</strong> {ASUSE_UDYAM_BENCHMARKS.metadata.totalUdyamRecords} • 36 States/UTs Covered
          </div>
        </div>
      </div>

    </div>
  );
}
