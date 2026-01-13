/**
 * Rosette Award Template
 * 
 * 800x800 PNG standalone rosette badge for awards and achievements.
 */

import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

interface RosetteAwardProps {
  rank: number;
  locationName: string;
  datePeriod: string;
  categoryLabel?: string;
  tier?: 'GOLD' | 'SILVER' | 'BRONZE' | 'GREEN';
}

export function RosetteAward(props: Record<string, unknown>): React.ReactElement {
  const {
    rank = 1,
    locationName = 'Location',
    datePeriod = 'June 2026',
    categoryLabel = 'VetsinEngland',
    tier,
  } = props as unknown as RosetteAwardProps;

  // Select rosette based on tier (if provided) or rank
  let rosetteColor: string;
  if (tier) {
    switch (tier) {
      case 'GOLD':
        rosetteColor = '#D4AF37'; // Gold
        break;
      case 'SILVER':
        rosetteColor = '#C0C0C0'; // Silver
        break;
      case 'BRONZE':
        rosetteColor = '#CD7F32'; // Bronze
        break;
      case 'GREEN':
        rosetteColor = '#1A6B52'; // Green
        break;
      default:
        rosetteColor = '#D4AF37'; // Default to gold
    }
  } else {
    // Select color based on rank
    if (rank === 1) {
      rosetteColor = '#D4AF37'; // Gold
    } else if (rank === 2) {
      rosetteColor = '#C0C0C0'; // Silver
    } else if (rank === 3) {
      rosetteColor = '#CD7F32'; // Bronze
    } else {
      rosetteColor = '#1A6B52'; // Green
    }
  }

  // Format the title
  const titlePrefix = categoryLabel ? `${categoryLabel}` : '';
  const title = `Vet in ${locationName}`;

  // Calculate font sizes based on content length
  const isLongCategoryLabel = categoryLabel && categoryLabel.length > 15;
  const isLongLocationName = locationName.length > 12;

  return (
    <html>
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');

          ${getFontFaceCSS()}
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 800px;
            height: 800px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: transparent;
          }
          
          .container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .rosette-wrapper {
            position: relative;
            width: 750px;
            height: 750px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* SVG Rosette Badge */
          .rosette-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
          
          .content-wrapper {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 380px;
            margin-top: -40px;
          }
          
          .category-label {
            font-size: ${isLongCategoryLabel ? '36px' : '42px'};
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            font-family: 'Inter', sans-serif;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
          }
          
          .rank-number {
            font-size: 160px;
            font-weight: 900;
            color: #FFFFFF;
            line-height: 1;
            margin: 10px 0;
            font-family: 'Montserrat', sans-serif;
            text-shadow: 3px 3px 12px rgba(0,0,0,0.4);
            letter-spacing: -5px;
          }
          
          .hashtag {
            font-size: 120px;
            position: relative;
            top: -15px;
            margin-right: -10px;
            font-weight: 800;
          }
          
          .stars {
            display: flex;
            gap: 20px;
            margin: 5px 0 15px 0;
          }
          
          .star {
            font-size: 32px;
            color: #FFFFFF;
            text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
          }
          
          .ribbon {
            position: absolute;
            bottom: 35px;
            left: 50%;
            transform: translateX(-50%);
            background: ${rosetteColor};
            padding: 16px 60px;
            border-radius: 8px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.35);
            border: 3px solid rgba(255,255,255,0.3);
            z-index: 3;
            width: 520px;
          }
          
          .ribbon-title {
            font-size: ${isLongLocationName ? '30px' : '34px'};
            font-weight: 800;
            color: #FFFFFF;
            margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
            text-shadow: 2px 2px 6px rgba(0,0,0,0.4);
            text-align: center;
          }
          
          .ribbon-date {
            font-size: 24px;
            font-weight: 700;
            color: rgba(255,255,255,0.95);
            font-family: 'Inter', sans-serif;
            text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
            text-align: center;
          }
          
          /* Rosette shape with gradient */
          .rosette-circle {
            fill: url(#gradient);
            filter: drop-shadow(0px 8px 20px rgba(0,0,0,0.3));
          }
          
          .rosette-ring {
            fill: none;
            stroke: ${rosetteColor};
            stroke-width: 28;
            opacity: 0.95;
          }
          
          .rosette-inner-circle {
            fill: ${rosetteColor};
            opacity: 0.85;
          }
        `}</style>
      </head>
      <body data-render-ready="1">
        <div className="container">
          <div className="rosette-wrapper">
            {/* SVG Rosette Badge */}
            <svg className="rosette-svg" viewBox="0 0 750 750" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style={{ stopColor: rosetteColor, stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: rosetteColor, stopOpacity: 0.7 }} />
                </radialGradient>
              </defs>
              
              {/* Outer scalloped edge (rosette petals) */}
              <g>
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 360) / 24;
                  const rad = (angle * Math.PI) / 180;
                  const x = 375 + Math.cos(rad) * 340;
                  const y = 375 + Math.sin(rad) * 340;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="60"
                      className="rosette-circle"
                    />
                  );
                })}
              </g>
              
              {/* Main outer ring */}
              <circle cx="375" cy="375" r="290" className="rosette-ring" />
              
              {/* Inner circle background */}
              <circle cx="375" cy="375" r="240" className="rosette-inner-circle" />
              
              {/* Ribbon tails at bottom */}
              <g transform="translate(375, 650)">
                {/* Left ribbon tail */}
                <path
                  d="M -80 0 L -100 100 L -60 80 L -80 0 Z"
                  fill={rosetteColor}
                  style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }}
                />
                {/* Right ribbon tail */}
                <path
                  d="M 80 0 L 100 100 L 60 80 L 80 0 Z"
                  fill={rosetteColor}
                  style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }}
                />
              </g>
            </svg>
            
            {/* Content overlay */}
            <div className="content-wrapper">
              {categoryLabel && (
                <div className="category-label">{categoryLabel}</div>
              )}
              
              <div className="rank-number">
                <span className="hashtag">#</span>{rank}
              </div>
              
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
            </div>
            
            {/* Bottom ribbon banner */}
            <div className="ribbon">
              <div className="ribbon-title">{title}</div>
              <div className="ribbon-date">{datePeriod}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
