/**
 * Social Square Template
 * 
 * 1080x1080 PNG for Instagram and Facebook posts.
 */

import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

interface SocialSquareProps {
  rank: number;
  locationName: string;
  clinicName: string;
  datePeriod: string;
  websiteDomain: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  categoryLabel?: string;
}

export function SocialSquare(props: Record<string, unknown>): JSX.Element {
  const {
    rank = 1,
    locationName = 'Location',
    clinicName = 'Clinic Name',
    datePeriod = '2026',
    websiteDomain = 'www.vetsinengland.com',
    categoryLabel,
  } = props as SocialSquareProps;

  const titlePrefix = categoryLabel ? `${categoryLabel} ` : '';
  const title = `${titlePrefix}Vet in ${locationName}`;

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
            height: 1080px;
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          
          .container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px;
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
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .rosette-container {
            position: relative;
            width: 200px;
            height: 200px;
            margin-bottom: 30px;
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
            font-size: 56px;
            font-weight: bold;
            color: #C5A54E;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          
          .title {
            font-size: 42px;
            font-style: italic;
            color: #1A6B52;
            margin-bottom: 20px;
          }
          
          .clinic-name {
            font-size: 52px;
            font-weight: bold;
            color: #1A6B52;
            margin-bottom: 30px;
            max-width: 900px;
            line-height: 1.2;
          }
          
          .date-period {
            font-size: 28px;
            font-weight: bold;
            color: #1A6B52;
            margin-bottom: 40px;
          }
          
          .footer {
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
            <div className="rosette-container">
              {assets.awardRosette && (
                <img src={assets.awardRosette} className="rosette-img" alt="" />
              )}
              <div className="rank-number">#{rank}</div>
            </div>
            
            <h1 className="title">{title}</h1>
            <h2 className="clinic-name">{clinicName}</h2>
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
