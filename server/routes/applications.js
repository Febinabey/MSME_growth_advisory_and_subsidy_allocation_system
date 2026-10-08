import express from 'express';
import { getAllApplications, getApplicationById, createApplication, updateApplicationStatus, getStats } from '../db.js';
import { predictMSMEGrowth } from '../../src/engine/xgboostPredictor.js';
import { getMSMETier, MAX_MSME_TURNOVER } from '../../src/utils/formatCurrency.js';

const router = express.Router();

// GET /api/applications - List all applications
router.get('/', (req, res) => {
  try {
    const { sector, state, status, limit } = req.query;
    const applications = getAllApplications({ sector, state, status, limit });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/applications/stats/summary - Summary stats
router.get('/stats/summary', (req, res) => {
  try {
    const stats = getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/applications/:id - Single application
router.get('/:id', (req, res) => {
  try {
    const app = getApplicationById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: app });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/applications - Submit an official application
router.post('/', (req, res) => {
  try {
    const body = req.body;

    if (!body.enterpriseName && !body.name) {
      return res.status(400).json({ success: false, error: 'Enterprise name is required' });
    }

    const annualRevenue = Number(body.annualRevenue) || 0;
    const tier = getMSMETier(annualRevenue);

    // Statutory MSME check: Exceeding statutory ceiling (> ₹250 Cr) cannot apply for MSME subsidies
    if (!tier.isMSME) {
      return res.status(403).json({
        success: false,
        error: `Ineligible: Enterprise turnover (${annualRevenue}) exceeds statutory MSME threshold (> ₹250 Crore). Large enterprises are legally excluded from MSME subsidies.`
      });
    }

    // Run XGBoost prediction if predictions not passed
    const predictions = predictMSMEGrowth({
      annualRevenue,
      revenueGrowthRate: Number(body.revenueGrowthRate) || 15,
      employees: Number(body.employees) || 10,
      debtRatio: Number(body.debtRatio) || 0.25,
      profitMargin: Number(body.profitMargin) || 12,
      techLevel: Number(body.techLevel) || 3,
      gstScore: Number(body.gstScore) || 75,
      exportShare: Number(body.exportShare) || 0,
      sector: body.sector || 'Manufacturing'
    });

    const newApp = createApplication({
      ...body,
      growthScore: body.growthScore || predictions.growthScore,
      growthTier: body.growthTier || predictions.tier,
      predictedJobs: body.predictedJobs || predictions.predictedJobs,
      projectedRevenue: body.projectedRevenue || predictions.projectedRevenueAmount
    });

    res.status(201).json({
      success: true,
      message: 'Application officially submitted and registered in national queue',
      data: newApp
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/applications/:id/status - Update application status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }
    const updated = updateApplicationStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
