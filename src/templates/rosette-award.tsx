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
    datePeriod = 'Q1 2026',
    categoryLabel = 'VetsinEngland',
  } = props as unknown as RosetteAwardProps;

  // Select rosette and banner based on rank (matching certificate and social-post logic)
  let rosetteAsset: string;
  let bannerAsset: string;
  
  if (rank === 1) {
    rosetteAsset = assets.goldRosette;
    bannerAsset = assets.goldenBanner;
  } else if (rank === 2) {
    rosetteAsset = assets.silverRosette;
    bannerAsset = assets.silverBanner;
  } else if (rank === 3) {
    rosetteAsset = assets.bronzeRosette;
    bannerAsset = assets.bronzeBanner;
  } else if (rank >= 4 && rank <= 10) {
    rosetteAsset = assets.greenRosette;
    bannerAsset = assets.greenBanner;
  } else {
    // Default to green for ranks outside 1-10
    rosetteAsset = assets.greenRosette;
    bannerAsset = assets.greenBanner;
  }

  // Format the title
  const titlePrefix = categoryLabel ? `${categoryLabel}` : '';
  const title = `Vet in ${locationName}`;

  // Calculate font sizes based on content length
  const isLongCategoryLabel = categoryLabel && categoryLabel.length > 15;
  const isLongLocationName = locationName.length > 12;
  
  // Determine if this is a green tier (rank 4+)
  const isGreenTier = rank >= 4;
  const textColor = isGreenTier ? '#FFFFFF' : '#1A5642';

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
            margin-top: -120px;
          }
          
          .rank-number {
            font-size: 180px;
            font-weight: 900;
            color: #FFFFFF;
            line-height: 1;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            text-shadow: 4px 4px 12px rgba(0,0,0,0.3);
            letter-spacing: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .hashtag {
            font-size: 130px;
            position: relative;
            font-family: 'Inter', sans-serif;
            font-weight: 800;
            margin-right: 5px;
          }
          
          .banner-wrapper {
            position: absolute;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 3;
            width: 616px;
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
            left: 0px;
            object-fit: contain;
            transform: scaleX(1.4);
          }
          
          .banner-text-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: -10px;
            left: 0;
            z-index: 4;
          }
          
          .banner-title-text {
            font-size: ${isLongLocationName ? '32px' : '36px'};
            font-weight: 800;
            fill: ${textColor};
            font-family: 'Inter', sans-serif;
            filter: drop-shadow(0px 1px 2px rgba(${isGreenTier ? '0,0,0' : '255,255,255'},0.3));
          }
          
          .banner-date-text {
            font-size: 26px;
            padding-top: 10px;
            font-weight: 700;
            fill: ${textColor};
            font-family: 'Inter', sans-serif;
            filter: drop-shadow(0px 1px 2px rgba(${isGreenTier ? '0,0,0' : '255,255,255'},0.3));
          }
          
          .watermark-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 10;
            pointer-events: none;
            opacity: 0.4;
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
            
            {/* Bottom banner with selected banner image */}
            <div className="banner-wrapper">
              <img 
                src={bannerAsset} 
                className="banner-image" 
                alt="Banner"
              />
              {/* Curved text using SVG */}
              <svg className="banner-text-svg" viewBox="0 0 616 130" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Curved path for title text - normal size (shifted down 5px, centered, reduced curve) */}
                  <path 
                    id="titleCurveNormal" 
                    d="M 66 50 Q 308 100 550 50" 
                    fill="transparent"
                  />
                  {/* Curved path for title text - long names (shifted down 7px, centered, reduced curve) */}
                  <path 
                    id="titleCurveLong" 
                    d="M 66 51 Q 308 95 550 53" 
                    fill="transparent"
                  />
                  {/* Curved path for date text (curves downward in middle, centered, shifted down 3px) */}
                  <path 
                    id="dateCurve" 
                    d="M 110 89 Q 308 143 506 89" 
                    fill="transparent"
                  />
                </defs>
                
                {/* Title text on curved path */}
                <text className="banner-title-text">
                  <textPath href={isLongLocationName ? "#titleCurveLong" : "#titleCurveNormal"} startOffset="50%" textAnchor="middle">
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
          
          {/* Watermark overlay */}
          {assets.socialPostWatermark && (
            <img src={assets.socialPostWatermark} className="watermark-overlay" alt="" />
          )}
        </div>
      </body>
    </html>
  );
}
