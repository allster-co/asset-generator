# Rosette Award Template

## Overview
The `rosette-award` template generates a standalone 800x800 PNG badge featuring a decorative rosette design, perfect for awards, achievements, and recognition.

## Template Details
- **Template Key**: `rosette-award`
- **Version**: 1
- **Format**: PNG
- **Variant**: `800x800`
- **Output Size**: 800x800 pixels

## Usage

### Basic Example
```typescript
import { render } from './src/renderer';

const result = await render({
  templateKey: 'rosette-award',
  templateVersion: 1,
  variant: '800x800',
  format: 'PNG',
  payload: {
    rank: 1,
    locationName: 'Wakefield',
    datePeriod: 'June 2026',
    categoryLabel: 'VetsinEngland',
    tier: 'GOLD',
  },
});
```

### Payload Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `rank` | number | No | 1 | The rank/position number displayed prominently |
| `locationName` | string | No | 'Location' | Location name shown in the ribbon banner |
| `datePeriod` | string | No | 'June 2026' | Date or period shown below location |
| `categoryLabel` | string | No | 'VetsinEngland' | Category label shown at top of rosette |
| `tier` | string | No | Based on rank | One of: 'GOLD', 'SILVER', 'BRONZE', 'GREEN' |

### Tier Colors
- **GOLD**: #D4AF37 (used for rank 1 or when tier='GOLD')
- **SILVER**: #C0C0C0 (used for rank 2 or when tier='SILVER')
- **BRONZE**: #CD7F32 (used for rank 3 or when tier='BRONZE')
- **GREEN**: #1A6B52 (used for rank 4+ or when tier='GREEN')

### Preview Generation
Run the preview script to generate a sample rosette award:

```bash
npx ts-node preview-rosette-award.ts
```

This will create `rosette-award-preview.png` in the project root.

## Design Features
- **Scalloped Edge**: 24 circular petals create the classic rosette appearance
- **Layered Design**: Multiple rings with gradient effects for depth
- **Prominent Rank**: Large #1 style number in the center
- **Decorative Stars**: Two stars below the rank number
- **Ribbon Banner**: Bottom banner with location and date information
- **Ribbon Tails**: Two decorative tails extending from bottom
- **Responsive Text**: Font sizes adjust based on content length
- **Drop Shadows**: Professional shadows throughout for 3D effect

## File Structure
```
src/templates/rosette-award.tsx     - Template component
preview-rosette-award.ts            - Preview generation script
rosette-award-preview.png           - Generated preview (800x800)
```

## API Integration
This template is registered in the template registry and can be called via the render API:

```bash
POST /render
Content-Type: application/json

{
  "templateKey": "rosette-award",
  "templateVersion": 1,
  "variant": "800x800",
  "format": "PNG",
  "payload": {
    "rank": 1,
    "locationName": "Wakefield",
    "datePeriod": "June 2026",
    "categoryLabel": "VetsinEngland",
    "tier": "GOLD"
  }
}
```

## Examples

### Gold First Place
```typescript
{
  rank: 1,
  locationName: 'Manchester',
  datePeriod: 'January 2026',
  categoryLabel: 'VetsinEngland',
  tier: 'GOLD'
}
```

### Silver Second Place
```typescript
{
  rank: 2,
  locationName: 'Liverpool',
  datePeriod: 'February 2026',
  categoryLabel: 'Top Rated Clinic',
  tier: 'SILVER'
}
```

### Green Top 10
```typescript
{
  rank: 7,
  locationName: 'Birmingham',
  datePeriod: 'March 2026',
  categoryLabel: 'Best Service',
  tier: 'GREEN'
}
```

## Notes
- Long category labels (>15 chars) automatically reduce font size
- Long location names (>12 chars) automatically reduce font size
- The template uses transparent background for easy overlay on other designs
- All text includes text-shadow for readability
- The rosette is created using SVG for crisp, scalable graphics
