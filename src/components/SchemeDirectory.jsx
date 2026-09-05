import React, { useState } from 'react';
import { GOVERNMENT_SCHEMES } from '../data/schemes';
import { Search, Filter, BookOpen, ExternalLink, ShieldCheck, CheckCircle2, Sprout } from 'lucide-react';

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
      <div className="glass-panel organic-card-1" style={{
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(93, 112, 82, 0.08) 0%, rgba(193, 140, 93, 0.08) 100%)',
        border: '1.5px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
              <Sprout size={13} /> Official Central & State Repository
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Indian MSME Government Scheme Knowledge Directory
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
              Comprehensive database of verified MSME government financial assistance, credit guarantees, and green incentives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search schemes or keywords..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="form-input"
                style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
              />
            </div>

            {/* Category Filter */}
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="form-select"
              style={{ width: '200px', fontSize: '0.88rem' }}
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
        {filteredSchemes.map((scheme, idx) => (
          <div key={scheme.id} className="glass-panel" style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: idx % 2 === 0 ? '2.5rem 1.5rem 2rem 1.75rem' : '1.5rem 2.5rem 1.75rem 2.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>{scheme.category}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{scheme.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{scheme.ministry}</div>
                </div>

                <div style={{ textAlign: 'right', background: 'var(--muted)', padding: '0.5rem 1.15rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Max Assistance</div>
                  <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{(scheme.maxSubsidy / 100000).toFixed(1)} Lakhs
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                {scheme.description}
              </p>

              {/* Eligible Sectors */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Eligible Sectors:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {scheme.eligibleSectors.map(sec => (
                    <span key={sec} className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>{sec}</span>
                  ))}
                </div>
              </div>

              {/* Semantic Keywords */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Semantic Match Keywords:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {scheme.semanticKeywords.map(kw => (
                    <span key={kw} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--muted)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheme Footer info */}
            <div style={{ background: 'var(--muted)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', flexWrap: 'wrap', gap: '0.5rem' }}>
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
