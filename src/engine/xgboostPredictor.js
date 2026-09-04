/**
 * Simulated XGBoost Gradient Boosted Decision Tree Predictor
 * Inputs enterprise financial & operational metrics to output:
 * - Growth Score (0-100)
 * - Growth Tier ("High Growth", "Moderate Growth", "Low/Stable Growth")
 * - Predicted 1-Year Revenue Growth Rate (%)
 * - Predicted Job Creation Potential (Number of new jobs)
 * - Risk Assessment
 */

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

  // Base ensemble model decision tree weightings
  let score = 50; // Base baseline score

  // Feature 1: Historical Revenue Growth Rate (Weight ~ 0.25)
  if (revenueGrowthRate > 25) score += 18;
  else if (revenueGrowthRate > 15) score += 12;
  else if (revenueGrowthRate > 8) score += 6;
  else if (revenueGrowthRate < 0) score -= 15;

  // Feature 2: Profit Margin (Weight ~ 0.20)
  if (profitMargin > 20) score += 15;
  else if (profitMargin > 12) score += 10;
  else if (profitMargin > 6) score += 4;
  else score -= 10;

  // Feature 3: Debt-to-Revenue Ratio (Weight ~ 0.15 - Negative factor if high)
  if (debtRatio < 0.15) score += 10;
  else if (debtRatio < 0.30) score += 5;
  else if (debtRatio > 0.50) score -= 14;

  // Feature 4: Technology Adoption Level (Weight ~ 0.15)
  score += (techLevel - 3) * 4.5;

  // Feature 5: GST Compliance Score (Weight ~ 0.10)
  score += (gstScore - 70) * 0.25;

  // Feature 6: Export Share (Weight ~ 0.10)
  if (exportShare > 30) score += 8;
  else if (exportShare > 10) score += 4;

  // Feature 7: Sector Bonus multiplier
  const sectorMultipliers = {
    "IT Services": 1.08,
    "Green Tech": 1.10,
    "Electronics": 1.06,
    "Manufacturing": 1.02,
    "Agro-processing": 1.00,
    "Textiles": 0.96
  };
  
  score = score * (sectorMultipliers[sector] || 1.0);

  // Clamp score between 10 and 99
  const growthScore = Math.max(10, Math.min(99, Math.round(score)));

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
