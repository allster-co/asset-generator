# Asset Generator

A standalone, pluggable service for rendering HTML/CSS templates to PNG and PDF using headless Chromium (Playwright). Designed to be framework-agnostic and deployable on any Node.js hosting platform.

## Overview

Asset Generator processes rendering jobs from a PostgreSQL-based queue (pg-boss), renders templates using Playwright, and uploads the results to S3-compatible object storage (e.g., Cloudflare R2, AWS S3).

**Key Features:**
- Headless Chromium rendering via Playwright
- React/JSX templates with embedded assets (data URIs)
- PostgreSQL job queue (pg-boss) - no Redis required
- S3-compatible storage (R2, S3, MinIO, etc.)
- Deterministic rendering (fonts, images, render-ready flags)
- Content-hash based deduplication and immutable caching

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Your App      │     │ Asset Generator │     │  Object Storage │
│  (e.g. Next.js) │────▶│    (Worker)     │────▶│   (R2/S3)       │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │    pg-boss jobs       │
         └───────────┬───────────┘
                     ▼
              ┌─────────────┐
              │  PostgreSQL │
              └─────────────┘
```

## Prerequisites

- Node.js 20+
- PostgreSQL database (shared with your main application)
- S3-compatible object storage (Cloudflare R2 recommended)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url> asset-generator
cd asset-generator
npm install
npx playwright install chromium
```

### 2. Configure Environment

Create a `.env` file:

```bash
# Database (same as your main app)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Cloudflare R2 (or any S3-compatible storage)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
```

### 3. Run the Worker

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm run worker
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `R2_ACCOUNT_ID` | Yes | Cloudflare account ID (or S3 endpoint) |
| `R2_ACCESS_KEY_ID` | Yes | S3 access key |
| `R2_SECRET_ACCESS_KEY` | Yes | S3 secret key |
| `R2_BUCKET_NAME` | Yes | Storage bucket name |
| `PORT` | No | Health check server port (default: 3000) |

## Integrating with Your Application

### 1. Database Schema

Your application needs tables to store award and asset metadata. Example Prisma schema:

```prisma
enum AssetFormat {
  PNG
  PDF
}

model AwardAsset {
  id              String      @id @default(cuid())
  awardId         String
  clinicId        Int
  templateKey     String
  templateVersion Int
  format          AssetFormat
  variant         String      // "1080x1080", "A4", "A5", "1920x1080"
  width           Int?
  height          Int?
  contentHash     String
  storageKey      String
  mimeType        String
  byteSize        Int
  etag            String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@unique([awardId, templateKey, templateVersion, variant, format])
  @@index([contentHash])
}
```

### 2. Install pg-boss in Your App

```bash
npm install pg-boss
```

### 3. Enqueue Jobs from Your App

```typescript
import PgBoss from 'pg-boss';

const boss = new PgBoss({
  connectionString: process.env.DATABASE_URL,
  schema: 'pgboss',  // Isolate pg-boss tables
});

await boss.start();

// Enqueue a render job
await boss.send('render_award_asset', {
  awardId: 'award_123',
  clinicId: 456,
  templateKey: 'certificate-a4',
  templateVersion: 1,
  variant: 'A4',        // or '1080x1080' for PNG
  format: 'PDF',        // or 'PNG'
  awardMeta: {
    year: 2026,
    period: 0,          // 0=annual, 1-4=quarters
    scope: 'TOWN',
    scopeKey: 'wakefield',
    categoryKey: 'overall',
    title: 'Best Vet in Wakefield',
    tier: 'GOLD',
  },
  payload: {
    rank: 1,
    locationName: 'Wakefield',
    clinicName: 'Example Veterinary Clinic',
    datePeriod: '2026',
    websiteDomain: 'www.vetsinengland.com',
    tier: 'GOLD',
    categoryLabel: undefined,  // or 'Dog & Cat' for category awards
  },
});
```

### 4. Job Payload Schema

```typescript
interface RenderJobPayload {
  awardId: string;
  clinicId: number;
  templateKey: string;
  templateVersion: number;
  variant: string;           // '1080x1080' | 'A4' | 'A5' | '1920x1080'
  format: 'PNG' | 'PDF';
  awardMeta: {
    year: number;
    period: number;          // 0=annual, 1-4=quarters
    scope: 'TOWN' | 'COUNTY' | 'COUNTRY';
    scopeKey: string;
    categoryKey: string;
    title: string;
    tier: 'GOLD' | 'SILVER' | 'BRONZE';
  };
  payload: {
    rank: number;
    locationName: string;
    clinicName: string;
    datePeriod: string;
    websiteDomain: string;
    tier: 'GOLD' | 'SILVER' | 'BRONZE';
    categoryLabel?: string;
  };
}
```

## Available Templates

| Template Key | Variant | Format | Use Case |
|-------------|---------|--------|----------|
| `certificate-a4` | `A4` | PDF | Print certificates |
| `social-square` | `1080x1080` | PNG | Instagram/Facebook posts |
| `social-story` | `1080x1920` | PNG | Instagram/Facebook stories |
| `display-16x9` | `1920x1080` | PNG | Website banners, screens |

## Adding Custom Templates

1. Create a new template in `src/templates/`:

```tsx
// src/templates/my-template.tsx
import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

export function MyTemplate(props: Record<string, unknown>): JSX.Element {
  const { clinicName, locationName } = props;
  
  return (
    <html>
      <head>
        <style>{`
          ${getFontFaceCSS()}
          /* Your styles */
        `}</style>
      </head>
      <body data-render-ready="1">
        {/* Your template content */}
      </body>
    </html>
  );
}
```

2. Register it in `src/templates/index.ts`:

```typescript
import { MyTemplate } from './my-template';

export const templates: Record<string, TemplateComponent> = {
  // ... existing templates
  'my-template': MyTemplate,
};
```

### Template Requirements

- **data-render-ready="1"**: Add this attribute to `<body>` when the template is ready to render
- **Embedded assets**: Use data URIs from `assets.ts` for images/fonts
- **PNG dimensions**: Specified by variant (e.g., `1080x1080`)
- **PDF format**: Specified by variant (`A4`, `A5`, `LETTER`)

## Adding Custom Fonts

1. Add font files to `src/assets/fonts/`
2. Update `src/assets.ts`:

```typescript
export const assets = {
  // ...existing assets
  fonts: {
    myFont: loadFont('MyFont-Regular.woff2'),
    myFontBold: loadFont('MyFont-Bold.woff2'),
  },
};

export function getFontFaceCSS(): string {
  return `
    @font-face {
      font-family: 'My Font';
      src: url(${assets.fonts.myFont}) format('woff2');
      font-weight: normal;
    }
    @font-face {
      font-family: 'My Font';
      src: url(${assets.fonts.myFontBold}) format('woff2');
      font-weight: bold;
    }
  `;
}
```

## Storage Keys

Assets are stored with deterministic keys:

```
awards/{awardId}/{templateKey}/v{templateVersion}/{contentHash}.{ext}
```

This enables:
- Content-based deduplication (same hash = same file)
- Immutable caching (`Cache-Control: public, max-age=31536000, immutable`)
- Easy regeneration without conflicts

## Deployment

### Render.com

The included `render.yaml` configures:
- **Worker service**: Processes render jobs
- **Web service** (optional): Health check endpoint

```bash
# Deploy to Render
git push origin main
# Connect repo in Render dashboard
```

### Docker

```dockerfile
FROM node:20-slim

# Install Playwright dependencies
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

CMD ["npm", "run", "worker"]
```

### Manual/VPS

```bash
npm ci
npm run build
npx playwright install chromium

# Run with process manager (PM2, systemd, etc.)
pm2 start dist/worker.js --name asset-generator
```

## Monitoring

The worker logs job processing:

```
[worker] pg-boss started
[worker] Listening for render_award_asset jobs...
[worker] Processing job abc123: certificate-a4 for award xyz789
[renderer] Browser launched
[storage] Uploaded awards/xyz789/certificate-a4/v1/sha256hash.pdf (45678 bytes)
[worker] Completed job abc123: asset asset_456 stored at awards/xyz789/...
```

## Troubleshooting

### Fonts not rendering correctly
- Ensure fonts are in `src/assets/fonts/`
- Check `getFontFaceCSS()` includes @font-face declarations
- Verify fonts are loaded as data URIs

### Images not loading
- Images must be embedded as data URIs
- Add images to `src/assets.ts` and reference via `assets.myImage`

### Jobs timing out
- Default timeout is 30 minutes
- Check Playwright browser launch (may need `--no-sandbox`)
- Ensure `[data-render-ready="1"]` is set on templates

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure pg-boss schema exists (created automatically on first run)

## License

MIT
