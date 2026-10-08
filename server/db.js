import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/applications.db');

export const db = new DatabaseSync(dbPath);

// Ensure the applications table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    enterprise_name TEXT,
    state TEXT,
    district TEXT,
    pincode TEXT,
    sector TEXT,
    annual_revenue REAL,
    revenue_growth_rate REAL,
    employees INTEGER,
    debt_ratio REAL,
    profit_margin REAL,
    tech_level INTEGER,
    gst_score REAL,
    export_share REAL,
    requested_scheme TEXT,
    requested_subsidy REAL,
    growth_score INTEGER,
    growth_tier TEXT,
    predicted_jobs INTEGER,
    projected_revenue REAL,
    status TEXT DEFAULT 'PENDING_REVIEW',
    is_seed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

export function getAllApplications(filters = {}) {
  let query = 'SELECT * FROM applications WHERE 1=1';
  const params = [];

  if (filters.sector && filters.sector !== 'All') {
    query += ' AND sector = ?';
    params.push(filters.sector);
  }
  if (filters.state && filters.state !== 'All') {
    query += ' AND state = ?';
    params.push(filters.state);
  }
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  query += ' ORDER BY created_at DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(Number(filters.limit));
  }

  return db.prepare(query).all(...params);
}

export function getApplicationById(id) {
  return db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
}

export function createApplication(data) {
  const stmt = db.prepare(`
    INSERT INTO applications (
      id, name, enterprise_name, state, district, pincode, sector,
      annual_revenue, revenue_growth_rate, employees, debt_ratio, profit_margin,
      tech_level, gst_score, export_share, requested_scheme, requested_subsidy,
      growth_score, growth_tier, predicted_jobs, projected_revenue, status, is_seed, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const id = data.id || `APP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  stmt.run(
    id,
    data.name || data.enterpriseName || 'Unnamed Enterprise',
    data.enterpriseName || data.name || 'Unnamed Enterprise',
    data.state || 'India',
    data.district || 'General',
    data.pincode || '',
    data.sector || 'Manufacturing',
    Number(data.annualRevenue) || 0,
    Number(data.revenueGrowthRate) || 0,
    Number(data.employees) || 1,
    Number(data.debtRatio) || 0,
    Number(data.profitMargin) || 0,
    Number(data.techLevel) || 1,
    Number(data.gstScore) || 50,
    Number(data.exportShare) || 0,
    data.requestedScheme || 'PMEGP Subsidy',
    Number(data.requestedSubsidy) || 1000000,
    Number(data.growthScore) || 50,
    data.growthTier || 'Moderate Growth',
    Number(data.predictedJobs) || 1,
    Number(data.projectedRevenue) || 0,
    data.status || 'PENDING_REVIEW',
    0,
    now
  );

  return getApplicationById(id);
}

export function updateApplicationStatus(id, status) {
  db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, id);
  return getApplicationById(id);
}

export function getStats() {
  const totalApps = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
  const totalDemand = db.prepare('SELECT SUM(requested_subsidy) as total FROM applications').get().total || 0;
  const totalJobs = db.prepare('SELECT SUM(predicted_jobs) as jobs FROM applications').get().jobs || 0;
  const avgGrowth = db.prepare('SELECT AVG(growth_score) as avg FROM applications').get().avg || 0;
  const sectorBreakdown = db.prepare('SELECT sector, COUNT(*) as count FROM applications GROUP BY sector').all();

  return {
    totalApplications: totalApps,
    totalSubsidyDemandINR: totalDemand,
    totalPotentialJobs: totalJobs,
    averageGrowthScore: Math.round(avgGrowth),
    sectorBreakdown
  };
}
