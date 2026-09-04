import React from 'react';
import {
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Apple,
  Gamepad2,
  Film,
  Shirt,
  Home,
  Building,
  Car,
  Train,
  Zap,
  Droplets,
  Smartphone,
  Plane,
  HeartPulse,
  ShieldCheck,
  PawPrint,
  Dumbbell,
  Gift,
  Hammer,
  Briefcase,
  Laptop,
  PiggyBank,
  TrendingUp,
  RotateCcw,
  Gauge,
  Repeat,
  PieChart,
  DownloadCloud,
  CheckCircle2,
  HelpCircle,
  CreditCard,
  Banknote,
  ArrowLeftRight,
  Receipt,
  FileSpreadsheet,
  Calendar,
  Tag,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';

export const ICON_MAP = {
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Apple,
  Gamepad2,
  Film,
  Shirt,
  Home,
  Building,
  Car,
  Train,
  Zap,
  Droplets,
  Smartphone,
  Plane,
  HeartPulse,
  ShieldCheck,
  PawPrint,
  Dumbbell,
  Gift,
  Hammer,
  Briefcase,
  Laptop,
  PiggyBank,
  TrendingUp,
  RotateCcw,
  Gauge,
  Repeat,
  PieChart,
  DownloadCloud,
  CheckCircle2,
  CreditCard,
  Banknote,
  ArrowLeftRight,
  Receipt,
  FileSpreadsheet,
  Calendar,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
  HelpCircle
};

const SIZE_MAP = {
  xs: { box: 'w-6 h-6', icon: 13 },
  sm: { box: 'w-8 h-8', icon: 16 },
  md: { box: 'w-10 h-10', icon: 20 },
  lg: { box: 'w-12 h-12', icon: 24 },
  xl: { box: 'w-14 h-14', icon: 28 },
};

export default function CategoryIcon({
  name,
  color = '#10b981',
  size = 'md',
  badge = true,
  className = '',
  iconClassName = ''
}) {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  if (!badge) {
    return (
      <IconComponent
        size={sizeConfig.icon}
        style={{ color }}
        className={`shrink-0 transition-transform ${iconClassName}`}
      />
    );
  }

  // Generate subtle background tint from hex
  const bgStyle = {
    backgroundColor: `${color}18`, // 10% opacity
    borderColor: `${color}35`,     // 20% opacity border
  };

  return (
    <div
      style={bgStyle}
      className={`inline-flex items-center justify-center rounded-xl border shrink-0 transition-all ${sizeConfig.box} ${className}`}
    >
      <IconComponent
        size={sizeConfig.icon}
        style={{ color }}
        className={`transition-transform duration-200 ${iconClassName}`}
      />
    </div>
  );
}
