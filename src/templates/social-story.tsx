/**
 * Social Story Template
 * 
 * 1080x1920 PNG for Instagram and Facebook Stories.
 */

import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

interface SocialStoryProps {
  rank: number;
  locationName: string;
  clinicName: string;
  datePeriod: string;
  websiteDomain: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  categoryLabel?: string;
}

export function SocialStory(props: Record<string, unknown>): React.ReactElement {
  const {
    rank = 1,
    locationName = 'Location',
    clinicName = 'Clinic Name',
    datePeriod = '2026',
    websiteDomain = 'www.vetsinengland.com',
    categoryLabel,
  } = props as unknown as SocialStoryProps;

  const titlePrefix = categoryLabel ? `${categoryLabel} ` : '';
  const title = `${titlePrefix}Vet in ${locationName}`;

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
          ${getFontFaceCSS()}
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 1080px;
            height: 1920px;
            font-family: 'Georgia', 'Times New Roman', serif;
            background: linear-gradient(180deg, #f8f6f1 0%, #efe9dc 100%);
          }
          
          .container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 60px;
          }
          
          .border {
            position: absolute;
            top: 30px;
            left: 30px;
            right: 30px;
            bottom: 30px;
            border: 3px solid #C5A54E;
            pointer-events: none;
          }
          
          .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .rosette-container {
            position: relative;
            width: 280px;
            height: 280px;
            margin-bottom: 60px;
          }
          
          .rosette-img {
            width: 100%;
            height: auto;
          }
          
          .rank-number {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -60%);
            font-size: 72px;
            font-weight: bold;
            color: #C5A54E;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          
          .title {
            font-size: 52px;
            font-style: italic;
            color: #1A6B52;
            margin-bottom: 40px;
          }
          
          .divider {
            width: 60%;
            height: auto;
            margin-bottom: 40px;
          }
          
          .presented-to {
            font-size: 28px;
            font-style: italic;
            color: #666;
            margin-bottom: 20px;
          }
          
          .clinic-name {
            font-size: 64px;
            font-weight: bold;
            color: #1A6B52;
            margin-bottom: 50px;
            max-width: 900px;
            line-height: 1.2;
          }
          
          .description {
            font-size: 26px;
            color: #444;
            max-width: 800px;
            line-height: 1.5;
            margin-bottom: 40px;
          }
          
          .date-period {
            font-size: 36px;
            font-weight: bold;
            color: #1A6B52;
            margin-bottom: 60px;
          }
          
          .footer {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px 40px;
            background: #1A6B52;
            border-radius: 40px;
          }
          
          .footer-logo {
            width: 50px;
            height: 50px;
          }
          
          .footer-url {
            font-size: 28px;
            color: #fff;
            font-weight: 500;
          }
        `}</style>
      </head>
      <body data-render-ready="1">
        <div className="container">
          <div className="border"></div>
          
          <div className="content">
            <div className="rosette-container">
              {rosetteImage && (
                <img src={rosetteImage} className="rosette-img" alt="" />
              )}
              <div className="rank-number">#{rank}</div>
            </div>
            
            <h1 className="title">{title}</h1>
            
            {assets.divider && (
              <img src={assets.divider} className="divider" alt="" />
            )}
            
            <p className="presented-to">Presented to</p>
            <h2 className="clinic-name">{clinicName}</h2>
            
            <p className="description">
              Ranked by independent local review data as the top veterinary practice in {locationName}.
            </p>
            
            <p className="date-period">{datePeriod}</p>
            
            <div className="footer">
              {assets.logo && (
                <img src={assets.logo} className="footer-logo" alt="" />
              )}
              <span className="footer-url">{websiteDomain}</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
