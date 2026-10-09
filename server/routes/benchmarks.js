import express from 'express';
import { ASUSE_UDYAM_BENCHMARKS } from '../../src/data/asuseUdyamBenchmarks.js';
import { benchmarkMSME } from '../../src/engine/benchmarkEngine.js';

const router = express.Router();

// GET /api/benchmarks - Get official ASUSE survey sector benchmarks
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: ASUSE_UDYAM_BENCHMARKS
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/benchmarks/sectors - Get sector benchmarks map
router.get('/sectors', (req, res) => {
  try {
    res.json({
      success: true,
      data: ASUSE_UDYAM_BENCHMARKS.sectorBenchmarks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/benchmarks/metadata - Get benchmark metadata
router.get('/metadata', (req, res) => {
  try {
    res.json({
      success: true,
      data: ASUSE_UDYAM_BENCHMARKS.metadata
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/benchmarks/evaluate - Evaluate enterprise against national benchmarks
router.post('/evaluate', (req, res) => {
  try {
    const metrics = req.body || {};
    const evaluation = benchmarkMSME(metrics);
    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
