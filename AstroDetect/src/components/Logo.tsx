export default function Logo({ size = 64 }: { size?: number }) {
  return <svg className="logo" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="logo-sky" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#1d2b57" />
        <stop offset="100%" stopColor="#070b1c" />
      </radialGradient>
      <radialGradient id="logo-star" cx="42%" cy="38%" r="62%">
        <stop offset="0%" stopColor="#fff3c4" />
        <stop offset="55%" stopColor="#ffc857" />
        <stop offset="100%" stopColor="#f08a24" />
      </radialGradient>
      <radialGradient id="logo-glow" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stopColor="#ffc857" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffc857" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#logo-sky)" stroke="#5cc8ff" strokeOpacity="0.55" strokeWidth="1.5" />
    <circle cx="12" cy="16" r="0.9" fill="#ffffff" />
    <circle cx="51" cy="13" r="0.7" fill="#cfe6ff" />
    <circle cx="54" cy="36" r="0.8" fill="#ffffff" />
    <circle cx="9" cy="35" r="0.6" fill="#cfe6ff" />
    <circle cx="32" cy="27" r="20" fill="url(#logo-glow)" />
    <circle cx="32" cy="27" r="13.5" fill="url(#logo-star)" />
    <circle cx="38.5" cy="24.5" r="4.6" fill="#0a1026" stroke="#5cc8ff" strokeWidth="0.9" />
    <path d="M8 48 H23 L26.5 53 H37.5 L41 48 H56" fill="none" stroke="#5cc8ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
