# Asset Renderer

A stateless HTTP service for rendering React templates to PNG and PDF using headless Chromium (Playwright).

## Overview

Asset Renderer is a generic rendering microservice that converts React/JSX templates into image (PNG) and document (PDF) files. It is:

- **Stateless**: No database, no queues, no storage - just rendering
- **Source-agnostic**: Can be called by any application
- **Deterministic**: Same input always produces same output (content-hash verified)

## Architecture

```
┌─────────────────┐     HTTP POST /render      ┌─────────────────┐
│   Your App      │ ──────────────────────────▶│  Asset Renderer │
│                 │◀───────────────────────────│   (This repo)   │
└─────────────────┘     Binary PNG/PDF         └─────────────────┘
        │                                              │
        │                                              │
        ▼                                              ▼
┌─────────────────┐                           ┌─────────────────┐
│  Your Storage   │                           │   Templates +   │
│   (R2/S3/etc)   │                           │  Static Assets  │
└─────────────────┘                           └─────────────────┘
```

## Prerequisites

- Node.js 20+
- Playwright Chromium browser

## Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Configure Environment

Create a `.env` file (optional for local development):

```bash
# Required for production
RENDERER_SERVICE_KEY=your_secret_key_here

# Optional
PORT=3000
```

### 3. Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

### 4. Test Rendering

```bash
npm test
```

## API Reference

### Authentication

All endpoints except `/health` require Bearer token authentication:

```
Authorization: Bearer <RENDERER_SERVICE_KEY>
```

### GET /health

Health check endpoint (no auth required).

**Response:**
```json
{
  "ok": true,
  "version": "1.0.0",
  "service": "asset-renderer"
}
```

### POST /render

Render a template to PNG or PDF.

**Request Body:**
```json
{
  "templateKey": "certificate-a4",
  "templateVersion": 1,
  "format": "PNG",
  "variant": "1080x1080",
  "payload": {
    "rank": 1,
    "locationName": "London",
    "clinicName": "Example Clinic",
    "datePeriod": "2026",
    "websiteDomain": "www.example.com",
    "tier": "GOLD",
    "categoryLabel": null
  }
}
```

**Response:**
- **Body**: Binary PNG or PDF data
- **Status**: 200 OK
- **Headers**:
  - `Content-Type`: `image/png` or `application/pdf`
  - `x-content-hash`: SHA-256 hex of output bytes
  - `x-byte-size`: Integer byte count
  - `x-mime-type`: Same as Content-Type
  - `x-template-key`: Echo of request
  - `x-template-version`: Echo of request
  - `x-variant`: Echo of request
  - `x-width`: (PNG only) Image width
  - `x-height`: (PNG only) Image height
  - `x-request-id`: UUID for debugging

### Available Templates

| Template Key | Format | Variants | Description |
|-------------|--------|----------|-------------|
| `certificate-a4` | PDF | `A4`, `A5` | Print certificate |
| `social-square` | PNG | `1080x1080` | Instagram/Facebook post |
| `social-post` | PNG | `1080x1350` | Instagram/Facebook post |
| `social-story` | PNG | `1080x1920` | Instagram/Facebook story |
| `display-16x9` | PNG | `1920x1080` | Website banner |
| `rosette-award` | PNG | `800x800` | Standalone rosette badge |

### Variant Rules

- **PNG format**: Variant must be `WIDTHxHEIGHT` (e.g., `1080x1080`, `1920x1080`)
- **PDF format**: Variant must be page size (e.g., `A4`, `A5`)

### Error Responses

All errors return JSON:

```json
{
  "error": "invalid_request",
  "message": "Human-readable error message",
  "requestId": "uuid"  // Only for render_failed
}
```

| Status | Error Code | Description |
|--------|------------|-------------|
| 400 | `invalid_request` | Missing fields, unknown template, invalid variant |
| 401 | `unauthorized` | Missing or invalid auth token |
| 500 | `render_failed` | Rendering error (includes requestId) |

## Template Development

### Adding a New Template

1. Create a new file in `src/templates/`:

```tsx
// src/templates/my-template.tsx
import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

interface MyTemplateProps {
  title: string;
  // ... other props
}

export function MyTemplate(props: Record<string, unknown>): React.ReactElement {
  const { title } = props as unknown as MyTemplateProps;
  
  return (
    <html>
      <head>
        <style>{`
          ${getFontFaceCSS()}
          /* Your CSS */
        `}</style>
      </head>
      <body data-render-ready="1">
        {/* Your template */}
      </body>
    </html>
  );
}
```

2. Register it in `src/templates/index.ts`:

```typescript
import { MyTemplate } from './my-template';

export const templates: Record<string, Record<number, TemplateComponent>> = {
  // ... existing templates
  'my-template': {
    1: MyTemplate,
  },
};
```

### Template Requirements

- **`data-render-ready="1"`**: Add to `<body>` when template is ready to render
- **Embedded assets**: Use data URIs from `assets.ts` (no external URLs)
- **Embedded fonts**: Use `getFontFaceCSS()` for @font-face declarations
- **For PDF**: Include `@page { size: A4; margin: 0; }` in CSS

## Deployment

### Render.com

The included `render.yaml` configures deployment:

```bash
git push origin main
# Connect repo in Render dashboard
```

**Required Environment Variables:**
- `RENDERER_SERVICE_KEY`: Bearer token for auth

### Docker

```dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libasound2

WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npx playwright install chromium

COPY . .
RUN npm run build

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RENDERER_SERVICE_KEY` | Yes | - | Bearer token for API auth |
| `PORT` | No | 3000 | HTTP server port |

## License

MIT
