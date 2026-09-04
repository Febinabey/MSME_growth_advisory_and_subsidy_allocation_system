import React, { useState } from 'react';
import { GOVERNMENT_SCHEMES } from '../data/schemes';
import { Search, Filter, BookOpen, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SchemeDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(GOVERNMENT_SCHEMES.map(s => s.category))];

  const filteredSchemes = GOVERNMENT_SCHEMES.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.semanticKeywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.25rem' }}>Government Repository</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>Indian MSME Government Scheme Knowledge Directory</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Comprehensive database of verified MSME government financial assistance, credit guarantees, and green incentives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search schemes or keywords..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="form-input"
                style={{ paddingLeft: '2.2rem', fontSize: '0.82rem' }}
              />
            </div>

            {/* Category Filter */}
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="form-select"
              style={{ width: '180px', fontSize: '0.82rem', padding: '0.6rem' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid-2">
        {filteredSchemes.map(scheme => (
          <div key={scheme.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>{scheme.category}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{scheme.name}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{scheme.ministry}</div>
                </div>

                <div style={{ textAlign: 'right', background: 'var(--bg-secondary)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Max Grant / Loan</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--emerald-main)' }}>
                    ₹{(scheme.maxSubsidy / 100000).toFixed(1)} Lakhs
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                {scheme.description}
              </p>

              {/* Eligible Sectors */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Eligible Sectors:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {scheme.eligibleSectors.map(sec => (
                    <span key={sec} className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>{sec}</span>
                  ))}
                </div>
              </div>

              {/* Semantic Keywords */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Semantic Match Keywords:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {scheme.semanticKeywords.map(kw => (
                    <span key={kw} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheme Footer info */}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div>
                <strong>Collateral:</strong> {scheme.collateralRequired ? 'Required ⚠️' : 'Collateral Free ✅'}
              </div>
              <div>
                <strong>Processing:</strong> ~{scheme.processingDays} Days
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
