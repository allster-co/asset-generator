/**
 * Asset Renderer - Stateless Rendering Service
 * 
 * HTTP API for rendering React templates to PNG/PDF.
 * No database, no queues, no storage - just rendering.
 */

import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from './middleware/auth';
import { render, closeBrowser, RenderValidationError } from './renderer';
import { RenderRequest, ApiError } from './types';

// Load version from package.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json') as { version: string };

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Health check - no auth required
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    version: packageJson.version,
    service: 'asset-renderer',
  });
});

// Root endpoint - service info
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'asset-renderer',
    version: packageJson.version,
    description: 'Stateless rendering service for React templates',
    endpoints: {
      health: 'GET /health',
      render: 'POST /render (requires auth)',
    },
  });
});

// Render endpoint - requires auth
app.post('/render', authMiddleware, async (req: Request, res: Response) => {
  const requestId = uuidv4();
  
  try {
    // Validate request body
    const body = req.body as Partial<RenderRequest>;
    
    if (!body.templateKey) {
      return res.status(400).json({
        error: 'invalid_request',
        message: 'Missing required field: templateKey',
      } as ApiError);
    }
    
    if (body.templateVersion === undefined || typeof body.templateVersion !== 'number') {
      return res.status(400).json({
        error: 'invalid_request',
        message: 'Missing or invalid field: templateVersion (must be a number)',
      } as ApiError);
    }
    
    if (!body.format || !['PNG', 'PDF'].includes(body.format)) {
      return res.status(400).json({
        error: 'invalid_request',
        message: 'Missing or invalid field: format (must be PNG or PDF)',
      } as ApiError);
    }
    
    if (!body.variant) {
      return res.status(400).json({
        error: 'invalid_request',
        message: 'Missing required field: variant',
      } as ApiError);
    }
    
    if (!body.payload || typeof body.payload !== 'object') {
      return res.status(400).json({
        error: 'invalid_request',
        message: 'Missing or invalid field: payload (must be an object)',
      } as ApiError);
    }

    const renderRequest: RenderRequest = {
      templateKey: body.templateKey,
      templateVersion: body.templateVersion,
      format: body.format,
      variant: body.variant,
      payload: body.payload,
    };

    console.log(`[render] Request ${requestId}: ${renderRequest.templateKey} v${renderRequest.templateVersion} ${renderRequest.format} ${renderRequest.variant}`);

    // Render the template
    const result = await render({
      templateKey: renderRequest.templateKey,
      templateVersion: renderRequest.templateVersion,
      variant: renderRequest.variant,
      format: renderRequest.format,
      payload: renderRequest.payload,
    });

    console.log(`[render] Complete ${requestId}: ${result.buffer.length} bytes, hash=${result.contentHash.slice(0, 12)}...`);

    // Set response headers
    res.set({
      'Content-Type': result.mimeType,
      'x-content-hash': result.contentHash,
      'x-byte-size': String(result.buffer.length),
      'x-mime-type': result.mimeType,
      'x-template-key': renderRequest.templateKey,
      'x-template-version': String(renderRequest.templateVersion),
      'x-variant': renderRequest.variant,
      'x-request-id': requestId,
    });

    // Add dimensions for PNG
    if (result.width !== undefined) {
      res.set('x-width', String(result.width));
    }
    if (result.height !== undefined) {
      res.set('x-height', String(result.height));
    }

    // Send binary response
    res.send(result.buffer);

  } catch (error) {
    if (error instanceof RenderValidationError) {
      console.log(`[render] Validation error ${requestId}: ${error.message}`);
      return res.status(400).json({
        error: 'invalid_request',
        message: error.message,
      } as ApiError);
    }

    console.error(`[render] Failed ${requestId}:`, error);
    return res.status(500).json({
      error: 'render_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      requestId,
    } as ApiError);
  }
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'invalid_request',
    message: 'Not found',
  } as ApiError);
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({
    error: 'render_failed',
    message: 'Internal server error',
  } as ApiError);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`[asset-renderer] Server running on port ${PORT}`);
  console.log(`[asset-renderer] Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`[asset-renderer] Received ${signal}, shutting down...`);
  
  server.close(async () => {
    await closeBrowser();
    console.log('[asset-renderer] Shutdown complete');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('[asset-renderer] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
