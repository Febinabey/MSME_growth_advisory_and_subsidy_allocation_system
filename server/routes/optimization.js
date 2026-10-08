import express from 'express';
import { getAllApplications, updateApplicationStatus } from '../db.js';
import { optimizeSubsidyBudget } from '../../src/engine/knapsackSolver.js';

const router = express.Router();

// POST /api/optimize - Execute Multiple-Choice Knapsack optimization
router.post('/', (req, res) => {
  try {
    const { 
      budgetINR = 25000000, 
      policyWeights = { jobWeight: 0.5, revenueWeight: 0.5, greenBonus: 0.2 },
      sectorFilter = 'All',
      stateFilter = 'All',
      applyDecisions = false
    } = req.body;

    // Fetch active applications from database
    const rawApplications = getAllApplications({
      sector: sectorFilter,
      state: stateFilter
    });

    // Map database fields to Knapsack solver format
    const normalizedApplicants = rawApplications.map(app => ({
      id: app.id,
      name: app.name || app.enterprise_name,
      enterpriseName: app.enterprise_name || app.name,
      state: app.state,
      district: app.district,
      pincode: app.pincode,
      sector: app.sector,
      annualRevenue: Number(app.annual_revenue) || 0,
      revenueGrowthRate: Number(app.revenue_growth_rate) || 15,
      employees: Number(app.employees) || 10,
      debtRatio: Number(app.debt_ratio) || 0.25,
      profitMargin: Number(app.profit_margin) || 12,
      techLevel: Number(app.tech_level) || 3,
      gstScore: Number(app.gst_score) || 75,
      exportShare: Number(app.export_share) || 0,
      requestedScheme: app.requested_scheme || 'PMEGP Subsidy',
      requestedSubsidy: Number(app.requested_subsidy) || 1000000
    }));

    if (normalizedApplicants.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No active applicants found in the queue matching the specified filters.'
      });
    }

    const optimizationResult = optimizeSubsidyBudget(
      normalizedApplicants,
      Number(budgetINR),
      policyWeights
    );

    // If requested, persist disbursal status updates to the database
    if (applyDecisions) {
      optimizationResult.aiAllocation.awardedList.forEach(item => {
        updateApplicationStatus(item.id, 'AWARDED_AI_KNAPSACK');
      });
      optimizationResult.aiAllocation.rejectedList.forEach(item => {
        updateApplicationStatus(item.id, 'QUEUED_BUDGET_EXCEEDED');
      });
    }

    res.json({
      success: true,
      data: {
        totalApplicantsEvaluated: normalizedApplicants.length,
        ...optimizationResult
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
