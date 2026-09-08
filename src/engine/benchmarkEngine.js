import { ASUSE_UDYAM_BENCHMARKS } from '../data/asuseUdyamBenchmarks';

/**
 * ASUSE & Udyam Benchmark Engine
 * Evaluates enterprise metrics against national survey averages to output:
 * - Revenue Percentile vs Sector
 * - Profit Margin Percentile
 * - Productivity (GVA per worker index)
 * - Credit Gap Risk Index
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

  const benchmark = 
    ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks[sector] || 
    ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Manufacturing - Metals & Engineering"] ||
    ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks["Manufacturing"] ||
    Object.values(ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks)[0];

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

  // 4. Enterprise Size Classification under April 2025/2026 Gazette Revision
  let udyamCategory = "Micro Enterprise";
  if (annualRevenue > 100000000 && annualRevenue <= 1000000000) {
    udyamCategory = "Small Enterprise";
  } else if (annualRevenue > 1000000000) {
    udyamCategory = "Medium Enterprise";
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
