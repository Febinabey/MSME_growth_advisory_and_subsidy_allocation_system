import { ASUSE_UDYAM_BENCHMARKS } from '../data/asuseUdyamBenchmarks.js';
import { MAX_MSME_TURNOVER, MAX_MSME_INVESTMENT } from '../utils/formatCurrency.js';

/**
 * ASUSE & Udyam Benchmark Engine
 * Evaluates enterprise metrics against national survey averages to output:
 * - Revenue Percentile vs Sector
 * - Profit Margin Percentile
 * - Productivity (GVA per worker index)
 * - Credit Gap Risk Index
 * - Gazette Composite Enterprise Tier
 */
export function benchmarkMSME(metrics) {
  const {
    annualRevenue = 20000000,
    profitMargin = 12,
    employees = 20,
    debtRatio = 0.25,
    gstScore = 80,
    sector = "Manufacturing"
  } = metrics;

  const machineryInvestment = Number(metrics.machineryInvestment || metrics.investmentPlantMachinery) || 0;

  const sLookup = (sector || '').toLowerCase();
  let benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks[sector];
  if (!benchmark) {
    if (sLookup.includes('food') || sLookup.includes('agro')) {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Manufacturing - Food & Agro"];
    } else if (sLookup.includes('textil') || sLookup.includes('apparel')) {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Manufacturing - Textiles & Apparel"];
    } else if (sLookup.includes('it') || sLookup.includes('software') || sLookup.includes('digital')) {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["IT & Technology Services"];
    } else if (sLookup.includes('service') || sLookup.includes('trade') || sLookup.includes('retail') || sLookup.includes('wholesale')) {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Retail & Wholesale Trade"];
    } else if (sLookup.includes('logistics') || sLookup.includes('transport')) {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Logistics & Transportation"];
    } else if (sLookup.includes('pharma') || sLookup.includes('health')) {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Healthcare & Pharmaceuticals"];
    } else if (sLookup.includes('chemical') || sLookup.includes('plastic')) {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Manufacturing - Chemicals & Plastics"];
    } else {
      benchmark = ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Manufacturing - Metals & Engineering"] || Object.values(ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks)[0];
    }
  }

  // 1. Revenue Percentile Estimation
  const revRatio = annualRevenue / benchmark.avgRevenue;
  let revenuePercentile = Math.min(99, Math.round(50 + (revRatio - 1) * 25));
  revenuePercentile = Math.max(10, revenuePercentile);

  // 2. Profit Margin Percentile Estimation
  const marginDiff = profitMargin - benchmark.avgProfitMargin;
  let marginPercentile = Math.min(99, Math.round(50 + marginDiff * 4));
  marginPercentile = Math.max(10, marginPercentile);

  // 3. Labor Productivity: Estimated GVA per worker
  const estimatedGvaPerWorker = Math.round((annualRevenue * (profitMargin / 100 + 0.15)) / Math.max(1, employees));
  const productivityIndex = parseFloat((estimatedGvaPerWorker / benchmark.avgGvaPerWorker).toFixed(2));

  // 4. Enterprise Size Classification under Gazette Composite Framework (S.O. 2119(E))
  let udyamCategory = "Micro Enterprise";
  if (annualRevenue > MAX_MSME_TURNOVER || machineryInvestment > MAX_MSME_INVESTMENT) {
    udyamCategory = "Exceeds MSME Threshold (Large Enterprise - Ineligible)";
  } else if (annualRevenue > 1000000000 || machineryInvestment > 250000000) {
    udyamCategory = "Medium Enterprise";
  } else if (annualRevenue > 100000000 || machineryInvestment > 25000000) {
    udyamCategory = "Small Enterprise";
  }

  // 5. Credit Vulnerability Index
  let creditVulnerability = "Low Vulnerability";
  if (debtRatio > benchmark.avgDebtRatio * 1.3 || gstScore < benchmark.avgGstScore - 15) {
    creditVulnerability = "High Vulnerability";
  } else if (debtRatio > benchmark.avgDebtRatio || gstScore < benchmark.avgGstScore) {
    creditVulnerability = "Moderate Vulnerability";
  }

  return {
    sector,
    udyamCategory,
    revenuePercentile,
    marginPercentile,
    estimatedGvaPerWorker,
    nationalAvgGvaPerWorker: benchmark.avgGvaPerWorker,
    productivityIndex,
    creditVulnerability,
    benchmarkAvgRevenue: benchmark.avgRevenue,
    benchmarkAvgMargin: benchmark.avgProfitMargin,
    benchmarkAvgGstScore: benchmark.avgGstScore,
    asuseSurveyPeriod: ASUSE_UDYAM_BENCHMARKS.metadata.asuseSurveyPeriod
  };
}
