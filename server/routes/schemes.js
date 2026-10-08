import express from 'express';
import { GOVERNMENT_SCHEMES } from '../../src/data/schemes.js';
import { matchSchemesForMSME } from '../../src/engine/semanticMatcher.js';

const router = express.Router();

// GET /api/schemes - Retrieve schemes with optional filters
router.get('/', (req, res) => {
  try {
    const { tier, category, search } = req.query;
    let schemes = [...GOVERNMENT_SCHEMES];

    if (category && category !== 'All') {
      schemes = schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    if (tier && tier !== 'All') {
      if (tier === 'Micro') {
        schemes = schemes.filter(s => s.minTurnover <= 100000000);
      } else if (tier === 'Small') {
        schemes = schemes.filter(s => s.maxTurnover >= 100000000 && s.minTurnover <= 1000000000);
      } else if (tier === 'Medium') {
        schemes = schemes.filter(s => s.maxTurnover >= 1000000000);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      schemes = schemes.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.semanticKeywords.some(k => k.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: schemes.length,
      data: schemes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/schemes/:id - Retrieve single scheme
router.get('/:id', (req, res) => {
  try {
    const scheme = GOVERNMENT_SCHEMES.find(s => s.id === req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found' });
    }
    res.json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/schemes/match - Semantic Scheme Matching
router.post('/match', (req, res) => {
  try {
    const { metrics = {}, requirementText = '' } = req.body;
    const matches = matchSchemesForMSME(metrics, requirementText);
    res.json({
      success: true,
      count: matches.length,
      eligibleCount: matches.filter(s => s.isEligible).length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
