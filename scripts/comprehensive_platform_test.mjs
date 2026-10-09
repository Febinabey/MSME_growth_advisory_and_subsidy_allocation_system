import { formatINR, getMSMETier, MIN_MSME_TURNOVER, MAX_MSME_TURNOVER } from '../src/utils/formatCurrency.js';
import { benchmarkMSME } from '../src/engine/benchmarkEngine.js';
import { predictMSMEGrowth } from '../src/engine/xgboostPredictor.js';
import { computeSHAPValues } from '../src/engine/shapExplainer.js';
import { matchSchemesForMSME } from '../src/engine/semanticMatcher.js';
import { optimizeSubsidyBudget } from '../src/engine/knapsackSolver.js';
import { GOVERNMENT_SCHEMES } from '../src/data/schemes.js';
import { REAL_UDYAM_DIRECTORY } from '../src/data/realUdyamDirectory.js';
import { SAMPLE_APPLICANTS } from '../src/data/sampleApplicants.js';
import { ASUSE_REAL_BENCHMARKS } from '../src/data/asuseRealBenchmarks.js';
import { ASUSE_UDYAM_BENCHMARKS } from '../src/data/asuseUdyamBenchmarks.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('=== RUNNING COMPREHENSIVE MSME PLATFORM AUDIT SUITE ===\n');

// 1. Currency and MSME Tier Classification Tests
console.log('Test Suite 1: Currency Formatting & MSME Tier Guardrails');
assert(formatINR(50000) === '₹50,000', 'Formats below 1 Lakh as comma-separated');
assert(formatINR(5000000) === '₹50 Lakhs', 'Formats 50 Lakhs as Lakhs');
assert(formatINR(250000000) === '₹25 Crore', 'Formats 25 Crore as Crore');
assert(formatINR(250000000, { showBoth: true }) === '₹25 Cr (2,500 Lakhs)', 'Formats 25 Crore with dual Cr and Lakhs');
assert(formatINR(2500000000, { showBoth: true }) === '₹250 Cr (25,000 Lakhs)', 'Formats 250 Crore with dual Cr and Lakhs');

assert(getMSMETier(5000000).tier === 'Micro' && getMSMETier(5000000).isMSME === true, '50L is Micro');
assert(getMSMETier(100000000).tier === 'Micro' && getMSMETier(100000000).isMSME === true, '10Cr is Micro');
assert(getMSMETier(250000000).tier === 'Small' && getMSMETier(250000000).isMSME === true, '25Cr is Small');
assert(getMSMETier(1000000000).tier === 'Small' && getMSMETier(1000000000).isMSME === true, '100Cr is Small');
assert(getMSMETier(1500000000).tier === 'Medium' && getMSMETier(1500000000).isMSME === true, '150Cr is Medium');
assert(getMSMETier(2500000000).tier === 'Medium' && getMSMETier(2500000000).isMSME === true, '250Cr is Medium (Max MSME)');
assert(getMSMETier(3000000000).tier === 'Large' && getMSMETier(3000000000).isMSME === false, '300Cr is Large (Ineligible)');
assert(MAX_MSME_TURNOVER === 2500000000, 'MAX_MSME_TURNOVER is 250 Crore');

// 2. ASUSE & Udyam Benchmark Engine Tests
console.log('\nTest Suite 2: ASUSE & Udyam Benchmark Engine');
const sectors = Object.keys(ASUSE_REAL_BENCHMARKS);
assert(sectors.length >= 8, `Has at least 8 ASUSE survey sectors (found ${sectors.length})`);

sectors.forEach(sec => {
  const result = benchmarkMSME({
    annualRevenue: 35000000,
    profitMargin: 15,
    employees: 25,
    debtRatio: 0.25,
    gstScore: 85,
    sector: sec
  });
  assert(result.revenuePercentile >= 10 && result.revenuePercentile <= 99, `${sec}: revenue percentile clamped in [10, 99]`);
  assert(result.marginPercentile >= 10 && result.marginPercentile <= 99, `${sec}: margin percentile clamped in [10, 99]`);
  assert(result.estimatedGvaPerWorker > 0, `${sec}: positive GVA per worker (${result.estimatedGvaPerWorker})`);
  assert(result.productivityIndex > 0, `${sec}: positive productivity index (${result.productivityIndex})`);
});

const microBench = benchmarkMSME({ annualRevenue: 25000000 });
assert(microBench.udyamCategory === 'Micro Enterprise', 'Benchmark correctly identifies Micro Enterprise');
const smallBench = benchmarkMSME({ annualRevenue: 250000000 });
assert(smallBench.udyamCategory === 'Small Enterprise', 'Benchmark correctly identifies Small Enterprise');
const medBench = benchmarkMSME({ annualRevenue: 1500000000 });
assert(medBench.udyamCategory === 'Medium Enterprise', 'Benchmark correctly identifies Medium Enterprise');
const largeBench = benchmarkMSME({ annualRevenue: 3500000000 });
assert(largeBench.udyamCategory.includes('Large Enterprise - Ineligible'), 'Benchmark rejects >250 Cr as Large Enterprise - Ineligible');

// 3. XGBoost Growth Predictor & SHAP Explainer
console.log('\nTest Suite 3: XGBoost Growth Model & Tree SHAP Attributions');
const testEnterprises = [
  { name: 'Micro Weaver', annualRevenue: 1500000, employees: 4, revenueGrowthRate: 15, profitMargin: 12, techLevel: 2, gstScore: 78, debtRatio: 0.2, sector: 'Textiles' },
  { name: 'Small Auto Unit', annualRevenue: 35000000, employees: 28, revenueGrowthRate: 18, profitMargin: 14, techLevel: 3, gstScore: 85, debtRatio: 0.25, sector: 'Manufacturing' },
  { name: 'Medium Pharma', annualRevenue: 1500000000, employees: 180, revenueGrowthRate: 25, profitMargin: 22, techLevel: 5, gstScore: 92, debtRatio: 0.18, sector: 'Manufacturing' }
];

testEnterprises.forEach(ent => {
  const pred = predictMSMEGrowth(ent);
  assert(pred.growthScore >= 0 && pred.growthScore <= 100, `${ent.name}: growth score in [0, 100] (${pred.growthScore})`);
  assert(pred.predictedRevenueGrowth > 0, `${ent.name}: positive revenue growth (+${pred.predictedRevenueGrowth}%)`);
  assert(pred.predictedJobs >= 1, `${ent.name}: predicted new jobs >= 1 (${pred.predictedJobs} jobs)`);
  assert(pred.projectedRevenueAmount > ent.annualRevenue, `${ent.name}: projected revenue > current revenue`);

  const shap = computeSHAPValues(ent);
  assert(shap.shapContributions && shap.shapContributions.length >= 6, `${ent.name}: computed SHAP contributions (${shap.shapContributions.length} contributions)`);
  assert(shap.finalCalculatedScore >= 10 && shap.finalCalculatedScore <= 99, `${ent.name}: SHAP final score in [10, 99] (${shap.finalCalculatedScore})`);
  assert(shap.finalCalculatedScore === pred.growthScore, `${ent.name}: SHAP final score strictly matches model growth score (${shap.finalCalculatedScore} === ${pred.growthScore})`);
});

// 4. Semantic Scheme Matcher
console.log('\nTest Suite 4: Semantic Matching & 5-Point Eligibility Engine');
assert(GOVERNMENT_SCHEMES.length === 24, `Has all 24 statutory MSME schemes (found ${GOVERNMENT_SCHEMES.length})`);

const match1 = matchSchemesForMSME(
  { sector: 'Textiles', annualRevenue: 5000000, employees: 8, techLevel: 2, gstScore: 75 },
  'weaving machine looms textiles small workshop fabric'
);
assert(match1.length === 24, 'All 24 schemes ranked for applicant');
assert(match1[0].semanticScore >= match1[match1.length - 1].semanticScore, 'Schemes correctly ranked in descending relevance');
assert(match1[0].passedChecksCount >= 0 && match1[0].passedChecksCount <= 5, 'Passed checks count in [0, 5]');
assert(match1[0].recommendedSubsidyAmount > 0, 'Generates valid recommended subsidy allocation');

// Check that schemes with maxTurnover < revenue fail turnover check
const highTurnoverMSME = { sector: 'Manufacturing', annualRevenue: 200000000, employees: 50, techLevel: 3, gstScore: 80 };
const matchHigh = matchSchemesForMSME(highTurnoverMSME, 'machinery loan');
const pmegp = matchHigh.find(s => s.id === 'scheme_pmegp'); // maxTurnover 2.5 Cr
assert(pmegp.checks.turnoverMatch === false, 'PMEGP (max 2.5 Cr) correctly fails turnoverMatch for 20 Cr enterprise');

// 5. Knapsack Solver (Layer 2 Optimization)
console.log('\nTest Suite 5: Knapsack Multi-Objective Policy Optimization');
assert(SAMPLE_APPLICANTS.length === 20, `Has 20 sample applicants (found ${SAMPLE_APPLICANTS.length})`);
const budget = 50000000; // ₹5 Crore
const knapsack = optimizeSubsidyBudget(SAMPLE_APPLICANTS, budget, { jobWeight: 0.6, revenueWeight: 0.4, greenBonus: 0.2 });
assert(knapsack.aiAllocation.totalBudgetSpentINR <= budget, `Knapsack respects budget constraint (spent ₹${knapsack.aiAllocation.totalBudgetSpentINR} <= ₹${budget})`);
assert(knapsack.aiAllocation.awardedList.length > 0, `Knapsack selects beneficiaries (${knapsack.aiAllocation.awardedList.length} units)`);
assert(knapsack.aiAllocation.totalRevenueUpliftINR >= knapsack.baselineFCFS.totalRevenueUpliftINR, `AI optimization achieves higher revenue uplift than unoptimized FCFS (₹${knapsack.aiAllocation.totalRevenueUpliftINR} vs ₹${knapsack.baselineFCFS.totalRevenueUpliftINR})`);

// 6. Dataset Completeness
console.log('\nTest Suite 6: Dataset Completeness & Consistency');
assert(REAL_UDYAM_DIRECTORY.length >= 60, `Udyam directory contains at least 60 active units (${REAL_UDYAM_DIRECTORY.length})`);
REAL_UDYAM_DIRECTORY.forEach(u => {
  assert(u.id && u.enterpriseName && u.state && u.district && u.annualRevenue > 0, `Unit ${u.id} has complete metadata and positive revenue`);
});

console.log('\n======================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
