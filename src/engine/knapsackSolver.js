import { predictMSMEGrowth } from './xgboostPredictor.js';
import { getPmegpStateContext, PMEGP_NATIONAL_BENCHMARK } from '../data/pmegpData.js';

/**
 * Multiple-Choice Knapsack & Budget-Constrained Subsidy Optimization Solver
 * 
 * Objective: Maximize total economic ROI + Job Creation Impact
 * Subject to: Sum(Subsidy_i) <= Government_Budget
 * 
 * Uses Min-Max Standardized Multi-Objective Density:
 * - S_job = (JobIntensity_i - min) / (max - min)
 * - S_rev = (RevenueROI_i - min) / (max - min)
 * - Density_i = (w_job * S_job + w_rev * S_rev) * (1 + GreenBonus)
 * 
 * Compares AI Knapsack Allocation against First-Come-First-Served (FCFS) Baseline.
 */
export function optimizeSubsidyBudget(applicants, availableBudgetINR, policyWeights = { jobWeight: 0.5, revenueWeight: 0.5, greenBonus: 0.0 }) {
  if (!applicants || applicants.length === 0) {
    return {
      availableBudgetINR,
      aiAllocation: {
        awardedList: [],
        rejectedList: [],
        totalBudgetSpentINR: 0,
        budgetUtilizationPercent: 0,
        totalJobsCreated: 0,
        totalRevenueUpliftINR: 0,
        totalObjectiveScore: 0
      },
      baselineFCFS: {
        awardedList: [],
        totalBudgetSpentINR: 0,
        budgetUtilizationPercent: 0,
        totalJobsCreated: 0,
        totalRevenueUpliftINR: 0,
        totalObjectiveScore: 0
      },
      gains: {
        jobGainPercent: 0,
        revenueGainPercent: 0,
        roiMultiplier: 1.0
      },
      pmegpSummary: {
        datasetSource: 'Ministry of MSME / KVIC via Data.gov.in',
        trainingPeriod: '2021-22 to 2024-25',
        provisionalPeriod: '2025-26 (as of 10-02-2026)',
        totalProjectsAssistedHistorical: PMEGP_NATIONAL_BENCHMARK.totalProjectsAssisted,
        totalEmploymentGeneratedHistorical: PMEGP_NATIONAL_BENCHMARK.totalEmploymentEstimated,
        averageEmploymentPerProjectHistorical: PMEGP_NATIONAL_BENCHMARK.nationalAvgEmploymentPerProject,
        dataIntegrityNote: 'PMEGP figures reflect regional programme statistics, not individual enterprise performance.'
      }
    };
  }

  // 1. Process each applicant to compute predictions & economic yields
  const processedApplicants = applicants.map(app => {
    const cost = Math.max(100000, Number(app.requestedSubsidy || app.requested_subsidy) || 1000000);
    const predictions = predictMSMEGrowth({
      ...app,
      requestedSubsidy: cost
    });
    const pmegpContext = getPmegpStateContext(app.state);
    
    const annualRevenue = Number(app.annualRevenue || app.annual_revenue) || 0;
    const projectedRevenueUpliftINR = annualRevenue * (predictions.predictedRevenueGrowth / 100);
    const predictedJobs = predictions.predictedJobs;

    // Unit-level marginal efficiency metrics
    const jobIntensity = predictedJobs / (cost / 100000); // Employment addition per Lakh subsidy
    const revROI = projectedRevenueUpliftINR / cost;      // Revenue uplift per rupee subsidy

    return {
      ...app,
      predictions,
      pmegpContext,
      projectedRevenueUpliftINR,
      predictedJobs,
      cost,
      jobIntensity,
      revROI
    };
  });

  // 2. Standardize multi-objective scores across the applicant cohort (Min-Max Scaling)
  const minJob = Math.min(...processedApplicants.map(p => p.jobIntensity));
  const maxJob = Math.max(...processedApplicants.map(p => p.jobIntensity));
  const minRev = Math.min(...processedApplicants.map(p => p.revROI));
  const maxRev = Math.max(...processedApplicants.map(p => p.revROI));

  const jobRange = (maxJob - minJob) || 1;
  const revRange = (maxRev - minRev) || 1;

  const jobWeight = Number(policyWeights.jobWeight ?? 0.5);
  const revenueWeight = Number(policyWeights.revenueWeight ?? 0.5);
  const greenBonus = Number(policyWeights.greenBonus ?? 0.0);

  const scoredApplicants = processedApplicants.map(app => {
    const sJob = (app.jobIntensity - minJob) / jobRange;
    const sRev = (app.revROI - minRev) / revRange;

    // Apply Green Sector bonus if enabled (MoSPI green / agro / clean tech priority)
    const secLower = (app.sector || '').toLowerCase();
    const isGreen = secLower.includes('green') || secLower.includes('agro') || secLower.includes('food') || secLower.includes('solar') || secLower.includes('clean');
    const greenMultiplier = isGreen ? (1 + greenBonus) : 1.0;

    const baseDensity = (jobWeight * sJob) + (revenueWeight * sRev);
    const density = (baseDensity + 0.05) * greenMultiplier;
    const objectiveValue = density * (app.cost / 100000);

    return {
      ...app,
      density,
      objectiveValue
    };
  });

  // -------------------------------------------------------------
  // ALGORITHM A: AI Knapsack Optimization (Greedy Density)
  // -------------------------------------------------------------
  // Sort candidates by Value Density (highest economic yield per subsidy rupee)
  const aiSorted = [...scoredApplicants].sort((a, b) => b.density - a.density);
  
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

  for (const item of scoredApplicants) {
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
      budgetUtilizationPercent: availableBudgetINR > 0 ? parseFloat(((aiTotalBudgetSpentINR / availableBudgetINR) * 100).toFixed(1)) : 0,
      totalJobsCreated: aiTotalJobsCreated,
      totalRevenueUpliftINR: aiTotalRevenueUpliftINR,
      totalObjectiveScore: parseFloat(aiTotalObjectiveScore.toFixed(1))
    },
    baselineFCFS: {
      awardedList: fcfsAwardedList,
      totalBudgetSpentINR: fcfsTotalBudgetSpentINR,
      budgetUtilizationPercent: availableBudgetINR > 0 ? parseFloat(((fcfsTotalBudgetSpentINR / availableBudgetINR) * 100).toFixed(1)) : 0,
      totalJobsCreated: fcfsTotalJobsCreated,
      totalRevenueUpliftINR: fcfsTotalRevenueUpliftINR,
      totalObjectiveScore: parseFloat(fcfsTotalObjectiveScore.toFixed(1))
    },
    gains: {
      jobGainPercent,
      revenueGainPercent,
      roiMultiplier
    },
    pmegpSummary: {
      datasetSource: 'Ministry of MSME / KVIC via Data.gov.in',
      trainingPeriod: '2021-22 to 2024-25',
      provisionalPeriod: '2025-26 (as of 10-02-2026)',
      totalProjectsAssistedHistorical: PMEGP_NATIONAL_BENCHMARK.totalProjectsAssisted,
      totalEmploymentGeneratedHistorical: PMEGP_NATIONAL_BENCHMARK.totalEmploymentEstimated,
      averageEmploymentPerProjectHistorical: PMEGP_NATIONAL_BENCHMARK.nationalAvgEmploymentPerProject,
      dataIntegrityNote: 'PMEGP figures reflect regional programme statistics, not individual enterprise performance.'
    }
  };
}
