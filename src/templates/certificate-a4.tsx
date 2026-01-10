/**
 * Certificate A4 Template
 * 
 * A4 PDF certificate for print.
 * Based on the Diploma Style design from Certificate Assets.
 */

import React from 'react';
import { assets, getFontFaceCSS } from '../assets';

interface CertificateA4Props {
  rank: number;
  locationName: string;
  clinicName: string;
  datePeriod: string;
  websiteDomain: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  categoryLabel?: string;
}

export function CertificateA4(props: Record<string, unknown>): JSX.Element {
  const {
    rank = 1,
    locationName = 'Location',
    clinicName = 'Clinic Name',
    datePeriod = '2026',
    websiteDomain = 'www.vetsinengland.com',
    categoryLabel,
  } = props as CertificateA4Props;

  // Build the title based on whether there's a category
  const titlePrefix = categoryLabel ? `${categoryLabel} ` : '';
  const title = `${titlePrefix}Vet in ${locationName}`;

  return (
    <html>
      <head>
        <style>{`
          @page {
            size: A4;
            margin: 0;
          }
          
          ${getFontFaceCSS()}
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 210mm;
            height: 297mm;
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          
          .certificate {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px;
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
            width: 100%;
            height: 100%;
            padding-top: 30px;
          }
          
          .rosette {
            width: 180px;
            height: auto;
            margin-bottom: 20px;
          }
          
          .rosette-container {
            position: relative;
            width: 180px;
            height: 180px;
            margin-bottom: 20px;
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
            font-size: 48px;
            font-weight: bold;
            color: #C5A54E;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          }
          
          .title {
            font-size: 32px;
            font-style: italic;
            color: #1A6B52;
            margin-bottom: 25px;
            text-align: center;
          }
          
          .divider {
            width: 60%;
            height: auto;
            margin-bottom: 20px;
          }
          
          .presented-to {
            font-size: 18px;
            font-style: italic;
            color: #666;
            margin-bottom: 15px;
          }
          
          .clinic-name {
            font-size: 42px;
            font-weight: bold;
            color: #1A6B52;
            margin-bottom: 25px;
            text-align: center;
            max-width: 90%;
            line-height: 1.2;
          }
          
          .description {
            font-size: 16px;
            color: #444;
            text-align: center;
            max-width: 80%;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          
          .date-period {
            font-size: 22px;
            font-weight: bold;
            color: #1A6B52;
            margin-bottom: 40px;
          }
          
          .footer {
            margin-top: auto;
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
            font-size: 18px;
            color: #fff;
            font-weight: 500;
          }
        `}</style>
      </head>
      <body data-render-ready="1">
        <div className="certificate">
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
            
            {assets.divider && (
              <img src={assets.divider} className="divider" alt="" />
            )}
            
            <p className="presented-to">Presented to</p>
            
            <h2 className="clinic-name">{clinicName}</h2>
            
            {assets.divider && (
              <img src={assets.divider} className="divider" alt="" />
            )}
            
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
