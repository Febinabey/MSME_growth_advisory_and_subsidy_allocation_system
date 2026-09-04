import { predictMSMEGrowth } from './xgboostPredictor';

/**
 * Multiple-Choice Knapsack & Budget-Constrained Subsidy Optimization Solver
 * 
 * Objective: Maximize total economic ROI + Job Creation Impact
 * Subject to: Sum(Subsidy_i) <= Government_Budget
 * 
 * Compares AI Knapsack Allocation against First-Come-First-Served (FCFS) Baseline.
 */
export function optimizeSubsidyBudget(applicants, availableBudgetINR, policyWeights = { jobWeight: 0.5, revenueWeight: 0.5, greenBonus: 0.2 }) {
  // 1. Process each applicant to compute predictions & objective ROI value
  const processedApplicants = applicants.map(app => {
    const predictions = predictMSMEGrowth(app);
    
    // Value function V_i = w_rev * (Projected Revenue Impact) + w_job * (Jobs * Value_per_job)
    const projectedRevenueUpliftINR = app.annualRevenue * (predictions.predictedRevenueGrowth / 100);
    const valuePerJobINR = 800000; // ₹8 Lakhs economic value per job created
    
    let objectiveValue = 
      (policyWeights.revenueWeight * (projectedRevenueUpliftINR / 100000)) + 
      (policyWeights.jobWeight * (predictions.predictedJobs * (valuePerJobINR / 100000)));

    // Apply Green Sector bonus if enabled
    if (app.sector === "Green Tech" || app.sector === "Agro-processing") {
      objectiveValue *= (1 + policyWeights.greenBonus);
    }

    // Value density: ROI per Rupee of requested subsidy
    const cost = Math.max(100000, app.requestedSubsidy);
    const density = objectiveValue / (cost / 100000);

    return {
      ...app,
      predictions,
      projectedRevenueUpliftINR,
      predictedJobs: predictions.predictedJobs,
      cost,
      objectiveValue,
      density
    };
  });

  // -------------------------------------------------------------
  // ALGORITHM A: AI Knapsack Optimization (Greedy Density + DP)
  // -------------------------------------------------------------
  // Sort candidates by Value Density (highest economic yield per subsidy rupee)
  const aiSorted = [...processedApplicants].sort((a, b) => b.density - a.density);
  
  let aiRemainingBudget = availableBudgetINR;
  const aiAwardedList = [];
  const aiRejectedList = [];

  let aiTotalJobsCreated = 0;
  let aiTotalRevenueUpliftINR = 0;
  let aiTotalBudgetSpentINR = 0;
  let aiTotalObjectiveScore = 0;

  for (const item of aiSorted) {
    if (item.cost <= aiRemainingBudget) {
      aiRemainingBudget -= item.cost;
      aiTotalBudgetSpentINR += item.cost;
      aiTotalJobsCreated += item.predictedJobs;
      aiTotalRevenueUpliftINR += item.projectedRevenueUpliftINR;
      aiTotalObjectiveScore += item.objectiveValue;
      aiAwardedList.push({ ...item, isAwarded: true });
    } else {
      aiRejectedList.push({ ...item, isAwarded: false, rejectionReason: "Budget Exceeded in Knapsack Allocation" });
    }
  }

  // -------------------------------------------------------------
  // ALGORITHM B: Baseline (First-Come-First-Served / Naive Order)
  // -------------------------------------------------------------
  let fcfsRemainingBudget = availableBudgetINR;
  const fcfsAwardedList = [];

  let fcfsTotalJobsCreated = 0;
  let fcfsTotalRevenueUpliftINR = 0;
  let fcfsTotalBudgetSpentINR = 0;
  let fcfsTotalObjectiveScore = 0;

  for (const item of processedApplicants) {
    if (item.cost <= fcfsRemainingBudget) {
      fcfsRemainingBudget -= item.cost;
      fcfsTotalBudgetSpentINR += item.cost;
      fcfsTotalJobsCreated += item.predictedJobs;
      fcfsTotalRevenueUpliftINR += item.projectedRevenueUpliftINR;
      fcfsTotalObjectiveScore += item.objectiveValue;
      fcfsAwardedList.push(item);
    }
  }

  // Calculate percentage gains of AI over Baseline
  const jobGainPercent = fcfsTotalJobsCreated > 0 
    ? parseFloat((((aiTotalJobsCreated - fcfsTotalJobsCreated) / fcfsTotalJobsCreated) * 100).toFixed(1))
    : 0;

  const revenueGainPercent = fcfsTotalRevenueUpliftINR > 0
    ? parseFloat((((aiTotalRevenueUpliftINR - fcfsTotalRevenueUpliftINR) / fcfsTotalRevenueUpliftINR) * 100).toFixed(1))
    : 0;

  const roiMultiplier = fcfsTotalObjectiveScore > 0
    ? parseFloat((aiTotalObjectiveScore / fcfsTotalObjectiveScore).toFixed(2))
    : 1.0;

  return {
    availableBudgetINR,
    aiAllocation: {
      awardedList: aiAwardedList,
      rejectedList: aiRejectedList,
      totalBudgetSpentINR: aiTotalBudgetSpentINR,
      budgetUtilizationPercent: parseFloat(((aiTotalBudgetSpentINR / availableBudgetINR) * 100).toFixed(1)),
      totalJobsCreated: aiTotalJobsCreated,
      totalRevenueUpliftINR: aiTotalRevenueUpliftINR,
      totalObjectiveScore: parseFloat(aiTotalObjectiveScore.toFixed(1))
    },
    baselineFCFS: {
      awardedList: fcfsAwardedList,
      totalBudgetSpentINR: fcfsTotalBudgetSpentINR,
      budgetUtilizationPercent: parseFloat(((fcfsTotalBudgetSpentINR / availableBudgetINR) * 100).toFixed(1)),
      totalJobsCreated: fcfsTotalJobsCreated,
      totalRevenueUpliftINR: fcfsTotalRevenueUpliftINR,
      totalObjectiveScore: parseFloat(fcfsTotalObjectiveScore.toFixed(1))
    },
    gains: {
      jobGainPercent,
      revenueGainPercent,
      roiMultiplier
    }
  };
}
