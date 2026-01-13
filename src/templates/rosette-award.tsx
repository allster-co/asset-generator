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

  // Select rosette SVG based on tier (if provided) or rank
  let rosetteAsset: string;
  if (tier) {
    switch (tier) {
      case 'GOLD':
        rosetteAsset = assets.goldRosette;
        break;
      case 'SILVER':
        rosetteAsset = assets.silverRosette;
        break;
      case 'BRONZE':
        rosetteAsset = assets.bronzeRosette;
        break;
      case 'GREEN':
        rosetteAsset = assets.greenRosette;
        break;
      default:
        rosetteAsset = assets.goldRosette;
    }
  } else {
    // Select rosette based on rank
    if (rank === 1) {
      rosetteAsset = assets.goldRosette;
    } else if (rank === 2) {
      rosetteAsset = assets.silverRosette;
    } else if (rank === 3) {
      rosetteAsset = assets.bronzeRosette;
    } else {
      rosetteAsset = assets.greenRosette;
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
          
          /* Background rosette SVG */
          .rosette-background {
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
            width: 450px;
            margin-top: -30px;
          }
          
          .rank-number {
            font-size: 200px;
            font-weight: 900;
            color: #FFFFFF;
            line-height: 1;
            margin: 0;
            padding: 0;
            font-family: 'Montserrat', sans-serif;
            text-shadow: 4px 4px 12px rgba(0,0,0,0.3);
            letter-spacing: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .hashtag {
            font-size: 150px;
            position: relative;
            font-weight: 800;
            margin-right: 5px;
          }
          
          .banner-wrapper {
            position: absolute;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 3;
            width: 560px;
            height: 130px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .banner-image {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            object-fit: contain;
          }
          
          .banner-text-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 4;
          }
          
          .banner-title-text {
            font-size: ${isLongLocationName ? '28px' : '32px'};
            font-weight: 800;
            fill: #1A5642;
            font-family: 'Inter', sans-serif;
            filter: drop-shadow(0px 1px 2px rgba(255,255,255,0.3));
          }
          
          .banner-date-text {
            font-size: 26px;
            font-weight: 700;
            fill: #1A5642;
            font-family: 'Inter', sans-serif;
            filter: drop-shadow(0px 1px 2px rgba(255,255,255,0.3));
          }
        `}</style>
      </head>
      <body data-render-ready="1">
        <div className="container">
          <div className="rosette-wrapper">
            {/* Background rosette SVG */}
            <img 
              src={rosetteAsset} 
              className="rosette-background" 
              alt="Rosette"
            />
            
            {/* Content overlay */}
            <div className="content-wrapper">
              <div className="rank-number">
                <span className="hashtag">#</span>{rank}
              </div>
            </div>
            
            {/* Bottom banner with golden-banner.png */}
            <div className="banner-wrapper">
              <img 
                src={assets.goldenBanner} 
                className="banner-image" 
                alt="Banner"
              />
              {/* Curved text using SVG */}
              <svg className="banner-text-svg" viewBox="0 0 560 130" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Curved path for title text (curves downward in middle) */}
                  <path 
                    id="titleCurve" 
                    d="M 60 55 Q 280 85 500 55" 
                    fill="transparent"
                  />
                  {/* Curved path for date text (curves downward in middle) */}
                  <path 
                    id="dateCurve" 
                    d="M 100 80 Q 280 108 460 80" 
                    fill="transparent"
                  />
                </defs>
                
                {/* Title text on curved path */}
                <text className="banner-title-text">
                  <textPath href="#titleCurve" startOffset="50%" textAnchor="middle">
                    {title}
                  </textPath>
                </text>
                
                {/* Date text on curved path */}
                <text className="banner-date-text">
                  <textPath href="#dateCurve" startOffset="50%" textAnchor="middle">
                    {datePeriod}
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
