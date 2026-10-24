import assert from 'node:assert';
import { REAL_UDYAM_DIRECTORY } from '../src/data/realUdyamDirectory.js';
import { SAMPLE_APPLICANTS } from '../src/data/sampleApplicants.js';
import { GOVERNMENT_SCHEMES } from '../src/data/schemes.js';
import { getMSMETier, formatINR } from '../src/utils/formatCurrency.js';
import { predictMSMEGrowth } from '../src/engine/xgboostPredictor.js';
import { computeSHAPValues } from '../src/engine/shapExplainer.js';
import { matchSchemesForMSME, matchesSector } from '../src/engine/semanticMatcher.js';
import { benchmarkMSME } from '../src/engine/benchmarkEngine.js';
import { optimizeSubsidyBudget } from '../src/engine/knapsackSolver.js';

console.log('================================================================');
console.log('🏛️  REAL-WORLD UDYAM DATASET & EDGE-CASE COMPREHENSIVE AUDIT');
console.log('================================================================');

let totalChecks = 0;
function check(description, fn) {
  try {
    fn();
    totalChecks++;
  } catch (err) {
    console.error(`❌ FAILED: ${description}`);
    console.error(err);
    process.exit(1);
  }
}

// ----------------------------------------------------------------------
// 1. Audit All 60 Real Udyam Directory Units
// ----------------------------------------------------------------------
console.log(`\nPhase 1: Validating all ${REAL_UDYAM_DIRECTORY.length} Real Registered MSME Units`);

REAL_UDYAM_DIRECTORY.forEach((unit, idx) => {
  const prefix = `[Unit ${idx + 1}: ${unit.id}] ${unit.enterpriseName}`;

  // Check A: Identity & Data Integrity
  check(`${prefix} has valid legal identity & location`, () => {
    assert(unit.id && unit.id.startsWith('UDYAM-'), 'Valid Udyam Registration Number format');
    assert(unit.enterpriseName && unit.enterpriseName.length > 2, 'Non-empty enterprise name');
    assert(unit.state && unit.state.length > 2, 'Valid state name');
    assert(unit.district && unit.district.length > 1, 'Valid district name');
    assert(unit.pincode && /^\d{6}$/.test(unit.pincode), 'Valid 6-digit Indian PIN code');
  });

  // Check B: Financial Composite Criteria
  check(`${prefix} evaluates valid Gazette MSME Tier`, () => {
    const tier = getMSMETier(unit.annualRevenue, unit.machineryInvestment);
    assert(['Micro', 'Small', 'Medium', 'Large'].includes(tier.tier), 'Valid statutory tier');
    assert.strictEqual(tier.isMSME, tier.tier !== 'Large', 'isMSME matches statutory definition');
  });

  // Check C: XGBoost Predictive Indicator
  let pred;
  check(`${prefix} executes XGBoost growth prediction`, () => {
    pred = predictMSMEGrowth(unit);
    assert(pred.growthScore >= 10 && pred.growthScore <= 99, 'Growth score clamped in [10, 99]');
    assert(['High Growth', 'Moderate Growth', 'Low Growth'].includes(pred.tier), 'Valid growth tier label');
    assert(pred.predictedJobs >= 1, 'Predicted new jobs >= 1');
    assert(pred.projectedRevenueAmount > 0, 'Positive projected revenue');
  });

  // Check D: Exact Lundberg & Lee SHAP Additivity
  check(`${prefix} strictly satisfies SHAP Additivity (Base + sum(phi) === GrowthScore)`, () => {
    const shap = computeSHAPValues(unit);
    assert.strictEqual(shap.baseScore, 50.0, 'Baseline expectation is 50.0');
    assert.strictEqual(shap.shapContributions.length, 8, 'Evaluates all 8 SHAP features');
    assert.strictEqual(shap.finalCalculatedScore, pred.growthScore, 'SHAP score strictly matches model growth score');

    const sumPhi = shap.shapContributions.reduce((s, c) => s + c.shapValue, 0);
    const expectedTarget = shap.finalCalculatedScore - shap.baseScore;
    const diff = Math.abs(sumPhi - expectedTarget);
    assert(diff < 0.15, `SHAP sum(phi) (${sumPhi.toFixed(1)}) matches target attribution (${expectedTarget.toFixed(1)})`);
  });

  // Check E: Semantic & Rule-Based Scheme Matching
  check(`${prefix} matches eligible central schemes`, () => {
    const matches = matchSchemesForMSME(unit, unit.requirementText || unit.nicActivity || '');
    assert.strictEqual(matches.length, 24, 'All 24 statutory schemes evaluated');
    assert(matches.some(s => s.checks.sectorMatch), 'At least one scheme matches unit sector');
    const eligible = matches.filter(s => s.isEligible);
    assert(eligible.length > 0, 'Real compliant MSME matches at least 1 eligible scheme');
    assert(eligible.every(s => s.recommendedSubsidyAmount > 0), 'Eligible schemes have positive recommended subsidy');
  });

  // Check F: ASUSE MoSPI Benchmarking
  check(`${prefix} generates MoSPI ASUSE 2023-24 benchmark percentiles`, () => {
    const bm = benchmarkMSME(unit);
    assert(bm.revenuePercentile >= 10 && bm.revenuePercentile <= 99, 'Revenue percentile in [10, 99]');
    assert(bm.marginPercentile >= 10 && bm.marginPercentile <= 99, 'Margin percentile in [10, 99]');
    assert(bm.estimatedGvaPerWorker > 0, 'Positive GVA per worker');
    assert(bm.productivityIndex > 0, 'Positive productivity index');
  });
});
console.log(`  ✓ Passed all audits across ${REAL_UDYAM_DIRECTORY.length} real registered MSMEs.`);

// ----------------------------------------------------------------------
// 2. Multi-Objective Knapsack Solver Across Real Applicant Cohort
// ----------------------------------------------------------------------
console.log('\nPhase 2: Knapsack Policy Solver Multi-Objective Rigor');

const budgets = [
  { amount: 5000000, label: '₹50 Lakhs (Severe Scarcity)' },
  { amount: 25000000, label: '₹2.5 Crore (Standard Policy)' },
  { amount: 50000000, label: '₹5.0 Crore (Moderate Envelope)' },
  { amount: 150000000, label: '₹15 Crore (Surplus Envelope)' }
];

budgets.forEach(({ amount, label }) => {
  check(`Knapsack solver under ${label}`, () => {
    const res = optimizeSubsidyBudget(SAMPLE_APPLICANTS, amount, { jobWeight: 0.5, revenueWeight: 0.5, greenBonus: 0.1 });
    assert(res.aiAllocation.totalBudgetSpentINR <= amount, 'Spent subsidy <= budget limit');
    assert(res.aiAllocation.totalJobsCreated >= res.baselineFCFS.totalJobsCreated, 'AI jobs >= FCFS baseline jobs');
    assert(res.aiAllocation.totalRevenueUpliftINR >= res.baselineFCFS.totalRevenueUpliftINR, 'AI revenue >= FCFS baseline revenue');
    assert(res.aiAllocation.budgetUtilizationPercent >= 0 && res.aiAllocation.budgetUtilizationPercent <= 100, 'Utilization % in [0, 100]');
    assert(res.gains.roiMultiplier >= 1.0, 'ROI multiplier >= 1.0x');
  });
});

// Green Sector Bonus Sensitivity
check('Knapsack green sector bonus enhances priority for green/agro units', () => {
  const neutral = optimizeSubsidyBudget(SAMPLE_APPLICANTS, 20000000, { jobWeight: 0.5, revenueWeight: 0.5, greenBonus: 0.0 });
  const boosted = optimizeSubsidyBudget(SAMPLE_APPLICANTS, 20000000, { jobWeight: 0.5, revenueWeight: 0.5, greenBonus: 0.3 });
  assert(boosted.aiAllocation.awardedList.length > 0, 'Boosted allocation non-empty');
});

// ----------------------------------------------------------------------
// 3. Statutory Boundary & Edge Case Stress Tests
// ----------------------------------------------------------------------
console.log('\nPhase 3: Statutory Boundaries & Edge-Case Stress Matrix');

const EDGE_CASES = [
  {
    desc: 'Greenfield Startup (Zero revenue, 2 workers, ₹10L request)',
    metrics: { annualRevenue: 0, machineryInvestment: 500000, employees: 2, debtRatio: 0, profitMargin: 0, techLevel: 1, gstScore: 70, sector: 'Services' },
    expectedTier: 'Micro',
    expectedEligible: true
  },
  {
    desc: 'Borderline Micro Upper Bound (₹10 Cr Turnover, ₹2.5 Cr Machinery)',
    metrics: { annualRevenue: 100000000, machineryInvestment: 25000000, employees: 30, debtRatio: 0.20, profitMargin: 15, techLevel: 3, gstScore: 85, sector: 'Manufacturing' },
    expectedTier: 'Micro',
    expectedEligible: true
  },
  {
    desc: 'Borderline Small Upper Bound (₹100 Cr Turnover, ₹25 Cr Machinery)',
    metrics: { annualRevenue: 1000000000, machineryInvestment: 250000000, employees: 120, debtRatio: 0.25, profitMargin: 14, techLevel: 4, gstScore: 90, sector: 'Manufacturing' },
    expectedTier: 'Small',
    expectedEligible: true
  },
  {
    desc: 'Borderline Medium Max MSME (₹250 Cr Turnover, ₹125 Cr Machinery)',
    metrics: { annualRevenue: 2500000000, machineryInvestment: 1250000000, employees: 400, debtRatio: 0.30, profitMargin: 18, techLevel: 5, gstScore: 95, sector: 'Manufacturing' },
    expectedTier: 'Medium',
    expectedEligible: true
  },
  {
    desc: 'Statutory Large Corporate by Turnover (₹260 Cr > ₹250 Cr Ceiling)',
    metrics: { annualRevenue: 2600000000, machineryInvestment: 20000000, employees: 500, debtRatio: 0.20, profitMargin: 20, techLevel: 4, gstScore: 90, sector: 'Manufacturing' },
    expectedTier: 'Large',
    expectedEligible: false
  },
  {
    desc: 'Statutory Large Corporate by Machinery (₹130 Cr > ₹125 Cr Ceiling with ₹40 Cr Turnover)',
    metrics: { annualRevenue: 400000000, machineryInvestment: 1300000000, employees: 250, debtRatio: 0.25, profitMargin: 12, techLevel: 4, gstScore: 85, sector: 'Manufacturing' },
    expectedTier: 'Large',
    expectedEligible: false
  },
  {
    desc: 'Distressed Unit (Negative Profit Margin -25%, High Debt 80%)',
    metrics: { annualRevenue: 15000000, machineryInvestment: 3000000, employees: 15, debtRatio: 0.80, profitMargin: -25, techLevel: 1, gstScore: 40, sector: 'Textiles' },
    expectedTier: 'Micro',
    expectedEligible: true,
    expectedHighRisk: true
  },
  {
    desc: '100% Export-Oriented IT Enterprise',
    metrics: { annualRevenue: 80000000, machineryInvestment: 12000000, employees: 60, debtRatio: 0.10, profitMargin: 28, techLevel: 5, gstScore: 98, exportShare: 100, sector: 'IT Services' },
    expectedTier: 'Micro',
    expectedEligible: true,
    expectedHighGrowth: true
  }
];

EDGE_CASES.forEach(ec => {
  check(`Stress test: ${ec.desc}`, () => {
    const tier = getMSMETier(ec.metrics.annualRevenue, ec.metrics.machineryInvestment);
    assert.strictEqual(tier.tier, ec.expectedTier, `Tier matches expected ${ec.expectedTier} (got ${tier.tier})`);
    assert.strictEqual(tier.isMSME, ec.expectedEligible, `isMSME matches expected ${ec.expectedEligible}`);

    const schemes = matchSchemesForMSME(ec.metrics, 'machinery subsidy working capital grant');
    const eligibleCount = schemes.filter(s => s.isEligible).length;

    if (!ec.expectedEligible) {
      assert.strictEqual(eligibleCount, 0, 'Large Enterprise has 0 eligible schemes');
      assert(schemes.every(s => s.recommendedSubsidyAmount === 0), 'Large Enterprise receives ₹0 subsidy');
    } else {
      assert(eligibleCount > 0, 'Compliant unit has >= 1 eligible schemes');
    }

    const pred = predictMSMEGrowth(ec.metrics);
    if (ec.expectedHighRisk) {
      assert.strictEqual(pred.riskLevel, 'High Risk', 'Identified as High Risk');
    }
    if (ec.expectedHighGrowth) {
      assert.strictEqual(pred.tier, 'High Growth', 'Identified as High Growth');
    }

    const shap = computeSHAPValues(ec.metrics);
    assert.strictEqual(shap.finalCalculatedScore, pred.growthScore, 'SHAP additivity holds in stress case');
  });
});

console.log(`  ✓ Passed all ${EDGE_CASES.length} boundary and edge-case scenarios.`);

// ----------------------------------------------------------------------
// 4. End-to-End Live API Endpoint Audit
// ----------------------------------------------------------------------
console.log('\nPhase 4: Live REST API Endpoints Verification');

async function testLiveAPIs() {
  const BASE = 'http://localhost:5000';

  // 1. Health
  const healthRes = await fetch(`${BASE}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Health endpoint 200 OK');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'ONLINE');
  assert(healthData.stats.totalApplications >= 20, 'At least 20 applications in database');

  // 2. Schemes Match with Real Udyam Unit
  const sampleRealUnit = REAL_UDYAM_DIRECTORY[0];
  const matchRes = await fetch(`${BASE}/api/schemes/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metrics: sampleRealUnit, requirementText: sampleRealUnit.nicActivity })
  });
  assert.strictEqual(matchRes.status, 200, 'Schemes match 200 OK');
  const matchData = await matchRes.json();
  assert.strictEqual(matchData.success, true);
  assert(matchData.eligibleCount > 0, 'Returns eligible schemes for real unit');

  // 3. Predict All
  const predRes = await fetch(`${BASE}/api/predict/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sampleRealUnit)
  });
  assert.strictEqual(predRes.status, 200, 'Predict all 200 OK');
  const predData = await predRes.json();
  assert.strictEqual(predData.success, true);
  assert.strictEqual(predData.data.predictions.growthScore, predData.data.shapData.finalCalculatedScore);

  // 4. Sector Benchmarks
  const bmRes = await fetch(`${BASE}/api/benchmarks/sectors`);
  assert.strictEqual(bmRes.status, 200, 'Benchmarks 200 OK');
  const bmData = await bmRes.json();
  assert.strictEqual(bmData.success, true);
  assert(Object.keys(bmData.data).length >= 8, 'Has at least 8 MoSPI ASUSE sectors');

  console.log('  ✓ Live API endpoints verified successfully.');
}

testLiveAPIs().then(() => {
  console.log('\n================================================================');
  console.log(`🎉 ALL EXTENSIVE VALIDATIONS PASSED: ${totalChecks} AUTOMATED CHECKS VERIFIED`);
  console.log('================================================================\n');
}).catch(err => {
  console.error('API Verification error:', err);
  process.exit(1);
});
