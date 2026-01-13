// Retro Game Icons - Simple SVG icons for grain-voyage

interface IconProps {
  size?: number;
  className?: string;
}

// Ship - Current position, travel
export const ShipIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M3 17h18l-3-8H6l-3 8zm5-6h8l1.5 4H6.5L8 11zm4-7v4h-2V4h2zm-5 2l1.5 2H8L6 6h1zm10 0l-1.5 2H16l2-2h-1z" />
  </svg>
);

// Anchor - Port marker
export const AnchorIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-1 6v2H8v2h3v8.17A5.98 5.98 0 0 1 6 15v-2H4v2a8 8 0 0 0 7 7.93V12h3v-2h-3V8h-1zm5 5v2a5.98 5.98 0 0 1-3 5.17V12h-1v8.93A8 8 0 0 0 20 15v-2h-2z" />
  </svg>
);

// Fuel - Fuel gauge
export const FuelIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18 10a1 1 0 0 1 1 1v8h-2v-6h-2V5a2 2 0 0 1 2-2h1v2h-1v3h1a1 1 0 0 1 1 1v1zm-4-7H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 8H6V5h8v6z" />
  </svg>
);

// Cargo - Package, goods
export const CargoIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm6 11.5l-5 2.5v-5l5-2.5v5zm-6-3.5L7 7.5 12 5l5 2.5-5 2.5zM6 8.5l5 2.5v5l-5-2.5v-5z" />
  </svg>
);

// Coin - Money
export const CoinIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="12"
      fontWeight="bold"
      fill="currentColor"
    >
      ¥
    </text>
  </svg>
);

// Check - Success, completion
export const CheckIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
  </svg>
);

// Alert - Warning
export const AlertIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
  </svg>
);

// Target - Mission destination
export const TargetIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// Turn - Turn counter
export const TurnIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 4V1L8 5l4 4V6a6 6 0 0 1 0 12v2a8 8 0 1 0 0-16z" />
  </svg>
);

// Dice - Dice icon (when not showing actual dice)
export const DiceIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="16" cy="16" r="1.5" />
  </svg>
);
