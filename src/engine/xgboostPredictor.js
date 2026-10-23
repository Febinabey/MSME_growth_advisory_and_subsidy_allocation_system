/**
 * Simulated XGBoost Gradient Boosted Decision Tree Predictor
 * Inputs enterprise financial & operational metrics to output:
 * - Growth Score (0-100)
 * - Growth Tier ("High Growth", "Moderate Growth", "Low/Stable Growth")
 * - Predicted 1-Year Revenue Growth Rate (%)
 * - Predicted Job Creation Potential (Number of new jobs)
 * - Risk Assessment
 */

import { computeSHAPValues } from './shapExplainer.js';

export function predictMSMEGrowth(metrics) {
  const {
    annualRevenue = 20000000, // ₹2 Cr default
    revenueGrowthRate = 15,   // 15% YoY
    employees = 20,
    debtRatio = 0.25,         // 25% debt/revenue
    profitMargin = 12,        // 12% net margin
    techLevel = 3,            // 1-5 level
    gstScore = 80,            // 0-100 score
    exportShare = 10,         // 10% exports
    sector = "Manufacturing"
  } = metrics;

  // Unify with Tree SHAP explainer to strictly guarantee Lundberg & Lee Additivity Axiom:
  // Growth Score === Base Score + sum(SHAP contributions)
  const shapData = computeSHAPValues(metrics);
  const growthScore = shapData.finalCalculatedScore;

  // Determine Growth Tier
  let tier = "Moderate Growth";
  let tierColor = "amber";
  if (growthScore >= 75) {
    tier = "High Growth";
    tierColor = "emerald";
  } else if (growthScore < 50) {
    tier = "Low Growth";
    tierColor = "rose";
  }

  // Predict 1-Year Projected Revenue Growth Rate (%)
  const predictedRevenueGrowth = parseFloat((revenueGrowthRate * 0.4 + growthScore * 0.25 + techLevel * 2).toFixed(1));

  // Predict Job Creation Potential
  // Sector employment elasticity (MoSPI ASUSE 2023-24 & KVIC PMEGP benchmarks)
  let sectorJobMult = 1.0;
  const sLower = (sector || '').toLowerCase();
  if (sLower.includes('textile') || sLower.includes('apparel') || sLower.includes('handloom') || sLower.includes('craft') || sLower.includes('garment')) {
    sectorJobMult = 2.4; // High labor elasticity
  } else if (sLower.includes('food') || sLower.includes('agro')) {
    sectorJobMult = 1.8; // Rural agro-processing labor elasticity
  } else if (sLower.includes('trade') || sLower.includes('retail') || sLower.includes('service') || sLower.includes('tour') || sLower.includes('transport') || sLower.includes('logistics')) {
    sectorJobMult = 1.1; // Moderate service multiplier
  } else if (sLower.includes('metal') || sLower.includes('engineering') || sLower.includes('construction')) {
    sectorJobMult = 0.65; // Capital & automated machinery intensive
  } else if (sLower.includes('green') || sLower.includes('solar') || sLower.includes('clean') || sLower.includes('pharma') || sLower.includes('tech')) {
    sectorJobMult = 0.75; // Tech capital intensive
  }

  const growthFactor = growthScore >= 75 ? 0.35 : growthScore >= 50 ? 0.22 : 0.12;
  const workforceGrowth = employees * growthFactor * sectorJobMult;

  // Capital subsidy enablement: micro units generate jobs efficiently for modest subsidy (PMEGP benchmark ~8 jobs/unit)
  const subsidyLakhs = (Number(metrics.requestedSubsidy || metrics.requested_subsidy) || 1000000) / 100000;
  const subsidyJobRate = (sLower.includes('textile') || sLower.includes('food') || sLower.includes('agro') || sLower.includes('craft'))
    ? 0.45
    : (sLower.includes('trade') || sLower.includes('retail') || sLower.includes('service') || sLower.includes('logistics'))
    ? 0.25
    : 0.15;

  const subsidyJobs = subsidyLakhs * subsidyJobRate;
  const predictedJobs = Math.max(1, Math.round(workforceGrowth + subsidyJobs));

  // Projected 1-Year Revenue Amount
  const projectedRevenueAmount = Math.round(annualRevenue * (1 + predictedRevenueGrowth / 100));

  // Risk Rating
  let riskLevel = "Low Risk";
  if (debtRatio > 0.45 || gstScore < 60) riskLevel = "High Risk";
  else if (debtRatio > 0.30 || gstScore < 75) riskLevel = "Medium Risk";

  return {
    growthScore,
    tier,
    tierColor,
    predictedRevenueGrowth,
    predictedJobs,
    projectedRevenueAmount,
    riskLevel
  };
}
