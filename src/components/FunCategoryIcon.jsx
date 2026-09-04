import React from 'react';

/**
 * High-definition, crisp, vibrant vector icons inspired directly by the user's Gemini cartoon sheet.
 * Features:
 * - Razor-sharp vector outlines (1.6px - 2px stroke in #0F172A / #1E293B)
 * - Saturated, playful flat fills matching the Gemini reference sheet
 * - High-DPI crisp rendering (viewBox="0 0 44 44", shapeRendering="geometricPrecision")
 * - Native rendering without CSS transform scaling to prevent any subpixel blurriness
 */

export const FUN_ICONS = {
  // Groceries: Apple & Carrot with leafy greens (Gemini Sheet Row 1, Col 3)
  groceries: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
      {/* Carrot body & foliage */}
      <path d="M26 12c1-2 3-3 5-3-1 3-2 5-3 6" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="#16A34A" />
      <path d="M29 11c1-1 3-1 4 0-1 2-2 3-3 4" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="#22C55E" />
      <path d="M25 15l8 3-9 14c-1 1-2 0-2-1l3-16z" fill="#F97316" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 18l3 1M25 22l3 1M24 26l2 1" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
      {/* Apple body, leaf & stem */}
      <path d="M17 13c1-2 3-2 4-2" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M19 12c2-1 3 0 4 2-1 1-3 1-4-2z" fill="#16A34A" stroke="#0F172A" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M17 15c-3 0-6 3-6 7 0 6 5 10 7 10 1 0 2-1 3-1s2 1 3 1c2 0 7-4 7-10 0-4-3-7-6-7-2 0-3 2-4 2s-2-2-4-2z" fill="#EF4444" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Apple highlight */}
      <path d="M13 18c-1 2-1 5 0 7" stroke="#FCA5A5" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),

  // Eating Out: White dinner plate with burger, fork & knife (Gemini Sheet Row 5, Col 1 & 3)
  eating_out: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1.5" />
      {/* Fork */}
      <path d="M10 13v6a2 2 0 002 2v10h2V21a2 2 0 002-2v-6" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M13 13v5" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" />
      {/* Knife */}
      <path d="M33 13c-2 2-3 5-3 9v9h2.5V13h-.5z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Center Plate & Burger */}
      <circle cx="22" cy="22" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.6" />
      {/* Burger top bun */}
      <path d="M16 20c0-4 3-5 6-5s6 1 6 5z" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Lettuce */}
      <path d="M15.5 21c1-1 2 0 3 0s2-1 3 0 2 0 3 0 2-1 3 0" stroke="#0F172A" strokeWidth="1.4" fill="#22C55E" />
      {/* Patty */}
      <rect x="16" y="22" width="12" height="2.5" rx="1.2" fill="#78350F" stroke="#0F172A" strokeWidth="1.4" />
      {/* Bottom bun */}
      <path d="M16.5 25.5h11c0 2-2.5 3-5.5 3s-5.5-1-5.5-3z" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
    </svg>
  ),

  // Transport: Yellow Commuter Bus with blue windows (Gemini Sheet Row 4, Col 4)
  transport: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="1.5" />
      {/* Bus Body */}
      <rect x="13" y="13" width="18" height="18" rx="4" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.8" />
      {/* Roof destination display */}
      <rect x="17" y="15" width="10" height="2" rx="1" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      {/* Windshields */}
      <rect x="15.5" y="19" width="5.8" height="6.5" rx="1" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.4" />
      <rect x="22.7" y="19" width="5.8" height="6.5" rx="1" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.4" />
      {/* Headlights */}
      <circle cx="16" cy="27.5" r="1.5" fill="#FEF08A" stroke="#0F172A" strokeWidth="1.2" />
      <circle cx="28" cy="27.5" r="1.5" fill="#FEF08A" stroke="#0F172A" strokeWidth="1.2" />
      {/* Front Grille */}
      <line x1="20" y1="27.5" x2="24" y2="27.5" stroke="#0F172A" strokeWidth="1.4" strokeLinecap="round" />
      {/* Side Mirrors */}
      <path d="M13 21h-2v3h2M31 21h2v3h-2" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Wheels */}
      <rect x="15" y="30" width="3.5" height="3" rx="1" fill="#0F172A" />
      <rect x="25.5" y="30" width="3.5" height="3" rx="1" fill="#0F172A" />
    </svg>
  ),

  // Rent: Hanging wooden "RENT" board with keys & roof (Gemini Sheet Row 3, Col 3)
  rent: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1.5" />
      {/* Hanging rope cords */}
      <line x1="16" y1="11" x2="19" y2="17" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="11" x2="25" y2="17" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Wooden Sign Board */}
      <rect x="11" y="17" width="22" height="14" rx="3" fill="#E11D48" stroke="#0F172A" strokeWidth="1.8" />
      {/* RENT letters */}
      <text x="22" y="27.5" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="8" letterSpacing="0.5">RENT</text>
      {/* House roof silhouette at bottom */}
      <path d="M14 34l8-4 8 4" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="20.5" y="32" width="3" height="3" fill="#E11D48" stroke="#0F172A" strokeWidth="1.2" />
    </svg>
  ),

  // Utilities: Incandescent lightbulb with warm glow & filament (Gemini Sheet Row 2, Col 1)
  utilities: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1.5" />
      {/* Light glow sparks */}
      <line x1="22" y1="9" x2="22" y2="11" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="13" y1="14" x2="15" y2="15" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="31" y1="14" x2="29" y2="15" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round" />
      {/* Glass Bulb Body */}
      <path d="M15 19a7 7 0 0113.8-2c.2 1.3-.3 2.5-1 3.5-1.2 1.8-1.8 2.5-1.8 4.5h-8c0-2-.6-2.7-1.8-4.5-.8-1-1.3-2.2-1.2-3.5z" fill="#FACC15" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Internal Filament */}
      <path d="M19 21v-3l2 2 2-2v3" stroke="#0F172A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Screw Base */}
      <rect x="18" y="25" width="8" height="2.5" rx="0.5" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="18.5" y="27.5" width="7" height="2" rx="0.5" fill="#64748B" stroke="#0F172A" strokeWidth="1.4" />
      <path d="M19.5 29.5c0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5" fill="#334155" stroke="#0F172A" strokeWidth="1.4" />
    </svg>
  ),

  // Subscriptions: Modern Television Screen & Play (Gemini Sheet Row 6, Col 3)
  subscriptions: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#F3E8FF" stroke="#D8B4FE" strokeWidth="1.5" />
      {/* Antenna */}
      <path d="M17 11l5 4 5-4" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* TV Monitor Outer Box */}
      <rect x="12" y="15" width="20" height="15" rx="3" fill="#7E22CE" stroke="#0F172A" strokeWidth="1.8" />
      {/* Display Screen */}
      <rect x="14" y="17" width="16" height="11" rx="1.5" fill="#3B0764" stroke="#0F172A" strokeWidth="1.2" />
      {/* Play Triangle button on screen */}
      <polygon points="20,20 20,25 25,22.5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Stand Base */}
      <rect x="19" y="30" width="6" height="2" fill="#0F172A" />
      <line x1="16" y1="32" x2="28" y2="32" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),

  // Other: Mint Checklist Clipboard (Gemini Sheet Row 1, Col 19 & Row 11, Col 3)
  other: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#CCFBF1" stroke="#99F6E4" strokeWidth="1.5" />
      {/* Board */}
      <rect x="14" y="12" width="16" height="22" rx="3" fill="#0D9488" stroke="#0F172A" strokeWidth="1.8" />
      {/* Paper */}
      <rect x="16" y="15" width="12" height="17" rx="1.5" fill="#F0FDFA" stroke="#0F172A" strokeWidth="1.4" />
      {/* Metal clip */}
      <rect x="18" y="10.5" width="8" height="3.5" rx="1" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.4" />
      {/* Checklist Lines & Green Checkmark */}
      <path d="M18 19l2 2 4-4" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="18" y1="24" x2="26" y2="24" stroke="#0D9488" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="18" y1="28" x2="24" y2="28" stroke="#0D9488" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),

  // Coffee: Ceramic steaming coffee mug (Gemini Sheet Row 5, Col 5)
  coffee: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#FEF3C7" stroke="#FDE047" strokeWidth="1.5" />
      {/* Steam swirls */}
      <path d="M18 11c0 2 2 2 2 4M23 10c0 2 2 2 2 4" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Coffee Cup Body */}
      <path d="M14 18h14v8a6 6 0 01-6 6h-2a6 6 0 01-6-6v-8z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Coffee beverage inside */}
      <rect x="16" y="19" width="10" height="2" rx="1" fill="#78350F" />
      {/* Mug Handle */}
      <path d="M28 20h2.5a3.5 3.5 0 010 7H28" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Saucer plate */}
      <rect x="12" y="32" width="18" height="2" rx="1" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.6" />
    </svg>
  ),

  // Home: Cozy cottage house (Gemini Sheet Row 3, Col 4)
  home: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
      {/* Chimney */}
      <rect x="25" y="13" width="3" height="6" fill="#B91C1C" stroke="#0F172A" strokeWidth="1.4" />
      {/* House Body */}
      <rect x="14" y="21" width="16" height="12" rx="1" fill="#FEF08A" stroke="#0F172A" strokeWidth="1.8" />
      {/* Roof */}
      <polygon points="22,11 11,21 33,21" fill="#DC2626" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Door */}
      <rect x="20" y="25" width="4" height="8" rx="0.5" fill="#92400E" stroke="#0F172A" strokeWidth="1.4" />
      <circle cx="23" cy="29" r="0.6" fill="#FBBF24" />
      {/* Window */}
      <rect x="15.5" y="23" width="3.5" height="3.5" rx="0.5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.2" />
    </svg>
  ),

  // Phone: Modern Smartphone (Gemini Sheet Row 2, Col 8)
  phone: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="1.5" />
      {/* Phone Casing */}
      <rect x="14" y="11" width="16" height="24" rx="3.5" fill="#0284C7" stroke="#0F172A" strokeWidth="1.8" />
      {/* Screen */}
      <rect x="16" y="14" width="12" height="17" rx="1.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      {/* Top speaker & camera */}
      <circle cx="22" cy="12.5" r="0.6" fill="#94A3B8" />
      {/* Home button */}
      <circle cx="22" cy="32.5" r="1.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      {/* App grid mockup inside screen */}
      <rect x="17.5" y="16" width="3.5" height="3.5" rx="0.8" fill="#38BDF8" />
      <rect x="23" y="16" width="3.5" height="3.5" rx="0.8" fill="#F59E0B" />
      <rect x="17.5" y="21" width="3.5" height="3.5" rx="0.8" fill="#10B981" />
      <rect x="23" y="21" width="3.5" height="3.5" rx="0.8" fill="#EC4899" />
    </svg>
  ),

  // Gym: Classic Hex Dumbbell (Gemini Sheet Row 7, Col 7)
  gym: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#CCFBF1" stroke="#5EEAD4" strokeWidth="1.5" />
      {/* Bar */}
      <rect x="11" y="20.5" width="22" height="3" rx="1.5" fill="#0F766E" stroke="#0F172A" strokeWidth="1.5" />
      {/* Left Weights */}
      <rect x="13" y="15" width="3.5" height="14" rx="1.5" fill="#2DD4BF" stroke="#0F172A" strokeWidth="1.6" />
      <rect x="10" y="17" width="3" height="10" rx="1" fill="#14B8A6" stroke="#0F172A" strokeWidth="1.6" />
      {/* Right Weights */}
      <rect x="27.5" y="15" width="3.5" height="14" rx="1.5" fill="#2DD4BF" stroke="#0F172A" strokeWidth="1.6" />
      <rect x="31" y="17" width="3" height="10" rx="1" fill="#14B8A6" stroke="#0F172A" strokeWidth="1.6" />
      {/* Center grip textured ridges */}
      <line x1="20" y1="21" x2="20" y2="23" stroke="#FFFFFF" strokeWidth="1" />
      <line x1="22" y1="21" x2="22" y2="23" stroke="#FFFFFF" strokeWidth="1" />
      <line x1="24" y1="21" x2="24" y2="23" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  ),

  // Travel: Globe with Red Location Map Pin (Gemini Sheet Row 4, Col 20)
  travel: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5" />
      {/* Globe */}
      <circle cx="22" cy="22" r="13" fill="#60A5FA" stroke="#0F172A" strokeWidth="1.6" />
      <path d="M14 20c2-1 4 0 6-1s3-3 5-2 3 1 5 1" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 27c3 0 4-2 7-1s4 2 5 1" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
      {/* Red Location Pin */}
      <path d="M22 11a5 5 0 00-5 5c0 4 5 10 5 10s5-6 5-10a5 5 0 00-5-5z" fill="#EF4444" stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="22" cy="16" r="1.8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
    </svg>
  ),

  // Shopping: Yellow shopping tote bag (Gemini Sheet Row 8, Col 1)
  shopping: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1.5" />
      {/* Handles */}
      <path d="M17 17v-4a5 5 0 0110 0v4" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Bag Body */}
      <path d="M12 17h20l-2 16H14L12 17z" fill="#FACC15" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Red Sale Tag */}
      <rect x="20" y="21" width="5" height="7" rx="1" transform="rotate(15 20 21)" fill="#EF4444" stroke="#0F172A" strokeWidth="1.2" />
    </svg>
  ),

  // Salary: Stack of gold coins and banknotes (Gemini Sheet Row 10, Col 11)
  salary: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <circle cx="22" cy="22" r="20" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
      {/* Banknote */}
      <rect x="11" y="14" width="22" height="12" rx="2" fill="#10B981" stroke="#0F172A" strokeWidth="1.8" />
      <circle cx="22" cy="20" r="2.8" fill="#A7F3D0" stroke="#0F172A" strokeWidth="1.2" />
      {/* Gold coin stack */}
      <ellipse cx="22" cy="28" rx="7" ry="2.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
      <ellipse cx="22" cy="26" rx="7" ry="2.5" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
      <ellipse cx="22" cy="24" rx="7" ry="2.5" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
    </svg>
  ),

  // FlowCash Brand Logo Cash Icon
  cash_logo: (
    <svg viewBox="0 0 40 40" className="w-8 h-8" shapeRendering="geometricPrecision">
      <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
      <rect x="10" y="13" width="20" height="14" rx="2" fill="#047857" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="11.5" y="14.5" width="17" height="11" rx="1" fill="#34D399" />
      <circle cx="20" cy="20" r="3.5" fill="#047857" stroke="#0F172A" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="2" fill="#A7F3D0" />
    </svg>
  ),

  // Laptop for "Stays on this device"
  laptop_device: (
    <svg viewBox="0 0 48 48" className="w-11 h-11" shapeRendering="geometricPrecision">
      <circle cx="24" cy="24" r="22" fill="rgba(255, 255, 255, 0.25)" />
      <rect x="14" y="15" width="20" height="13" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.6" />
      <rect x="15.5" y="16.5" width="17" height="10" rx="1" fill="#0284C7" />
      {/* Display check graphic */}
      <path d="M20 22l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Base */}
      <path d="M11 29h26a1 1 0 011 1v1H10v-1a1 1 0 011-1z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.6" />
    </svg>
  ),

  // Calendar Check for "1 monthly payment still to record"
  calendar_check: (
    <svg viewBox="0 0 44 44" className="w-9 h-9" shapeRendering="geometricPrecision">
      <rect x="8" y="10" width="28" height="26" rx="6" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.6" />
      <rect x="8" y="16" width="28" height="20" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.6" />
      <rect x="13" y="7" width="3" height="5" rx="1.5" fill="#0284C7" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="28" y="7" width="3" height="5" rx="1.5" fill="#0284C7" stroke="#0F172A" strokeWidth="1.2" />
      {/* Green checkmark badge */}
      <circle cx="28" cy="28" r="6" fill="#10B981" stroke="#0F172A" strokeWidth="1.4" />
      <path d="M25.5 28l1.8 1.8 3.5-3.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  // Chart icon for "Where it went"
  pie_chart_box: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" shapeRendering="geometricPrecision">
      <circle cx="24" cy="24" r="22" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="13" y="13" width="22" height="22" rx="5" fill="#0F172A" stroke="#0F172A" strokeWidth="1.6" />
      {/* Bar charts inside */}
      <rect x="17" y="24" width="3" height="7" rx="1" fill="#38BDF8" />
      <rect x="22.5" y="19" width="3" height="12" rx="1" fill="#F59E0B" />
      <rect x="28" y="16" width="3" height="15" rx="1" fill="#10B981" />
    </svg>
  )
};

export default function FunCategoryIcon({ name, className = '' }) {
  const iconKey = (name || '').toLowerCase().replace(/[\s-]/g, '_');
  const icon = FUN_ICONS[iconKey] || FUN_ICONS.other;
  return (
    <div className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}>
      {icon}
    </div>
  );
}
