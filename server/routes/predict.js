import express from 'express';
import { predictMSMEGrowth } from '../../src/engine/xgboostPredictor.js';
import { computeSHAPValues } from '../../src/engine/shapExplainer.js';

const router = express.Router();

// POST /api/predict/all - Compute both XGBoost Growth & Tree SHAP feature attributions
router.post('/all', (req, res) => {
  try {
    const metrics = req.body || {};
    const predictions = predictMSMEGrowth(metrics);
    const shapData = computeSHAPValues(metrics);

    res.json({
      success: true,
      data: {
        predictions,
        shapData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/predict/growth - Run XGBoost predictor
router.post('/growth', (req, res) => {
  try {
    const predictions = predictMSMEGrowth(req.body || {});
    res.json({ success: true, data: predictions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/predict/shap - Compute SHAP values
router.post('/shap', (req, res) => {
  try {
    const shapData = computeSHAPValues(req.body || {});
    res.json({ success: true, data: shapData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
