/**
 * Social Post Template
 * 
 * 1080x1350 PNG for Instagram and Facebook Posts.
 */

import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

interface SocialPostProps {
  rank: number;
  locationName: string;
  clinicName: string;
  datePeriod: string;
  websiteDomain: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  categoryLabel?: string;
}

export function SocialPost(props: Record<string, unknown>): React.ReactElement {
  const {
    rank = 1,
    locationName = 'Location',
    clinicName = 'Clinic Name',
    datePeriod = '2026',
    websiteDomain = 'www.vetsinengland.com',
    categoryLabel,
  } = props as unknown as SocialPostProps;

  const titlePrefix = categoryLabel ? `${categoryLabel} ` : '';
  const title = `${titlePrefix}Vet in ${locationName}`;

  // Reduce font size for long location names
  const isLongLocationName = locationName.length > 10;
  
  // Reduce font size for long clinic names
  const isLongClinicName = clinicName.length > 50;

  // Select rosette based on rank
  let rosetteImage: string;
  if (rank === 1) {
    rosetteImage = assets.goldRosette;
  } else if (rank === 2) {
    rosetteImage = assets.silverRosette;
  } else if (rank === 3) {
    rosetteImage = assets.bronzeRosette;
  } else if (rank >= 4 && rank <= 10) {
    rosetteImage = assets.greenRosette;
  } else {
    rosetteImage = assets.greenRosette;
  }

  return (
    <html>
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Dancing+Script:wght@400;500;600;700&display=swap');

          
          ${getFontFaceCSS()}
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 1080px;
            height: 1350px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          .container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
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
          }
          
          .content {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px;
          }
          
          .congratulations-ribbon {
            width: 900px;
            height: auto;
            margin-top: 20px;
            margin-bottom: 30px;
          }
          
          .clinic-name {
            font-size: 58px;
            font-weight: bold;
            color: #FFFFFF;
            text-align: center;
            margin-bottom: 40px;
            line-height: 1.1;
            font-family: 'Lora', sans-serif;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
          }
          
          .clinic-name-long {
            font-size: 49.3px;
          }
          
          .middle-section {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            width: 100%;
            max-width: 1000px;
            margin-bottom: -100px;
            position: relative;
            z-index: 2;
          }
          
          .pet-left {
            position: absolute;
            left: 0;
            width: 380px;
            height: auto;
            margin-bottom: -290px;
          }
          
          .rosette-container {
            position: relative;
            width: 500px;
            height: 500px;
            flex-shrink: 0;
            z-index: 2;
          }
          
          .rosette-img {
            width: 100%;
            height: auto;
          }
          
          .rank-number {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -80%);
            font-size: 120px;
            font-weight: bold;
            color: #FFFFFF;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
          }
          
          .pet-right {
            position: absolute;
            right: -30px;
            width: 320px;
            height: auto;
            margin-bottom: -290px;
          }
          
          .info-box {
            background: #F8F8F0;
            border: 2px solid #00797B;
            padding: 15px 40px;
            padding-top: 20px;
            max-width: 540px;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2), inset 0 0 0 2px #00797B;
            position: relative;
            border-radius: 100px 100px 0 0;
            z-index: 1;
          }
          
          .info-box::after {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            border: 2px solid #00797B;
            border-radius: 95px 95px 0 0;
            pointer-events: none;
          }
          
          .info-box-inner {
            position: relative;
            z-index: 1;
          }
          
          .hashtag {
            font-size: 80px !important;
            position: relative;
            top: -15px;
          }

          .title {
            font-size: 42px;
            font-weight: bold;
            color: #29303D;
            margin-bottom: 12px;
            margin-top: 40px;
            font-family: 'Lora', sans-serif;
          }
          
          .title-long {
            font-size: 35.7px;
          }
          
          .date-period {
            font-size: 36px;
            color: #1A6B52;
            margin-bottom: 20px;
            font-weight: bold;
            font-family: 'Inter', sans-serif;
          }
          
          .description {
            font-size: 20px;
            color: #444;
            line-height: 1.6;
            margin-bottom:40px;
            font-family: 'Inter', sans-serif;
          }
          
          .footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-top: auto;
          }
          
          .verify-text {
            font-size: 18px;
            color: #FFFFFF;
            text-shadow: 1px 1px 4px rgba(0,0,0,0.5);
            font-family: 'Inter', sans-serif;
          }
          
          .footer-url-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .footer-logo {
            width: 48px;
            height: 48px;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
          }
          
          .footer-url {
            font-size: 32px;
            color: #FFF;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </head>
      <body data-render-ready="1">
        <div className="container">
          {assets.socialPostBackground && (
            <img src={assets.socialPostBackground} className="background" alt="" />
          )}
          
          <div className="content">
            {assets.congratulationsRibbon && (
              <img src={assets.congratulationsRibbon} className="congratulations-ribbon" alt="Congratulations!" />
            )}
            
            <h2 className={`clinic-name ${isLongClinicName ? 'clinic-name-long' : ''}`}>{clinicName}</h2>
            
            <div className="middle-section">
              {assets.socialPostDog && (
                <img src={assets.socialPostDog} className="pet-left" alt="" />
              )}
              
              <div className="rosette-container">
                {rosetteImage && (
                  <img src={rosetteImage} className="rosette-img" alt="" />
                )}
                <div className="rank-number"><span className="hashtag">#</span>{rank}</div>
              </div>
              
              {assets.socialPostCat && (
                <img src={assets.socialPostCat} className="pet-right" alt="" />
              )}
            </div>
            
            <div className="info-box">
              <div className="info-box-inner">
                <h1 className={`title ${isLongLocationName ? 'title-long' : ''}`}>{title}</h1>
                <p className="date-period">{datePeriod}</p>
                <p className="description">
                  Independently ranked for quality of service and customer reviews.
                </p>
              </div>
            </div>
            
            <div className="footer">
              <p className="verify-text">Verify at:</p>
              <div className="footer-url-container">
                {assets.logo && (
                  <img src={assets.logo} className="footer-logo" alt="" />
                )}
                <span className="footer-url">{websiteDomain}</span>
              </div>
            </div>
          </div>
          
          {assets.socialPostWatermark && (
            <img src={assets.socialPostWatermark} className="watermark-overlay" alt="" />
          )}
        </div>
      </body>
    </html>
  );
}
