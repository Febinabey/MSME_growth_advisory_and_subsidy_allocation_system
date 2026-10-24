/**
 * Comprehensive MSME Platform Multi-Value Stress Test & Statutory Fact Check Suite
 * 
 * Tests:
 * 1. Statutory Tier Classification (Gazette S.O. 1364(E) & S.O. 2119(E)) across 14 turnover points
 * 2. MoSPI ASUSE 2023-24 Benchmarking across 8 Industry Sectors and extreme financial ratios
 * 3. XGBoost Growth Predictor & SHAP Explainability across 6 diverse enterprise archetypes
 * 4. Semantic Scheme Matcher & 5-Point Eligibility Engine across Micro, Small, Medium & Large profiles
 * 5. Multiple-Choice Knapsack Policy Solver across 6 budget tiers & objective weighting variations
 * 6. Dual-currency formatting & UI boundary conditions
 */

import { formatINR, getMSMETier, MIN_MSME_TURNOVER, MAX_MSME_TURNOVER } from '../src/utils/formatCurrency.js';
import { ASUSE_UDYAM_BENCHMARKS } from '../src/data/asuseUdyamBenchmarks.js';
import { benchmarkMSME } from '../src/engine/benchmarkEngine.js';
import { predictMSMEGrowth } from '../src/engine/xgboostPredictor.js';
import { computeSHAPValues } from '../src/engine/shapExplainer.js';
import { matchSchemesForMSME } from '../src/engine/semanticMatcher.js';
import { optimizeSubsidyBudget } from '../src/engine/knapsackSolver.js';
import { SAMPLE_APPLICANTS } from '../src/data/sampleApplicants.js';
import { GOVERNMENT_SCHEMES } from '../src/data/schemes.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
  }
}

console.log('================================================================');
console.log('MSME PLATFORM COMPREHENSIVE FACT CHECK & MULTI-VALUE STRESS TEST');
console.log('================================================================\n');

// -------------------------------------------------------------
// SUITE 1: STATUTORY TIER CLASSIFICATION ACROSS 14 BOUNDARIES
// -------------------------------------------------------------
console.log('Test Suite 1: Statutory MSME Tier Classification & Formatting');

const turnoverBoundaries = [
  { rev: 0, expectedTier: 'Micro', isMSME: true, desc: 'Zero Revenue (Greenfield Startup)' },
  { rev: 500000, expectedTier: 'Micro', isMSME: true, desc: '₹5 Lakhs (Micro Artisan / Vishwakarma)' },
  { rev: 2500000, expectedTier: 'Micro', isMSME: true, desc: '₹25 Lakhs (Micro Food Processing / PMFME)' },
  { rev: 10000000, expectedTier: 'Micro', isMSME: true, desc: '₹1 Crore (Micro Service / MUDRA)' },
  { rev: 50000000, expectedTier: 'Micro', isMSME: true, desc: '₹5 Crore (Pre-2025 Micro Ceiling)' },
  { rev: 100000000, expectedTier: 'Micro', isMSME: true, desc: '₹10 Crore (S.O. 1364(E) Micro Ceiling)' },
  { rev: 100000001, expectedTier: 'Small', isMSME: true, desc: '₹10.000001 Crore (Small Entry)' },
  { rev: 250000000, expectedTier: 'Small', isMSME: true, desc: '₹25 Crore (Small Manufacturing)' },
  { rev: 500000000, expectedTier: 'Small', isMSME: true, desc: '₹50 Crore (Pre-2025 Small Ceiling)' },
  { rev: 1000000000, expectedTier: 'Small', isMSME: true, desc: '₹100 Crore (S.O. 1364(E) Small Ceiling)' },
  { rev: 1000000001, expectedTier: 'Medium', isMSME: true, desc: '₹100.000001 Crore (Medium Entry)' },
  { rev: 2500000000, expectedTier: 'Medium', isMSME: true, desc: '₹250 Crore (Statutory Platform Ceiling)' },
  { rev: 2500000001, expectedTier: 'Large', isMSME: false, desc: '₹250.000001 Crore (Large - Ineligible)' },
  { rev: 3500000000, expectedTier: 'Large', isMSME: false, desc: '₹350 Crore (Large Conglomerate)' }
];

turnoverBoundaries.forEach(({ rev, expectedTier, isMSME, desc }) => {
  const result = getMSMETier(rev);
  assert(result.tier === expectedTier, `Tier match for ${desc}`, `Expected ${expectedTier}, got ${result.tier}`);
  assert(result.isMSME === isMSME, `MSME eligibility for ${desc}`, `Expected ${isMSME}, got ${result.isMSME}`);
});

// Verify dual currency formatting
assert(formatINR(0) === '₹0', 'Format INR ₹0');
assert(formatINR(500000) === '₹5 Lakhs', 'Format INR ₹5 Lakhs');
assert(formatINR(25000000, { showBoth: true }) === '₹2.5 Cr (250 Lakhs)', 'Format INR dual display ₹2.5 Cr');
assert(formatINR(2500000000) === '₹250 Crore', 'Format INR ₹250 Crore');


// -------------------------------------------------------------
// SUITE 2: MOSPI ASUSE BENCHMARK ENGINE ACROSS 8 SECTORS
// -------------------------------------------------------------
console.log('\nTest Suite 2: MoSPI ASUSE 2023-24 Sector Benchmarking');

const SECTORS = Object.keys(ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks);
assert(SECTORS.length >= 8, `Has at least 8 ASUSE sector benchmarks (found ${SECTORS.length})`);

SECTORS.forEach(sec => {
  const bm = benchmarkMSME({
    annualRevenue: 35000000,
    profitMargin: 15.0,
    employees: 25,
    debtRatio: 0.20,
    gstScore: 85,
    sector: sec
  });

  assert(bm.revenuePercentile >= 10 && bm.revenuePercentile <= 99, `${sec}: revenue percentile clamped [10, 99] (${bm.revenuePercentile})`);
  assert(bm.marginPercentile >= 10 && bm.marginPercentile <= 99, `${sec}: margin percentile clamped [10, 99] (${bm.marginPercentile})`);
  assert(bm.estimatedGvaPerWorker > 0 && !isNaN(bm.estimatedGvaPerWorker), `${sec}: valid GVA per worker (₹${bm.estimatedGvaPerWorker})`);
  assert(bm.productivityIndex > 0 && !isNaN(bm.productivityIndex), `${sec}: valid productivity index (${bm.productivityIndex})`);
  assert(['Low Vulnerability', 'Moderate Vulnerability', 'High Vulnerability'].includes(bm.creditVulnerability), `${sec}: valid credit vulnerability rating (${bm.creditVulnerability})`);
});


// -------------------------------------------------------------
// SUITE 3: XGBOOST & SHAP ACROSS DIVERSE ARCHETYPES
// -------------------------------------------------------------
console.log('\nTest Suite 3: XGBoost Growth Predictor & SHAP Explainability');

const ARCHETYPES = [
  { name: 'Greenfield Startup', annualRevenue: 0, revenueGrowthRate: 0, employees: 1, debtRatio: 0.05, profitMargin: 0, techLevel: 1, gstScore: 30, sector: 'Manufacturing' },
  { name: 'Micro Weaver Cooperative', annualRevenue: 1500000, revenueGrowthRate: 8, employees: 4, debtRatio: 0.12, profitMargin: 14, techLevel: 1, gstScore: 50, sector: 'Textiles' },
  { name: 'Modernized Agro Unit', annualRevenue: 45000000, revenueGrowthRate: 22, employees: 30, debtRatio: 0.20, profitMargin: 18, techLevel: 3, gstScore: 88, sector: 'Agro-processing' },
  { name: 'Distressed Precision Tooling', annualRevenue: 30000000, revenueGrowthRate: -18, employees: 20, debtRatio: 0.85, profitMargin: -4, techLevel: 2, gstScore: 40, sector: 'Manufacturing' },
  { name: 'Green Tech Solar Assembly', annualRevenue: 180000000, revenueGrowthRate: 40, employees: 65, debtRatio: 0.15, profitMargin: 24, techLevel: 5, gstScore: 98, sector: 'Green Tech' },
  { name: 'Upper Medium Pharma Unit', annualRevenue: 2500000000, revenueGrowthRate: 28, employees: 280, debtRatio: 0.22, profitMargin: 22, techLevel: 4, gstScore: 95, sector: 'Healthcare & Pharmaceuticals' }
];

ARCHETYPES.forEach(arch => {
  const pred = predictMSMEGrowth(arch);
  const shap = computeSHAPValues(arch);

  assert(pred.growthScore >= 10 && pred.growthScore <= 99, `${arch.name}: growth score clamped [10, 99] (${pred.growthScore})`);
  assert(['High Growth', 'Moderate Growth', 'Low Growth'].includes(pred.tier), `${arch.name}: valid growth tier (${pred.tier})`);
  assert(pred.predictedJobs >= 1, `${arch.name}: predicted new jobs >= 1 (${pred.predictedJobs})`);
  assert(shap.shapContributions.length === 8, `${arch.name}: exactly 8 SHAP feature attributions computed`);
  assert(shap.finalCalculatedScore >= 10 && shap.finalCalculatedScore <= 99, `${arch.name}: SHAP final score in [10, 99] (${shap.finalCalculatedScore})`);
  assert(shap.finalCalculatedScore === pred.growthScore, `${arch.name}: SHAP score strictly equals predicted growth score (${shap.finalCalculatedScore} === ${pred.growthScore})`);
});


// -------------------------------------------------------------
// SUITE 4: SEMANTIC MATCHER & 5-POINT ELIGIBILITY
// -------------------------------------------------------------
console.log('\nTest Suite 4: Semantic Matching & 5-Point Eligibility Across MSME Tiers');

// Test 4A: Greenfield Startup (Revenue = 0)
const startupResults = matchSchemesForMSME({
  annualRevenue: 0,
  employees: 2,
  sector: 'Manufacturing',
  techLevel: 1,
  gstScore: 40
}, 'new manufacturing startup kvic margin money employment');

const startupEligible = startupResults.filter(s => s.isEligible);
assert(startupEligible.length >= 3, `Startup matches at least 3 eligible schemes (found ${startupEligible.length})`);
assert(startupEligible[0].id === 'scheme_pmegp', 'PMEGP is top eligible match for new startup');
assert(startupEligible[0].recommendedSubsidyAmount > 0, `Startup recommended subsidy > ₹0 (got ₹${startupEligible[0].recommendedSubsidyAmount})`);

// Test 4B: Small Enterprise (Revenue = ₹75 Cr)
const smallResults = matchSchemesForMSME({
  annualRevenue: 750000000, // ₹75 Cr
  employees: 60,
  sector: 'Textiles',
  techLevel: 3,
  gstScore: 80
}, 'textile machinery weaving upgrade quality energy');

const smallEligible = smallResults.filter(s => s.isEligible);
assert(smallEligible.some(s => s.id === 'scheme_atufs'), 'ATUFS textile scheme is eligible for ₹75 Cr Small Enterprise');
assert(smallEligible.some(s => s.id === 'scheme_zed'), 'ZED certification is eligible for ₹75 Cr Small Enterprise');
assert(smallEligible.some(s => s.id === 'scheme_cgtmse'), 'CGTMSE credit guarantee is eligible for ₹75 Cr Small Enterprise');

// Test 4C: Medium Enterprise (Revenue = ₹200 Cr)
const mediumResults = matchSchemesForMSME({
  annualRevenue: 2000000000, // ₹200 Cr
  employees: 250,
  sector: 'Manufacturing',
  techLevel: 4,
  gstScore: 85
}, 'smart factory automation export quality');

const mediumEligible = mediumResults.filter(s => s.isEligible);
assert(mediumEligible.length >= 8, `Medium Enterprise matches at least 8 schemes (found ${mediumEligible.length})`);
assert(mediumEligible.every(s => s.maxTurnover >= 2000000000), 'All matched schemes support ≥ ₹200 Cr turnover');

// Test 4D: Large Enterprise (Revenue = ₹300 Cr - Out of Bounds)
const largeResults = matchSchemesForMSME({
  annualRevenue: 3000000000, // ₹300 Cr
  employees: 500,
  sector: 'Manufacturing',
  techLevel: 4,
  gstScore: 90
}, 'all schemes');

const largeEligible = largeResults.filter(s => s.isEligible);
assert(largeEligible.length === 0, 'Large Enterprise (> ₹250 Cr) has 0 eligible schemes (strictly blocked by law)');

// Test 4E: Large Enterprise via Plant & Machinery (> ₹125 Cr - S.O. 1364(E) Composite Breach)
const largeMachineryResults = matchSchemesForMSME({
  annualRevenue: 500000000, // ₹50 Cr (otherwise valid for Small/Medium MSME)
  machineryInvestment: 1500000000, // ₹150 Cr (> ₹125 Cr ceiling)
  employees: 100,
  sector: 'Manufacturing',
  techLevel: 4,
  gstScore: 85
}, 'machinery upgrade');

const largeMachineryEligible = largeMachineryResults.filter(s => s.isEligible);
assert(largeMachineryEligible.length === 0, 'Enterprise exceeding ₹125 Cr Plant & Machinery has 0 eligible schemes (S.O. 1364(E) composite breach)');
assert(largeMachineryResults.every(s => s.recommendedSubsidyAmount === 0), 'Enterprise exceeding ₹125 Cr Plant & Machinery receives ₹0 subsidy');



// -------------------------------------------------------------
// SUITE 5: KNAPSACK SOLVER & BUDGET SCARCITY MULTIPLIER
// -------------------------------------------------------------
console.log('\nTest Suite 5: Knapsack Solver Across Budget Tiers & Weight Variations');

const BUDGET_TIERS = [
  { budget: 5000000, desc: '₹50 Lakhs (Severe Capital Scarcity)' },
  { budget: 10000000, desc: '₹1 Crore (Constrained Capital)' },
  { budget: 25000000, desc: '₹2.5 Crore (Default Policy Budget)' },
  { budget: 50000000, desc: '₹5 Crore (Moderate Policy Budget)' },
  { budget: 74400000, desc: '₹7.44 Crore (Pool Saturation Boundary)' },
  { budget: 100000000, desc: '₹10 Crore (Capital Surplus)' }
];

BUDGET_TIERS.forEach(({ budget, desc }) => {
  const result = optimizeSubsidyBudget(SAMPLE_APPLICANTS, budget);

  assert(result.aiAllocation.totalBudgetSpentINR <= budget, `${desc}: spent budget (₹${result.aiAllocation.totalBudgetSpentINR}) <= budget ceiling (₹${budget})`);
  assert(result.aiAllocation.totalJobsCreated >= result.baselineFCFS.totalJobsCreated, `${desc}: AI jobs (${result.aiAllocation.totalJobsCreated}) >= FCFS jobs (${result.baselineFCFS.totalJobsCreated})`);
  assert(result.aiAllocation.totalRevenueUpliftINR >= result.baselineFCFS.totalRevenueUpliftINR, `${desc}: AI revenue (₹${result.aiAllocation.totalRevenueUpliftINR}) >= FCFS revenue (₹${result.baselineFCFS.totalRevenueUpliftINR})`);
  assert(result.gains.roiMultiplier >= 1.0, `${desc}: ROI multiplier >= 1.0x (${result.gains.roiMultiplier}x)`);
});

// Policy Weight Sensitivity Tests
const jobPriority = optimizeSubsidyBudget(SAMPLE_APPLICANTS, 25000000, { jobWeight: 0.9, revenueWeight: 0.1, greenBonus: 0.0 });
const revPriority = optimizeSubsidyBudget(SAMPLE_APPLICANTS, 25000000, { jobWeight: 0.1, revenueWeight: 0.9, greenBonus: 0.0 });

assert(jobPriority.aiAllocation.totalJobsCreated >= revPriority.aiAllocation.totalJobsCreated, 'Job-priority policy yields >= jobs than revenue-priority policy');
assert(revPriority.aiAllocation.totalRevenueUpliftINR >= jobPriority.aiAllocation.totalRevenueUpliftINR, 'Revenue-priority policy yields >= revenue uplift than job-priority policy');


// -------------------------------------------------------------
// SUITE 6: STATUTORY INTEGRITY & DATASET VALIDATION
// -------------------------------------------------------------
console.log('\nTest Suite 6: Dataset & Statutory Integrity');

assert(GOVERNMENT_SCHEMES.length === 24, `Complete statutory scheme repository has exactly 24 schemes (found ${GOVERNMENT_SCHEMES.length})`);
assert(SAMPLE_APPLICANTS.length === 20, `Applicant pool contains exactly 20 validated enterprises (found ${SAMPLE_APPLICANTS.length})`);

const totalApplicantDemand = SAMPLE_APPLICANTS.reduce((sum, a) => sum + a.requestedSubsidy, 0);
assert(totalApplicantDemand === 74440000, `Total sample applicant subsidy demand equals exactly ₹7.444 Cr (₹${totalApplicantDemand})`);

GOVERNMENT_SCHEMES.forEach(s => {
  assert(s.maxSubsidy > 0, `${s.name}: positive max subsidy`);
  assert(s.subsidyPercentage > 0 && s.subsidyPercentage <= 100, `${s.name}: valid subsidy percentage (1-100%)`);
  assert(s.maxTurnover <= 2500000000, `${s.name}: max turnover adheres to ₹250 Cr statutory ceiling`);
  assert(s.eligibleSectors.length > 0, `${s.name}: at least one eligible sector`);
});

console.log('\n======================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
