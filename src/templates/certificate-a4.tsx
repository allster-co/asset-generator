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
  signatureName?: string;
  signatureTitle?: string;
  brandName?: string;
}

export function CertificateA4(props: Record<string, unknown>): React.ReactElement {
  const {
    rank = 1,
    locationName = 'Location',
    clinicName = 'Clinic Name',
    datePeriod = 'January - March 2026',
    websiteDomain = 'www.vetsinengland.com',
    categoryLabel,
    signatureName = 'E. Holmes',
    signatureTitle = 'Signed Eddie Holmes',
    brandName = 'Vets in England',
  } = props as unknown as CertificateA4Props;

  // Build the title based on whether there's a category
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
    // Default to green for ranks outside 1-10
    rosetteImage = assets.greenRosette;
  }

  return (
    <html>
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Dancing+Script:wght@400;500;600;700&family=Oxygen+Mono:wght@400;700&display=swap');
          
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
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          .certificate {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
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
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 50px 40px 40px 40px;
            justify-content: flex-start;
          }
          
          .rosette {
            width: 220px;
            height: auto;
            margin-bottom: 20px;
          }
          
          .rosette-container {
            position: relative;
            width: 403px;
            height: 403px;
            margin: 0;
            flex-shrink: 0;
          }
          
          .rosette-img {
            width: 100%;
            height: auto;
          }
          
          .rank-number {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-55%, -80%);
            font-size: 96px;
            font-weight: bold;
            color: #FFF;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', monospace;
          }
          
          .clinic-name-top {
            font-size: 48px;
            font-weight: bold;
            color: #006D6F;
            margin-bottom: 8px;
            text-align: center;
            max-width: 90%;
            line-height: 1.2;
            font-family: 'Lora', Georgia, serif;
          }
          
          .clinic-name-top-long {
            font-size: 40.8px;
          }
          
          .awarded-text {
            font-size: 24px;
            font-style: italic;
            color: #666;
            margin-bottom: 30px;
            text-align: center;
            font-family: 'Inter', Georgia, serif;
          }
          
          .title {
            font-size: 42px;
            font-style: italic;
            color: #006D6F;
            margin-bottom: 20px;
            text-align: center;
            font-family: 'Lora', Georgia, serif;
          }
          
          .title-long {
            font-size: 35.7px;
          }
          
          .divider {
            width: 60%;
            height: 2px;
            background-color: #666;
            margin: 20px 0;
            border: none;
          }
          
          .divider-top {
            width: 100%;
            height: auto;
            margin: 0;
            margin-bottom: 20px;
          }
          
          .divider-bottom {
            width: 100%;
            height: auto;
            margin: 0;
            margin-top: 20px;
          }
          
          .rank-title {
            font-size: 28px;
            font-weight: 600;
            color: #006D6F;
            margin-bottom: 15px;
            text-align: center;
            font-family: 'Lora', Georgia, serif;
          }
          
          .signature-line {
            width: 200px;
            height: 1px;
            background-color: #444;
            margin-top: 8px;
            margin-bottom: 5px;
            border: none;
          }
          
          .date-period {
            font-size: 24px;
            font-weight: bold;
            color: #444;
            margin-bottom: 50px;
            text-align: center;
            font-family: 'Inter', sans-serif;
          }
          
          .description {
            font-size: 18px;
            color: #444;
            text-align: center;
            max-width: 85%;
            line-height: 1.6;
            margin-bottom: 20px;
            font-family: 'Inter', sans-serif;
          }
          
          .signature-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 15px;
          }
          
          .signature-name {
            font-size: 32px;
            font-family: 'Dancing Script', 'Brush Script MT', 'Lucida Handwriting', cursive;
            color: #444;
            margin-bottom: 0px;
            text-align: center;
            font-weight: 500;
          }
          
          .signature-title {
            font-size: 14px;
            color: #666;
            text-align: center;
            font-family: 'Inter', sans-serif;
          }
          
          .footer {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 20px 0 15px 0;
          }
          
          .footer-logo {
            width: 40px;
            height: 40px;
          }
          
          .footer-verify {
            font-size: 14px;
            color: #666;
            font-weight: 400;
            font-family: 'Inter', sans-serif;
          }
          
          .footer-url-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .footer-url {
            font-size: 26px;
            color: #006D6F;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </head>
      <body data-render-ready="1">
        <div className="certificate">
          {assets.backgroundFrame && (
            <img src={assets.backgroundFrame} className="background" alt="" />
          )}
         
          <div className="content">
            {assets.divider && (
              <img src={assets.divider} className="divider-top" alt="" />
            )}
            
            <h2 className={`clinic-name-top ${isLongClinicName ? 'clinic-name-top-long' : ''}`}>{clinicName}</h2>
            
            <p className="awarded-text">is hereby awarded</p>
            
            <div className="rosette-container">
              {rosetteImage && (
                <img src={rosetteImage} className="rosette-img" alt="" />
              )}
              <div className="rank-number">#{rank}</div>
            </div>
            
            <h1 className={`title ${isLongLocationName ? 'title-long' : ''}`}>#{rank} {title}</h1>
            
            <p className="date-period">{datePeriod}</p>
            
            <p className="description">
            Independently ranked for great service, amazing staff and happy pets!
            </p>
            
            <div className="signature-section">
              <div className="signature-name">{signatureName}</div>
              <hr className="signature-line" />
              <div className="signature-title">{signatureTitle}, Founder, {brandName}</div>
            </div>
            
            <div className="footer">
              <div className="footer-verify">Verify at</div>
              <div className="footer-url-container">
                {assets.logo && (
                  <img src={assets.logo} className="footer-logo" alt="" />
                )}
                <span className="footer-url">{websiteDomain}</span>
              </div>
            </div>
            
            {assets.divider && (
              <img src={assets.divider} className="divider-bottom" alt="" />
            )}
          </div>
          
          {assets.watermarkOverlay && (
            <img src={assets.watermarkOverlay} className="watermark-overlay" alt="" />
          )}
        </div>
      </body>
    </html>
  );
}
