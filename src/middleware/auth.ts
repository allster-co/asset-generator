/**
 * Authentication Middleware
 * 
 * Validates Bearer token against RENDERER_SERVICE_KEY env var.
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const serviceKey = process.env.RENDERER_SERVICE_KEY;

  if (!serviceKey) {
    console.error('[auth] RENDERER_SERVICE_KEY not configured');
    const error: ApiError = {
      error: 'render_failed',
      message: 'Service misconfigured',
    };
    res.status(500).json(error);
    return;
  }

  if (!authHeader) {
    const error: ApiError = {
      error: 'unauthorized',
      message: 'Missing Authorization header',
    };
    res.status(401).json(error);
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    const error: ApiError = {
      error: 'unauthorized',
      message: 'Invalid Authorization header format. Expected: Bearer <token>',
    };
    res.status(401).json(error);
    return;
  }

  if (token !== serviceKey) {
    const error: ApiError = {
      error: 'unauthorized',
      message: 'Invalid service key',
    };
    res.status(401).json(error);
    return;
  }

  next();
}
