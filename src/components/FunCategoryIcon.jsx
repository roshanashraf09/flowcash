import React from 'react';

/**
 * Fun, fully-filled, colorful vector icons matching the reference image.
 * Zero thin line-art. Each icon has a rich colored circular background and detailed filled graphics.
 */

export const FUN_ICONS = {
  groceries: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#E6F9F0" />
      {/* Shopping Cart Body */}
      <path d="M14 16h3l3.5 14h13.5l3-10H19" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="21" cy="34" r="2" fill="#059669" />
      <circle cx="33" cy="34" r="2" fill="#059669" />
      {/* Colorful groceries inside */}
      <circle cx="23" cy="20" r="3" fill="#EF4444" />
      <circle cx="27" cy="18" r="3.5" fill="#F59E0B" />
      <circle cx="31" cy="21" r="3" fill="#10B981" />
      <path d="M25 15l2-3 2 1-1.5 2" fill="#10B981" />
    </svg>
  ),

  eating_out: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#FFF3E8" />
      {/* Orange Plate */}
      <circle cx="24" cy="24" r="14" fill="#F97316" />
      <circle cx="24" cy="24" r="10.5" fill="#FED7AA" />
      <circle cx="24" cy="24" r="8" fill="#FFF7ED" />
      {/* Fork & Knife */}
      <path d="M12 16v6a2 2 0 002 2v8h2v-8a2 2 0 002-2v-6" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M34 16c-1.5 2-2 4-2 7v9h2v-16z" fill="#C2410C" />
    </svg>
  ),

  transport: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#E0F2FE" />
      {/* Blue Circle Base */}
      <circle cx="24" cy="24" r="16" fill="#0284C7" />
      {/* Cute Yellow Commuter Bus */}
      <rect x="16" y="17" width="16" height="13" rx="3" fill="#FBBF24" />
      {/* Windshield */}
      <rect x="18" y="19" width="12" height="5" rx="1" fill="#38BDF8" />
      {/* Headlights */}
      <circle cx="18.5" cy="26.5" r="1.2" fill="#FFFFFF" />
      <circle cx="29.5" cy="26.5" r="1.2" fill="#FFFFFF" />
      {/* Wheels */}
      <rect x="18" y="29" width="3" height="3" rx="1" fill="#1E293B" />
      <rect x="27" y="29" width="3" height="3" rx="1" fill="#1E293B" />
    </svg>
  ),

  rent: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#FFE4E6" />
      {/* Red Circular Base */}
      <circle cx="24" cy="24" r="16" fill="#E11D48" />
      {/* White House Silhouette */}
      <path d="M24 14l-9 8v10h18V22l-9-8z" fill="#FFFFFF" />
      {/* Roof trim */}
      <path d="M24 13l-10 9h20l-10-9z" fill="#FB7185" />
      {/* Red Door & Window */}
      <rect x="22" y="25" width="4" height="7" rx="1" fill="#E11D48" />
      <rect x="26.5" y="23" width="3.5" height="3.5" rx="0.5" fill="#FDA4AF" />
      <rect x="18" y="23" width="3.5" height="3.5" rx="0.5" fill="#FDA4AF" />
    </svg>
  ),

  utilities: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#FEF9C3" />
      {/* Cyan/Blue Circle */}
      <circle cx="24" cy="24" r="16" fill="#0EA5E9" />
      {/* Golden Filled Lightning Bolt */}
      <path d="M25 13l-7 12h6l-3 10 9-13h-6l4-9z" fill="#FACC15" stroke="#EAB308" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),

  subscriptions: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#F3E8FF" />
      {/* Deep Purple Circle */}
      <circle cx="24" cy="24" r="16" fill="#7E22CE" />
      {/* Display Screen */}
      <rect x="15" y="16" width="18" height="13" rx="2.5" fill="#C084FC" />
      <rect x="16.5" y="17.5" width="15" height="10" rx="1.5" fill="#3B0764" />
      {/* Stand */}
      <rect x="22" y="29" width="4" height="2" fill="#C084FC" />
      <rect x="20" y="31" width="8" height="1.5" rx="0.5" fill="#C084FC" />
      {/* Play Triangle */}
      <path d="M22.5 20l5 2.5-5 2.5z" fill="#38BDF8" />
    </svg>
  ),

  other: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#CCFBF1" />
      {/* Teal Circle */}
      <circle cx="24" cy="24" r="16" fill="#0D9488" />
      {/* Clipboard */}
      <rect x="16" y="15" width="16" height="20" rx="2" fill="#F0FDFA" />
      <rect x="20" y="13" width="8" height="4" rx="1.5" fill="#14B8A6" />
      {/* Checkmarks */}
      <path d="M20 22l2 2 4-4" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="20" y1="28" x2="28" y2="28" stroke="#99F6E4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  coffee: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#FEF3C7" />
      {/* Amber Circle */}
      <circle cx="24" cy="24" r="16" fill="#D97706" />
      {/* White Coffee Cup */}
      <path d="M16 20h13v8a5 5 0 01-5 5h-3a5 5 0 01-5-5v-8z" fill="#FFFFFF" />
      {/* Cup handle */}
      <path d="M29 22h2a2.5 2.5 0 010 5h-2" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Saucer */}
      <rect x="14" y="33" width="18" height="2" rx="1" fill="#FFFFFF" />
      {/* Steam curves */}
      <path d="M19 14c0 2 2 2 2 4M24 13c0 2 2 2 2 4" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  ),

  home: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#DCFCE7" />
      {/* Mint Green Circle */}
      <circle cx="24" cy="24" r="16" fill="#16A34A" />
      {/* House Body */}
      <rect x="16" y="22" width="16" height="11" rx="1" fill="#FEF08A" />
      {/* Brown/Red Roof */}
      <path d="M14 22l10-8 10 8z" fill="#DC2626" />
      {/* Door & Window */}
      <rect x="22" y="26" width="4" height="7" rx="0.8" fill="#92400E" />
      <circle cx="25" cy="30" r="0.6" fill="#FEF08A" />
      <rect x="17.5" y="24" width="3" height="3" rx="0.5" fill="#38BDF8" />
    </svg>
  ),

  phone: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#E0F2FE" />
      {/* Sky Blue Circle */}
      <circle cx="24" cy="24" r="16" fill="#0284C7" />
      {/* Modern Phone */}
      <rect x="17" y="13" width="14" height="22" rx="3" fill="#FFFFFF" />
      <rect x="18.5" y="15" width="11" height="15" rx="1" fill="#0F172A" />
      <circle cx="24" cy="32.5" r="1.2" fill="#64748B" />
      <rect x="22" y="14" width="4" height="0.8" rx="0.4" fill="#94A3B8" />
    </svg>
  ),

  gym: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#CCFBF1" />
      {/* Aqua/Teal Circle */}
      <circle cx="24" cy="24" r="16" fill="#0F766E" />
      {/* Cyan Dumbbell */}
      <rect x="13" y="22.5" width="22" height="3" rx="1.5" fill="#2DD4BF" />
      {/* Left weights */}
      <rect x="15" y="18" width="3" height="12" rx="1.5" fill="#14B8A6" />
      <rect x="12" y="19.5" width="3" height="9" rx="1" fill="#5EEAD4" />
      {/* Right weights */}
      <rect x="30" y="18" width="3" height="12" rx="1.5" fill="#14B8A6" />
      <rect x="33" y="19.5" width="3" height="9" rx="1" fill="#5EEAD4" />
    </svg>
  ),

  travel: (
    <svg viewBox="0 0 48 48" className="w-9 h-9">
      <circle cx="24" cy="24" r="22" fill="#DBEAFE" />
      {/* Ocean Blue Circle */}
      <circle cx="24" cy="24" r="16" fill="#2563EB" />
      {/* Mini Globe Map */}
      <circle cx="24" cy="24" r="12" fill="#60A5FA" />
      <path d="M19 22c2-2 4-1 6-2 1 1 3 0 4-2" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
      {/* Red Location Pin */}
      <path d="M24 15a4 4 0 00-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 00-4-4z" fill="#EF4444" />
      <circle cx="24" cy="19" r="1.5" fill="#FFFFFF" />
    </svg>
  ),

  // FlowCash Brand Logo Cash Icon
  cash_logo: (
    <svg viewBox="0 0 40 40" className="w-8 h-8">
      <circle cx="20" cy="20" r="18" fill="#10B981" />
      <rect x="10" y="13" width="20" height="14" rx="2" fill="#047857" />
      <rect x="11.5" y="14.5" width="17" height="11" rx="1" fill="#34D399" />
      <circle cx="20" cy="20" r="3.5" fill="#047857" />
      <circle cx="20" cy="20" r="2.5" fill="#A7F3D0" />
    </svg>
  ),

  // Laptop for "Stays on this device"
  laptop_device: (
    <svg viewBox="0 0 48 48" className="w-11 h-11">
      <circle cx="24" cy="24" r="22" fill="rgba(255, 255, 255, 0.25)" />
      <rect x="14" y="15" width="20" height="13" rx="2" fill="#FFFFFF" />
      <rect x="15.5" y="16.5" width="17" height="10" rx="1" fill="#0284C7" />
      {/* Display graphic */}
      <path d="M20 22l3 3 5-5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Base */}
      <path d="M11 29h26a1 1 0 011 1v1H10v-1a1 1 0 011-1z" fill="#E2E8F0" />
    </svg>
  ),

  // Calendar Check for "1 monthly payment still to record"
  calendar_check: (
    <svg viewBox="0 0 44 44" className="w-9 h-9">
      <rect x="8" y="10" width="28" height="26" rx="6" fill="#38BDF8" />
      <rect x="8" y="16" width="28" height="20" rx="4" fill="#FFFFFF" />
      <rect x="13" y="7" width="3" height="5" rx="1.5" fill="#0284C7" />
      <rect x="28" y="7" width="3" height="5" rx="1.5" fill="#0284C7" />
      {/* Green checkmark badge */}
      <circle cx="28" cy="28" r="6" fill="#10B981" />
      <path d="M25.5 28l1.8 1.8 3.5-3.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  // Chart icon for "Where it went"
  pie_chart_box: (
    <svg viewBox="0 0 48 48" className="w-12 h-12">
      <circle cx="24" cy="24" r="22" fill="#F1F5F9" />
      <rect x="13" y="13" width="22" height="22" rx="5" fill="#0F172A" />
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
