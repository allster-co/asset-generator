/**
 * Asset Generator - Express Server
 * 
 * Provides health check endpoint for Render deployment.
 * The actual work is done by the worker process (worker.ts).
 */

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'asset-generator',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    service: 'asset-generator',
    description: 'Award asset rendering service',
    endpoints: {
      health: '/health',
    },
  });
});

app.listen(PORT, () => {
  console.log(`[asset-generator] Server running on port ${PORT}`);
});
