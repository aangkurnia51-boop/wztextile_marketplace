/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface WzLogoProps {
  className?: string;
  isGreenTheme?: boolean;
}

export default function WzLogo({ className = "w-12 h-12", isGreenTheme = true }: WzLogoProps) {
  // Brand colors:
  // Original: orange = #F9571A, black = #000000
  // Green Theme: green = #10B981 (emerald), dark = #111827 (slate-900)
  const primaryColor = isGreenTheme ? "#10B981" : "#F9571A";
  const darkColor = isGreenTheme ? "#064E3B" : "#0A0A0A";
  const lightAccent = isGreenTheme ? "#34D399" : "#FF7A45";

  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. L-Shaped Brackets (Bottom-Left Frame) */}
      {/* Outer Bracket */}
      <path
        d="M 120 190 L 120 330 L 290 330 L 290 310 L 140 310 L 140 190 Z"
        fill={primaryColor}
      />
      {/* Inner Bracket */}
      <path
        d="M 100 170 L 100 350 L 310 350 L 310 340 L 110 340 L 110 170 Z"
        fill={lightAccent}
        opacity="0.85"
      />

      {/* 2. Bold Stylized W (Black / Dark Green) */}
      <path
        d="M 150 110 
           L 200 110 
           L 230 250 
           L 260 110 
           L 310 110 
           L 340 250 
           L 370 110 
           L 415 110 
           L 370 310 
           L 320 310 
           L 285 175 
           L 250 310 
           L 200 310 
           Z"
        fill={darkColor}
      />

      {/* 3. Overlapping Bold Stylized Z (Orange / Green) */}
      {/* In the logo, the Z sits offset to the right and overlaps the W */}
      <path
        d="M 290 175
           L 455 175
           L 455 220
           L 355 315
           L 465 315
           L 465 360
           L 285 360
           L 285 315
           L 385 220
           L 290 220
           Z"
        fill={primaryColor}
        className="drop-shadow-md"
      />

      {/* 4. TEXTILE Underneath in a Clean Tech/Futuristic Grid */}
      {/* We draw the letters for TEXTILE using vector paths to get the exact futuristic/sci-fi stencil style in the logo! */}
      <g fill={darkColor}>
        {/* T */}
        <path d="M 85 410 H 125 V 420 H 110 V 450 H 100 V 420 H 85 Z" />
        
        {/* E */}
        <path d="M 140 410 H 175 V 418 H 150 V 425 H 170 V 433 H 150 V 442 H 175 V 450 H 140 Z" />
        
        {/* X */}
        <path d="M 190 410 L 205 428 L 220 410 H 232 L 213 430 L 232 450 H 220 L 205 432 L 190 450 H 178 L 197 430 L 178 410 Z" />
        
        {/* T */}
        <path d="M 245 410 H 285 V 420 H 270 V 450 H 260 V 420 H 245 Z" />
        
        {/* I */}
        <path d="M 300 410 H 310 V 450 H 300 Z" />
        
        {/* L */}
        <path d="M 325 410 H 335 V 442 H 355 V 450 H 325 Z" />
        
        {/* E */}
        <path d="M 370 410 H 405 V 418 H 380 V 425 H 400 V 433 H 380 V 442 H 405 V 450 H 370 Z" />
      </g>
      
      {/* Tech Slices inside letters for sci-fi look */}
      <rect x="75" y="428" width="340" height="4" fill="#FFFFFF" opacity="0.35" />
    </svg>
  );
}
