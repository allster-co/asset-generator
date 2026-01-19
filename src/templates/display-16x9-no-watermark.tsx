/**
 * Display 16:9 Template (No Watermark)
 * 
 * 1920x1080 PNG for website banners and screens without watermark.
 */

import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

interface Display16x9Props {
  rank: number;
  locationName: string;
  clinicName: string;
  datePeriod: string;
  websiteDomain: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  categoryLabel?: string;
}

export function Display16x9NoWatermark(props: Record<string, unknown>): React.ReactElement {
  const {
    rank = 1,
    locationName = 'Location',
    clinicName = 'Clinic Name',
    datePeriod = '2026',
    websiteDomain = 'www.vetsinengland.com',
    categoryLabel,
  } = props as unknown as Display16x9Props;

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
          @import url('https://fonts.googleapis.com/css2?family=Oxygen+Mono:wght@400;700&display=swap');
          
          ${getFontFaceCSS()}
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 1920px;
            height: 1080px;
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          
          .container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 60px 100px;
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
          
          .content {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 80px;
            width: 100%;
          }
          
          .left-section {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .rosette-container {
            position: relative;
            width: 250px;
            height: 250px;
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
            font-size: 64px;
            font-weight: bold;
            color: #C5A54E;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            font-family: 'Oxygen Mono', monospace;
          }
          
          .right-section {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .title {
            font-size: 48px;
            font-style: italic;
            color: #1A6B52;
            margin-bottom: 15px;
          }
          
          .clinic-name {
            font-size: 60px;
            font-weight: bold;
            color: #1A6B52;
            margin-bottom: 20px;
            line-height: 1.2;
          }
          
          .description {
            font-size: 24px;
            color: #444;
            max-width: 900px;
            line-height: 1.4;
            margin-bottom: 25px;
          }
          
          .date-period {
            font-size: 32px;
            font-weight: bold;
            color: #1A6B52;
          }
          
          .footer {
            position: absolute;
            bottom: 40px;
            right: 60px;
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 30px;
            background: #1A6B52;
            border-radius: 30px;
          }
          
          .footer-logo {
            width: 40px;
            height: 40px;
          }
          
          .footer-url {
            font-size: 22px;
            color: #fff;
            font-weight: 500;
          }
        `}</style>
      </head>
      <body data-render-ready="1">
        <div className="container">
          {assets.backgroundFrame && (
            <img src={assets.backgroundFrame} className="background" alt="" />
          )}
          
          <div className="content">
            <div className="left-section">
              <div className="rosette-container">
                {rosetteImage && (
                  <img src={rosetteImage} className="rosette-img" alt="" />
                )}
                <div className="rank-number">#{rank}</div>
              </div>
            </div>
            
            <div className="right-section">
              <h1 className="title">{title}</h1>
              <h2 className="clinic-name">{clinicName}</h2>
              <p className="description">
                Ranked by independent local review data as the top veterinary practice in {locationName}.
              </p>
              <p className="date-period">{datePeriod}</p>
            </div>
          </div>
          
          <div className="footer">
            {assets.logo && (
              <img src={assets.logo} className="footer-logo" alt="" />
            )}
            <span className="footer-url">{websiteDomain}</span>
          </div>
        </div>
      </body>
    </html>
  );
}
