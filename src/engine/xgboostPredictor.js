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
  // Larger teams & higher growth score create more new jobs
  const baseJobMultiplier = growthScore >= 75 ? 0.25 : growthScore >= 50 ? 0.15 : 0.05;
  const predictedJobs = Math.max(1, Math.round(employees * baseJobMultiplier + (annualRevenue / 10000000) * 0.8));

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
