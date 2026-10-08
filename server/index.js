import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import applicationsRouter from './routes/applications.js';
import optimizationRouter from './routes/optimization.js';
import schemesRouter from './routes/schemes.js';
import benchmarksRouter from './routes/benchmarks.js';
import predictRouter from './routes/predict.js';
import { getStats } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distPath = path.resolve(projectRoot, 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development / Diagnostics)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (req.path.startsWith('/api')) {
      const duration = Date.now() - start;
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// REST API Route Mounts
app.use('/api/applications', applicationsRouter);
app.use('/api/optimize', optimizationRouter);
app.use('/api/schemes', schemesRouter);
app.use('/api/benchmarks', benchmarksRouter);
app.use('/api/predict', predictRouter);

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  try {
    const stats = getStats();
    res.json({
      status: 'ONLINE',
      system: 'MSME Growth Advisory & Subsidy Optimization Platform',
      version: '2.0.0',
      statutoryFramework: 'Gazette Notification S.O. 1364(E) & S.O. 2119(E)',
      datasets: {
        asuse: 'MoSPI ASUSE 2023-24 (5.2 Lakh Units)',
        udyam: 'Ministry of MSME Live Registry (70,929 Units)',
        pmegp: 'KVIC / Data.gov.in (35 States/UTs, 2021-2025)'
      },
      stats,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// Serve frontend static build if dist exists
if (fs.existsSync(distPath)) {
  console.log(`[STATIC] Serving compiled React bundle from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for client-side routing (Express 5 compatible)
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'API route not found' });
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  console.warn(`[WARN] dist directory not found. Run 'npm run build' to bundle the frontend.`);
  app.get('/', (req, res) => {
    res.send(`
      <h1>MSME Platform Backend Server</h1>
      <p>Backend REST API is running successfully on port ${PORT}.</p>
      <p>Please run <code>npm run build</code> in the root folder to serve the frontend.</p>
      <p><a href="/api/health">Check /api/health</a> | <a href="/api/applications">View /api/applications</a></p>
    `);
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🏛️  MSME DUAL-LAYER PLATFORM PRODUCTION SERVER ONLINE`);
  console.log(`📡 Local Server URL:  http://localhost:${PORT}`);
  console.log(`📊 Health Check:     http://localhost:${PORT}/api/health`);
  console.log(`📋 Applications API: http://localhost:${PORT}/api/applications`);
  console.log(`🎯 Knapsack API:     http://localhost:${PORT}/api/optimize`);
  console.log(`============================================================\n`);
});

export default app;
